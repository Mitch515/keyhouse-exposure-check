#!/usr/bin/env node
import { parseArgs, parseEnv } from 'node:util';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PRODUCT, TAGLINE, TOKEN_GUIDANCE } from './constants.js';
import { Inventory } from './inventory.js';
import { scanRailway } from './railway.js';
import { hiddenToken } from './prompt.js';
import { machine, markdown, terminal } from './report.js';

const inventory = new Inventory();
// Protect supplied auth and arguments even when parsing or file access fails.
if (process.env.RAILWAY_API_TOKEN) inventory.guard.protect(process.env.RAILWAY_API_TOKEN);
let jsonMode = process.argv.slice(2).includes('--json');
let railwayMode = false;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true, strict: true,
    options: { json: { type: 'boolean' }, report: { type: 'string' }, workspace: { type: 'string' }, help: { type: 'boolean', short: 'h' }, version: { type: 'boolean', short: 'v' } },
  });
  jsonMode = values.json ?? false;
  if (values.help) {
    process.stdout.write(inventory.guard.scrub(`${PRODUCT.name}\n\n${PRODUCT.bin} railway [--workspace ID] [--report PATH] [--json]\n${PRODUCT.bin} env <path> [--report PATH] [--json]\n\n${TOKEN_GUIDANCE}\n\nReports are created exclusively with owner-only permissions. Existing files are never overwritten.\n${TAGLINE}\n`));
    return;
  }
  if (values.version) { process.stdout.write(inventory.guard.scrub('0.1.0\n')); return; }
  const [mode, path] = positionals;
  railwayMode = mode === 'railway';
  if (mode === 'railway' && positionals.length === 1) {
    const token = process.env.RAILWAY_API_TOKEN?.trim() || await hiddenToken();
    inventory.guard.protect(token);
    if (!token || /[\r\n]/.test(token)) throw new Error('token');
    await scanRailway(inventory, token, values.workspace);
  } else if (mode === 'env' && path && positionals.length === 2 && !values.workspace) {
    // Never export parsed entries into process.env or execute interpolation.
    if ((await stat(path)).size > 16 * 1024 * 1024) throw new Error('file');
    const parsed = parseEnv(await readFile(path, 'utf8'));
    const variables = Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
    inventory.add({ project: 'Local .env', environment: 'local', service: 'file' }, variables);
  } else { throw new Error('usage'); }
  const report = inventory.report(mode === 'railway' ? 'Railway' : 'Local .env');
  const reportPath = values.report ?? `${PRODUCT.defaultReportPrefix}-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}.md`;
  // Scan completes before any inventory output. No misleading partial report.
  await writeFile(reportPath, inventory.guard.scrub(markdown(report)), { flag: 'wx', mode: 0o600 });
  const rendered = jsonMode ? inventory.guard.json(machine(report)) : inventory.guard.scrub(terminal(report));
  process.stdout.write(rendered);
}

main().catch(error => {
  // Exceptions may contain secrets from response bodies, filenames or Zod. Only
  // locally authored categories can influence the message; never stringify error.
  const category = error instanceof Error ? error.message : '';
  let message = 'Scan failed. No complete report was produced. Check file permissions, report filename, network access and Railway token scope. Existing report files are never overwritten.';
  if (category === 'usage') message = `Use ${PRODUCT.bin} railway or ${PRODUCT.bin} env <path>. See --help.`;
  if (category === 'token') message = TOKEN_GUIDANCE;
  if (category === 'rate-limit') message = 'Railway rate limit reached. Wait for your Railway quota to reset before rerunning. No complete report was produced.';
  if (railwayMode && category !== 'token') message += ` ${TOKEN_GUIDANCE}`;
  if (jsonMode) process.stderr.write(inventory.guard.json(JSON.stringify({ error: message, keyhouse: TAGLINE }) + '\n'));
  else process.stderr.write(inventory.guard.scrub(`${message}\n${TAGLINE}\n`));
  process.exitCode = 1;
});
