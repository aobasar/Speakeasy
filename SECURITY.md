# Security Policy

Speakeasy is a fork of [MiroTalk P2P](https://github.com/miroslavpejic85/mirotalk).
Where you report a vulnerability depends on where it lives.

## Reporting a vulnerability in this fork or its deployment

This covers anything specific to Speakeasy — the customisations in `app/src/config.js`,
the `public/css/aob-*.css` and `public/js/aob-rooms.js` files, the container health check,
the sync workflow, or the running deployment at `speakeasy.aobprojects.com`.

**Report it privately through GitHub:** open the
[Security tab](https://github.com/aobasar/mirotalk/security) of this repository and use
**Report a vulnerability**. Please do not open a public issue first — coordinated
disclosure gives me a chance to fix the root cause before it is public.

A useful report includes:

- The commit hash this reproduces on
- The affected component
- A description of the vulnerability and its impact
- Reproduction steps

## Reporting a vulnerability in MiroTalk itself

If the issue is in upstream code — the WebRTC signalling, `app/src/server.js`, the client
engine, dependencies — it affects every MiroTalk deployment, not just this one. Report it
to upstream, who can actually ship the fix:

**<https://github.com/miroslavpejic85/mirotalk/blob/master/SECURITY.md>**

I would appreciate a heads-up here as well, so this deployment can be patched once the fix
lands upstream.

## What this fork does about upstream security fixes

`.github/workflows/upstream-sync.yml` merges `miroslavpejic85/mirotalk` `master` into this
fork daily and deploys clean merges automatically, so upstream security fixes reach this
deployment without waiting on manual intervention. If a merge conflicts, the workflow
aborts and fails rather than shipping a half-merged tree.

---

## Acknowledgements

Upstream MiroTalk maintains its own list of researchers who have responsibly disclosed
vulnerabilities. It is preserved in
[upstream's SECURITY.md](https://github.com/miroslavpejic85/mirotalk/blob/master/SECURITY.md)
and their credit belongs there, not here.
