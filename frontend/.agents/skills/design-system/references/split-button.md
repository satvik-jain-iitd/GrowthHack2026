# SplitButton Component Reference
> AI agent-friendly reference for DLS SplitButton component

## Quick Reference
Combines a primary action button with a dropdown menu of related secondary actions. Use when you have one main action and several related alternatives.

## Import
```tsx
import { SplitButton, SplitButtonAction } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<SplitButton id="download-btn" label="Download">
  <SplitButtonAction>Save as PDF</SplitButtonAction>
  <SplitButtonAction>Save as CSV</SplitButtonAction>
</SplitButton>
```

## Props API

### SplitButton

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for menu |
| label | string | Yes | - | Main action button label |
| children | ReactElement \| ReactElement[] | Yes | - | Must be `SplitButtonAction` components |
| variant | `'primary'` \| `'secondary'` | No | `'primary'` | Visual style variant |
| icon | ReactNode | No | - | Optional icon for main button |
| isOpen | boolean | No | - | Controlled open state |
| defaultIsOpen | boolean | No | `false` | Default open state (uncontrolled) |
| onIsOpenChange | `(isOpen: boolean) => void` | No | - | Callback when menu opens/closes (controlled) |
| onClick | MouseEventHandler<HTMLButtonElement> | No | - | Click handler for the primary action button |
| disabled | boolean | No | `false` | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled | boolean \| `'true'` \| `'false'` | No | - | Disables but keeps focusable |
| className | string | No | - | Additional CSS classes |
| groupScreenReaderLabel | string | No | Same as label | Accessible label for button group |
| labelOverrides | SplitButtonLabelOverrides | No | - | Custom accessibility labels (for loading and nested actions trigger) |
| menuProps | Omit<MenuProps, 'id' \| 'isOpen' \| 'defaultIsOpen' \| 'onIsOpenChange' \| 'label' \| 'customTrigger' \| 'disabled' \| 'aria-disabled' \| 'children'> | No | - | Additional props passed to `Menu` |
| isLoading | boolean | No | - | Shows loading state on main button |
| iconPosition | `'start'` \| `'end'` | No | `'start'` | Position of icon relative to label |

### SplitButtonAction

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Action label |
| onClick | MouseEventHandler<HTMLButtonElement> | No | - | Click handler |
| icon | ReactElement | No | - | Optional icon |
| disabled | boolean | No | `false` | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus |
| aria-disabled | boolean \| `'true'` \| `'false'` | No | - | Disables but keeps focusable |

**Note:** `SplitButtonAction` is a wrapper around `MenuItem`, so it accepts all `MenuItem` props.

**Structure requirement:** `SplitButton` should contain only `SplitButtonAction` children.

## Common Patterns

### Primary with Icon
```tsx
<SplitButton id="download" label="Download" icon={<IconDownload />}>
  <SplitButtonAction>Save as CSV</SplitButtonAction>
  <SplitButtonAction>Save as PDF</SplitButtonAction>
  <SplitButtonAction>Print</SplitButtonAction>
</SplitButton>
```

### Primary without Icon
```tsx
<SplitButton id="export" label="Export">
  <SplitButtonAction>Export Current Page</SplitButtonAction>
  <SplitButtonAction>Export All Pages</SplitButtonAction>
  <SplitButtonAction>Export Selection</SplitButtonAction>
</SplitButton>
```

### Secondary Variant
```tsx
<SplitButton id="share" label="Share" variant="secondary" icon={<IconShare />}>
  <SplitButtonAction>Share via Email</SplitButtonAction>
  <SplitButtonAction>Copy Link</SplitButtonAction>
  <SplitButtonAction>Share to Social</SplitButtonAction>
</SplitButton>
```

### Actions with Click Handlers
```tsx
<SplitButton id="save" label="Save">
  <SplitButtonAction onClick={() => saveAsPDF()}>
    Save as PDF
  </SplitButtonAction>
  <SplitButtonAction onClick={() => saveAsCSV()}>
    Save as CSV
  </SplitButtonAction>
  <SplitButtonAction onClick={() => print()}>
    Print
  </SplitButtonAction>
</SplitButton>
```

### Actions with Icons
```tsx
<SplitButton id="account" label="My Account" icon={<IconAccount />}>
  <SplitButtonAction icon={<IconAccount />}>
    View Profile
  </SplitButtonAction>
  <SplitButtonAction icon={<IconSetting />}>
    Account Settings
  </SplitButtonAction>
  <SplitButtonAction icon={<IconHelp />}>
    Get Help
  </SplitButtonAction>
</SplitButton>
```

### Controlled Open State
```tsx
function ControlledSplitButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SplitButton
      id="controlled"
      label="Options"
      isOpen={isOpen}
      onIsOpenChange={setIsOpen}
    >
      <SplitButtonAction onClick={() => setIsOpen(false)}>
        Option 1
      </SplitButtonAction>
      <SplitButtonAction onClick={() => setIsOpen(false)}>
        Option 2
      </SplitButtonAction>
    </SplitButton>
  );
}
```

### Disabled Action
```tsx
<SplitButton id="edit" label="Edit">
  <SplitButtonAction>Edit Draft</SplitButtonAction>
  <SplitButtonAction aria-disabled="true">Edit Published (unavailable)</SplitButtonAction>
  <SplitButtonAction>Duplicate</SplitButtonAction>
</SplitButton>
```

### Disabled Entire Button
```tsx
<SplitButton id="save" label="Save" aria-disabled="true">
  <SplitButtonAction>Save as PDF</SplitButtonAction>
  <SplitButtonAction>Save as CSV</SplitButtonAction>
</SplitButton>
```

## Accessibility Requirements

**Required:**
- Must have unique `id` attribute
- Must have `label` for main action
- Each action must have descriptive text
- Maintain 3:1 contrast ratio with background

**Recommended:**
- Use clear, specific action labels
- Limit to 8 or fewer secondary actions
- Keep related actions together
- Provide `groupScreenReaderLabel` if label doesn't describe the group well

**Avoid:**
- Don't use for navigation (use Navigation or Links instead)
- Don't hide critical actions in the dropdown
- Don't use more than 8 secondary actions

## Anti-Patterns

❌ **Wrong: Missing label**
```tsx
<SplitButton id="actions" icon={<IconDownload />}>
  <SplitButtonAction>Action 1</SplitButtonAction>
</SplitButton>
```
✅ **Correct: Always include label**
```tsx
<SplitButton id="actions" label="Download" icon={<IconDownload />}>
  <SplitButtonAction>Save as PDF</SplitButtonAction>
</SplitButton>
```

❌ **Wrong: Using for navigation**
```tsx
<SplitButton id="learn" label="Learn More">
  <SplitButtonAction onClick={() => navigate('/cards')}>Card Details</SplitButtonAction>
  <SplitButtonAction onClick={() => navigate('/banking')}>Banking</SplitButtonAction>
</SplitButton>
```
✅ **Correct: Use for actions, not navigation**
```tsx
<SplitButton id="download" label="Download" icon={<IconDownload />}>
  <SplitButtonAction onClick={downloadPDF}>Save as PDF</SplitButtonAction>
  <SplitButtonAction onClick={downloadCSV}>Save as CSV</SplitButtonAction>
</SplitButton>
```

❌ **Wrong: Too many actions**
```tsx
<SplitButton id="countries" label="Select Country">
  <SplitButtonAction>Argentina</SplitButtonAction>
  <SplitButtonAction>Brazil</SplitButtonAction>
  <SplitButtonAction>Canada</SplitButtonAction>
  {/* ... 20 more countries ... */}
</SplitButton>
```
✅ **Correct: Use different component for many options**
```tsx
<Select label="Select Country">
  <option>Argentina</option>
  <option>Brazil</option>
  <option>Canada</option>
  {/* ... more options ... */}
</Select>
```

❌ **Wrong: Unrelated actions**
```tsx
<SplitButton id="mixed" label="Download">
  <SplitButtonAction>Save as PDF</SplitButtonAction>
  <SplitButtonAction>Delete Account</SplitButtonAction>
  <SplitButtonAction>Change Password</SplitButtonAction>
</SplitButton>
```
✅ **Correct: Group related actions**
```tsx
<SplitButton id="download" label="Download">
  <SplitButtonAction>Save as PDF</SplitButtonAction>
  <SplitButtonAction>Save as CSV</SplitButtonAction>
  <SplitButtonAction>Print</SplitButtonAction>
</SplitButton>
```

## Best Practices

- **Primary action:** Make the main button the most common/important action
- **Secondary actions:** Keep them related to the primary action
- **Action count:** Limit to 3-8 secondary actions; use different component if more
- **Labels:** Use verb + noun construction, be specific, keep short
- **Icons:** Optional for main button; use simple, recognizable icons
- **Not for navigation:** SplitButton performs actions; use Navigation/Links for page navigation
- **Not for selection:** Use Select or Menu for choosing from many options
- **Responsive:** Text wraps, overlay appears above/below based on position
- **Visual separator:** Always present between main action and dropdown trigger

## When to Use

**Use SplitButton for:**
- One primary action with related secondary options (Download → PDF/CSV/Print)
- Consolidating related action buttons (Save → Save Draft/Save & Publish/Save Template)
- Providing action alternatives (Send → Send Now/Schedule/Save Draft)

**Don't use SplitButton for:**
- Navigation to different pages
- No clear default/primary action
- More than 8 secondary actions
- Unrelated actions
- Multi-select scenarios

## Related Components
- [Button](button.md) - Standard action button
- [IconButton](icon-button.md) - Icon-only button
- [Menu](menu.md) - Standalone menu for actions (used internally by SplitButton)
- Navigation - For page navigation
- Select - For selection from many options
