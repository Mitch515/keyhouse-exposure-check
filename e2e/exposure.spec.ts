/**
 * Hard-rail failure modes, recorded before implementation:
 * - A renderer prints a raw value, prefix, suffix, fingerprint or exception body.
 * - JSON serialization or Markdown escaping reintroduces part of a value.
 * - A project/service/variable name contains a secret or terminal escape sequence.
 * - Duplicate reporting leaks a value rather than an opaque ordinal.
 * - API failures echo tokens, request bodies, response bodies or partial results.
 * - File/argument errors echo a secret-bearing path or command-line argument.
 * - An unclassified variable reaches output through a debug or fallback path.
 * - A static URL, label or redaction marker overlaps a five-character secret slice.
 *
 * Authoring gate: the two journeys own the CLI's visible inventory and persisted
 * checklist, including pagination and exclusions. The third check independently
 * owns the literal output invariant, including failure output. No existing tests.
 * The external Railway network boundary is stubbed with a Node fetch preload;
 * production has no alternate endpoint, test flag or injectable implementation.
 * Playwright runs subprocess journeys; transcripts replace browser video because
 * this product has no browser UI. Playwright traces and attachments are retained.
 */
import { test, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const secrets = {
  openai: 'sk-proj-' + 'Q7m4Z9r2'.repeat(7) + 'Q7' + 'T3BlbkFJ' + 'N8v5X1c6'.repeat(8) + 'N8v5X1c6N8',
  stripe: 'sk_' + 'live_' + '9Zq2V7b4R8x1F6m3C5n0W2y9',
  github: 'ghp_' + '7z3Q8v2X5m9R1c4N6b0W'.repeat(2).slice(0, 36),
  apify: 'j9V2q8M6x3B7r1N5z0C4d8F2s6K9p3L7',
  database: 'postgres://U1m8:U9q3V7x2B6m8@db.test/app',
  unknown: 'L8v3Q9r6X1m7B2z5C0n4F8w6',
  token: 'f6e4d2c0-b8a7-4913-8f25-d3c9b7a1e605',
};
const variables = {
  OPENAI_API_KEY: secrets.openai,
  STRIPE_SECRET_KEY: secrets.stripe,
  GH_TOKEN: secrets.github,
  APIFY_TOKEN: secrets.apify,
  DATABASE_URL: secrets.database,
  CUSTOM_SECRET: secrets.unknown,
  PORT: '3000', NODE_ENV: 'production', PUBLIC_URL: 'https://example.invalid',
  NEXT_PUBLIC_STRIPE_KEY: 'pk_live_demonstration',
  // Metadata must pass through the same final guard as static text.
  ['MALICIOUS_SECRET_' + secrets.unknown]: secrets.apify,
};
const connection = (nodes: { id: string; name: string }[], next = false, cursor = 'next') => ({
  edges: nodes.map(node => ({ node })),
  pageInfo: { hasNextPage: next, endCursor: cursor },
});

async function railwayStub(fail = false) {
  let variableReads = 0;
  const server = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { query, variables: args } = JSON.parse(body);
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'POST' || !query.trim().startsWith('query ') || req.headers.authorization !== `Bearer ${secrets.token}`) {
      res.statusCode = 400; res.end(JSON.stringify({ errors: [{ message: 'Read-only boundary rejected' }] })); return;
    }
    if (fail && variableReads > 0) {
      res.end(JSON.stringify({ errors: [{ message: `Rejected ${Object.values(secrets).join(' ')}` }] })); return;
    }
    let data;
    if (query.includes('query Projects')) {
      data = { projects: args.after ? connection([{ id: 'p2', name: 'Second app' }]) : connection([{ id: 'p1', name: 'Demo app' }], true) };
    } else if (query.includes('query Environments')) {
      data = { environments: args.after ? connection([{ id: 'e2', name: 'preview' }]) : connection([{ id: 'e1', name: 'production' }], true) };
    } else if (query.includes('query Services')) {
      data = { environment: { serviceInstances: args.after
        ? { edges: [{ node: { serviceId: 's2', serviceName: 'worker' } }], pageInfo: { hasNextPage: false, endCursor: null } }
        : { edges: [{ node: { serviceId: 's1', serviceName: 'api' } }], pageInfo: { hasNextPage: true, endCursor: 'next' } } } };
    } else if (query.includes('query Variables')) {
      variableReads++;
      data = { variables: args.serviceId ? variables : { SHARED_APIFY_TOKEN: secrets.apify } };
    } else {
      res.statusCode = 400; res.end(JSON.stringify({ errors: [{ message: 'Unsupported query' }] })); return;
    }
    res.end(JSON.stringify({ data }));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Stub did not bind');
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done())),
  };
}

async function execute(args: string[], cwd: string, stubUrl?: string) {
  const child = spawn(process.execPath, ['--import', resolve(root, 'e2e/network-boundary.mjs'), resolve(root, 'dist/cli.js'), ...args], {
    cwd,
    env: { ...process.env, RAILWAY_API_TOKEN: secrets.token, KEYHOUSE_STUB_URL: stubUrl ?? '', NODE_DEBUG: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = '', stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });
  const [code] = await once(child, 'close');
  return { stdout, stderr, code };
}

async function journey(mode: 'railway' | 'env', artifact: string) {
  const dir = resolve(root, 'e2e/artifacts', artifact);
  await mkdir(dir, { recursive: true });
  // Each journey owns these generated files. Replace only its prior artifacts,
  // while the production CLI continues to refuse overwriting arbitrary files.
  for (const name of ['report.md', 'json-report.md']) await rm(join(dir, name), { force: true });
  const work = await mkdtemp(join(dir, 'work-'));
  const stub = mode === 'railway' ? await railwayStub() : undefined;
  try {
    const args = mode === 'railway' ? ['railway'] : ['env', join(work, 'fixture.env')];
    if (mode === 'env') {
      await writeFile(args[1]!, Object.entries({ ...variables, APIFY_TOKEN_COPY: secrets.apify }).map(([key, value]) => `${key}='${value}'`).join('\n'));
    }
    const human = await execute([...args, '--report', join(dir, 'report.md')], work, stub?.url);
    const json = await execute([...args, '--json', '--report', join(dir, 'json-report.md')], work, stub?.url);
    const report = await readFile(join(dir, 'report.md'), 'utf8');
    const jsonReport = await readFile(join(dir, 'json-report.md'), 'utf8');
    await writeFile(join(dir, 'stdout.txt'), human.stdout);
    await writeFile(join(dir, 'stderr.txt'), human.stderr);
    await writeFile(join(dir, 'output.json'), json.stdout);
    await writeFile(join(dir, 'json-stderr.txt'), json.stderr);
    await writeFile(join(dir, 'transcript.txt'), `Runtime: ${process.version}\n$ keyhouse-check ${mode}${mode === 'env' ? ' fixture.env' : ''}\nexit: ${human.code}\n${human.stdout}\nstderr:\n${human.stderr}\n$ keyhouse-check ${mode} --json\nexit: ${json.code}\n${json.stdout}\nstderr:\n${json.stderr}`);
    return { human, json, report, jsonReport, dir };
  } finally {
    await stub?.close();
    await rm(work, { recursive: true, force: true });
  }
}

function checkChecklist(result: Awaited<ReturnType<typeof journey>>) {
  expect(result.human.code).toBe(0);
  expect(result.json.code).toBe(0);
  for (const output of [result.human.stdout, result.report, result.jsonReport]) {
    for (const word of ['OPENAI_API_KEY', 'STRIPE_SECRET_KEY', 'GH_TOKEN', 'APIFY_TOKEN', 'CUSTOM_SECRET', 'DATABASE_URL', 'OpenAI', 'Stripe', 'GitHub', 'Apify', 'Database', 'Unrecognized', 'Rotation checklist', 'same as #', 'https://platform.openai.com/api-keys', 'https://dashboard.stripe.com/apikeys', 'https://console.apify.com/settings/integrations', 'unverified', 'Keyhouse']) {
      expect(output).toContain(word);
    }
    for (const word of ['PORT', 'NODE_ENV', 'PUBLIC_URL', 'NEXT_PUBLIC_STRIPE_KEY']) expect(output).not.toContain(word);
  }
  const parsed = JSON.parse(result.json.stdout);
  expect(parsed.findings.length).toBeGreaterThanOrEqual(8);
  expect(parsed.checklist.map((item: { provider: string }) => item.provider)).toContain('OpenAI');
}

test('developer scans their Railway projects and sees every secret grouped by provider with rotation links, and no value is printed', async ({}, info) => {
  const result = await journey('railway', 'railway');
  checkChecklist(result);
  for (const place of ['Demo app', 'Second app', 'production', 'preview', 'api', 'worker', 'Shared variables']) expect(result.report).toContain(place);
  expect(result.human.stdout).toContain('invalidated');
  const saved = JSON.parse(result.json.stdout);
  expect(saved.findings).toHaveLength(60);
  for (const project of ['Demo app', 'Second app']) {
    for (const environment of ['production', 'preview']) {
      for (const service of ['api', 'worker']) {
        const names = saved.findings.filter((item: { project: string; environment: string; service: string }) => item.project === project && item.environment === environment && item.service === service).map((item: { variable: string }) => item.variable);
        for (const name of ['OPENAI_API_KEY', 'STRIPE_SECRET_KEY', 'GH_TOKEN', 'APIFY_TOKEN', 'DATABASE_URL', 'CUSTOM_SECRET']) expect(names).toContain(name);
      }
    }
  }
  await info.attach('terminal transcript', { path: join(result.dir, 'transcript.txt'), contentType: 'text/plain' });
  await info.attach('Markdown report', { path: join(result.dir, 'report.md'), contentType: 'text/markdown' });
});

test('developer scans a local .env file and gets the same checklist', async ({}, info) => {
  const result = await journey('env', 'env');
  checkChecklist(result);
  expect(result.report).toContain('Local .env');
  expect(JSON.parse(result.json.stdout).findings).toHaveLength(8);
  await info.attach('terminal transcript', { path: join(result.dir, 'transcript.txt'), contentType: 'text/plain' });
  await info.attach('Markdown report', { path: join(result.dir, 'report.md'), contentType: 'text/markdown' });
});

test('no seeded secret or five-character substring appears across either journey or failure output', async ({}, info) => {
  const runs = await Promise.all([journey('railway', 'hard-rail/railway'), journey('env', 'hard-rail/env')]);
  const stub = await railwayStub(true);
  let error;
  try { error = await execute(['railway'], root, stub.url); } finally { await stub.close(); }
  expect(error.code).not.toBe(0);
  const badPath = await execute(['env', secrets.unknown], root);
  expect(badPath.code).not.toBe(0);
  const outputs = runs.flatMap(run => [run.human.stdout, run.human.stderr, run.json.stdout, run.json.stderr, run.report, run.jsonReport]);
  outputs.push(error.stdout, error.stderr, badPath.stdout, badPath.stderr);
  for (const run of runs) { expect(run.human.code).toBe(0); expect(run.json.code).toBe(0); }
  // Boolean assertions keep secret-bearing expected/actual strings out of failures.
  for (const value of Object.values(secrets)) {
    expect(outputs.every(output => !output.includes(value)), 'whole-value exposure').toBe(true);
    for (let index = 0; index <= value.length - 5; index++) {
      expect(outputs.every(output => !output.includes(value.slice(index, index + 5))), 'five-character exposure').toBe(true);
    }
  }
  const evidence = 'PASS: Railway and env stdout, stderr, Markdown and JSON contain no seeded secret or five-character slice. API and file failure output checked too.\n';
  await writeFile(resolve(root, 'e2e/artifacts/hard-rail/result.txt'), evidence);
  await writeFile(resolve(root, 'e2e/artifacts/hard-rail/failures.txt'), `Railway exit: ${error.code}\n${error.stdout}${error.stderr}\nFile exit: ${badPath.code}\n${badPath.stdout}${badPath.stderr}`);
  await info.attach('hard-rail proof', { body: evidence, contentType: 'text/plain' });
});
