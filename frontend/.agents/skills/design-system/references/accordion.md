# Accordion Component Reference
> AI agent-friendly reference for DLS Accordion component

## Quick Reference
A vertical stack of interactive headings that allows users to expand and collapse content sections. Use for progressive disclosure of related information that users can explore at their own pace.

## Import
```tsx
import { Accordion, AccordionPanel, AccordionContent, AccordionText } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Accordion id="accordion-example">
  <AccordionPanel id="panel1" heading={<h3>Heading</h3>} />
  <AccordionContent aria-labelledby="panel1">
    Content for panel 1
  </AccordionContent>
</Accordion>
```

## Props API

### Accordion Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the accordion |
| isBordered | boolean | No | true | Whether to show borders around panels |
| shouldAllowMultipleExpanded | boolean | No | true | If true, multiple panels can be open at once. If false, only one panel can be open at a time |
| defaultOpenPanelIds | string[] | No | - | Array of panel IDs that should be open by default in uncontrolled mode |
| openPanelIds | string[] | No | - | Array of panel IDs that are currently open in controlled mode |
| onAccordionToggle | (event: MouseEvent, panelId: string) => void | No | - | Callback when panel is toggled. Used in controlled mode |
| children | ReactNode | No | - | Children components to be rendered within the accordion |
| className | string | No | - | Additional CSS classes |

### AccordionPanel Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the AccordionPanel component |
| heading | ReactElement | No | - | Heading displayed on the accordion panel |
| subText | string | No | - | Sub-text or additional information displayed on the accordion panel |
| icon | ReactNode | No | - | Icon displayed within the accordion panel |
| children | ReactNode | No | - | Child elements to be rendered within the accordion panel |
| chevronPosition | 'start' \| 'end' | No | 'end' | Position of the chevron icon (left or right of heading) |
| onClick | (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void | No | - | Event handler for button click |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| ref | RefObject<HTMLButtonElement> | No | - | Ref object for the button element |
| className | string | No | - | Additional CSS class names for styling |
| reactlytics | ReactlyticsProp | No | - | Reactlytics tracking prop |
| shouldShowIcons | boolean | No | - | If true, shows icons beside the accordion button |
| shouldUseUnstyledButton | boolean | No | - | If true, unstyled button will be used |

### AccordionContent Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| aria-labelledby | string | Yes | - | ID of the associated panel header |
| children | ReactNode | Yes | - | Content to display when panel is expanded |
| className | string | No | - | Additional CSS classes |

### AccordionText Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the AccordionText component |
| heading | string | Yes | - | The text or content that will be displayed as the heading of the accordion text |
| children | ReactNode | No | - | Children to render as the text for when shouldUseUnstyledButton is set to true |
| onClick | (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void | No | - | Event handler for button click |
| disabled | boolean | No | - | **Deprecated:** Use `aria-disabled` instead. Removes element from Accessibility Tree and prevents focus |
| aria-disabled | boolean | No | - | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled" |
| className | string | No | - | Additional CSS class names for styling |
| reactlytics | ReactlyticsProp | No | - | Reactlytics tracking prop |
| shouldShowDivider | boolean | No | true | Optional flag to show a divider line above and below the accordion text |
| shouldShowIcons | boolean | No | - | If true, shows icons beside the accordion button |
| icon | ReactNode | No | - | Custom icon displayed beside the accordion button |
| shouldUseUnstyledButton | boolean | No | - | If true, unstyled button will be used |
| labelOverrides | AccordionButtonLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

## Common Patterns

### Basic Panel Accordion
```tsx
<Accordion id="basic-accordion">
  <AccordionPanel 
    id="panel1" 
    heading={<h3>Heading</h3>} 
    subText="Subtext" 
    icon={<IconAccount />} 
  />
  <AccordionContent aria-labelledby="panel1">
    Use the accordion to show additional information.
    Information that is not important for moving forward, those should be visible.
    Pressing the button to open and close independently of each other within a larger stacked list.
  </AccordionContent>
</Accordion>
```

### Multiple Panels (Allow Multiple Open)
```tsx
<Accordion id="multi-accordion" shouldAllowMultipleExpanded={true}>
  <AccordionPanel
    heading={<h3>First Panel</h3>}
    icon={<IconAccount />}
    id="panel1"
    subText="Subtext"
  />
  <AccordionContent aria-labelledby="panel1">
    Use the accordion to show additional information. Information that is not important for moving forward, those should be visible.
  </AccordionContent>
  
  <AccordionPanel
    heading={<h3>Second Panel</h3>}
    icon={<IconAccount />}
    id="panel2"
  />
  <AccordionContent aria-labelledby="panel2">
    Selecting any area on the bar to open and close independently of each other within a larger stacked list.
  </AccordionContent>
  
  <AccordionPanel
    heading={<h3>Third Panel</h3>}
    icon={<IconAccount />}
    id="panel3"
  />
  <AccordionContent aria-labelledby="panel3">
    Use the accordion to show additional information.
  </AccordionContent>
</Accordion>
```

### Single Panel Open at a Time
```tsx
<Accordion id="single-accordion">
  <AccordionPanel heading={<h3>Panel 1</h3>} id="panel1" />
  <AccordionContent aria-labelledby="panel1">Panel 1 content</AccordionContent>
  
  <AccordionPanel heading={<h3>Panel 2</h3>} id="panel2" />
  <AccordionContent aria-labelledby="panel2">Panel 2 content</AccordionContent>
</Accordion>
```

### Text Panel Variation
```tsx
<Accordion id="text-accordion">
  <AccordionText 
    id="panel1" 
    heading="Preview of information, for additional details to expand users must select the button below."
  >
    Button
  </AccordionText>
  <AccordionContent aria-labelledby="panel1">
    Use the accordion to show additional information. Information that is not important for
    moving forward, those should be visible. Pressing the button to open and close
    independently of each other within a larger stacked list.
  </AccordionContent>
</Accordion>
```

### With Icon on Left
```tsx
<Accordion id="icon-left-accordion">
  <AccordionPanel 
    id="panel1" 
    heading={<h3>Heading</h3>} 
    icon={<IconAccount />}
    chevronPosition="start"
  />
  <AccordionContent aria-labelledby="panel1">
    Content with chevron on the left side.
  </AccordionContent>
</Accordion>
```

### Controlled Accordion
```tsx
function ControlledAccordion() {
  const [openPanels, setOpenPanels] = useState(['panel1']);
  
  return (
    <Accordion 
      id="controlled-accordion"
      openPanelIds={openPanels}
      onAccordionToggle={(event, panelId) => {
        setOpenPanels(prev => 
          prev.includes(panelId) 
            ? prev.filter(id => id !== panelId)
            : [...prev, panelId]
        );
      }}
    >
      <AccordionPanel id="panel1" heading={<h3>Panel 1</h3>} />
      <AccordionContent aria-labelledby="panel1">Content 1</AccordionContent>
      
      <AccordionPanel id="panel2" heading={<h3>Panel 2</h3>} />
      <AccordionContent aria-labelledby="panel2">Content 2</AccordionContent>
    </Accordion>
  );
}
```

### Without Border
```tsx
<Accordion id="borderless-accordion" isBordered={false}>
  <AccordionPanel id="panel1" heading={<h3>Heading</h3>} />
  <AccordionContent aria-labelledby="panel1">Content without borders</AccordionContent>
</Accordion>
```

### Accordion with MultiSelect ("absolute" positionStrategy)

```tsx
<Accordion id="accordion-with-multiselect">
  <AccordionPanel
    heading={<h3>Platform</h3>}
    id="panel1"
    subText=""
  />
  <AccordionContent aria-labelledby="panel1">
    <div className="pad-4-b pad-1-lr scroll-y position-relative">
      <MultiSelect
          id="multi-select"
          label="Platform"
          positionStrategy="absolute"
        >
          <MultiSelectOption value={1}>
            One
          </MultiSelectOption>
          <MultiSelectOption value={2}>
            Two
          </MultiSelectOption>
        </MultiSelect>
      </div>
  </AccordionContent>
</Accordion>
```

### Accordion with DatePicker or DateRangePicker (using portal)

```tsx
<Accordion id="accordion">
  <AccordionPanel
    heading={<h3>Heading</h3>}
    id="panel1"
  />
  <AccordionContent aria-labelledby="panel1" className="margin-2">
    <DatePicker
      hint="Choose which day you would like to make your payment."
      id="date-picker"
      label="Payment Date"
      shouldCreatePortal={true}
    />
  </AccordionContent>
</Accordion>
```

## Accessibility Requirements

**Required:**
- Each AccordionPanel or AccordionText must have a unique id
- AccordionContent must have aria-labelledby matching the panel id
- Panels automatically include aria-expanded state
- Keyboard navigation support (Enter/Space to toggle)
- Focus management for interactive elements

**Recommended:**
- Use semantic heading elements (h2, h3) for panel headings
- Provide meaningful heading text that describes the content
- Use label overrides for custom collapsed/expanded state labels
- Consider the heading level hierarchy in your page structure

**Avoid:**
- Nesting accordions within accordions (reduces usability and accessibility)
- Using accordions for critical information needed to proceed
- Putting interactive elements inside panel headings (unless properly managed)
- Detaching component from library (updates won't be reflected)

## Anti-Patterns

❌ **WRONG: Hiding critical information**
```tsx
<Accordion id="bad-accordion">
  <AccordionPanel id="checkout" heading={<h3>Complete Purchase</h3>} />
  <AccordionContent aria-labelledby="checkout">
    <Button>Submit Payment</Button>
  </AccordionContent>
</Accordion>
```

✅ **CORRECT: Use for supplementary information**
```tsx
<Button>Submit Payment</Button>
<Accordion id="good-accordion">
  <AccordionPanel id="details" heading={<h3>Additional Details</h3>} />
  <AccordionContent aria-labelledby="details">
    Optional shipping and tax information
  </AccordionContent>
</Accordion>
```

❌ **WRONG: Nested accordions**
```tsx
<Accordion id="outer">
  <AccordionPanel id="panel1" heading={<h3>Outer</h3>} />
  <AccordionContent aria-labelledby="panel1">
    <Accordion id="inner">
      <AccordionPanel id="inner1" heading={<h3>Inner</h3>} />
      <AccordionContent aria-labelledby="inner1">Content</AccordionContent>
    </Accordion>
  </AccordionContent>
</Accordion>
```

✅ **CORRECT: Flat structure with multiple panels**
```tsx
<Accordion id="flat-accordion">
  <AccordionPanel id="section1" heading={<h3>Section 1</h3>} />
  <AccordionContent aria-labelledby="section1">Content 1</AccordionContent>
  
  <AccordionPanel id="section2" heading={<h3>Section 2</h3>} />
  <AccordionContent aria-labelledby="section2">Content 2</AccordionContent>
</Accordion>
```

❌ **WRONG: Using same icon for different content**
```tsx
<Accordion id="bad-icons">
  <AccordionPanel id="account" heading={<h3>Account Info</h3>} icon={<IconAccount />} />
  <AccordionContent aria-labelledby="account">Account content</AccordionContent>
  
  <AccordionPanel id="rewards" heading={<h3>Rewards</h3>} icon={<IconAccount />} />
  <AccordionContent aria-labelledby="rewards">Rewards content</AccordionContent>
</Accordion>
```

✅ **CORRECT: Unique meaningful icons**
```tsx
<Accordion id="good-icons">
  <AccordionPanel id="account" heading={<h3>Account Info</h3>} icon={<IconAccount />} />
  <AccordionContent aria-labelledby="account">Account content</AccordionContent>
  
  <AccordionPanel id="rewards" heading={<h3>Rewards</h3>} icon={<IconRewards />} />
  <AccordionContent aria-labelledby="rewards">Rewards content</AccordionContent>
</Accordion>
```

## Best Practices

**When to Use:**
- Large amount of information to show on a page
- Limited space to display content
- Grouping related information for predictability
- Short content like FAQs or paragraph details

**When Not to Use:**
- Critical information needed to move forward
- Content that all users must see
- Heavy content with images, videos (may slow page load)
- As the only method to show important information

**Content Guidelines:**
- Make entire header container selectable for larger touch target
- Use up/down chevron (don't use right chevron or plus/minus icons)
- Panel content should accurately describe what users will find
- Be consistent with layout and icon usage

**Responsive Design:**
- Flexible width from minimum 288px to max 1440px
- Allows 16px margins at minimum breakpoint (320px viewport)
- Follows reflow accessibility standard

**Icon Usage:**
- Use simple, well-known visual metaphors
- Position left of heading
- Consider localization and cultural meaning
- Maintain consistent identification throughout site
- Collapsed panels show outline icons, expanded show filled

**Panel Behavior:**
- Configure to allow single or multiple panels open
- When single panel mode, opening new panel auto-closes others
- For multiple mode, users must manually close each panel
- Entire panel header is clickable (not just icon or text)

## Advanced Usage

### Custom Label Overrides

By default `collapseLabel` is "Show Details" and `expandLabel` is "Hide Details". You can override these labels using the `labelOverrides` prop on `AccordionText`.

```tsx
<Accordion id="custom-labels">
  <AccordionText 
    id="panel1"
    heading="Click to see more details"
    labelOverrides={{
      collapsedLabel: 'View More',
      expandedLabel: 'View Less'
    }}
  >
    Expand
  </AccordionText>
  <AccordionContent aria-labelledby="panel1">
    Additional content here
  </AccordionContent>
</Accordion>
```

### Default Open Panels
```tsx
<Accordion id="default-open" defaultOpenPanelIds={['panel1', 'panel3']}>
  <AccordionPanel id="panel1" heading={<h3>Panel 1</h3>} />
  <AccordionContent aria-labelledby="panel1">Opens by default</AccordionContent>
  
  <AccordionPanel id="panel2" heading={<h3>Panel 2</h3>} />
  <AccordionContent aria-labelledby="panel2">Closed by default</AccordionContent>
  
  <AccordionPanel id="panel3" heading={<h3>Panel 3</h3>} />
  <AccordionContent aria-labelledby="panel3">Opens by default</AccordionContent>
</Accordion>
```

### With Toggle Handler
```tsx
function TrackedAccordion() {
  const handleToggle = (event, panelId) => {
    console.log(`Panel ${panelId} was toggled`);
  };
  
  return (
    <Accordion id="tracked" onAccordionToggle={handleToggle}>
      <AccordionPanel id="panel1" heading={<h3>Panel 1</h3>} />
      <AccordionContent aria-labelledby="panel1">Content</AccordionContent>
    </Accordion>
  );
}
```

## Related Components
- [Button](button.md) - For panel actions
- [Tabs](tabs.md) - Alternative for content organization
- [Modal](modal.md) - For focused content overlays