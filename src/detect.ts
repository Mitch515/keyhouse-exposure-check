import { PROVIDERS, getProvider, type Provider } from './constants.js';
import { GITLEAKS_RULES } from './gitleaks-rules.js';

// Go's \z means absolute end of input; JavaScript has no \z assertion.
const rules = GITLEAKS_RULES.map(rule => ({ ...rule, pattern: new RegExp(rule.regex.replaceAll('\\z', '(?![\\s\\S])'), rule.flags) }));
const credentialName = /(?:^|_)(?:API_?KEY|KEY|TOKEN|SECRET|PASSWORD|PASSWD|PWD|CREDENTIALS?|AUTH|DSN|CONNECTION_STRING|MNEMONIC|SEED_PHRASE)(?:_|$)/;
const databaseName = /(?:DATABASE|POSTGRES|MYSQL|MONGO(?:DB)?|REDIS|DB)_URL$/;
const PUBLIC = { kind: 'public' } as const;
const UNCLASSIFIED = { kind: 'unclassified' } as const;
type Detection = { kind: 'secret'; provider: Provider; reason: string } | typeof PUBLIC | typeof UNCLASSIFIED;

export function detect(name: string, value: string): Detection {
  if (!value.trim() || /^\$\{\{[^}]+\}\}$/.test(value.trim())) return PUBLIC;
  for (const rule of rules) {
    if (rule.pattern.test(value)) return { kind: 'secret', provider: getProvider(rule.provider), reason: `Value format matches Gitleaks rule ${rule.id}.` };
  }
  // URL parsing is syntax recognition, not a newly invented provider pattern.
  try {
    const url = new URL(value);
    const hasCredentials = Boolean(url.password || url.username || [...url.searchParams.keys()].some(key => credentialName.test(key.toUpperCase())));
    if (hasCredentials) {
      const database = ['postgres:', 'postgresql:', 'mysql:', 'mongodb:', 'mongodb+srv:', 'redis:', 'rediss:', 'mssql:'].includes(url.protocol);
      return { kind: 'secret', provider: getProvider(database ? 'database' : 'unrecognized'), reason: 'URL contains embedded credentials or a credential query parameter.' };
    }
    if (['http:', 'https:'].includes(url.protocol) && !credentialName.test(name.toUpperCase())) return PUBLIC;
  } catch { /* Not a URL. No parser exception crosses the output boundary. */ }
  const key = name.toUpperCase().replace(/[.-]/g, '_');
  if (key === 'NODE_ENV' && /^(?:production|development|test)$/.test(value)) return PUBLIC;
  if (key === 'PORT' && /^\d+$/.test(value)) return PUBLIC;
  if (/SUPABASE.*ANON.*KEY/.test(key)) return PUBLIC;
  if (/^(?:pk_(?:live|test)_|sb_publishable_|phc_)/.test(value)) return PUBLIC;
  if (!credentialName.test(key) && !databaseName.test(key)) return UNCLASSIFIED;
  const provider = PROVIDERS.find(item => item.names.test(key)) ?? getProvider('unrecognized');
  return { kind: 'secret', provider, reason: 'Variable-name heuristic; review this candidate. The value format is not verified.' };
}
