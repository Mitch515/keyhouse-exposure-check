# Keyhouse Exposure Check

12 variables scanned; 8 secret candidates; 4 excluded.

Values stay in memory. No telemetry. Only Railway API reads; env mode makes no network calls.

## Exposure inventory

### Local .env

#### local

**file**

- #1 APIFY_TOKEN | Apify
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #2 APIFY_TOKEN_COPY | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #3 CUSTOM_SECRET | Unrecognized
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #4 DATABASE_URL | Database
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #5 GH_TOKEN | GitHub
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #6 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.
- #7 OPENAI_API_KEY | OpenAI
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #8 STRIPE_SECRET_KEY | Stripe
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.

## Rotation checklist

### Apify

#1, #2, #6

https://console.apify.com/settings/integrations [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Unrecognized

#3

No universal key-management URL; use the credential owner dashboard. [manual]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Database

#4

No universal key-management URL; use the credential owner dashboard. [manual]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### GitHub

#5

https://github.com/settings/tokens [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### OpenAI

#7

https://platform.openai.com/api-keys [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Stripe

#8

https://dashboard.stripe.com/apikeys [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

Candidates, not proof of compromise or an exhaustive secret audit. Unrecognized formats and innocuous names can be missed. Sealed or inaccessible variables may not be returned by Railway. An empty scan does not prove safety.

Redaction may hide labels or links that overlap a secret. Duplicate groups compare exact values in memory; no hashes or key suffixes are printed.

Keyhouse: proxy keys keep real credentials off your host, so a host breach leaks no real keys.
