import { PRODUCT, PRIVACY, TAGLINE, TOKEN_GUIDANCE } from './constants.js';
import type { Report } from './inventory.js';

function label(text: string): string {
  // Labels remain text, not Markdown links, tables, headings or terminal controls.
  return text.replace(/[\r\n\t]/g, ' ').replace(/[\\`*{}[\]()<>#!|]/g, character => `\\${character}`);
}

export function markdown(report: Report): string {
  const lines = [
    `# ${PRODUCT.name}`, '',
    `${report.variablesScanned} variables scanned; ${report.findings.length} secret candidates; ${report.excluded} excluded.`, '',
    PRIVACY, '',
    ...(report.source === 'Railway' ? [TOKEN_GUIDANCE, ''] : []),
    '## Exposure inventory', '',
  ];
  for (const project of new Set(report.placements.map(place => place.project))) {
    lines.push(`### ${label(project)}`, '');
    for (const environment of new Set(report.placements.filter(place => place.project === project).map(place => place.environment))) {
      lines.push(`#### ${label(environment)}`, '');
      for (const service of new Set(report.placements.filter(place => place.project === project && place.environment === environment).map(place => place.service))) {
        lines.push(`**${label(service)}**`, '');
        const matches = report.findings.filter(item => item.project === project && item.environment === environment && item.service === service);
        if (!matches.length) lines.push('No secret candidates detected here.', '');
        for (const item of matches) {
          lines.push(`- #${item.number} ${label(item.variable)} | ${item.provider}${item.duplicate ? ` | ${item.duplicate}` : ''}`, `  - ${item.whyItMatters}`, `  - ${item.reason}`);
        }
        lines.push('');
      }
    }
  }
  if (!report.placements.length) lines.push('No accessible placements returned.', '');
  lines.push('## Rotation checklist', '');
  for (const item of report.checklist) {
    lines.push(`### ${item.provider}`, '', `${item.findings.join(', ')}`, '', `${item.url} [${item.linkStatus}]`, '');
    for (const step of item.steps) lines.push(`- [ ] ${step}`);
    lines.push('');
  }
  if (!report.checklist.length) lines.push('No candidates detected. Review unknown formats and inaccessible variables manually.', '');
  lines.push(report.limitations, '', 'Redaction may hide labels or links that overlap a secret. Duplicate groups compare exact values in memory; no hashes or key suffixes are printed.', '', TAGLINE, '');
  return lines.join('\n');
}

export function terminal(report: Report): string {
  // One report template prevents terminal and persisted checklist drift.
  return markdown(report).replace(/^#{1,4} /gm, '').replace(/^\*\*(.+)\*\*$/gm, '$1').replace(/\\([\\`*_{}[\]()<>#!|])/g, '$1');
}

export function machine(report: Report): string {
  return JSON.stringify({ ...report, privacy: PRIVACY, ...(report.source === 'Railway' ? { tokenGuidance: TOKEN_GUIDANCE } : {}), keyhouse: TAGLINE }, null, 2) + '\n';
}
