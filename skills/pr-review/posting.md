# Posting and editing comments

## Verify before every post

```bash
gh pr view <n> --repo <owner>/<repo> --json headRefOid --jq .headRefOid
gh api "repos/<owner>/<repo>/contents/<path>?ref=<sha>" --jq .content | base64 -d | sed -n '<start>,<end>p'
```

If the head SHA moved since the draft, re-check the line numbers. Target lines must be on the right-hand side of a diff hunk in the PR.

## Post an inline comment

Use a quoted heredoc so backticks and code fences survive, and build the JSON with `jq`:

```bash
body=$(cat <<'EOF'
<approved comment text, verbatim>
EOF
)
jq -n --arg body "$body" '{body:$body, commit_id:"<sha>", path:"<path>", start_line:<start>, line:<end>, start_side:"RIGHT", side:"RIGHT"}' \
  | gh api repos/<owner>/<repo>/pulls/<n>/comments --input - --jq .html_url
```

For a single line, drop `start_line` and `start_side`.

Standalone comments notify the author immediately and set no review state. If Erik asks for a single notification instead, collect the approved drafts and submit them together through `POST repos/<owner>/<repo>/pulls/<n>/reviews` with `event: "COMMENT"` and a `comments` array.

## Edit a posted comment

Replace an exact substring, failing loudly if it isn't found exactly once:

```bash
gh api repos/<owner>/<repo>/pulls/comments/<id> --jq .body > /tmp/c.txt
python3 - <<'PY'
import json
s = open("/tmp/c.txt").read().rstrip("\n")
old, new = "<exact old text>", "<new text>"
assert s.count(old) == 1
json.dump({"body": s.replace(old, new)}, open("/tmp/c.json", "w"))
PY
gh api -X PATCH repos/<owner>/<repo>/pulls/comments/<id> --input /tmp/c.json --jq .html_url
rm /tmp/c.txt /tmp/c.json
```

Read the edited body back to confirm the change. GitHub marks the comment as edited.
