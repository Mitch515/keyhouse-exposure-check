export const PRODUCT = {
  name: 'Keyhouse Exposure Check',
  broker: 'Keyhouse',
  bin: 'keyhouse-check',
  waitlistUrl: '',
  railwayApi: 'https://backboard.railway.com/graphql/v2',
  railwayTokens: 'https://railway.com/account/tokens',
  defaultReportPrefix: 'keyhouse-report',
} as const;

export const TOKEN_GUIDANCE = `Railway invalidated all API tokens on October 22, 2026. Create a new account token at ${PRODUCT.railwayTokens}, choosing No workspace, or a workspace token for one workspace. Supply RAILWAY_API_TOKEN or use the hidden prompt. Project tokens cannot enumerate projects.`;
export const PRIVACY = 'Values stay in memory. No telemetry. Only Railway API reads; env mode makes no network calls.';
export const TAGLINE = `${PRODUCT.broker}: proxy keys keep real credentials off your host, so a host breach leaks no real keys.${PRODUCT.waitlistUrl ? ` ${PRODUCT.waitlistUrl}` : ''}`;

// Capability scope comes from the Keyhouse rotation plan, read 2026-10-22.
// Dashboard routes require a signed-in human and have NOT been verified live.
// Keep every runtime provider name, link and name heuristic in this one catalog.
function provider(id: string, name: string, names: RegExp, url: string, risk: string, verified = false) {
  return { id, name, names, url, risk, linkStatus: verified ? 'verified in official docs' : 'unverified dashboard link' };
}
const aiRisk = 'Can spend your inference budget and access provider resources.';
const infraRisk = 'Can access infrastructure, deployments or stored data.';
const emailRisk = 'Can send messages as you and damage your sending reputation.';
export const PROVIDERS = [
  provider('openai', 'OpenAI', /OPEN_?AI/, 'https://platform.openai.com/api-keys', aiRisk),
  provider('anthropic', 'Anthropic', /ANTHROPIC|CLAUDE/, 'https://platform.claude.com/settings/keys', aiRisk),
  provider('google', 'Google Cloud / Gemini', /GOOGLE|GEMINI|GCP|FIREBASE/, 'https://console.cloud.google.com/apis/credentials', infraRisk),
  provider('aws', 'AWS', /(?:^|_)AWS(?:_|$)/, 'https://console.aws.amazon.com/iam/home#/security_credentials', infraRisk),
  provider('openrouter', 'OpenRouter', /OPEN_?ROUTER/, 'https://openrouter.ai/settings/keys', aiRisk),
  provider('stripe', 'Stripe', /STRIPE/, 'https://dashboard.stripe.com/apikeys', 'Can access payment data or perform payment operations. Check live and test keys.'),
  provider('resend', 'Resend', /RESEND/, 'https://resend.com/api-keys', emailRisk),
  provider('twilio', 'Twilio', /TWILIO/, 'https://console.twilio.com/us1/account/keys-credentials/api-keys', emailRisk),
  provider('sendgrid', 'SendGrid', /SENDGRID/, 'https://app.sendgrid.com/settings/api_keys', emailRisk),
  provider('mailgun', 'Mailgun', /MAILGUN/, 'https://app.mailgun.com/settings/api_security', emailRisk),
  provider('deepgram', 'Deepgram', /DEEPGRAM/, 'https://console.deepgram.com/project/keys', aiRisk),
  provider('elevenlabs', 'ElevenLabs', /ELEVEN_?LABS/, 'https://elevenlabs.io/app/settings/api-keys', aiRisk),
  provider('pinecone', 'Pinecone', /PINECONE/, 'https://app.pinecone.io/', infraRisk),
  provider('apify', 'Apify', /APIFY/, 'https://console.apify.com/settings/integrations', 'Can run actors, spend credits and read datasets.'),
  provider('github', 'GitHub', /GITHUB|(?:^|_)GH(?:_|$)/, 'https://github.com/settings/tokens', 'Can read code, modify repositories or reach CI secrets.'),
  provider('cloudflare', 'Cloudflare', /CLOUDFLARE|(?:^|_)CF(?:_|$)/, 'https://dash.cloudflare.com/profile/api-tokens', infraRisk),
  provider('supabase', 'Supabase', /SUPABASE/, 'https://supabase.com/dashboard', infraRisk),
  provider('neon', 'Neon', /NEON/, 'https://console.neon.tech/app/settings/api-keys', infraRisk),
  provider('vercel', 'Vercel', /VERCEL/, 'https://vercel.com/account/settings/tokens', infraRisk),
  provider('railway', 'Railway', /RAILWAY/, PRODUCT.railwayTokens, infraRisk, true),
  provider('fly', 'Fly.io', /(?:^|_)FLY(?:_|$)/, 'https://fly.io/user/personal_access_tokens', infraRisk),
  provider('render', 'Render', /RENDER/, 'https://dashboard.render.com/u/settings#api-keys', infraRisk),
  provider('netlify', 'Netlify', /NETLIFY/, 'https://app.netlify.com/user/applications#personal-access-tokens', infraRisk),
  provider('sentry', 'Sentry', /SENTRY/, 'https://sentry.io/settings/account/api/auth-tokens/', infraRisk),
  provider('posthog', 'PostHog', /POSTHOG/, 'https://app.posthog.com/settings/user-api-keys', infraRisk),
  provider('clerk', 'Clerk', /CLERK/, 'https://dashboard.clerk.com/', 'Can administer authentication and user accounts.'),
  provider('upstash', 'Upstash', /UPSTASH/, 'https://console.upstash.com/', 'Can read cached data. A password reset invalidates existing clients immediately.'),
  provider('grafana', 'Grafana Cloud', /GRAFANA/, 'https://grafana.com/orgs', infraRisk),
  provider('groq', 'Groq', /GROQ/, 'https://console.groq.com/keys', aiRisk),
  provider('mistral', 'Mistral', /MISTRAL/, 'https://console.mistral.ai/api-keys', aiRisk),
  provider('linear', 'Linear', /LINEAR/, 'https://linear.app/settings/account/security', 'Can read or modify workspace issues and project data.'),
  provider('slack', 'Slack', /SLACK/, 'https://api.slack.com/apps', 'Can post messages or access workspace data. Rotate the credential in its owning app.'),
  provider('database', 'Database', /DATABASE|POSTGRES|MYSQL|MONGO|REDIS|(?:^|_)DB(?:_|$)/, '', 'Can read, change or delete database contents. Rotate the database role password.'),
  provider('private-key', 'Private key / wallet', /PRIVATE_KEY|WALLET|MNEMONIC|SEED_PHRASE/, '', 'Can sign as you or transfer funds. For wallets, move funds to a newly generated wallet.'),
  provider('unrecognized', 'Unrecognized', /$^/, '', 'A credential-like variable needs manual review. Identify its owner before rotating.'),
] as const;
export type Provider = (typeof PROVIDERS)[number];
export function getProvider(id: string): Provider {
  const found = PROVIDERS.find(item => item.id === id);
  if (!found) throw new Error('Invalid provider catalog');
  return found;
}
