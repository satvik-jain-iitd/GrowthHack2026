---  
title: WCAG 2.1 Compliance Checklist — Amex Standard  
description: Full WCAG 2.1 A + AA checklist plus the 11 additional AAA success criteria required by Amex policy (AENB77).  
---  
  
# WCAG 2.1 Level A + AA + Amex AAA Compliance Checklist  
  
## Amex Compliance Target  
  
Per AENB77 and TECH06.26: **WCAG 2.1 A and AA** plus **11 additional AAA success criteria**.  

## Amex Accessibility Standards  
  
Per AENB77 (Digital Accessibility Policy) and TECH06.26, American Express targets **WCAG 2.1 Level A and AA** compliance **plus 11 additional AAA success criteria**:  
  
| axe-core Tag | WCAG SC | Name |  
|---|---|---|  
| `wcag2a` | All Level A | WCAG 2.0 + 2.1 Level A |  
| `wcag2aa` | All Level AA | WCAG 2.0 + 2.1 Level AA |  
| `wcag21a` | All 2.1 Level A | WCAG 2.1-specific Level A |  
| `wcag21aa` | All 2.1 Level AA | WCAG 2.1-specific Level AA |  
| `wcag136` | 1.3.6 | Identify Purpose |  
| `wcag213` | 2.1.3 | Keyboard (No Exception) |  
| `wcag232` | 2.3.2 | Three Flashes |  
| `wcag233` | 2.3.3 | Animation from Interactions |  
| `wcag249` | 2.4.9 | Link Purpose (Link Only) |  
| `wcag2410` | 2.4.10 | Section Headings |  
| `wcag255` | 2.5.5 | Target Size (Minimum 44x44px) |  
| `wcag256` | 2.5.6 | Concurrent Input Mechanisms |  
| `wcag325` | 3.2.5 | Change on Request |  
| `wcag335` | 3.3.5 | Help |  
| `wcag336` | 3.3.6 | Error Prevention (All) |   
  
**All manual audit checks in this skill must cover these criteria.**  
  
## Principle 1: Perceivable  
  
### 1.1 Text Alternatives  
- [ ] 1.1.1 Non-text Content (A): All images have alt text  
  
### 1.2 Time-based Media  
- [ ] 1.2.1 Audio-only and Video-only (A): Alternatives provided  
- [ ] 1.2.2 Captions (A): Captions for videos  
- [ ] 1.2.3 Audio Description or Media Alternative (A)  
- [ ] 1.2.4 Captions (Live) (AA): Live captions  
- [ ] 1.2.5 Audio Description (AA): Pre-recorded video  
  
### 1.3 Adaptable  
- [ ] 1.3.1 Info and Relationships (A): Semantic markup  
- [ ] 1.3.2 Meaningful Sequence (A): Logical reading order  
- [ ] 1.3.3 Sensory Characteristics (A): Not color/shape only  
- [ ] 1.3.4 Orientation (AA): No orientation lock  
- [ ] 1.3.5 Identify Input Purpose (AA): Autocomplete attributes  
- [ ] **1.3.6 Identify Purpose (AAA — Amex required):** UI component purpose is programmatically determinable  
  
### 1.4 Distinguishable  
- [ ] 1.4.1 Use of Color (A): Not sole indicator  
- [ ] 1.4.2 Audio Control (A): Pause/stop audio  
- [ ] 1.4.3 Contrast (Minimum) (AA): 4.5:1 ratio for text, 3:1 for UI components  
- [ ] 1.4.4 Resize text (AA): 200% zoom without loss  
- [ ] 1.4.5 Images of Text (AA): Use real text  
- [ ] 1.4.10 Reflow (AA): No horizontal scrolling at 320px  
- [ ] 1.4.11 Non-text Contrast (AA): UI components 3:1  
- [ ] 1.4.12 Text Spacing (AA): Adjustable spacing  
- [ ] 1.4.13 Content on Hover or Focus (AA): Dismissible, hoverable, persistent  
  
## Principle 2: Operable  
  
### 2.1 Keyboard Accessible  
- [ ] 2.1.1 Keyboard (A): All functionality keyboard accessible  
- [ ] 2.1.2 No Keyboard Trap (A): Can navigate away  
- [ ] **2.1.3 Keyboard — No Exception (AAA — Amex required):** All functionality operable by keyboard, no exceptions  
- [ ] 2.1.4 Character Key Shortcuts (A): Remappable  
  
### 2.2 Enough Time  
- [ ] 2.2.1 Timing Adjustable (A): Extend/turn off time limits  
- [ ] 2.2.2 Pause, Stop, Hide (A): Control moving content  
  
### 2.3 Seizures and Physical Reactions  
- [ ] 2.3.1 Three Flashes or Below Threshold (A)  
- [ ] **2.3.2 Three Flashes (AAA — Amex required):** No content flashes more than 3 times/second, period  
- [ ] **2.3.3 Animation from Interactions (AAA — Amex required):** Motion can be disabled; `prefers-reduced-motion` respected  
  
### 2.4 Navigable  
- [ ] 2.4.1 Bypass Blocks (A): Skip navigation  
- [ ] 2.4.2 Page Titled (A): Descriptive page titles  
- [ ] 2.4.3 Focus Order (A): Logical tab order  
- [ ] 2.4.4 Link Purpose in Context (A): Link text is descriptive in context  
- [ ] 2.4.5 Multiple Ways (AA): Multiple nav methods  
- [ ] 2.4.6 Headings and Labels (AA): Descriptive  
- [ ] 2.4.7 Focus Visible (AA): Visible focus indicator  
- [ ] **2.4.9 Link Purpose — Link Only (AAA — Amex required):** Every link understandable from its text alone  
- [ ] **2.4.10 Section Headings (AAA — Amex required):** Content organized with section headings  
  
### 2.5 Input Modalities  
- [ ] 2.5.1 Pointer Gestures (A): No complex gestures only  
- [ ] 2.5.2 Pointer Cancellation (A): Can abort/undo  
- [ ] 2.5.3 Label in Name (A): Accessible name includes visible text  
- [ ] 2.5.4 Motion Actuation (A): Disable motion triggers  
- [ ] **2.5.5 Target Size (AAA — Amex required):** All interactive targets at least 44x44px  
- [ ] **2.5.6 Concurrent Input Mechanisms (AAA — Amex required):** No restriction on input modality  
  
## Principle 3: Understandable  
  
### 3.1 Readable  
- [ ] 3.1.1 Language of Page (A): `<html lang="en">`  
- [ ] 3.1.2 Language of Parts (AA): lang attribute for language changes within content  
  
### 3.2 Predictable  
- [ ] 3.2.1 On Focus (A): No context change on focus  
- [ ] 3.2.2 On Input (A): No unexpected changes  
- [ ] 3.2.3 Consistent Navigation (AA): Same order  
- [ ] 3.2.4 Consistent Identification (AA): Same function = same label  
- [ ] **3.2.5 Change on Request (AAA — Amex required):** Context changes only on user request or can be turned off  
  
### 3.3 Input Assistance  
- [ ] 3.3.1 Error Identification (A): Errors identified  
- [ ] 3.3.2 Labels or Instructions (A): Labels provided  
- [ ] 3.3.3 Error Suggestion (AA): Correction suggested  
- [ ] 3.3.4 Error Prevention — Legal/Financial (AA): Confirm/undo for legal/financial  
- [ ] **3.3.5 Help (AAA — Amex required):** Context-sensitive help is available  
- [ ] **3.3.6 Error Prevention — All (AAA — Amex required):** All submissions reversible, checked, or confirmed  
  
## Principle 4: Robust  
  
### 4.1 Compatible  
- [ ] 4.1.1 Parsing (A): Valid HTML  
- [ ] 4.1.2 Name, Role, Value (A): For custom widgets  
- [ ] 4.1.3 Status Messages (AA): Announced to screen readers  
  
## Testing Tools  
  
- **Automated**: axe-core (with Amex `axeTags` configuration), Lighthouse, WAVE  
- **Manual**: Keyboard navigation, this audit skill  
- **Color**: Contrast checker (4.5:1 text, 3:1 UI components)  
- **Screen Readers**: NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)  
- **Target Size**: Browser dev tools for measuring element dimensions  
  
## Amex-Specific Common Failures  
  
- Missing alt text  
- Insufficient contrast (below 4.5:1 for text, 3:1 for UI)  
- No keyboard access  
- Empty links/buttons  
- Form inputs without labels  
- Heading hierarchy skipped  
- No focus indicators  
- Using color alone to convey information  
- "Click here" or "learn more" link text (violates 2.4.9)  
- Link styled as button or button as link ("linton" anti-pattern)  
- Touch targets below 44x44px (violates 2.5.5)  
- Animations not respecting `prefers-reduced-motion` (violates 2.3.3)  
- Content flashing more than 3 times/second (violates 2.3.2)  
- Form submissions not reversible or confirmable (violates 3.3.6)  
- No context-sensitive help on complex forms (violates 3.3.5)  
- Context changes without user initiation (violates 3.2.5)  
- Input modality restricted to mouse/touch only (violates 2.5.6)