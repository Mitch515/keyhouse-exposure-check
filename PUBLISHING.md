# Publishing

Nothing has been pushed or published. Run these commands **only after Quentin
approves publishing**, using Node 22.16+ and the intended GitHub/npm accounts.
The GitHub repository name is `keyhouse-exposure-check`; the npm package and bin
name are `keyhouse-check`.

## Verify the release locally

```sh
cd keyhouse-exposure-check
npm ci --ignore-scripts
npm run check
npm run test:e2e
npm run lint
npm audit
npm pack --dry-run --ignore-scripts
git status --short
```

Inspect the package file list. It should include only compiled `dist/`, README,
package metadata, MIT licenses and third-party notices. Source credentials,
`.env`, artifacts, research downloads and development dependencies are excluded.
The test command explicitly builds; installation and publication never build
through lifecycle hooks.

## Create the public GitHub repository and push

Verify `gh auth status` identifies the intended owner. These commands create the
repository under that authenticated user's account and push the local branch.

```sh
gh auth status
gh repo create keyhouse-exposure-check --public --source=. --remote=origin --push
```

If `origin` already exists after an interrupted release, inspect `git remote -v`
and `gh repo view --json nameWithOwner,url` before proceeding. Do not repeat the
create command blindly.

## Publish npm

Confirm the package name is still available. `npm view keyhouse-check version`
should return E404 before the first publication; if it returns a version, stop
and check ownership. Run `npm login` if the intended account is not signed in;
keep tokens and one-time codes out of command history and documentation.

```sh
npm whoami
npm view keyhouse-check version
npm pkg set "repository.type=git" "repository.url=$(gh repo view --json url --jq .url).git" "bugs.url=$(gh repo view --json url --jq .url)/issues" "homepage=$(gh repo view --json url --jq .url)#readme"
git add package.json
git commit -m "Add public repository metadata"
git push origin HEAD
npm run build
npm pack --dry-run --ignore-scripts
npm publish --access public --ignore-scripts
```

The version is `0.1.0`. npm may prompt for 2FA. Once published, verify the real
installation and inspect the public README before announcing it:

```sh
npm view keyhouse-check@0.1.0 name version bin license
npx --yes --ignore-scripts keyhouse-check@0.1.0 --help
git tag v0.1.0
git push origin v0.1.0
```

Remove the README's pre-publication note once the public installation has been
verified. The waitlist constant stays empty until a real domain exists. No
telemetry, sign-up dependency or feature flag is required to run a scan.
