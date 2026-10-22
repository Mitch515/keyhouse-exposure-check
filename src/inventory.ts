import { detect } from './detect.js';
import { getProvider } from './constants.js';
import { OutputGuard } from './privacy.js';

export interface Placement { project: string; environment: string; service: string }
export interface Finding extends Placement {
  number: number;
  variable: string;
  provider: string;
  providerId: string;
  reason: string;
  whyItMatters: string;
  duplicate?: string;
}

export class Inventory {
  readonly guard = new OutputGuard();
  readonly findings: Finding[] = [];
  readonly placements: Placement[] = [];
  private readonly firstSeen = new Map<string, number>();
  private scanned = 0;
  private excluded = 0;

  add(place: Placement, variables: Record<string, string>): void {
    this.placements.push(place);
    for (const [name, value] of Object.entries(variables)) {
      this.scanned++;
      const match = detect(name, value);
      // Unknown formats still enter the output guard even if their innocuous
      // names cannot justify a finding. Explicit public configuration is spared.
      if (match.kind === 'secret' || (match.kind === 'unclassified' && value.length >= 5)) this.guard.protect(value);
      if (match.kind !== 'secret') { this.excluded++; continue; }
      const number = this.findings.length + 1;
      const first = this.firstSeen.get(value);
      this.firstSeen.set(value, first ?? number);
      const knownProvider = first && match.provider.id === 'unrecognized' ? this.findings[first - 1]?.providerId : undefined;
      const provider = knownProvider ? getProvider(knownProvider) : match.provider;
      this.findings.push({
        ...place, number, variable: name, provider: provider.name,
        providerId: provider.id, reason: knownProvider ? `Provider inferred from the same value at #${first}.` : match.reason,
        whyItMatters: provider.risk,
        ...(first ? { duplicate: `same as #${first}` } : {}),
      });
    }
  }

  report(source: string) {
    const checklist = [...new Set(this.findings.map(item => item.providerId))].map(id => {
      const provider = getProvider(id);
      const matches = this.findings.filter(item => item.providerId === id);
      return {
        provider: provider.name,
        findings: matches.map(item => `#${item.number}`),
        url: provider.url || 'No universal key-management URL; use the credential owner dashboard.',
        linkStatus: provider.url ? provider.linkStatus : 'manual',
        steps: [
          id === 'private-key' ? 'Create a new key pair or wallet. For a wallet, move funds.' : 'Create a replacement credential at the provider. Review permissions and recent usage.',
          'Update every listed placement and redeploy affected services. Verify the application works.',
          'Revoke the exposed credential. Review provider logs and unexpected spending.',
        ],
      };
    });
    return {
      source, variablesScanned: this.scanned, excluded: this.excluded,
      placements: this.placements, findings: this.findings, checklist,
      limitations: 'Candidates, not proof of compromise or an exhaustive secret audit. Unrecognized formats and innocuous names can be missed. Sealed or inaccessible variables may not be returned by Railway. An empty scan does not prove safety.',
    };
  }
}
export type Report = ReturnType<Inventory['report']>;
