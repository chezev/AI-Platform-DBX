# Angular SDS Screen — Agent Create

## Files
- `agent-create-screen.component.ts`
- `agent-create-screen.component.html`
- `agent-create-screen.component.scss`

## Usage
1. Copy this folder into your Angular app (for example `src/app/agent-create-screen/`).
2. Render the standalone component in a route or parent template:

```ts
import { Routes } from '@angular/router';
import { AgentCreateScreenComponent } from './agent-create-screen/agent-create-screen.component';

export const routes: Routes = [
  { path: 'agent-create', component: AgentCreateScreenComponent },
];
```

## SDS Notes
- Uses SDS tokenized CSS variables (`--sds-*`) for color, spacing, radius, and typography.
- Uses SDS control geometry: left nav `72px`, header `60px`, search `40px`, controls `32/40px`, pill search radius.
- Primary CTA uses SDS charcoal action style (`bg-primary-active`).
