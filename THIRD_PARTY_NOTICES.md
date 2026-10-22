# Third-party notices

This project is MIT licensed. Detection embeds 31 selected value-format rules
from [Gitleaks](https://github.com/gitleaks/gitleaks), also MIT licensed.
The upstream copyright and license are included in `LICENSE.gitleaks`, including
in the npm package.

Pinned source:

- Commit: `09242ce9c8a60d9b051fc2d166f9e849b88c7ac0`
- File: <https://github.com/gitleaks/gitleaks/blob/09242ce9c8a60d9b051fc2d166f9e849b88c7ac0/config/gitleaks.toml>
- SHA-256: `e163e53b9e7e8a8511e77271e2b323ed057759542a6d988258afe3a1fa329caf`
- Retrieved: October 22, 2026

`src/gitleaks-rules.ts` retains the upstream rule IDs and expressions. The Go
inline `(?i)` flag becomes JavaScript's regex `i` flag. Go's absolute-end `\z`
assertion becomes `(?![\s\S])` at compilation. No new provider value formats
were invented. This is a subset of Gitleaks, not the full scanner. Entropy
thresholds, source-code assignment context and allowlists are not applied to
these already extracted environment values. Lower-confidence variable-name
heuristics and credential-bearing URL parsing supplement the rules.

The runtime dependency Zod 4.1.12 is MIT licensed. Development dependencies
TypeScript and Node type definitions are Apache-2.0 and MIT respectively;
Playwright is Apache-2.0. Dependencies retain their own license files.
