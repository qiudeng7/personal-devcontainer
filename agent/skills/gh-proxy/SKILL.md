---
name: gh-proxy
description: Diagnose constrained access to public developer resources and use the gh-proxy service family safely. Use for slow or failed GitHub releases, raw files, archives, project files, Gists, API calls, avatars, GitHub Desktop downloads, or partial Git clones; public container images from Docker Hub, GCR, GHCR, Kubernetes registries, Quay, MCR, Elastic, NGC, ECR Public, GitLab, Red Hat, Oracle, SUSE, or openSUSE; Docker, Podman, Kubernetes, Compose, Dockerfile, CI/CD, or containerd image configuration; SourceForge downloads; cdnjs assets; Google Sheets to JSON through OpenSheet; or gh-proxy node selection and health checks, especially on networks in mainland China. Prefer working direct access or an existing local Mihomo or Clash proxy before a public accelerator.
---

# GH Proxy

Use the least invasive working route: direct access, an already configured local proxy, then a public accelerator.

## Workflow

1. Identify the resource family, exact source, operation, environment, and whether the resource is public.
2. Check for an existing proxy without printing credentials:
   - Inspect whether proxy variable names are set, but redact their values.
   - Check listeners on ports `7890` and `7891`.
   - Check Mihomo or Clash services and containers when available.
3. Test direct connectivity and the discovered proxy with short timeouts.
4. Keep direct access when it works. Otherwise prefer the user's existing Mihomo or Clash proxy.
5. Select the matching gh-proxy capability only for public content:
   - GitHub downloads, API resources, or partial Git clone support: read [references/github.md](references/github.md).
   - Public container images and runtime configuration: read [references/containers.md](references/containers.md).
   - SourceForge project files and mirrors: read [references/sourceforge.md](references/sourceforge.md).
   - cdnjs mirroring or Google Sheets OpenSheet APIs: read [references/web-assets-and-data.md](references/web-assets-and-data.md).
   - Regional node choice, speed tests, or service status: read [references/nodes-and-status.md](references/nodes-and-status.md).
6. Verify the rewritten URL, clone, API response, asset, manifest, or pull. Report the route used and every source reference changed.

Useful read-only checks include:

```bash
env | sed -n 's/^\([A-Za-z_][A-Za-z0-9_]*_[Pp][Rr][Oo][Xx][Yy]\)=.*/\1=<set>/p'
ss -ltnp | rg ':(7890|7891)\b'
systemctl status mihomo --no-pager
systemctl status clash --no-pager
docker ps --format '{{.Names}}\t{{.Image}}\t{{.Ports}}' | rg -i 'mihomo|clash|7890|7891'
```

Treat unavailable commands or services as a normal negative check. Do not install or reconfigure proxy software unless the user requests it.

## Safety

- Do not send credentials, tokens, private repository URLs, private images, signed download URLs, or non-public spreadsheet data through a public service.
- Do not print proxy URLs that embed usernames or passwords.
- Preserve tags, digests, URL paths, queries, fragments, and relevant HTML attributes exactly.
- Confirm before persistently editing Git remotes, container daemon settings, Compose files, Kubernetes manifests, Dockerfiles, CI configuration, or system proxy settings.
- Do not claim success from a rewritten string alone. Perform a proportionate connectivity, response, checksum, clone, manifest, asset, or pull check.
- Treat endpoints, supported routes, caching, and availability as changeable. Recheck the official service page when behavior matters; never weaken TLS verification to make a route pass.

## Output

Give the final command, URL, API endpoint, or configuration change first. Briefly state whether direct access, a local proxy, or gh-proxy was selected and what verification passed.
