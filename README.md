# Keyhouse Exposure Check

Find the credentials your Railway projects expose, grouped by provider, with a
rotation checklist. Or scan a local `.env` file entirely offline. Free and open
source under the MIT license. Requires Node.js 22.16 or newer.

## Run it

Published on npm as [`keyhouse-check`](https://www.npmjs.com/package/keyhouse-check), so `npx` downloads and runs it:

```sh
npx keyhouse-check railway
npx keyhouse-check env .env
npx keyhouse-check env .env --json --report exposure.md
```

Railway invalidated every API token on October 22, 2026. Create a fresh token at
<https://railway.com/account/tokens>. Select **No workspace** for an account token,
or select a workspace for a token scoped to that workspace. The CLI reads
`RAILWAY_API_TOKEN` if set; otherwise it prompts without echoing the token or its
length. Avoid placing a token in a shell command or shell history.

```sh
keyhouse-check railway --workspace YOUR_WORKSPACE_ID
```

Account and workspace tokens use Railway's Bearer authentication. Project tokens
only reach one environment and cannot enumerate projects, so they are not
supported. The CLI never asks for an admin role. A token itself may permit writes;
the CLI sends **only GraphQL queries**. Revoke this scan token when finished.

## What it reads

- Railway's public GraphQL API at `https://backboard.railway.com/graphql/v2`.
  It lists projects, all environments including previews, shared variables,
  and environment-scoped services with their rendered variables. Every
  collection is paginated. Use `--workspace` to select a specific workspace;
  default scope is whatever Railway returns for the supplied token.
- Or exactly the local `.env` path you supply. Node's built-in dotenv parser
  handles quotes, comments, `export` and multiline quoted values. It does not
  execute substitutions, expand references, traverse directories or alter your
  process environment. As with Node's parser, the last repeated variable name
  wins.

Railway advised customers to rotate every secret after its October 21, 2026
disclosure. This tool inventories credentials to help you do that. A finding does
not prove a credential was stolen, or that it is still valid.

## What it never does

**No secret values leave your machine.** The Railway authentication token is sent
only to Railway to read your data. Downloaded credential values remain in memory
and are never uploaded, logged, included in errors, saved to a temporary dump or
written to reports. The tool never calls credential providers to validate keys.
There is no telemetry, analytics, update checker or Keyhouse server call. `env`
mode makes **zero network calls**. Installing through `npx` itself contacts npm;
that happens before the scanner runs.

There are no Railway mutations, deployments, automatic rotations or provider
changes. Reports contain placement names, variable names, inferred providers,
reasons, opaque duplicate references and rotation instructions. A single output
guard removes secret values and every five-character substring of them from
terminal output, stderr, Markdown and JSON, even if a substring happens to occur
in a label or link. It also guards the Railway token. No key prefixes, suffixes,
hashes or fingerprints are displayed. Values of four characters or fewer that
are classified as secret are redacted in full too.

A pathological secret that overlaps JSON punctuation can make a safe JSON
document impossible to render as normal. In that case JSON output is `{}`, or
empty if even that collides. The tool never relaxes redaction to preserve a
label, link or schema. Memory is not securely zeroized by JavaScript; don't run
the scanner under a debugger, HTTP logger or process-dump collector if those
tools record secrets outside the CLI's output boundary.

The Markdown report uses owner-only permissions where the filesystem supports
them and is created exclusively. **Existing files are never overwritten**,
including symlinks and your input file. By default it is saved in your current
directory as `keyhouse-report-<timestamp>-<random>.md`. Use `--report PATH` to
choose a new filename. Inventory is printed only after the scan and report
write both succeed. No partial success report is produced on API errors.

## Sample output

Illustrative output with fake placement names. No example credentials are needed.

```text
Keyhouse Exposure Check
4 variables scanned; 3 secret candidates; 1 excluded.

Exposure inventory
Demo app
production
api
- #1 OPENAI_API_KEY | OpenAI
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #2 APIFY_TOKEN | Apify
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
worker
- #3 APIFY_TOKEN | Apify | same as #2

Rotation checklist
OpenAI
#1
https://platform.openai.com/api-keys [unverified dashboard link]
- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

Apify
#2, #3
https://console.apify.com/settings/integrations [unverified dashboard link]
...
Keyhouse: proxy keys keep real credentials off your host, so a host breach leaks no real keys.
```

The full report explains every finding and includes each provider's checklist.
Duplicate references compare complete, exact values in memory; two services with
different keys for the same provider are not reported as duplicates. `--json`
prints a JSON document with `placements`, `findings`, `checklist`, totals and
limitations. Authentication guidance is included in Railway output. The Keyhouse
line is the final human-readable line and the final JSON field. A waitlist URL
is deliberately unset.

## Detection and limits

The CLI reuses 31 MIT-licensed [Gitleaks rules](THIRD_PARTY_NOTICES.md) for distinctive
value formats. Provider-name heuristics cover the rotation plan's SaaS providers,
including OpenAI, Anthropic, Stripe, Apify, AWS, GitHub, Supabase, Cloudflare and
others. Credentials in database URLs and private keys are included. Heuristics
are labeled as candidates and require your review. `PORT`, `NODE_ENV`, ordinary
public URLs and public publishable keys are excluded unless a known secret
format or embedded URL credential overrides that exclusion.

This is not a complete Gitleaks scan, a proof of compromise, or a guarantee of
finding every secret. Unknown formats with innocuous names can be missed.
Railway may omit inaccessible or sealed variables. Resolved references and
shared values may appear more than once. Reports describe current API-visible
values, not historical deployment snapshots. A zero-finding report does not
prove the account is safe.

Key-management links that require login are marked **unverified**. Some providers
need a selected project or organization; their link opens the dashboard where
you choose it. Database credentials and private keys have no universal dashboard
URL. See [research and API notes](docs/research.md) for source and verification
limits.

## Develop and verify

```sh
npm ci --ignore-scripts
npm run check
npm run test:e2e
npm run lint
node dist/cli.js railway
node dist/cli.js env /path/to/.env --report local-exposure.md
```

Direct dependencies and the lockfile are pinned. Lifecycle scripts are disabled
in `.npmrc`. The source uses TypeScript; `npm run build` produces the executable
JavaScript without a runtime compiler. Runtime branding, provider names and URLs
live in `src/constants.ts`.

Playwright runs exactly two subprocess journeys and one isolated output check.
Railway is a local HTTP stub at the network boundary; production has no API URL
override. The env journey rejects every attempted network request. The hard-rail
check inspects stdout, stderr, both Markdown reports and JSON from both journeys,
plus API and file failures, for whole seeded values and every five-character
slice. Tests use fake credentials, never a real account.

Repeatable terminal transcripts, reports, JSON and the privacy proof are saved
under `e2e/artifacts/railway/`, `e2e/artifacts/env/` and
`e2e/artifacts/hard-rail/`. Playwright traces are retained under
`e2e/artifacts/playwright/`. There is no browser UI to record, so the terminal
transcripts are the journey recordings. No browser is launched or installed.

Release steps are in [PUBLISHING.md](PUBLISHING.md).
