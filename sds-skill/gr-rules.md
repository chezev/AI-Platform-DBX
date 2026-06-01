# GR — Grammar & Copy Rules

## Forbidden words — flag any occurrence

`please`, `kindly`, `sorry`, `apologies`, `oops`, `uh-oh`, `very`, `just`,
`really`, `basically`, `simply`, `kind of`, `sort of`, `seems like`,
`apparently`, `blacklist`, `whitelist`, `master` (as in "master file"),
`utilize`, `facilitate`, `implement` (prefer "use / set up / help").

## Weak / vague words — flag and replace

`very` → remove · `just` → remove · `really` → remove · `basically` → remove ·
`simply` → remove · `even` → remove · `only` → remove · `slightly` → remove ·
`seems` → be direct · `likely` → be direct · `actually` → remove ·
`might` → use "will" · `may` → use "can" · `utilize` → use.

## Inclusive language

- `Blacklist / Whitelist` → Block list / Suspended / Rejected
- `Master` (file) → main / default / primary
- `Darklisted` → Block list / Suspended / Rejected
- `Dark Practices` → Deceptive Patterns
- Gender-neutral terms throughout.

## Casing rules by component

| Component | Rule |
|---|---|
| Toast | Sentence case |
| Button | Sentence case |
| Tab | Title Case |
| Modal title | Title Case |
| Modal body | Sentence case |
| Popover title | Title Case (≤ 44 chars) |
| Popover body | Sentence case (≤ 100 chars) |
| Badge | Sentence case, 1–2 words |
| Input label / placeholder / helper | Sentence case |
| Link | Sentence case |
| Chip | Sentence case |
| Toggle | Sentence case, declarative (no "?") |

## Toast rules — flag all violations

- Pattern: Noun + Verb(past) [+ optional adjective]. No articles (a / an / the).
  No end punctuation. Max 75 chars (70 with CTA); small variant ≤ 40 chars.
- "successfully" only for multi-step termination — never on errors or
  destructive actions.
- Max 1 variable per string; variable quoted; truncate name > 28 chars.
- ✅ `"Request submitted"` · `"File uploaded"` · `"Leave approved"`
- ❌ `"Request Successfully Deleted!"` · `"An unexpected error has occurred!"`
  · `"Your file has been uploaded successfully"`

## Button rules

- Start with action verb. 1–3 words ideal.
- ✅ `"Submit"` · `"Delete account"` · `"Save changes"`
- ❌ `"Please click to submit"` · `"Click here"` · `"OK"` / `"Yes"` alone.
- Approved action verbs: add, create, submit, save, delete, edit, update, view,
  open, close, cancel, confirm, approve, reject, download, upload, search,
  filter, sort, import, export, enable, disable, toggle, select, assign,
  complete, start, pause, resume, share, copy, reset, refresh, move, duplicate.

## Input / form copy

- Placeholder: `Enter …` not `Type here …` (accessibility).
- Label describes the field; placeholder gives the example format.
- Helper text in sentence case; no instructions masquerading as labels.
- `"Confirm Password"` field must not carry `"Enter Password"` placeholder —
  flag as copy error.

## Word-choice corrections

- `Activate` over Enable · `Deactivate` over Disable.
- `"Enter …"` over `"Type here …"`.
- `"No data found"` over `"No stuff found"` (be specific).

## Structural copy checks

- No placeholder / lorem ipsum / "TBD" / "Text here" / `your-file-here.pdf`.
- No layer names: `TODO` / `WIP` / `FIXME` / `TEMP` / `OLD` / `TEST` (case-insensitive).
- Spelling — cross-check: **Aadhaar** (not Adhaar), **Darwinbox** (capital D, capital B).
- Capitalisation consistent across equivalent UI on the same screen
  (`"View All"` vs `"View all"` — flag the deviant).
- No duplicate section titles / sidebar items.
- Consistent terminology: pick one of `"Cancel"` / `"Close"` / `"Dismiss"` per
  action; stick with it across the screen.
- Number / date formatting consistent within a page.
- Error and validation messages human-readable; no raw error codes exposed.
- Toggle labels are declarative statements, not questions.
- Links: action-oriented, not `"Click here"` or `"Read more"`.

## Scanner detection patterns

| Pattern | Severity | Fix |
|---|---|---|
| Toast starts with capital mid-word (title case leak) | 🟡 | Sentence case |
| Toast ends with `!` or `?` | 🟡 | Remove punctuation |
| Toast contains article `a` / `an` / `the` | 🟡 | Remove article |
| Toast > 75 chars | 🟠 | Shorten |
| Toast contains "successfully" on error/destructive action | 🟠 | Remove |
| Toast has > 1 variable | 🟠 | Use max 1 variable |
| Button starts with non-verb | 🟡 | Reorder to verb-first |
| Tab label is a verb phrase | 🟡 | Use noun |
| Toggle label is a question | 🟡 | Rewrite as statement |
| Input placeholder starts "Type here" | 🟡 | Replace with "Enter …" |
| Any forbidden word found | 🟠 | Remove / replace per table above |
| Weak word found | 🟡 | Remove or rephrase |
| Placeholder / TBD / lorem ipsum in layer | 🔴 | Replace with real copy |
| Layer name contains TODO / WIP / FIXME | 🟠 | Rename layer |
