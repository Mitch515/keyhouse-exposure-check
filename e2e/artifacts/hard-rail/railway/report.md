# Keyhouse Exposure Check

92 variables scanned; 60 secret candidates; 32 excluded.

Values stay in memory. No telemetry. Only Railway API reads; env mode makes no network calls.

Railway invalidated all API tokens on October 22, 2026. Create a new account token at https://railway.com/account/tokens, choosing No workspace, or a workspace token for one workspace. Supply RAILWAY_API_TOKEN or use the hidden prompt. Project tokens cannot enumerate projects.

## Exposure inventory

### Demo app

#### production

**Shared variables**

- #1 SHARED_APIFY_TOKEN | Apify
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.

**api**

- #2 OPENAI_API_KEY | OpenAI
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #3 STRIPE_SECRET_KEY | Stripe
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #4 GH_TOKEN | GitHub
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #5 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #6 DATABASE_URL | Database
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #7 CUSTOM_SECRET | Unrecognized
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #8 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

**worker**

- #9 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #10 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #11 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #12 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #13 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #14 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #15 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

#### preview

**Shared variables**

- #16 SHARED_APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.

**api**

- #17 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #18 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #19 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #20 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #21 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #22 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #23 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

**worker**

- #24 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #25 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #26 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #27 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #28 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #29 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #30 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

### Second app

#### production

**Shared variables**

- #31 SHARED_APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.

**api**

- #32 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #33 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #34 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #35 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #36 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #37 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #38 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

**worker**

- #39 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #40 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #41 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #42 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #43 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #44 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #45 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

#### preview

**Shared variables**

- #46 SHARED_APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.

**api**

- #47 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #48 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #49 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #50 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #51 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #52 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #53 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

**worker**

- #54 OPENAI_API_KEY | OpenAI | same as #2
  - Can spend your inference budget and access provider resources.
  - Value format matches Gitleaks rule openai-api-key.
- #55 STRIPE_SECRET_KEY | Stripe | same as #3
  - Can access payment data or perform payment operations. Check live and test keys.
  - Value format matches Gitleaks rule stripe-access-token.
- #56 GH_TOKEN | GitHub | same as #4
  - Can read code, modify repositories or reach CI secrets.
  - Value format matches Gitleaks rule github-pat.
- #57 APIFY_TOKEN | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Variable-name heuristic; review this candidate. The value format is not verified.
- #58 DATABASE_URL | Database | same as #6
  - Can read, change or delete database contents. Rotate the database role password.
  - URL contains embedded credentials or a credential query parameter.
- #59 CUSTOM_SECRET | Unrecognized | same as #7
  - A credential-like variable needs manual review. Identify its owner before rotating.
  - Provider inferred from the same value at #7.
- #60 MALICIOUS_SECRET_█ | Apify | same as #1
  - Can run actors, spend credits and read datasets.
  - Provider inferred from the same value at #1.

## Rotation checklist

### Apify

#1, #5, #8, #12, #15, #16, #20, #23, #27, #30, #31, #35, #38, #42, #45, #46, #50, #53, #57, #60

https://console.apify.com/settings/integrations [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### OpenAI

#2, #9, #17, #24, #32, #39, #47, #54

https://platform.openai.com/api-keys [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Stripe

#3, #10, #18, #25, #33, #40, #48, #55

https://dashboard.stripe.com/apikeys [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### GitHub

#4, #11, #19, #26, #34, #41, #49, #56

https://github.com/settings/tokens [unverified dashboard link]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Database

#6, #13, #21, #28, #36, #43, #51, #58

No universal key-management URL; use the credential owner dashboard. [manual]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

### Unrecognized

#7, #14, #22, #29, #37, #44, #52, #59

No universal key-management URL; use the credential owner dashboard. [manual]

- [ ] Create a replacement credential at the provider. Review permissions and recent usage.
- [ ] Update every listed placement and redeploy affected services. Verify the application works.
- [ ] Revoke the exposed credential. Review provider logs and unexpected spending.

Candidates, not proof of compromise or an exhaustive secret audit. Unrecognized formats and innocuous names can be missed. Sealed or inaccessible variables may not be returned by Railway. An empty scan does not prove safety.

Redaction may hide labels or links that overlap a secret. Duplicate groups compare exact values in memory; no hashes or key suffixes are printed.

Keyhouse: proxy keys keep real credentials off your host, so a host breach leaks no real keys.
