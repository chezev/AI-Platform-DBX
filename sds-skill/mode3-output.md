# MODE 3 — Design Output

Goal: turn a wireframe and/or product requirements into a production-ready
Angular UI package that engineering can drop into a Darwinbox module with
minimal changes.

**Hard constraints — enforced on every line of output:**
- Only components listed in the SDS Component Catalog (`SDS-Reference.md`).
  Never build a custom component when an SDS one exists.
- Only tokens in the `--sds-*` namespace. Never raw hex, never `rgba()` except
  the three approved exceptions, never invented token names.
- Only SCSS mixins from the SCSS Mixin Catalog. Call them as
  `@include sds.<mixin-name>` (requires `@use 'src/styles/sds-tokens' as sds;`).
- If a requirement cannot be satisfied by existing SDS, surface it as a
  **🚩 SDS Gap** — do NOT invent a workaround.

---

## Step 1 — Ingest requirements

Accept any combination of the following. Use all that are provided.

| Input type | How to process |
|---|---|
| Figma wireframe URL | `get_screenshot(fileKey, nodeId)` for layout intent + `get_design_context` for zone structure. This is a wireframe — do not run an SDS compliance check. |
| PDF document | Read the file. Extract: screen names, zone descriptions, field lists, interaction notes, copy. |
| Jira issue link | Fetch via Atlassian MCP (`getJiraIssue`). Extract: title, description, acceptance criteria, attached wireframes. |
| Freeform text | Parse directly. Ask one follow-up if a critical field list or layout intent is missing. |

After ingestion, produce a **Requirements Digest** (internal, not shown to user unless asked):

```
Screen: <name>
Layout: <e.g. full-width 12-col / two-pane 9+3 / right-panel overlay>
Zones:
  - <Zone 1 name>: <what it contains>
  - <Zone 2 name>: ...
Fields / inputs: [list]
Actions / CTAs: [list]
States: [default / loading / empty / error / success — which are required?]
SDS Gaps (initial scan): [list anything the PRD asks for that has no SDS component]
```

---

## Step 2 — Map every UI element to SDS

For each zone and element from the Requirements Digest, identify its SDS
counterpart. Use `SDS-Reference.md` as the lookup — do not rely on memory.

| PRD element | SDS component | node-id | Key props / variants needed |
|---|---|---|---|
| Page shell | Page Background + Left Nav + Global Header | `6673-45117` / `14919-151837` | — |
| Page header bar | Page Header | `31375-9093` | breadcrumb, title, action buttons |
| Data table | Table | `26561-286370` | pagination, header cells, row states |
| … | … | … | … |

**🚩 SDS Gap rules:**
- If the PRD describes a UI element with no matching SDS component, record it
  as a Gap. Do NOT invent a component. Write the Gap in the output report.
- Gaps must be escalated: *"No SDS component for [X]. Engineering should raise
  with the SDS team before implementing."*

---

## Step 3 — Define Angular component architecture

Before writing code, lay out the component tree. Apply Angular best practices
and SDS naming conventions.

```
<FeatureName>Module
  ├── <FeatureName>Component          (smart — data + state)
  │     <FeatureName>PageHeaderComponent   (presentational)
  │     <FeatureName>ContentComponent      (presentational)
  │     │    <FeatureName>TableComponent   (presentational)
  │     │    <FeatureName>FiltersComponent (presentational)
  │     <FeatureName>RightPanelComponent   (presentational, optional)
```

For each component, list:
- `@Input()` — data the parent passes down
- `@Output()` — events emitted up
- SDS component dependencies (Angular module imports required)

---

## Step 4 — Generate Angular code

Produce three files per component: `.ts`, `.html`, `.scss`.

### `.ts` skeleton

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-<component-name>',
  templateUrl: './<component-name>.component.html',
  styleUrls: ['./<component-name>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <ComponentName>Component {
  // @Input() and @Output() declarations
  // No business logic in presentational components
}
```

### `.html` rules

- Use SDS Angular component tags where the SDS library exposes them
  (e.g. `<sds-button>`, `<sds-badge>`, `<sds-status-tag>`).
- Where the SDS library uses standard HTML elements styled via mixins,
  emit the correct HTML semantic element + CSS class.
- All copy uses `{{ binding }}` — no hardcoded strings in templates.
- All list renders use `*ngFor` with `trackBy`.
- Conditional visibility uses `*ngIf`, never `[style.display]`.
- Async data uses `| async` pipe + loading skeleton slot.
- ARIA roles and `aria-label` on all interactive elements.
- **No raw `style="..."` attributes** — all visual styling is in the `.scss`.

### `.scss` rules

```scss
@use 'src/styles/sds-tokens' as sds;

:host {
  display: block;
}

// — Layout uses SDS spacing tokens —
.zone-name {
  padding: var(--sds-padding-16) var(--sds-padding-24);
  gap: var(--sds-gap-12);
}

// — Typography via mixins —
.field-label {
  @include sds.sds-label;
}

// — Colors via token variables —
.card {
  background: var(--sds-bg-neutralWhite-default);
  border: 1px solid var(--sds-border-neutralGrey-light2);
  border-radius: var(--sds-border-radius-4);
}
```

**Token format for engineering output (always use these):**
| Category | Format | Example |
|---|---|---|
| Background | `var(--sds-bg-{token})` | `var(--sds-bg-primary-active)` |
| Border color | `var(--sds-border-{token})` | `var(--sds-border-neutralBlue-active)` |
| Text color | `var(--sds-text-{token})` | `var(--sds-text-neutral-label)` |
| Icon color | `var(--sds-icon-{token})` | `var(--sds-icon-neutral-default)` |
| Padding | `var(--sds-padding-{n})` | `var(--sds-padding-16)` |
| Gap | `var(--sds-gap-{n})` | `var(--sds-gap-8)` |
| Border radius | `var(--sds-border-radius-{n})` | `var(--sds-border-radius-4)` |
| Typography | `@include sds.sds-{composite}` | `@include sds.sds-body-m-medium` |

**Never use:** raw hex (`#202020`), raw `rgba()` except the 3 approved, Figma token separators (`/` or `:`), Tailwind classes, any token without an `--sds-` prefix.

---

## Step 5 — Generate preview HTML

Produce a single self-contained `<ScreenName>_Preview.html` file that renders
fully in Chrome by opening `file://` — no build step, no server, no npm.

**Canonical patterns to match:**
- Right-panel form with custom SDS dropdown overlay, full Error Framework JS, segmented control — see steps 5f and 5g below
- Full-page admin form with native styled selects, `[hidden]` attribute pattern, dynamic row rendering — use native `.sds-select` CSS only (no `upgradeSelects()`)

---

### 5a — Font faces (dual-source for portability)

```html
@font-face {
  font-family: 'DarwinSans'; font-weight: 300; font-style: normal;
  src: url('sds-starter-pack/assets/fonts/DarwinSans-Book.otf') format('opentype'),
       url('src/assets/fonts/DarwinSans-Book.otf') format('opentype');
}
@font-face {
  font-family: 'DarwinSans'; font-weight: 500; font-style: normal;
  src: url('sds-starter-pack/assets/fonts/DarwinSans-Medium.otf') format('opentype'),
       url('src/assets/fonts/DarwinSans-Medium.otf') format('opentype');
}
@font-face {
  font-family: 'DarwinSans'; font-weight: 700; font-style: normal;
  src: url('sds-starter-pack/assets/fonts/DarwinSans-Bold.otf') format('opentype'),
       url('src/assets/fonts/DarwinSans-Bold.otf') format('opentype');
}
```

### 5b — `:root` token block

**Typography: split each composite token into three individual vars** — never a single shorthand. This is mandatory:

```css
:root {
  /* body-m-medium (14px / 500 / 18px) */
  --sds-body-m-medium-font-size:   14px;
  --sds-body-m-medium-font-weight: 500;
  --sds-body-m-medium-line-height: 18px;
  /* body-m-book (14px / 300 / 18px) */
  --sds-body-m-book-font-size:     14px;
  --sds-body-m-book-font-weight:   300;
  --sds-body-m-book-line-height:   18px;
  /* body-s-medium (12px / 500 / 16px) */
  --sds-body-s-medium-font-size:   12px;
  --sds-body-s-medium-font-weight: 500;
  --sds-body-s-medium-line-height: 16px;
  /* body-s-book (12px / 300 / 16px) */
  --sds-body-s-book-font-size:     12px;
  --sds-body-s-book-font-weight:   300;
  --sds-body-s-book-line-height:   16px;
  /* title-xxs-bold (16px / 700 / 20px) */
  --sds-title-xxs-bold-font-size:     16px;
  --sds-title-xxs-bold-font-weight:   700;
  --sds-title-xxs-bold-line-height:   20px;
  /* title-xs-bold (20px / 700 / 24px) */
  --sds-title-xs-bold-font-size:      20px;
  --sds-title-xs-bold-font-weight:    700;
  --sds-title-xs-bold-line-height:    24px;
  /* caption-medium (10px / 500 / 14px) — Count Badge only */
  --sds-caption-medium-font-size:   10px;
  --sds-caption-medium-font-weight: 500;
  --sds-caption-medium-line-height: 14px;

  /* Background */
  --sds-bg-primary-active:          #202020;
  --sds-bg-primary-hover:           #4d4d4d;
  --sds-bg-primary-disabled:        #e9e9e9;
  --sds-bg-neutralWhite-default:    #ffffff;
  --sds-bg-neutralGrey-light1:      #fbfbfb;
  --sds-bg-neutralGrey-light2:      #f6f6f6;
  --sds-bg-neutralGrey-light3:      #f2f2f2;
  --sds-bg-neutralGrey-hover:       #e9e9e9;
  --sds-bg-neutralBlue-light1:      #f5faff;
  --sds-bg-neutralBlue-active:      #0183ff;
  --sds-bg-feedback-successLow:     #e5f6ee;
  --sds-bg-feedback-successHigh:    #00a251;
  --sds-bg-feedback-errorLow:       #ffe9e9;
  --sds-bg-feedback-errorHigh:      #ff2323;
  --sds-bg-feedback-warningLow:     #fff7e5;
  --sds-bg-feedback-infoLow:        #d0ebff;
  --sds-bg-overlay-blanket:         rgba(32,32,32,0.48);

  /* Border */
  --sds-border-primary-default:      #a6a6a6;
  --sds-border-primary-disabled:     #e9e9e9;
  --sds-border-neutralGrey-light2:   #e9e9e9;
  --sds-border-neutralGrey-hover:    #797979;
  --sds-border-neutralBlue-active:   #0183ff;
  --sds-border-feedback-errorHigh:   #ff2323;
  --sds-border-feedback-errorMid:    #ffa7a7;
  --sds-border-feedback-warningMid:  #ffdf9e;
  --sds-border-feedback-successMid:  #99dab9;
  --sds-border-feedback-infoMid:     #8bc1ff;

  /* Text */
  --sds-text-neutral-title:          #202020;
  --sds-text-neutral-label:          #4d4d4d;
  --sds-text-neutral-body:           #4d4d4d;
  --sds-text-neutral-ghost:          #797979;
  --sds-text-neutral-disabled:       #a6a6a6;
  --sds-text-feedback-error:         #ff2323;
  --sds-text-neutralBlue-active:     #0183ff;

  /* Icon */
  --sds-icon-neutral-default: #797979;
  --sds-icon-neutral-hover:   #202020;

  /* Spacing */
  --sds-gap-4:4px; --sds-gap-6:6px; --sds-gap-8:8px;
  --sds-gap-12:12px; --sds-gap-16:16px; --sds-gap-20:20px; --sds-gap-24:24px;
  --sds-padding-4:4px; --sds-padding-6:6px; --sds-padding-8:8px;
  --sds-padding-12:12px; --sds-padding-16:16px; --sds-padding-20:20px;
  --sds-padding-28:28px; --sds-padding-40:40px;

  /* Border radius */
  --sds-border-radius-2:    2px;
  --sds-border-radius-4:    4px;
  --sds-border-radius-8:    8px;
  --sds-border-radius-24:   24px;
  --sds-border-radius-full: 999px;
}
```

Add additional tokens for the specific screen. Only declare what the file uses.

### 5c — Reset

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
[hidden] { display: none !important; }
body {
  font-family: 'DarwinSans', 'Segoe UI', sans-serif;
  background: var(--sds-bg-neutralGrey-light2);
  color: var(--sds-text-neutral-body);
}
```

Use `[hidden]` **attribute** (not `.hidden` class) for conditional visibility.
Toggle in JS as `element.hidden = true / false`.

### 5d — Typography in HTML/CSS

In the preview HTML, typography composite tokens are applied by expanding the
three vars directly — NOT via `@include` (that is Angular SCSS only):

```css
.panel-title {
  font-size:   var(--sds-title-xxs-bold-font-size);
  font-weight: var(--sds-title-xxs-bold-font-weight);
  line-height: var(--sds-title-xxs-bold-line-height);
  color: var(--sds-text-neutral-title);
}
```

### 5e — Form controls

```css
.sds-input, .sds-select {
  height: 32px;
  padding: 0 var(--sds-padding-8);
  border: 1px solid var(--sds-border-primary-default);
  border-radius: var(--sds-border-radius-4);
  background: var(--sds-bg-neutralWhite-default);
  color: var(--sds-text-neutral-body);
  font: inherit;
  width: 100%;
  outline: none;
}
.sds-input:hover { border-color: var(--sds-border-neutralGrey-hover); }
.sds-input:focus {
  border-color: var(--sds-border-neutralBlue-active);
  box-shadow:   0 0 0 1px var(--sds-border-neutralBlue-active);
}
.sds-input.is-invalid { border-color: var(--sds-border-feedback-errorHigh); }
.sds-input::placeholder { color: var(--sds-text-neutral-ghost); }
.sds-select {
  padding-right: var(--sds-padding-28);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%234D4D4D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--sds-padding-8) center;
  cursor: pointer;
}
```

### 5f — Custom SDS Dropdown overlay

Use the `upgradeSelects(root)` pattern when the design requires the full SDS
dropdown (optgroups, selected checkmark, open-state border radius). It wraps
every `select.sds-select` within `root` with a custom overlay — the native
`<select>` is hidden but stays in the DOM for value sync.

Include the full `upgradeSelects()` function below verbatim. Key geometry it enforces:
- Trigger open: `border-radius: 4px 4px 0 0`
- List: `border-top: none`, `border-radius: 0 0 8px 8px`, `box-shadow: 0 8px 8px rgba(32,32,32,0.16)`
- Selected row: `background: var(--sds-bg-neutralBlue-light1)`, check icon in `text-neutralBlue-active`

```javascript
function upgradeSelects(root) {
  (root || document).querySelectorAll('select.sds-select').forEach(sel => {
    if (sel.dataset.upgraded) return;
    sel.dataset.upgraded = 'true';
    sel.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'sds-dropdown';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'sds-dropdown-trigger';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'sds-dropdown-label';

    const chevron = document.createElement('span');
    chevron.className = 'sds-dropdown-chevron';
    chevron.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    trigger.appendChild(labelSpan);
    trigger.appendChild(chevron);

    const list = document.createElement('ul');
    list.className = 'sds-dropdown-list';
    list.setAttribute('role', 'listbox');

    function renderLabel() {
      const opt = sel.options[sel.selectedIndex];
      labelSpan.textContent = opt ? opt.text : '';
      trigger.classList.toggle('sds-dropdown-trigger--placeholder', !sel.value);
    }

    function buildList() {
      list.innerHTML = '';
      Array.from(sel.children).forEach(child => {
        if (child.tagName === 'OPTGROUP') {
          const grp = document.createElement('li');
          grp.className = 'sds-dropdown-optgroup-label';
          grp.textContent = child.label;
          list.appendChild(grp);
          Array.from(child.children).forEach(opt => list.appendChild(makeItem(opt)));
        } else if (child.tagName === 'OPTION') {
          list.appendChild(makeItem(child));
        }
      });
    }

    const CHECK_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    function makeItem(opt) {
      const li = document.createElement('li');
      li.className = 'sds-dropdown-option';
      li.setAttribute('role', 'option');
      li.dataset.value = opt.value;
      const textSpan = document.createElement('span');
      textSpan.className = 'sds-dropdown-option-text';
      textSpan.textContent = opt.text;
      const checkSpan = document.createElement('span');
      checkSpan.className = 'sds-dropdown-option-check';
      checkSpan.innerHTML = CHECK_SVG;
      li.appendChild(textSpan);
      li.appendChild(checkSpan);
      if (opt.value === sel.value) li.classList.add('is-selected');
      li.addEventListener('click', e => {
        e.stopPropagation();
        sel.value = opt.value;
        renderLabel();
        list.querySelectorAll('.sds-dropdown-option').forEach(o => o.classList.remove('is-selected'));
        li.classList.add('is-selected');
        wrapper.classList.remove('is-open');
        trigger.classList.remove('is-open');
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      return li;
    }

    renderLabel();
    buildList();

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = wrapper.classList.contains('is-open');
      document.querySelectorAll('.sds-dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
        d.querySelector('.sds-dropdown-trigger')?.classList.remove('is-open');
      });
      if (!wasOpen) {
        wrapper.classList.add('is-open');
        trigger.classList.add('is-open');
      }
    });

    sel.parentNode.insertBefore(wrapper, sel);
    wrapper.appendChild(trigger);
    wrapper.appendChild(list);
    wrapper.appendChild(sel);
  });
}
```

For simpler forms where optgroups aren't needed, use the native `<select>`
styled with `.sds-select` CSS only — no `upgradeSelects()` required.

### 5g — Error Framework JS (no disabled CTAs)

Every form in the preview must implement the SDS Error Framework pattern:

```javascript
function getValidationErrors() {
  const errors = [];
  if (!document.getElementById('field-id').value.trim())
    errors.push('Field name is required.');
  return errors;
}

function showErrorAlert(errors) {
  const MAX = 3;
  const alert = document.getElementById('errorAlert');
  document.getElementById('errorAlertTitle').textContent =
    `${errors.length} error${errors.length > 1 ? 's' : ''} need fixing to proceed`;
  document.getElementById('errorAlertList').innerHTML =
    errors.slice(0, MAX).map(e => `<li>${e}</li>`).join('');
  alert.hidden = false;
  alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeErrorAlert() {
  document.getElementById('errorAlert').hidden = true;
}

function tick() {
  closeErrorAlert();
}

function onSave() {
  const errors = getValidationErrors();
  if (errors.length) { showErrorAlert(errors); return; }
  // proceed with save
}
```

The primary CTA (`btn-primary`) is **always active** — never `disabled`.
Call `onSave()` on click; the Error Framework handles invalid state.

### 5h — Segmented control (toggle group)

```css
.toggle-group {
  display: flex;
  width: fit-content;
  height: 32px;
  border: 1px solid var(--sds-border-primary-default);
  border-radius: var(--sds-border-radius-4);
  overflow: hidden;
}
.toggle-btn {
  padding: 0 var(--sds-padding-12);
  border: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  background: var(--sds-bg-neutralWhite-default);
  color: var(--sds-text-neutral-label);
  font-size: var(--sds-body-s-medium-font-size);
  font-weight: var(--sds-body-s-medium-font-weight);
  font-family: inherit;
  cursor: pointer;
}
.toggle-btn + .toggle-btn { border-left: 1px solid var(--sds-border-primary-default); }
.toggle-btn.active,
.toggle-btn.active:active,
.toggle-btn.active:focus,
.toggle-btn.active:focus-visible {
  background: var(--sds-bg-primary-active);
  color: var(--sds-bg-neutralWhite-default);
}
```

### 5i — SDS Right Panel

```css
.calc-panel {
  position: fixed; top: 0; right: 0;
  height: 100vh; width: 480px; max-width: 100vw;
  background: var(--sds-bg-neutralWhite-default);
  box-shadow: -4px 0 24px rgba(32,32,32,0.14);
  display: flex; flex-direction: column;
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
}
.calc-panel.open { transform: translateX(0); }
```

Overlay behind panel uses `var(--sds-bg-overlay-blanket)` (`rgba(32,32,32,0.48)`).

### 5i-b — Illustration placeholders (preview HTML)

```html
<!-- [SDS: SdsIllustration type="SDS No Data" size="Large" variant="No Data 1"] -->
<div class="sds-illustration sds-illustration-lg" role="img" aria-label="No data illustration">
  <span class="sds-illustration-label">[ Illustration: No Data ]</span>
</div>
```

```css
.sds-illustration {
  display: flex; align-items: center; justify-content: center;
  border: 1px dashed var(--sds-border-neutralGrey-light2);
  border-radius: var(--sds-border-radius-8);
  background: var(--sds-bg-neutralGrey-light1);
  flex-shrink: 0;
}
.sds-illustration-sm  { width: 150px; height: 150px; }
.sds-illustration-md  { width: 250px; height: 250px; }
.sds-illustration-lg  { width: 350px; height: 350px; }
.sds-illustration-label {
  font-size: var(--sds-body-s-book-font-size);
  font-weight: var(--sds-body-s-book-font-weight);
  color: var(--sds-text-neutral-ghost);
}
```

In Angular `.html`, emit the component tag directly:

```html
<app-sds-illustration
  [type]="'SDS No Data'"
  [size]="'Large'"
  [variant]="'No Data 1'"
></app-sds-illustration>
```

### 5j — Dynamic content comments

```html
<div class="modal-row-value" id="modal-field-name">
  <!-- [DYNAMIC: calculatedField.name] -->
</div>
<!-- [SDS: sds-table] — replace with <sds-table [rows]="rows" ...> -->
```

---

## Step 6 — Output package

Deliver in this order:

### 1. File list
```
<ScreenName>/
  <feature>.module.ts
  <feature-page>.component.ts
  <feature-page>.component.html
  <feature-page>.component.scss
  [sub-components as needed]
  <ScreenName>_Preview.html
```

### 2. Integration notes
| Item | What to do |
|---|---|
| Data service | Replace `TODO_DATA` placeholders with real Observable/service calls |
| Router | Wire `routerLink` attributes |
| SDS module imports | Add `[listed modules]` to the feature module |
| Font loading | Ensure `DarwinSans-Book/Medium/Bold.otf` in `src/assets/fonts/` |
| Darwin Sans `@font-face` | Confirm `_sds-tokens.scss` is imported globally in `angular.json` styles |

### 3. SDS Gaps report
```
🚩 SDS Gap — [element description]
   Requirement: [what the PRD asked for]
   Closest SDS component: [name or "none"]
   Recommended action: Raise with SDS team to add [component/variant].
   Interim: [safe fallback if any, or "none — do not ship without SDS coverage"]
```

### 4. Assumptions
List any layout, copy, or interaction assumption made where the wireframe or
PRD was silent. Engineering must confirm these before shipping.

---

## Quality gates

Before outputting any file, verify:

- [ ] Every `background` / `border-color` / `color` value uses a `var(--sds-*)` token — zero raw hex
- [ ] Every typography block uses `@include sds.sds-*` — zero raw `font-size` / `font-weight`
- [ ] Every spacing value (`padding`, `gap`, `margin`) uses `var(--sds-*)` — zero raw px (except 1px/2px borders)
- [ ] Every interactive component maps to an SDS component from the catalog
- [ ] Primary CTAs are charcoal (`var(--sds-bg-primary-active)`) — never blue
- [ ] No disabled primary CTAs — always-active CTA + Error Framework pattern applied where validation exists
- [ ] All `@Input()` props typed — no `any`
- [ ] Preview HTML renders the correct layout with declared CSS custom properties
