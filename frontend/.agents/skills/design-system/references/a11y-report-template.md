## Mandatory Audit Report Format  
  
**Every audit must end with this exact structure. Copy, fill in, and always include it:**  
  
```  
## ✅ AUDIT REPORT  
  
**URL Tested:** [URL]  
**Date:** [ISO date]  
**Viewports Tested:** [e.g., 375px (mobile), 1024px (desktop)]  
**Amex Standard:** WCAG 2.1 A + AA + 11 AAA (per AENB77)  
  
### Summary  
[1-2 sentences: Overall accessibility status]  
  
### Critical Issues  
[List or "None found"]  
- Issue title and impact  
  
### High Issues  
[List or "None found"]  
- Issue title and impact  
  
### Medium Issues  
[List or "None found"]  
- Issue title and impact  
  
### Low Issues / Polish  
[List or "None found"]  
- Issue title and impact  
  
### Failed Tests (Required if any failures)  
| Failed Check | Severity | Observed Behavior | User Impact | WCAG Mapping | Evidence | Suggested Fix |  
|---|---|---|---|---|---|---|  
| [Checklist item or test step] | [Critical/High/Medium/Low] | [What happened] | [Who is affected and how] | [e.g., 2.4.7 Focus Visible] | [Screenshot/selector/step] | [Concrete remediation] |  
  
### Passed Checks  
- [Examples of what worked well]  
  
### Test Coverage Matrix — Core A/AA  
| Check | Status (Pass/Fail/Not Tested) | Evidence | Notes |  
|---|---|---|---|  
| Semantic HTML is used where possible | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Headings form a logical outline | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Landmarks are present and meaningful | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Interactive controls are reachable by keyboard | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Focus order matches visual/task order | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Focus indicator is always visible | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Dialogs/menus/popovers are accessible | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Forms have labels/instructions/error associations | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Images/icons have appropriate text alternatives | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Color contrast is sufficient | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Content works at 200% zoom | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| No horizontal scrolling at 320px (1.4.10) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Text spacing adjustable (1.4.12) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Content on hover/focus dismissible (1.4.13) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Dynamic updates are announced appropriately | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Custom widgets expose name/role/value | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| No keyboard traps are present | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| autocomplete attributes on common fields (1.3.5) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| lang attribute on language changes (3.1.2) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
  
### Test Coverage Matrix — Amex AAA  
| Check | Status (Pass/Fail/Not Tested) | Evidence | Notes |  
|---|---|---|---|  
| 1.3.6 Identify Purpose | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.1.3 Keyboard (No Exception) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.3.2 Three Flashes | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.3.3 Animation from Interactions | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.4.9 Link Purpose (Link Only) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.4.10 Section Headings | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.5.5 Target Size (44x44px) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 2.5.6 Concurrent Input Mechanisms | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 3.2.5 Change on Request | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 3.3.5 Help | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| 3.3.6 Error Prevention (All) | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
  
### Test Coverage Matrix — ARIA State Changes  
| Check | Status (Pass/Fail/Not Tested) | Evidence | Notes |  
|---|---|---|---|  
| aria-expanded toggles on open/close | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-hidden syncs with content visibility | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-selected updates on tabs/options | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-activedescendant tracks active option | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-checked/aria-pressed updates on toggles | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-invalid set/removed on validation | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-describedby links to error messages | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-sort updates on table sort | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-busy set during loading states | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-modal and focus trap on dialogs | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-disabled used correctly | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-controls points to correct elements | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-live regions present for dynamic content | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| aria-live politeness level appropriate | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| role="alert" for error notifications | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| role="status" for non-critical updates | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| No focusable elements in aria-hidden containers | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Focus management on dialog open/close | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Form error association and announcement | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Slider value/valuetext updates | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Combobox aria-expanded/autocomplete | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Tab panel visibility syncs with selection | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
  
### Test Coverage Matrix — Amex-Specific  
| Check | Status (Pass/Fail/Not Tested) | Evidence | Notes |  
|---|---|---|---|  
| No linton anti-patterns | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| No generic link text | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| DLS props used correctly | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
| Multi-viewport testing completed | [Pass/Fail/Not Tested] | [Screenshot/selector/step] | [Short note] |  
  
### Not Tested / Limitations  
[Note any checks that couldn't be performed and why]  
  
### Screen Reader Verification Status  
- Keyboard behavior: ✅ Verified / ⚠️ Partial / ❌ Not tested  
- ARIA and semantics: ✅ Verified / ⚠️ Partial / ❌ Not tested  
- ARIA state changes: ✅ Verified / ⚠️ Partial / ❌ Not tested  
- Full screen reader testing: ⚠️ Still needed  
  
### Recommended Next Steps  
1. [Action item]  
2. [Action item]  
```  
  
**Important:** This block must be included in every response that completes an audit. Do not omit it.  