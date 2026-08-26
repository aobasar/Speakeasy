# aob-brand

Build-time branding for AOB Speakeasy.

## Why this directory exists

MiroTalk puts a large footer on every public page — its logo, Discord and social
links, sponsor blocks. We replace it with a one-line credit.

The obvious way to do that is to edit `public/views/*.html` directly. We used to,
and it cost us: upstream keeps touching its own footer (sponsor rotations, icon
tweaks), so the nightly `upstream-sync` workflow hit a merge conflict in **six**
HTML files on every MiroTalk release and failed until someone resolved it by hand.

So the view files are now kept **byte-identical to upstream**, and the footer is
swapped in while the Docker image is built. There is nothing left to merge.

## Files

| File | What it is |
|---|---|
| `footer.html` | Our footer markup — the single source of truth. Edit this to change the footer. |
| `apply.js` | Finds `<footer id="footer">…</footer>` in every `public/views/*.html` and replaces it with `footer.html`. Run by the `Dockerfile`. |

## Editing the footer

Edit `aob-brand/footer.html`, commit, push. Coolify rebuilds and the new footer
appears on all pages. Do **not** edit the footer inside `public/views/*.html` —
that reintroduces the conflicts this exists to prevent.

Keep the `@AOBASAR` marker (`apply.js` uses it as its idempotency check) and keep
the "Based on MiroTalk (AGPLv3)" link — attribution is a licence obligation.

## Previewing locally

```bash
node aob-brand/apply.js     # rewrites public/views/*.html in place
npm start                   # look at it
git checkout -- public/views # undo — never commit the result
```

Running it twice is a no-op; it skips any page that already carries the marker.

## Failure mode, on purpose

If upstream ever renames the `<footer id="footer">` anchor, `apply.js` exits
non-zero and the Docker build fails. Coolify keeps the previous container
running, so the live site never silently reverts to MiroTalk branding. A red
build is the intended signal: fix the anchor in `apply.js`, then redeploy.
