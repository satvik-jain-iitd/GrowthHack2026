# SegmentedControl Component Reference

> AI agent-friendly reference for DLS SegmentedControl component

## Quick Reference

Switch between alternative views of similar/related content. Single selection at a time. Use SegmentedControl wrapper with SegmentedButton children.

## Import

```tsx
import { SegmentedControl, SegmentedButton } from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
<SegmentedControl id="view" label="View">
  <SegmentedButton id="list">List</SegmentedButton>
  <SegmentedButton id="grid">Grid</SegmentedButton>
</SegmentedControl>
```

## Props API

### SegmentedControl Props

| Prop                 | Type                     | Required | Default   | Description                                                                                                                                    |
| -------------------- | ------------------------ | -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | string                   | Yes      | -         | Unique identifier                                                                                                                              |
| label                | string                   |          | -         | Group label                                                                                                                                    |
| aria-labelledby      | string                   | -        | -         | ID of label element                                                                                                                            |
| children             | ReactNode                | Yes      | -         | SegmentedButton components                                                                                                                     |
| variant              | 'primary' \| 'secondary' |          | 'primary' | Visual style                                                                                                                                   |
| iconPosition         | 'start' \| 'end'         |          | 'start'   | Icon placement                                                                                                                                 |
| selected             | string                   |          | -         | Controlled selected button ID                                                                                                                  |
| defaultSelected      | string                   |          | -         | Initial selected button ID (uncontrolled)                                                                                                      |
| onSelectionChange    | function                 |          | -         | Selection change handler                                                                                                                       |
| disabled             | boolean                  |          | -         | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled        | boolean                  |          | -         | Accessible disabled state                                                                                                                      |
| hint                 | string                   |          | -         | Helper text                                                                                                                                    |
| isHintVisuallyHidden | boolean                  |          | false     | Hide hint visually                                                                                                                             |
| className            | string                   |          | -         | Additional CSS classes                                                                                                                         |
| ref                  | React ref                |          | -         | Ref to the root element                                                                                                                        |

### SegmentedButton Props

| Prop           | Type                                   | Required | Default   | Description                                                                                                                                    |
| -------------- | -------------------------------------- | -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| id             | string                                 | Yes      | -         | Unique button identifier                                                                                                                       |
| children       | ReactNode                              | Yes      | -         | Button label                                                                                                                                   |
| icon           | ReactElement                           |          | -         | Icon component                                                                                                                                 |
| onClick        | function                               |          | -         | Click handler                                                                                                                                  |
| disabled       | boolean                                |          | -         | @deprecated use aria-disabled instead. The disabled prop removes the element from the Accessibility Tree and prevents it from receiving focus. |
| aria-disabled  | boolean                                |          | -         | Accessible disabled state                                                                                                                      |
| className      | string                                 |          | -         | Additional CSS classes                                                                                                                         |
| ref            | React ref                              |          | -         | Ref to the button element                                                                                                                      |
| isLoaded       | boolean                                |          | -         | Show loading state on button                                                                                                                   |
| variant        | 'primary' \| 'secondary' \| 'tertiary' |          | 'primary' | Visual style variant                                                                                                                           |
| labelOverrides | object                                 |          | -         | Custom accessible labels for screen readers                                                                                                    |

## Common Patterns

### Primary Segmented Control

```tsx
<SegmentedControl
  id="view"
  label="View"
  variant="primary"
  defaultSelected="list"
>
  <SegmentedButton id="list">List</SegmentedButton>
  <SegmentedButton id="grid">Grid</SegmentedButton>
  <SegmentedButton id="card">Card</SegmentedButton>
</SegmentedControl>
```

### Primary With Icons

```tsx
import { IconList, IconGrid } from "@americanexpress/dls-icons";

<SegmentedControl
  id="view"
  label="Layout"
  iconPosition="start"
  defaultSelected="list"
  variant="primary"
>
  <SegmentedButton id="list" icon={<IconList />}>
    List
  </SegmentedButton>
  <SegmentedButton id="grid" icon={<IconGrid />}>
    Grid
  </SegmentedButton>
</SegmentedControl>;
```

### Controlled Selection

```tsx
const [selected, setSelected] = useState("list");

<SegmentedControl
  id="view"
  label="View"
  selected={selected}
  onSelectionChange={(e, id) => setSelected(id)}
>
  <SegmentedButton id="list">List</SegmentedButton>
  <SegmentedButton id="grid">Grid</SegmentedButton>
</SegmentedControl>;
```

### Uncontrolled (Default Selection)

```tsx
<SegmentedControl id="view" label="View" defaultSelected="grid">
  <SegmentedButton id="list">List</SegmentedButton>
  <SegmentedButton id="grid">Grid</SegmentedButton>
</SegmentedControl>
```

### Secondary Variant

```tsx
<SegmentedControl id="sorting" label="Sort" variant="secondary">
  <SegmentedButton id="newest">Newest</SegmentedButton>
  <SegmentedButton id="oldest">Oldest</SegmentedButton>
</SegmentedControl>
```

### With Disabled Button

```tsx
<SegmentedControl id="view" label="View">
  <SegmentedButton id="list">List</SegmentedButton>
  <SegmentedButton id="grid">Grid</SegmentedButton>
  <SegmentedButton id="map" aria-disabled>
    Map
  </SegmentedButton>
</SegmentedControl>
```

## Accessibility Requirements

**Required:**

- Provide visible label for the control group
- Only one option selectable at a time
- Keyboard navigation with arrow keys
- Selected state clearly indicated with checkmark

**Recommended:**

- Keep button text concise
- Use 2-5 options (never just 1)
- Each button has descriptive text

## Anti-Patterns

**Never:**

- Use for unrelated content (use Tabs instead)
- Have more than 5 options (use Menu instead)
- Have only 1 option
- Allow multiple selections (use Checkbox or Filter instead)
- Let button text wrap to multiple lines

## Best Practices

- Use for switching between similar views of same data
- Use for sorting or filtering similar content
- Limit to 2-5 options
- Keep labels short and clear
- Show checkmark on selected option
- Can start with no selection OR one preselected
- Primary variant for main actions
- Secondary variant for subtle controls

## Related Components

- **Tabs**: For different content sections
- **Menu**: For more than 5 options
- **Filter**: For multiple selections
- **RadioButton**: For form selections
