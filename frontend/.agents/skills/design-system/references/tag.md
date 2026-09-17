# Tag Component Reference

> AI agent-friendly reference for DLS Tag component

## Quick Reference

Interactive tags for category selection and filtering. Always interactive. Two types: toggle (for selection) and dismissible (for filtering). For non-interactive labels, use Badge.

## Import

```tsx
import { Tag } from '@americanexpress/dls-react';
```

## Minimal Example

```tsx
<Tag onClick={() => console.log('clicked')}>Category</Tag>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | No | - | What is displayed within the Tag, typically text |
| onClick | MouseEventHandler<HTMLButtonElement> | No | - | The function that is called when the tag is clicked |
| aria-pressed | boolean \| `'true'` \| `'false'` | No | - | The pressed state of the clickable Tag. When true, shows checkmark icon. |
| isDismissible | boolean | No | `false` | If true, shows close icon and allows dismissing the tag |
| focusOnDismissRef | RefObject<HTMLElement> | No | - | Optional ref to another element that should receive focus when the tag is dismissed |
| disabled | boolean | No | - | @deprecated use `aria-disabled` instead. The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled | boolean \| `'true'` \| `'false'` | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled". |
| className | string | No | - | Additional CSS class names to apply to the tag. |
| labelOverrides | TagLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |

**Note:** Tag extends `ButtonBaseProps` which extends `ComponentPropsWithRef<'button'>`, so it accepts all native button element props.

**TagLabelOverrides:**
```typescript
{
  dismissScreenReaderLabel?: string; // Default: 'Dismiss'
}
```

## Common Patterns

### Toggle Tag (Selection)
```tsx
const [isSelected, setIsSelected] = useState(false);

<Tag 
  aria-pressed={isSelected} 
  onClick={() => setIsSelected(!isSelected)}
>
  Electronics
</Tag>
```

### Dismissible Tag (Filtering)
```tsx
<Tag 
  isDismissible 
  onClick={() => console.log('Tag dismissed')}
>
  Electronics
</Tag>
```

### Multiple Toggle Tags (Selection Group)
```tsx
const [selectedTags, setSelectedTags] = useState<string[]>([]);

const toggleTag = (tag: string) => {
  setSelectedTags(prev => 
    prev.includes(tag) 
      ? prev.filter(t => t !== tag)
      : [...prev, tag]
  );
};

<div role="group" aria-label="Filter options">
  <Tag 
    aria-pressed={selectedTags.includes('new')}
    onClick={() => toggleTag('new')}
  >
    New
  </Tag>
  <Tag 
    aria-pressed={selectedTags.includes('sale')}
    onClick={() => toggleTag('sale')}
  >
    On Sale
  </Tag>
  <Tag 
    aria-pressed={selectedTags.includes('clearance')}
    onClick={() => toggleTag('clearance')}
  >
    Clearance
  </Tag>
</div>
```

### Dismissible Tags with Focus Management
```tsx
const buttonRef = useRef<HTMLButtonElement>(null);

<>
  <Tag 
    isDismissible 
    focusOnDismissRef={buttonRef}
    onClick={() => console.log('Tag 1 dismissed')}
  >
    Filter 1
  </Tag>
  <Tag 
    isDismissible
    onClick={() => console.log('Tag 2 dismissed')}
  >
    Filter 2
  </Tag>
  <button ref={buttonRef}>Clear All</button>
</>
```

### Disabled Tag
```tsx
<Tag aria-disabled="true" onClick={() => {}}>
  Unavailable
</Tag>
```

### With Custom Dismiss Label
```tsx
<Tag 
  isDismissible
  labelOverrides={{ dismissScreenReaderLabel: 'Remove filter' }}
>
  Active Filter
</Tag>
```

## Accessibility Requirements

**Required:**
- Always provide a visible label (children)
- Tags are keyboard accessible (Space/Enter to activate)
- Use `aria-pressed` for toggle state communication
- Dismissible tags announce "Dismiss" to screen readers by default

**Recommended:**
- Group related tags using `role="group"` with `aria-label`
- Use `focusOnDismissRef` to manage focus when tag is dismissed
- Keep labels concise (≤20 characters)
- Use sentence case for labels

**Never:**
- Use tags as static labels (use Badge instead)
- Use tags as buttons (use Button instead)
- Use tags to switch content (use Tabs instead)
- Create text that wraps multiple lines
- Use more than 7 tags in a group
- Remove focus without setting `focusOnDismissRef`

## Anti-Patterns

❌ **Wrong: Using Tag as static label**
```tsx
<Tag>Status: Active</Tag>
```

✅ **Correct: Use Badge for static labels**
```tsx
<Badge>Status: Active</Badge>
```

---

❌ **Wrong: No onClick handler**
```tsx
<Tag>Category</Tag>
```

✅ **Correct: Tags are always interactive**
```tsx
<Tag onClick={() => handleClick()}>Category</Tag>
```

---

❌ **Wrong: Using Tag as primary action button**
```tsx
<Tag onClick={() => submitForm()}>Submit Form</Tag>
```

✅ **Correct: Use Button for primary actions**
```tsx
<Button onClick={() => submitForm()}>Submit Form</Button>
```

---

❌ **Wrong: Using Tag to switch content**
```tsx
<Tag onClick={() => setActiveTab('home')}>Home</Tag>
<Tag onClick={() => setActiveTab('profile')}>Profile</Tag>
```

✅ **Correct: Use Tabs for content switching**
```tsx
<Tabs>
  <TabList>
    <Tab id="home">Home</Tab>
    <Tab id="profile">Profile</Tab>
  </TabList>
  {/* TabPanels... */}
</Tabs>
```

---

❌ **Wrong: Too many tags**
```tsx
<div>
  <Tag>Tag 1</Tag>
  <Tag>Tag 2</Tag>
  {/* ... 15 more tags ... */}
</div>
```

✅ **Correct: Limit to 7 tags per group**
```tsx
<div role="group">
  <Tag>Tag 1</Tag>
  <Tag>Tag 2</Tag>
  <Tag>Tag 3</Tag>
  {/* Max 7 tags */}
</div>
```

---

❌ **Wrong: Missing focus management on dismiss**
```tsx
<Tag isDismissible>Filter</Tag>
```

✅ **Correct: Provide focusOnDismissRef**
```tsx
const clearButtonRef = useRef<HTMLButtonElement>(null);

<>
  <Tag isDismissible focusOnDismissRef={clearButtonRef}>Filter</Tag>
  <button ref={clearButtonRef}>Clear All</button>
</>
```

## Best Practices

- **Toggle tags**: Use for multiple category selection
- **Dismissible tags**: Use for active filters that can be removed
- **Limit quantity**: Use 1-7 tags per group for scannability
- **Label length**: Keep labels short (1-2 words, ≤20 characters)
- **Text case**: Use sentence case for labels (not ALL CAPS or Title Case)
- **Grouping**: Wrap related tags in `role="group"` with `aria-label`
- **Focus management**: Always provide `focusOnDismissRef` for dismissible tags
- **Visual feedback**: Tag shows check icon when `aria-pressed={true}`
- **State management**: Tag component manages visibility internally when dismissed


## Related Components

- **Badge**: For non-interactive labels and status indicators
- **Button**: For primary and secondary actions
- **Tabs**: For switching between content views
- **SegmentedControl**: For mutually exclusive selection (radio-like behavior)
