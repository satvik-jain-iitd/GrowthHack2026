# Accessibility Guided Manual Audit

## Purpose

Use this recipe to perform an **active manual accessibility audit** of a web page, flow, or UI component. This recipe opens the integrated browser, performs hands-on keyboard testing, and produces evidence-backed findings against WCAG standards.

This recipe is **not** an automated scanner. It uses manual browser interaction, structured observations, and evidence-based reporting to uncover accessibility barriers that require human judgment.

> **Relationship to automated testing:** American Express maintains an automated axe-core accessibility testing pipeline via `@americanexpress/one-amex-test-utils`. Automated scans catch programmatic issues (missing alt text, invalid ARIA, contrast violations). This manual audit recipe complements automated testing by catching issues that require human judgment: logical focus order, usable keyboard flows, meaningful reading order, context-dependent labeling, interaction behavior, ARIA state transitions during interaction, and real-world usability for assistive technology users.

## Amex Accessibility Standards

Per AENB77 and TECH06.26: **WCAG 2.1 A + AA + 11 AAA success criteria**.
All manual checks must cover these. See `../references/wcag-checklist.md` for
the full criteria list and axe-core tag mapping.

## Standard Viewport Breakpoints

**Amex standard breakpoints:** 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (large desktop). Minimum: 375 + 1024.

At minimum, test mobile (375px) and desktop (1024px). For thorough audits, test all four.

## Operating Principles

1. **Observe first, conclude second.**
2. **Prefer manual interaction over DOM inspection for verifying behavior, context, and usability** — use DOM inspection to confirm what interaction revealed, not as a substitute.
3. **Separate facts from recommendations.**
4. **Document what was tested, how it was tested, and what was observed.**
5. **Mark uncertain items as needing follow-up or assistive-technology verification.**
6. **Prioritize by user impact** — test primary user flows and critical interactive elements before secondary content.

## Audit Workflow

### 1. Define Scope and Prioritize

Before testing, identify and confirm:

* page, route, or component name and URL
* browser viewport(s) to test (use Amex standard breakpoints: 375px, 768px, 1024px, 1280px)
* interaction path to test
* relevant states (empty, loading, error, success, disabled)
* any expected assistive technology considerations
* which user flows and states must be tested manually

**Prioritization guidance:**
1. Primary user flows (login, checkout, search, form submission) before secondary flows
2. Critical interactive elements (navigation, forms, modals) before static content
3. Error and edge-case states after happy-path flows
4. Repeat critical checks across viewports (mobile-first, then desktop)

If scope is unclear, ask one clarifying question before opening the browser.

### 2. Open the Browser and Baseline Review

Use `open_browser_page` to navigate to the target URL. Check the page without deep interaction:

* page title is descriptive (use `read_page` to inspect)
* `<html lang>` attribute is set correctly
* headings appear in a logical order with section headings organizing content (2.4.10)
* landmarks are present and sensible
* main content is identifiable
* images, icons, and controls have usable names
* visible text is understandable without relying on color alone
* UI component purpose is programmatically determinable where possible (1.3.6)
* take a screenshot of the initial state as baseline evidence

### 3. Keyboard-Only Pass

Use only Tab, Shift+Tab, Enter, Space, Escape, and arrow keys via `type_in_page` to verify:

* **all** functionality is operable by keyboard with no exceptions (2.1.3 — stricter than 2.1.1)
* tab order is logical and matches visual order
* all interactive elements are reachable by keyboard
* focus is visible at all times (screenshot evidence)
* focus does not get trapped unexpectedly
* dialogs and menus open and close correctly
* Escape closes dismissible overlays when appropriate
* focus returns to a sensible place after dismissal
* custom controls respond to Enter and Space as expected
* no input modality is restricted — touch, keyboard, and mouse all work where applicable (2.5.6)

Record each test step and outcome.

### 4. Manual Interaction Review

Exercise primary user flows manually and verify accessibility behavior in context:

* open and close menus, modals, and popovers with keyboard controls
* verify focus enters and exits overlays predictably
* verify focus returns to the triggering control after dismissal
* confirm custom widgets expose visible state changes during interaction
* verify context changes only happen on user request or can be turned off (3.2.5)
* capture screenshots for each key interaction state

### 5. Link and Button Semantics Review

Check every link and button for correct semantics and meaningful text:

* **Link purpose (2.4.9 — Amex AAA):** every link must be understandable from its text alone — no "click here", "learn more", "read more", "here", or other generic text
* **Link vs. button semantics:** links (`<a>`) navigate to a new page/location; buttons (`<button>`) perform an action. Flag any "linton" anti-patterns (link styled as button or button as link)
* Verify `<a>` elements have `href` attributes
* Verify `<button>` elements have `type` attributes
* If a link opens a new window, verify it indicates so in the link text or via `aria-label`
* Take screenshots of any generic link text or linton patterns as evidence

### 6. Form and Error Review (if applicable)

For forms, check:

* every input has an accessible label (via `label` prop, `aria-label`, or `aria-labelledby`)
* helper text is associated correctly (via `hint` prop or `aria-describedby`)
* `autocomplete` attributes are present on common fields (name, email, phone, address, etc.) per 1.3.5
* required fields are indicated clearly (both visually and programmatically)
* errors are announced or otherwise discoverable (take screenshots)
* error text explains how to fix the issue (3.3.3)
* focus moves to the first invalid field on submit failures
* context-sensitive help is available for complex forms (3.3.5 — Amex AAA)
* all form submissions are reversible, checked, or confirmed — not just legal/financial (3.3.6 — Amex AAA)
* for DLS components, verify `status`, `statusMessage`, `hint`, and `labelOverrides` props are used correctly (see `./accessibility.md` for DLS-specific patterns)

### 7. Dynamic Content Review (if applicable)

For live updates, toasts, async regions, and loading states:

* important status changes are announced appropriately
* non-essential updates do not interrupt the user
* loading states are perceivable
* content updates do not cause confusion or loss of context
* take screenshots of dynamic state changes as evidence

### 8. Animation and Motion Review

Check for motion and animation accessibility:

* **No flashing content (2.3.2 — Amex AAA):** no content flashes more than 3 times per second, period (no threshold exception)
* **Animation from interactions (2.3.3 — Amex AAA):** motion triggered by user interaction can be disabled
* `prefers-reduced-motion` media query is respected — verify by enabling reduced motion in browser settings and confirming animations are suppressed or replaced with non-motion alternatives
* Auto-playing content (carousels, videos, animations) has pause/stop controls
* Page transitions and micro-animations do not cause disorientation
* Take screenshots with and without reduced motion enabled as evidence

### 9. Target Size and Touch Review

Check interactive element sizing:

* **Target size (2.5.5 — Amex AAA):** all interactive targets (buttons, links, checkboxes, radio buttons, toggle switches, tabs, etc.) are at least **44x44px**
* Use browser dev tools to measure element dimensions
* Check spacing between adjacent targets to prevent accidental activation
* **Concurrent input mechanisms (2.5.6 — Amex AAA):** no restriction on input modality — functionality works with touch, keyboard, mouse, and stylus
* Verify at mobile viewport (375px) where touch targets are most critical
* Take screenshots with element dimensions visible as evidence

### 10. Visual Accessibility Review

Check:

* contrast is sufficient for text (4.5:1) and UI components (3:1) (take close screenshots)
* content remains usable at zoom levels up to 200% (use browser zoom) (1.4.4)
* **Reflow (1.4.10):** no horizontal scrolling at 320px viewport width
* **Text spacing (1.4.12):** content remains readable with increased line height (1.5x), letter spacing (0.12em), word spacing (0.16em), and paragraph spacing (2x)
* **Content on hover/focus (1.4.13):** tooltips, popovers, and hover content are dismissible (Escape), hoverable (can move pointer over them), and persistent (stay visible until dismissed)
* text does not overlap or clip at common breakpoints
* information is not conveyed by color alone
* focus styling is strong enough to see (take screenshots showing focus)

### 11. DOM and ARIA Inspection

Using `read_page` to inspect the DOM and ARIA:

* accessible names and roles are correct
* ARIA only where semantic HTML is insufficient
* headings, landmarks, and relationships are sound
* button, link, input, and dialog semantics are proper — no links used as buttons or buttons as links (linton anti-pattern)
* custom widgets expose the right state and value
* **Language of parts (3.1.2):** `lang` attribute set on any content in a different language than the page
* **Identify purpose (1.3.6 — Amex AAA):** UI component purposes are programmatically determinable (icons, regions, inputs use proper semantics, landmarks, `autocomplete`)

#### Accessibility Tree Verification (if browser supports CDP)

If the integrated browser exposes the computed accessibility tree (e.g., via
Chrome DevTools Protocol `Accessibility.getFullAXTree` or
`page.accessibility.snapshot()`), capture a tree snapshot and verify:

* Every interactive element has a **non-empty computed accessible name**
* Computed names match what a user would expect to hear (not generic like
  "button" or "link" with no label)
* Computed roles match the element's purpose
* `aria-labelledby` chains resolve correctly (all referenced IDs exist
  and are visible)
* `<label>` associations are computed correctly (not pointing to wrong
  elements)
* No orphaned ARIA references (IDs that don't exist in the DOM)
* Heading hierarchy in the tree matches the visual heading hierarchy

This step is complementary to — not a replacement for — the ARIA State
Change Verification in Step 12. The tree shows the **static computed state**;
Step 12 verifies that state **transitions correctly during interaction**.

### 12. ARIA State Change Verification

For every interactive widget that changes state, perform a **before-and-after verification loop**: inspect the DOM, perform the interaction, then inspect the DOM again. This is the single most critical step for verifying what a screen reader user will experience during interaction.

#### General Process

**ARIA verification loop:** For every row below: (1) `read_page` to capture
attributes BEFORE interaction, (2) perform the interaction via keyboard,
(3) `read_page` again to verify attributes AFTER, (4) screenshot both states.
Record any attribute that fails to update.

| Widget | Trigger Keys | Attributes to Verify | Before → After | DLS Components |
|---|---|---|---|---|
| Expandable | Enter/Space | `aria-expanded`, `aria-hidden`, `aria-controls`, `aria-haspopup` | `expanded=false,hidden=true` → `expanded=true,hidden=false` | Accordion, Navigation, Popover, SelectCustom, MultiSelect, Search |
| Tabs | Arrow L/R, Home, End | `aria-selected`, `tabindex`, panel `hidden`, `aria-controls`, `aria-labelledby` | active: `selected=true,tabindex=0`; inactive: `selected=false,tabindex=-1` | Tabs |
| Listbox/Combobox | Arrow U/D, Enter, Esc | `aria-activedescendant`, `aria-expanded`, option `aria-selected`, `aria-autocomplete` | closed: `expanded=false`; open: `expanded=true`, active option via `activedescendant` | Search, SelectCustom, MultiSelect |
| Modal/Dialog | Esc, Tab (trapped) | `aria-modal`, background `aria-hidden`/`inert`, focus trap | open: `modal=true`, bg `hidden=true`, focus inside; close: restore focus to trigger | Modal, AlertDialog, Drawer |
| Toggle/Switch | Enter/Space | `role=switch`, `aria-checked` | `checked=false` → `checked=true` | ToggleSwitch, Checkbox |
| Loading | (automatic) | `aria-busy`, spinner `aria-hidden`, `aria-label` | loading: `busy=true`; done: `busy=false`, spinner removed | ProgressCircular, ProgressLinear, Button |
| Sortable Table | Enter/Space on header | `aria-sort`, live region announcement | `sort=none` → `sort=ascending` → `sort=descending` | DataTable |
| Slider | Arrow, PgUp/Dn, Home/End | `aria-valuenow`, `aria-valuetext`, `aria-valuemin`, `aria-valuemax` | value changes with each key press, `valuetext` updates | Slider |
| Form Validation | Submit with errors | `aria-invalid`, `aria-describedby`, error `role=alert` | valid: no `aria-invalid`; invalid: `invalid=true`, `describedby` includes error ID, error announced via `role=alert`; corrected: `invalid` removed, `describedby` updated | Input, Checkbox, RadioGroup, Select, Textarea |

**Universal rules (all widgets):**
- Dynamically appearing content needs `aria-live` or role (`alert`/`status`/`log`). Polite = non-urgent, assertive = blocking.
- DLS prefers `aria-disabled="true"` over `disabled`. Disabled elements must stay in tab order.
- No focusable elements inside `aria-hidden="true"` containers.

### 13. Multi-Viewport Testing

Repeat critical checks across Amex standard breakpoints:

1. **Mobile (375px):** verify touch target sizes (44x44px minimum), reflow (no horizontal scrolling), focus visibility on small screen, form usability
2. **Tablet (768px):** verify layout transitions, navigation behavior, focus order changes
3. **Desktop (1024px):** baseline check — most tests start here
4. **Large Desktop (1280px):** verify layout at wide viewport, reading line length

At each breakpoint:
* take a screenshot as viewport evidence
* verify focus order matches the viewport's visual layout (it may differ between mobile and desktop)
* check that no interactive elements are hidden or become unreachable
* verify text does not truncate or overlap

### 14. Record Findings

For each issue, capture:

* title
* severity (Critical, High, Medium, Low)
* location or step
* viewport tested
* what was observed (include screenshot reference)
* expected behavior
* why it matters
* WCAG reference when appropriate (include Amex AAA criteria where applicable)
* suggested remediation
* evidence such as screenshot file, selector, or interaction note

## Severity Guidance

Use consistent severity levels:

* **Critical**: blocks a core task for keyboard or assistive-technology users
* **High**: major barrier, likely to cause task failure or significant confusion
* **Medium**: usable but clearly non-compliant or fragile
* **Low**: minor issue or polish item with limited user impact

## Reporting Format

When the audit is complete, return results in this structure:

1. **Scope tested** (including viewports)
2. **Amex compliance target** (WCAG 2.1 A + AA + 11 AAA)
3. **Summary**
4. **Critical findings**
5. **Other findings**
6. **Items that need assistive-technology verification**
7. **Recommended fixes**
8. **Evidence notes**

## Manual Check Checklist

For full WCAG A + AA + Amex AAA criteria, see `../references/wcag-checklist.md`.

### ARIA State Change Checks

* [ ] `aria-expanded` toggles correctly on open/close interactions
* [ ] `aria-hidden` stays in sync with content visibility
* [ ] `aria-selected` updates on tab switch and option selection
* [ ] `aria-activedescendant` tracks the active option in composite widgets
* [ ] `aria-checked` / `aria-pressed` updates on toggle/switch interactions
* [ ] `aria-invalid` set on inputs when validation fails, removed when corrected
* [ ] `aria-describedby` dynamically updated to include/exclude error message IDs
* [ ] `aria-sort` updates on table column sort
* [ ] `aria-busy` set during loading states, removed on completion
* [ ] `aria-modal` present on open dialogs with focus trap active
* [ ] `aria-disabled` used correctly (keeps element in tab order)
* [ ] `aria-controls` points to the correct controlled element
* [ ] `aria-haspopup` value matches the popup type
* [ ] `aria-live` regions exist for all dynamically appearing content
* [ ] `aria-live` politeness level matches content urgency (polite vs assertive)
* [ ] No focusable elements inside `aria-hidden="true"` containers
* [ ] `role="alert"` used for error notifications requiring immediate announcement
* [ ] `role="status"` used for non-critical status updates
* [ ] Focus management correct on dialog open (focus moves in) and close (focus returns)
* [ ] Slider `value` / `aria-valuetext` updates during interaction
* [ ] Combobox `aria-expanded` and `aria-autocomplete` correct
* [ ] Tab panel visibility syncs with tab `aria-selected`

### Amex-Specific Checks

* [ ] No "linton" anti-patterns (link styled as button or button as link)
* [ ] No generic link text ("click here", "learn more", "read more", "here")
* [ ] DLS component `labelOverrides`, `hint`, and `status` props used correctly
* [ ] Testing completed across at least mobile (375px) and desktop (1024px) viewports

## Allowed Tool Usage Guide

For detailed tool usage patterns, keyboard testing sequences, and evidence
capture workflow, see `./browser-testing.md`.

| Frontmatter Name | Function Name in Workflow | When to Use |
|---|---|---|
| Open Browser | `open_browser_page(url)` | Navigate to target URL |
| Read Page | `read_page(pageId)` | Inspect DOM, ARIA attributes, text content |
| Screenshot | `screenshot_page(pageId)` | Capture evidence before/after interactions |
| Type | `type_in_page(pageId, key)` | Keyboard navigation and interaction |
| Click Element | `click_element(pageId, selector)` | Visual contrast verification, target size measurement, non-keyboard interaction testing for 2.5.6 |
| Hover | `hover_element(pageId, selector)` | Testing 1.4.13 Content on Hover/Focus — verify tooltips/popovers are dismissible and hoverable |
| Read | File reading for source code inspection | Verify source-level ARIA implementation |
| Grep | Pattern search in source code | Find ARIA attributes, role usage across codebase |
| Glob | File path matching | Locate component files for source inspection |

**Note:** Click Element and Hover are included to verify non-keyboard input modalities (2.5.6) and hover/focus content behavior (1.4.13). Keyboard testing remains the primary interaction method for the audit.

## Guidance for Screen Reader-Related Checks

Do not claim full screen reader verification unless a real screen reader was used. Instead, say:

* "Accessible-name and role review completed"
* "Keyboard behavior reviewed"
* "ARIA state change verification completed"
* "Full screen reader verification still needed"

## Response Rules

* **Do not invent findings** — Only report what you actively tested and observed.
* **Do not state compliance without evidence** — Every finding needs a screenshot, selector, or interaction note.
* **Distinguish between confirmed and suspected issues** — Mark uncertain items clearly.
* **When something cannot be tested**, say so plainly and explain why (no auth, behind paywall, etc.).
* **Prefer concrete observations over generalizations** — "Focus is not visible on the button after Tab" vs. "Focus is hard to see."
* **Keep findings manual-only** — Do not include or reference automated scanner output.
* **Acknowledge screen reader limitations** — Note "Verified keyboard access; full screen reader testing still needed."
* **Always verify against Amex AAA criteria** — The 11 additional AAA success criteria are mandatory, not optional.
* **ALWAYS output the Audit Report block** — Every audit must end with the standardized report format below. A response without it is incomplete.
* **ALWAYS include the Test Coverage Matrix** — Every checklist item must be marked as Pass, Fail, or Not Tested with evidence or a reason.
* **Render failures as a table** — If any checks fail, include the Failed Tests table below with one row per failed check.

## Mandatory Audit Report Format

Use the template in `../references/a11y-report-template.md`. Every audit must end with this filled-in report. A response without it is incomplete.

## Bundled Scripts

Node.js scripts bundled by tsup at build time. Most dependencies are inlined, but `jsdom` is loaded at runtime because it reads resource files from disk. Ensure `jsdom` is installed (`npm install jsdom`) in the environment where the scripts run.

| Script | Path | Purpose |
|---|---|---|
| Keyboard Audit | `../scripts/keyboard-audit.mjs` | Fetches a page, simulates tab order, and reports every tabbable element with role, name, label, and a11y issues. Batches keystrokes for efficiency. |
| Virtual Screen Reader Audit | `../scripts/virtual-screen-reader-audit.mjs` | Fetches a page, walks the accessibility tree with a virtual screen reader, and reports what would be announced. |

### Keyboard Audit

Analyzes the tab order of a page and flags accessibility issues (missing labels, positive tabindex, aria-hidden focusable elements, etc.).

```bash
node <skill-dir>/scripts/keyboard-audit.mjs <url>
```

Output: JSON report to stdout with `tabOrder`, `deepAnalysis` (detailed a11y info for interactive elements), and `issues` arrays.

### Virtual Screen Reader Audit

Walks the accessibility tree using `@guidepup/virtual-screen-reader` and reports every phrase a screen reader would announce.

```bash
node <skill-dir>/scripts/virtual-screen-reader-audit.mjs <url> [css-selector]
```

- `<url>` — the page to audit (fetched via `fetch()`)
- `[css-selector]` — optional CSS selector to scope the audit to a specific container

Output: JSON report to stdout with an `announcements` array containing each spoken phrase, item text, and any detected issues.

## Related Skills and References

* **DLS component accessibility patterns:** See `./accessibility.md` for DLS-specific guidance on `label`, `hint`, `labelOverrides`, `aria-label`, `aria-labelledby`, and accessible form patterns.
* **Automated accessibility testing:** See `@americanexpress/one-amex-test-utils` documentation for axe-core integration and the `AXE_TAGS` configuration.
* **Amex accessibility policy:** AENB77 (Digital Accessibility Policy) and TECH06.26.
* **WCAG reference:** https://www.w3.org/WAI/WCAG21/quickref/
