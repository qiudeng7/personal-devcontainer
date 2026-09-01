# SourceForge acceleration

Use <https://gh-proxy.com/sourceforge/> for public SourceForge project files, mirror links, and source packages.

## Supported inputs

- Standard `sourceforge.net/projects/.../files/.../download` URLs
- Direct `*.dl.sourceforge.net/project/...` mirror URLs
- Installer files such as EXE and MSI
- Source archives such as ZIP and tar.gz
- ISO images
- Individual files under public distribution directories
- Direct links and generated `wget` or `curl` commands

Full-URL form:

```text
https://gh-proxy.org/sourceforge/<complete-original-https-url>
```

Example:

```text
https://gh-proxy.org/sourceforge/https://sourceforge.net/projects/qbittorrent/files/qbittorrent-win32/qbittorrent-5.2.0beta1/qbittorrent_5.2.0beta1_x64_setup.exe/download
```

The service also documents a shorter project-path form:

```text
https://gh-proxy.org/sourceforge/projects/qbittorrent/files/qbittorrent-win32/qbittorrent-5.2.0beta1/qbittorrent_5.2.0beta1_x64_setup.exe
```

Prefer the full-URL form when preserving an existing source is important. For a large file, verify size and checksum when the publisher provides them. If a cold or regional route is slow or returns 403, try another published node rather than disabling TLS checks.

Preserve query strings on direct mirror URLs. Follow redirects with a bounded redirect count and write to an explicit filename; do not blindly trust a server-provided `Content-Disposition` filename. If a route loops or resolves back to itself, stop and try a different published node.
