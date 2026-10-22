// Derived from MIT Gitleaks 09242ce9c8a60d9b051fc2d166f9e849b88c7ac0. Inline (?i) moved to the JS i flag.
// Value formats only; entropy/allowlists are deliberately not applied to inventories.
export const GITLEAKS_RULES = [
  {
    "id": "age-secret-key",
    "provider": "private-key",
    "regex": "AGE-SECRET-KEY-1[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{58}",
    "flags": ""
  },
  {
    "id": "anthropic-admin-api-key",
    "provider": "anthropic",
    "regex": "\\b(sk-ant-admin01-[a-zA-Z0-9_\\-]{93}AA)(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "anthropic-api-key",
    "provider": "anthropic",
    "regex": "\\b(sk-ant-api03-[a-zA-Z0-9_\\-]{93}AA)(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "aws-access-token",
    "provider": "aws",
    "regex": "\\b((?:A3T[A-Z0-9]|AKIA|ASIA|ABIA|ACCA)[A-Z2-7]{16})\\b",
    "flags": ""
  },
  {
    "id": "flyio-access-token",
    "provider": "fly",
    "regex": "\\b((?:fo1_[\\w-]{43}|fm1[ar]_[a-zA-Z0-9+\\/]{100,}={0,3}|fm2_[a-zA-Z0-9+\\/]{100,}={0,3}))(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "gcp-api-key",
    "provider": "google",
    "regex": "\\b(AIza[\\w-]{35})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "github-app-token",
    "provider": "github",
    "regex": "(?:ghu|ghs)_[0-9a-zA-Z]{36}",
    "flags": ""
  },
  {
    "id": "github-fine-grained-pat",
    "provider": "github",
    "regex": "github_pat_\\w{82}",
    "flags": ""
  },
  {
    "id": "github-oauth",
    "provider": "github",
    "regex": "gho_[0-9a-zA-Z]{36}",
    "flags": ""
  },
  {
    "id": "github-pat",
    "provider": "github",
    "regex": "ghp_[0-9a-zA-Z]{36}",
    "flags": ""
  },
  {
    "id": "github-refresh-token",
    "provider": "github",
    "regex": "ghr_[0-9a-zA-Z]{36}",
    "flags": ""
  },
  {
    "id": "grafana-api-key",
    "provider": "grafana",
    "regex": "\\b(eyJrIjoi[A-Za-z0-9]{70,400}={0,3})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": "i"
  },
  {
    "id": "grafana-cloud-api-token",
    "provider": "grafana",
    "regex": "\\b(glc_[A-Za-z0-9+/]{32,400}={0,3})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": "i"
  },
  {
    "id": "grafana-service-account-token",
    "provider": "grafana",
    "regex": "\\b(glsa_[A-Za-z0-9]{32}_[A-Fa-f0-9]{8})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": "i"
  },
  {
    "id": "linear-api-key",
    "provider": "linear",
    "regex": "lin_api_[a-z0-9]{40}",
    "flags": "i"
  },
  {
    "id": "openai-api-key",
    "provider": "openai",
    "regex": "\\b(sk-(?:proj|svcacct|admin)-(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})T3BlbkFJ(?:[A-Za-z0-9_-]{74}|[A-Za-z0-9_-]{58})\\b|sk-[a-zA-Z0-9]{20}T3BlbkFJ[a-zA-Z0-9]{20})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "private-key",
    "provider": "private-key",
    "regex": "-----BEGIN[ A-Z0-9_-]{0,100}PRIVATE KEY(?: BLOCK)?-----[\\s\\S-]{64,}?KEY(?: BLOCK)?-----",
    "flags": "i"
  },
  {
    "id": "sendgrid-api-token",
    "provider": "sendgrid",
    "regex": "\\b(SG\\.[a-z0-9=_\\-\\.]{66})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": "i"
  },
  {
    "id": "sentry-org-token",
    "provider": "sentry",
    "regex": "\\bsntrys_eyJpYXQiO[a-zA-Z0-9+/]{10,200}(?:LCJyZWdpb25fdXJs|InJlZ2lvbl91cmwi|cmVnaW9uX3VybCI6)[a-zA-Z0-9+/]{10,200}={0,2}_[a-zA-Z0-9+/]{43}(?:[^a-zA-Z0-9+/]|\\z)",
    "flags": ""
  },
  {
    "id": "sentry-user-token",
    "provider": "sentry",
    "regex": "\\b(sntryu_[a-f0-9]{64})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "slack-app-token",
    "provider": "slack",
    "regex": "xapp-\\d-[A-Z0-9]+-\\d+-[a-z0-9]+",
    "flags": "i"
  },
  {
    "id": "slack-bot-token",
    "provider": "slack",
    "regex": "xoxb-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*",
    "flags": ""
  },
  {
    "id": "slack-config-access-token",
    "provider": "slack",
    "regex": "xoxe.xox[bp]-\\d-[A-Z0-9]{163,166}",
    "flags": "i"
  },
  {
    "id": "slack-config-refresh-token",
    "provider": "slack",
    "regex": "xoxe-\\d-[A-Z0-9]{146}",
    "flags": "i"
  },
  {
    "id": "slack-legacy-bot-token",
    "provider": "slack",
    "regex": "xoxb-[0-9]{8,14}-[a-zA-Z0-9]{18,26}",
    "flags": ""
  },
  {
    "id": "slack-legacy-token",
    "provider": "slack",
    "regex": "xox[os]-\\d+-\\d+-\\d+-[a-fA-F\\d]+",
    "flags": ""
  },
  {
    "id": "slack-legacy-workspace-token",
    "provider": "slack",
    "regex": "xox[ar]-(?:\\d-)?[0-9a-zA-Z]{8,48}",
    "flags": ""
  },
  {
    "id": "slack-user-token",
    "provider": "slack",
    "regex": "xox[pe](?:-[0-9]{10,13}){3}-[a-zA-Z0-9-]{28,34}",
    "flags": ""
  },
  {
    "id": "slack-webhook-url",
    "provider": "slack",
    "regex": "(?:https?://)?hooks.slack.com/(?:services|workflows|triggers)/[A-Za-z0-9+/]{43,56}",
    "flags": ""
  },
  {
    "id": "stripe-access-token",
    "provider": "stripe",
    "regex": "\\b((?:sk|rk)_(?:test|live|prod)_[a-zA-Z0-9]{10,99})(?:[\\x60'\"\\s;]|\\\\[nr]|$)",
    "flags": ""
  },
  {
    "id": "twilio-api-key",
    "provider": "twilio",
    "regex": "SK[0-9a-fA-F]{32}",
    "flags": ""
  }
] as const;
