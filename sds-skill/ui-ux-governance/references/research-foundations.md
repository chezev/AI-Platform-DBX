# Research Foundations

Updated: 2026-05-29

## 1) Nielsen Heuristics (Usability Baseline)

Source:
- https://www.nngroup.com/articles/ten-usability-heuristics/

Operational usage:
- Use all 10 heuristics as review criteria, not just visual polish.
- Require explicit status feedback for async actions.
- Use user language and domain terms (not internal jargon).
- Ensure undo/cancel exits for risky actions.
- Keep interaction patterns and labels consistent across screens.
- Prevent common slips with constraints and defaults.
- Reduce recall burden with visible options and contextual hints.
- Preserve expert efficiency with shortcuts where relevant.
- Remove non-essential UI noise.
- Provide clear, actionable error recovery copy.

## 2) Gestalt Principles (Grouping and Scanability)

Primary sources:
- Proximity: https://www.nngroup.com/articles/gestalt-proximity/
- Similarity: https://www.nngroup.com/articles/gestalt-similarity/
- Common Region: https://www.nngroup.com/articles/common-region/
- Figure/Ground summary: https://www.nngroup.com/videos/figure-ground-gestalt/
- Continuation summary: https://www.nngroup.com/videos/continuation-gestalt/
- Common Fate summary: https://www.nngroup.com/videos/common-fate-gestalt/

Supplemental references:
- Jakob's Law: https://lawsofux.com/jakobs-law/
- Proximity: https://lawsofux.com/law-of-proximity/
- Similarity: https://lawsofux.com/law-of-similarity/
- Common Region: https://lawsofux.com/law-of-common-region/
- Uniform Connectedness: https://lawsofux.com/law-of-uniform-connectedness/

Research-backed notes:
- Proximity is often the strongest grouping cue in UI scanning.
- Similarity can unify distributed elements but should map to shared behavior.
- Common region can overpower proximity and similarity; use intentionally.
- Overuse of borders/containers increases clutter and can hurt scanning.
- Figure-ground separation supports discoverability of primary actions.
- Continuation and common fate are strong for guiding flow and motion.

Academic link cited in NN/g common-region article:
- Palmer, S. E. (1992), Common Region, Cognitive Psychology, 24(3), 436-447
- DOI: https://doi.org/10.1016/0010-0285(92)90014-S

## 3) Accessibility (WCAG 2.2)

Sources:
- WCAG overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- Quick reference: https://www.w3.org/WAI/WCAG22/quickref/

Key implementation points:
- Prefer latest WCAG version (2.2) for new work.
- Apply POUR structure in reviews:
- Perceivable
- Operable
- Understandable
- Robust
- Always verify foundational criteria on interactive UI:
- 1.4.3 Contrast (Minimum)
- 2.1.1 Keyboard
- 2.4.7 Focus Visible
- 3.3.1 Error Identification
- 4.1.2 Name, Role, Value

## 4) Spacing-System Consensus (Cross Design Systems)

Sources:
- Atlassian spacing foundation: https://atlassian.design/foundations/spacing/
- Carbon spacing overview: https://carbondesignsystem.com/elements/spacing/overview/

Cross-system pattern:
- Use a tokenized spacing scale instead of ad hoc values.
- Use predictable rhythm and consistent grouping gaps for scanability.
- Keep spacing intentional to express hierarchy and relationships.
- Prefer layout primitives/stack patterns instead of margin hacks.
