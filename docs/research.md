# Implementation research, October 22, 2026

## Source material

The implementation brief and Keyhouse's `PLAN.md`,
`docs/plan/business-01-offer.md`, `docs/plan/business-02-leads.md` and
`docs/plan/feature-02-rotation-agent.md` in the adjacent planning repository
define the product scope. The QMD note
`qmd://global-knowledge/topics/agent-credential-brokers-2026.md` confirmed the
proxy-key positioning. No canonical vault files were changed because this
implementation task is restricted to this repository.

The rotation plan has a provider capability table and API-documentation sources,
but **no dashboard key-management URL column**. Dashboard routes were added in
`src/constants.ts` and marked unverified. Railway's account-token URL is the one
direct management link explicitly confirmed by the current official API docs.
Pinecone, Supabase, Clerk, Upstash and Grafana need account/project selection;
their links open that provider's dashboard. Database and private-key owners need
manual identification. No provider dashboard was authenticated for this task.

## OSS and skills search

GitHub repository metadata was checked live before implementation:

- `gitleaks/gitleaks`: MIT, Go, 30,227 stars, last push September 30, 2026.
- `betterleaks/betterleaks`: MIT, Go, 2,307 stars, last push October 22, 2026.
- `motdotla/dotenv` was considered for `.env` parsing. Node 22's built-in
  `util.parseEnv` already supplies this operation, so no parsing package is needed.

A follow-up GitHub search for `secret scanner language:TypeScript` found mostly
agent extensions and repository/editor scanners. The leading MIT result,
`moyai-ai/pi-betterleaks-scanner`, had 34 stars and an August 10, 2026 last push.
It wraps a scanner rather than providing Railway inventory or output protection;
the directly vendored upstream rules remain the smaller dependency choice.

The CLI embeds selected Gitleaks rules, rather than downloading a scanner binary
at runtime or inventing credential patterns. See `THIRD_PARTY_NOTICES.md` for the
exact revision, transformations, source digest and license. A small inventory
wrapper is necessary because source scanners don't implement Railway traversal,
placement grouping or this strict substring-output rule.

The skills.sh API was searched for `gitleaks`. It returned
`mukul975/anthropic-cybersecurity-skills/implementing-secret-scanning-with-gitleaks`
and other repository-scanning workflows. The first skill was downloaded and read
under ignored research files. It explicitly excludes runtime/in-memory secret
detection, so it was not applied to this product. The installed `test-audit`,
`playwright-best-practices`, `typescript-expert`, `webpull-fetch` and `unslop`
guidance was used where applicable. The requested suite remains exactly three
checks, with no unit or snapshot tests.

## Railway contract

Official docs were fetched with webpull and read on October 22, 2026:

- <https://docs.railway.com/integrations/api>
- <https://docs.railway.com/integrations/api/manage-projects>
- <https://docs.railway.com/integrations/api/manage-environments>
- <https://docs.railway.com/integrations/api/manage-services>
- <https://docs.railway.com/integrations/api/manage-variables>

The API endpoint is `https://backboard.railway.com/graphql/v2`. Account and
workspace tokens use `Authorization: Bearer`. Project tokens use a different
header, have environment scope and cannot enumerate the account.

The exact documented roots are `projects`, `environments(projectId:)`,
`environment(id:).serviceInstances` and
`variables(projectId:, environmentId:, serviceId:)`. Omitting `serviceId` reads
shared variables. Omitting `unrendered` returns rendered values. The code uses
these queries, including shared variables and ephemeral environments. Services
are scoped by environment, rather than assuming every project service exists in
every environment.

Pagination arguments `first`, `after` and `pageInfo`, plus `serviceId` on service
instances, were cross-checked against Railway CLI's public introspection schema:
<https://github.com/railwayapp/cli/blob/master/src/gql/schema.json>.
The client rejects missing/malformed page info or repeated cursors instead of
silently truncating. It accepts at most 1,000 pages per collection. It paces
requests below the documented Hobby 10 RPS ceiling, rejects redirects, times out
requests after 30 seconds and aborts on HTTP failures, rate limits or GraphQL
errors. Raw errors and response bodies never reach output. Scan input and each
API response are capped at 16 MiB.

**Not verified against a live Railway account:** authenticated project scope,
sealed-variable visibility, permissions, rendered-reference behavior and
workspace-token behavior. No real token was requested or used. The network stub
verifies traversal and the user-visible report; it cannot establish that a real
account will grant access. A token restricted to a workspace may require
`--workspace ID`. Retry after a rate limit resets; the CLI never writes or
retries mutations because it has none.

## Dependencies and release age

Versions were checked against npm's publication timestamps before installation:

| Package | Version | Published | Purpose |
|---|---|---|---|
| zod | 4.1.12 | 2025-10-06 | Validate external GraphQL shapes |
| typescript | 5.9.3 | 2025-09-30 | Build and strict type checks |
| @types/node | 22.18.6 | 2025-09-18 | Node 22 API types |
| @playwright/test | 1.56.1 | 2025-10-17 | Requested E2E runner, traces and artifacts |

The lockfile fixes transitive versions; `undici-types` is overridden to 6.21.0.
All direct and transitive releases predate the seven-day cutoff. Installation
used the guarded npm shim, printed `Protected by Socket Firewall`, disabled
lifecycle scripts and reported zero vulnerabilities. Built-in Node utilities
replace dotenv, commander, prompt and terminal-formatting dependencies.

The host's default Node is 24. Node 22.23.3, released September 23, 2026, was
downloaded from nodejs.org into ignored `.research/` and checked against its
official SHA-256 manifest to run the requested Node 22 validation.
