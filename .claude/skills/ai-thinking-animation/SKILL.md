---
name: ai-thinking-animation
description: Use when building an AI "thinking"/loading indicator — a Darwinbox-blue asterisk that blooms like a firework plus a terminal-style typewriter whose caret blinks block↔underscore. Drop-in CSS/TS for Angular (and the canvas-studio React equivalent).
---

# AI "thinking" animation (asterisk firework + terminal typewriter)

The thinking indicator used in the AI Assist / Copilot Debug panel. Two independent parts you can use together or separately:

1. **Asterisk firework** — a single glyph that *blooms* through shapes (square → plus → asterisk → 6-point star → flower), Darwinbox blue, slow enough to read frame-by-frame.
2. **Terminal typewriter** — status text typed out with a one-cell caret that blinks **block `█` ↔ underscore `_`** (never both at once), rewriting each new line in place over the previous one.

Live in this repo:
- Angular: [`copilot-debug-panel.component.ts`](../../../angular-agent-create/src/app/shared/trace/copilot-debug-panel.component.ts) (firework CSS + thinking markup) and [`trace-log-panel.component.ts`](../../../angular-agent-create/src/app/shared/trace/trace-log-panel.component.ts) (`runThinkingTypewriter`, `TRACE_THINKING_STEPS`, the `thinkingTimer`/`blinkTimer` fields).
- React (canvas-studio): [`AIAssistPanel.jsx`](../../../canvas-studio/src/panels/AIAssistPanel.jsx) — `AsteriskFirework` + `.ai-firework` CSS (`aiFwGlyph`/`aiFwBurst`). canvas-studio needs a rebuild: `npx vite build --base=/agentic-flows/` then copy `dist/*` → `angular-agent-create/public/agentic-flows/`.

## How it was tuned (the journey — don't re-litigate)

- Asterisk: **Darwinbox blue** `--sds-bg-neutralBlue-active` (`#0183ff`), not purple. Speed **1.1s** (slowed from 0.7s so each shape is a distinct frame, then nudged a little faster).
- Caret: the user explicitly rejected a two-cell `_█` (block+underscore shown together) and a per-char "block→_→letter" materialise. The accepted model is **one cell that blinks `█`↔`_`** while the text types and follows through.
- They also rejected a Claude-Code "sweeping block over rotating gerunds (Crunching…/Cooking…)" version in favour of the typed sentences below. Keep the sentences.
- Button note (same panel): flip the trigger label to **"Retry" on click** (`thinking || debugResult`), not on result, so the "Debug Full Trace" user-message pill and the button never show the same label in two styles at once.

## Firework (CSS) — drop in

```css
.firework {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; font-size: 16px; line-height: 1;
  color: var(--sds-bg-neutralBlue-active);          /* #0183ff Darwinbox blue */
  text-shadow: 0 0 6px rgba(1, 131, 255, 0.45);
}
.firework::before {
  content: '✳';
  display: inline-block;
  color: var(--sds-bg-neutralBlue-active);
  animation: fw-glyph 1.1s steps(1) infinite, fw-burst 1.1s ease-in-out infinite;
}
@keyframes fw-glyph {           /* the bloom: square → plus → asterisk → star → flower */
  0%  { content: '▪'; }
  20% { content: '✚'; }
  40% { content: '✳'; }
  60% { content: '✶'; }
  80% { content: '❋'; }
}
@keyframes fw-burst {           /* gentle scale pulse, no rotation (keeps frames legible) */
  0%   { transform: scale(0.72); opacity: 0.6; }
  50%  { transform: scale(1.1);  opacity: 1; }
  100% { transform: scale(0.72); opacity: 0.6; }
}
```

Markup: an **empty** element (`<span class="firework" aria-hidden="true"></span>`) — the glyph is the `::before` so CSS can cycle it.

> **Gotcha:** animating CSS `content` via keyframes only works in **Chromium** (Chrome/Edge/Electron/VS Code webview). Fine for this app; if you need Safari/Firefox, swap to a sprite or JS that rewrites the glyph on a timer.

## Terminal typewriter (TS) — one-cell block↔underscore caret, rewrite-in-place

Render `thinkingText` inside a monospace span (`font-family: ui-monospace, Menlo, Consolas, monospace; white-space: pre;`). No separate caret element — the caret char (`█`/`_`) is part of the string. Two timers: one types, one blinks. **Clear both** on teardown.

```ts
// rotating status lines (keep these sentences; ... endings)
const THINKING_STEPS = [
  'Reading the trace...', 'Checking tools and inputs...', 'Analyzing token usage...',
  'Spotting retries and failures...', 'Writing the explanation...',
];

private thinkingTimer?: ReturnType<typeof setTimeout>;
private blinkTimer?: ReturnType<typeof setTimeout>;

private runThinking(): void {
  const steps = THINKING_STEPS;
  const TYPE_MS = 75, BLINK_MS = 340, HOLD_MS = 520;
  let msgIdx = 0, oldText = '', target = steps[0], i = 0, cursorOn = true;

  const render = () => {
    const caret = cursorOn ? '█' : '_';                 // one cell, never both
    // new chars committed up to i, caret overwrites old[i], old tail trails after
    this.thinkingText = i >= target.length ? target + caret
                                            : target.slice(0, i) + caret + oldText.slice(i + 1);
    this.cdr.markForCheck();                             // OnPush: timers need markForCheck
  };
  const blink = () => { cursorOn = !cursorOn; render(); this.blinkTimer = setTimeout(blink, BLINK_MS); };
  const type = () => {
    if (i > target.length) {                            // line done → rewrite next over it
      this.thinkingTimer = setTimeout(() => {
        oldText = target; msgIdx = (msgIdx + 1) % steps.length; target = steps[msgIdx]; i = 0; type();
      }, HOLD_MS);
      return;
    }
    render(); i += 1; this.thinkingTimer = setTimeout(type, TYPE_MS);
  };

  render();
  this.thinkingTimer = setTimeout(type, TYPE_MS);
  this.blinkTimer = setTimeout(blink, BLINK_MS);
}
// teardown / restart: clearTimeout(this.thinkingTimer); clearTimeout(this.blinkTimer);
```

Key ideas:
- **Single caret cell** alternating `█`/`_` (block on/off) — the whole point; never render `_█` together.
- **Rewrite in place**: `oldText` is the previous line; the new line's caret overwrites it left-to-right (`oldText.slice(i + 1)` is the un-overwritten tail), so lines don't clear-and-retype.
- OnPush components: every timer callback must `markForCheck()` (a plain `setTimeout` doesn't mark OnPush dirty).
- Verify with headless Chrome by sampling `.terminal-line` textContent over time — assert no frame contains `_█`, and that the caret toggles `█`↔`_`.

## React (canvas-studio) equivalent
`AsteriskFirework({size,color})` renders an empty `<span className="ai-firework" style={{'--fw-size','--fw-color', width,height}}/>`; the `.ai-firework::before` carries the same `aiFwGlyph`/`aiFwBurst` keyframes (1.1s) in the panel's `<style>` block. Used as `{busy ? <AsteriskFirework .../> : <AIIcon/>}`. (canvas-studio uses bullet-line thinking, not the terminal typewriter.)

See [[fixing-ui-issues]] for the verify-with-CDP workflow and SDS conventions.
