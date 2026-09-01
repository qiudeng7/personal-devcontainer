# Nodes and service status

The public generators currently advertise these acceleration nodes:

| Domain | Route | Coverage |
| --- | --- | --- |
| `gh-proxy.org` | Cloudflare main | GitHub, containers, SourceForge, OpenSheet |
| `v4.gh-proxy.org` | IPv4-optimized Cloudflare | GitHub, containers, SourceForge, OpenSheet |
| `v6.gh-proxy.org` | IPv4/IPv6 Cloudflare | GitHub, containers, SourceForge, OpenSheet |
| `cdn.gh-proxy.org` | Fastly IPv4 | GitHub, containers, SourceForge, OpenSheet |
| `axisnow.gh-proxy.org` | AxisNow IPv4 | GitHub generator |
| `cdnjs.gh-proxy.com` | cdnjs mirror | cdnjs assets |

Keep the same suffix after changing among compatible nodes. For example, retain `/docker/...`, `/sourceforge/...`, `/opensheet/...`, or the complete GitHub URL.

## Selection

1. Prefer the main node unless a real test shows it is unsuitable.
2. Use `v4` for IPv4-only or poorly routed networks.
3. Use `v6` when dual-stack or IPv6 routing is materially better.
4. Try Fastly when the Cloudflare routes fail or perform poorly. For AxisNow, use the exact link produced by the GitHub generator rather than assuming a manually constructed URL is supported.
5. Verify the chosen route with the actual resource; regional performance changes over time.

Use a small request with short timeouts for a lightweight comparison. Prefer `HEAD` when the target handles it correctly; some download endpoints do not, so validate against the actual operation before concluding a node is broken.

```bash
curl -fsSIL --connect-timeout 5 --max-time 15 \
  -o /dev/null -w '%{http_code} %{time_connect} %{time_starttransfer}\n' \
  'ACCELERATED_URL'
```

There is no universal latency threshold. Compare HTTP success, connect time, time to first byte, and the behavior of the real resource across viable nodes.

## Diagnostic pages

- Main speed test: <https://gh-proxy.com/speedtest>
- IPv4 speed test: <https://v4.gh-proxy.org/speedtest>
- IPv4/IPv6 speed test: <https://v6.gh-proxy.org/speedtest>
- Fastly speed test: <https://cdn.gh-proxy.org/speedtest>
- Cloudflare statistics: <https://gh-proxy.com/analytics/>
- Fastly real-time metrics: <https://gh-proxy.com/analytics/fastly>

The browser speed tests transfer 25, 50, or 100 MB. Do not run them without the user's request when bandwidth or metering matters. Prefer a short request against the actual target for routine validation.

The service says unhealthy subsidiary nodes may redirect to the main route after health detection. Do not depend on that behavior for automation; handle HTTP failures and redirects explicitly.
