# GitHub acceleration

Use the official generator at <https://gh-proxy.com/> or prepend a selected acceleration domain to the complete public GitHub resource URL.

## Supported resources

- Release attachments and release source archives
- Branch and tag archives
- Repository `raw` and `blob` project files
- `raw.githubusercontent.com` content
- Raw Gist content
- GitHub REST API URLs
- GitHub avatar URLs
- GitHub Desktop release files
- Public HTTP Git clone, with only partial support
- Direct links, `wget`/`curl` commands, and QR-code output from the web generator

Generic download form:

```text
https://gh-proxy.org/<complete-original-https-url>
```

Examples:

```text
https://gh-proxy.org/https://github.com/WJQSERVER-STUDIO/ghproxy/archive/refs/heads/main.zip
https://gh-proxy.org/https://github.com/WJQSERVER-STUDIO/ghproxy/archive/refs/tags/4.3.4.zip
https://gh-proxy.org/https://github.com/WJQSERVER-STUDIO/ghproxy/releases/download/4.3.4/ghproxy-linux-amd64.tar.gz
https://gh-proxy.org/https://github.com/WJQSERVER-STUDIO/ghproxy/blob/main/config/config.toml
https://gh-proxy.org/https://raw.githubusercontent.com/WJQSERVER-STUDIO/ghproxy/refs/heads/main/config/config.toml
https://gh-proxy.org/https://gist.githubusercontent.com/oopsunix/2dbf20f64984773da6740d1d1cf7c2d4/raw/github-blacklist
https://gh-proxy.org/https://api.github.com/repos/umami-software/umami
https://gh-proxy.org/https://avatars.githubusercontent.com/u/10000?v=4
https://gh-proxy.org/https://desktop.githubusercontent.com/releases/3.6.2-beta1-f62b1c7a/GitHubDesktop-x64.zip
```

Public clone example shown by the service:

```bash
git clone https://gh-proxy.com/https://github.com/WJQSERVER-STUDIO/ghproxy.git
```

Do not route authenticated Git operations or private repository URLs through the public service. Do not persistently change a remote until the user agrees; prefer a one-off clone URL.

For release downloads, rewrite the stable public `github.com/.../releases/download/...` URL. Do not capture and proxy the short-lived signed object-storage URL returned by GitHub after a redirect. Verify publisher checksums or signatures when available.

`https://nightly.link/` can expose downloadable artifacts for public GitHub repositories, but it is a separate third-party service rather than a gh-proxy route.
