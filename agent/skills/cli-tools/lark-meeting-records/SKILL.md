---
name: lark-meeting-records
description: Read Feishu/Lark meeting-record links and tokens, including AI meeting summaries, verbatim Docx transcripts, Minutes records, and Note IDs. Use only when the user provides a Feishu/Lark meeting-record URL or token, or explicitly asks to retrieve meeting records from Feishu/Lark. Do not use for generic documents, local Markdown, spreadsheets, app or UI development, or non-Feishu meetings.
---

# Feishu/Lark Meeting Records

Use the locally installed `lark-cli` to read AI meeting summaries, verbatim transcripts, and Minutes
artifacts. Keep the workflow read-only: do not create or modify documents, upload media, or change
resource permissions.

## Command Convention

Disable update and skill-sync notices for every command so a read task cannot alter local
configuration:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 lark-cli ...
```

Do not run `lark-cli update` automatically. It may restore the complete upstream `lark-*` skill
bundle; ask the user before updating the CLI or restoring other Lark capabilities.

Use `--as user` by default. Do not treat `auth status` as a mandatory gate: public documents may
still be readable when the user token reports `needs_refresh`. Attempt the requested read first, and
start authorization only after the read returns an authentication or scope error.

## Route by Input Type

### Docx or Wiki URL

AI summaries and verbatim transcripts are commonly `/docx/` URLs. Pass the complete URL to the CLI:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
  lark-cli docs +fetch --doc '<docx-or-wiki-url>' \
  --doc-format markdown --detail simple --as user
```

Do not scrape the public page in a browser or guess a token manually. The CLI result includes the
body, revision, and identity information. The title is usually at the beginning of the body; do not
assume a separate `title` field exists.

### Minutes URL or minute token

For a `/minutes/<token>` URL, take the final path segment and remove its query string. Read the
structured AI artifacts and `note_id` first:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
  lark-cli minutes +detail --minute-tokens '<minute-token>' \
  --summary --todo --chapter --keyword --as user
```

### Note ID

Use Note details to resolve the actual document tokens for the AI summary and verbatim transcript:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
  lark-cli note +detail --note-id '<note-id>' --as user
```

- For `note_display_type=normal`, read the returned `note_doc_token` and `verbatim_doc_token`, then
  fetch each with `docs +fetch`.
- For `note_display_type=unified`, read the raw verbatim record with:

```bash
LARKSUITE_CLI_NO_UPDATE_NOTIFIER=1 LARKSUITE_CLI_NO_SKILLS_NOTIFIER=1 \
  lark-cli note +transcript --note-id '<note-id>' --as user
```

If only a Minutes record is available, no Note or Docx transcript can be resolved, and the user
explicitly needs the verbatim transcript, use `minutes +detail --transcript`. That command writes
files: run it in a newly created temporary directory, point `--output-dir` to a relative path inside
that directory, and delete only the confirmed temporary directory after reading the output.

## AI Summary and Verbatim Transcript

- When the user provides both an AI summary and a verbatim transcript, read both.
- Treat the verbatim transcript as the source of truth for independent summaries, fact-checking,
  and quotations. Use the AI summary to locate topics, action items, and chapters quickly.
- Clearly label whether content comes from the AI summary or the verbatim transcript. Never present
  an AI inference as a participant's exact words.
- Default to a concise summary with only the necessary source notes. Expand only when requested.
- Record the title, meeting time, input URLs, and any verifiable relationship between the sources.
  Report conflicts instead of silently merging them.
- If the result has no `note_id`, transcript token, or transcript entry point, state that it is
  unavailable. Do not enumerate or guess tokens.

## Private Records and Authorization

Attempt to read a private record directly first. Enter the authorization flow only when the actual
command returns `missing_scope`, an expired token, or a logged-out error:

1. Read the minimum required scope from the CLI error. Do not request unrelated business domains.
2. Start the split flow:

   ```bash
   lark-cli auth login --scope '<missing-scope>' --no-wait --json
   ```

3. Send the returned `verification_url` to the user unchanged and display its QR code with
   `lark-cli auth qrcode`.
4. Wait for the user to confirm authorization, then finish login with:

   ```bash
   lark-cli auth login --device-code '<device-code>'
   ```

If access is denied or the resource ACL blocks the caller, do not guess another scope or request
resource permissions automatically. Explain the exact failure and ask the user to share the record
or authorize access explicitly. Never expose an app secret, access token, or other credential.
