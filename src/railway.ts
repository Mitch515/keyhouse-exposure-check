import { z } from 'zod';
import { setTimeout } from 'node:timers/promises';
import { PRODUCT } from './constants.js';
import { Inventory, type Placement } from './inventory.js';

const node = z.object({ id: z.string(), name: z.string() });
const pageInfo = z.object({ hasNextPage: z.boolean(), endCursor: z.string().nullable() });
const connection = z.object({ edges: z.array(z.object({ node })), pageInfo });
const instances = z.object({
  edges: z.array(z.object({ node: z.object({ serviceId: z.string(), serviceName: z.string() }) })), pageInfo,
});
const projectsSchema = z.object({ projects: connection });
const environmentsSchema = z.object({ environments: connection });
const servicesSchema = z.object({ environment: z.object({ serviceInstances: instances }) });
const variablesSchema = z.object({ variables: z.record(z.string(), z.string()) });

const PAGE = 'pageInfo { hasNextPage endCursor }';
const PROJECTS = `query Projects($after: String, $workspaceId: String) {
  projects(first: 100, after: $after, workspaceId: $workspaceId) {
    edges { node { id name } } ${PAGE}
  }
}`;
const ENVIRONMENTS = `query Environments($projectId: String!, $after: String) {
  environments(projectId: $projectId, first: 100, after: $after) {
    edges { node { id name } } ${PAGE}
  }
}`;
const SERVICES = `query Services($id: String!, $after: String) {
  environment(id: $id) { serviceInstances(first: 100, after: $after) {
    edges { node { serviceId serviceName } } ${PAGE}
  } }
}`;
const VARIABLES = `query Variables($projectId: String!, $environmentId: String!, $serviceId: String) {
  variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
}`;

type Args = Record<string, string | null>;
class RailwayClient {
  constructor(private readonly token: string) {}

  async query<S extends z.ZodType>(query: string, variables: Args, schema: S): Promise<z.output<S>> {
    // Fixed destination; redirects are rejected so the token cannot follow one.
    const response = await fetch(PRODUCT.railwayApi, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30_000),
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });
    if (response.status === 429) throw new Error('rate-limit');
    if (!response.ok) throw new Error('railway');
    const body = await response.text();
    if (body.length > 16 * 1024 * 1024) throw new Error('railway');
    // Never carry upstream error text or Zod diagnostics into a user-facing error.
    const result = z.object({ data: schema.optional(), errors: z.array(z.object({})).optional() }).parse(JSON.parse(body));
    if (result.errors?.length || !result.data) throw new Error('railway');
    // Stay below the documented 10 RPS Hobby ceiling, including fast responses.
    await setTimeout(120);
    return result.data;
  }
}

async function allPages<T>(read: (after: string | null) => Promise<{ edges: { node: T }[]; pageInfo: z.infer<typeof pageInfo> }>): Promise<T[]> {
  const nodes: T[] = [];
  const seen = new Set<string>();
  let after: string | null = null;
  for (let page = 0; page < 1_000; page++) {
    const result = await read(after);
    nodes.push(...result.edges.map(edge => edge.node));
    if (!result.pageInfo.hasNextPage) return nodes;
    const cursor = result.pageInfo.endCursor;
    if (!cursor || seen.has(cursor)) throw new Error('railway');
    seen.add(cursor); after = cursor;
  }
  throw new Error('railway');
}

export async function scanRailway(inventory: Inventory, token: string, workspaceId?: string): Promise<void> {
  inventory.guard.protect(token);
  const client = new RailwayClient(token);
  const projects = await allPages(async after => (await client.query(PROJECTS, { after, workspaceId: workspaceId ?? null }, projectsSchema)).projects);
  for (const project of projects) {
    const environments = await allPages(async after => (await client.query(ENVIRONMENTS, { projectId: project.id, after }, environmentsSchema)).environments);
    for (const environment of environments) {
      const place = { project: project.name, environment: environment.name };
      const args = { projectId: project.id, environmentId: environment.id };
      const read = async (location: Placement, serviceId: string | null) => {
        const result = await client.query(VARIABLES, { ...args, serviceId }, variablesSchema);
        inventory.add(location, result.variables);
      };
      await read({ ...place, service: 'Shared variables' }, null);
      // The environment-scoped connection includes only services placed there.
      const services = await allPages(async after => (await client.query(SERVICES, { id: environment.id, after }, servicesSchema)).environment.serviceInstances);
      for (const service of services) await read({ ...place, service: service.serviceName }, service.serviceId);
    }
  }
}
