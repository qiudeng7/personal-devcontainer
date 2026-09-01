# Web assets and public sheet data

## cdnjs mirror

Use <https://cdnjs.gh-proxy.com/> for public resources hosted by `cdnjs.cloudflare.com`.

Supported inputs and outputs include:

- Full cdnjs URLs
- Relative paths under `ajax/libs/`
- CSS and JavaScript resources from all cdnjs libraries
- Existing HTML `script` tags while preserving attributes
- Generated `link` tags for CSS, `script` tags for JavaScript, and `wget` commands

Rewrite by replacing the cdnjs host and retaining the full path:

```text
https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
https://cdnjs.gh-proxy.com/ajax/libs/jquery/3.6.0/jquery.min.js
```

Also supported:

```text
ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css
ajax/libs/font-awesome/6.4.0/css/all.min.css
```

When rewriting an HTML tag, preserve `integrity`, `crossorigin`, `referrerpolicy`, and other attributes. Verify that the mirrored bytes still satisfy Subresource Integrity before deploying the change.

For a `sha384-...` integrity value, compute the mirrored payload digest and compare the base64 portion exactly:

```bash
curl -fsSL 'https://cdnjs.gh-proxy.com/ajax/libs/jquery/3.6.0/jquery.min.js' \
  | openssl dgst -sha384 -binary \
  | openssl base64 -A

curl -fsSI 'https://cdnjs.gh-proxy.com/ajax/libs/jquery/3.6.0/jquery.min.js' \
  | rg -i '^(access-control-allow-origin|content-type):'
```

Use the algorithm declared by the tag rather than always using SHA-384. Fall back to the original cdnjs URL if the digest or required CORS behavior differs.

## OpenSheet API

Use <https://gh-proxy.com/opensheet/> to expose rows from a publicly viewable Google Sheet as a JSON array.

URL form:

```text
https://gh-proxy.com/opensheet/{spreadsheet_id}/{sheet_name_or_1_based_index}
```

Examples:

```text
https://gh-proxy.com/opensheet/1NuaXdRper70yHQXNYZaXR0Jv-1xELZ_RaPuEjWDaZns/list
https://gh-proxy.com/opensheet/1NuaXdRper70yHQXNYZaXR0Jv-1xELZ_RaPuEjWDaZns/1
```

The page documents `gh-proxy.com` examples and its generator currently also emits the general regional domains with the same `/opensheet/...` suffix, for example:

```text
https://gh-proxy.org/opensheet/{spreadsheet_id}/{sheet_name_or_1_based_index}
https://v4.gh-proxy.org/opensheet/{spreadsheet_id}/{sheet_name_or_1_based_index}
https://v6.gh-proxy.org/opensheet/{spreadsheet_id}/{sheet_name_or_1_based_index}
https://cdn.gh-proxy.org/opensheet/{spreadsheet_id}/{sheet_name_or_1_based_index}
```

Requirements and behavior:

- Make the sheet viewable by anyone with the link.
- Use the first row as JSON object keys and avoid blank header cells.
- Address a worksheet by name or a one-based index.
- Percent-encode a worksheet name when using it as a URL path segment.
- Use the default response for Google-formatted display text.
- Append `?raw=true` for underlying unformatted values useful in calculations.
- Expect edge caching; the service currently documents a refresh delay of up to 10 minutes.

Do not make a private or sensitive sheet public merely to use this API. Validate headers, duplicate-key behavior, JSON types, schema, and data freshness with the actual sheet before using it in an application.
