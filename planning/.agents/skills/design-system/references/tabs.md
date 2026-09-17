# Tabs Component Reference

## Quick Reference
Tabs allow users to navigate between related views (tab panels) within the same context, organizing content into labeled sections.

## Import
```tsx
import { Tabs, TabList, Tab, TabPanel } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Tabs defaultSelectedTabId="home" id="basic-tabs">
  <TabList>
    <Tab id="home">Home</Tab>
    <Tab id="profile">Profile</Tab>
    <Tab id="settings">Settings</Tab>
  </TabList>
  <TabPanel aria-labelledby="home">Home content</TabPanel>
  <TabPanel aria-labelledby="profile">Profile content</TabPanel>
  <TabPanel aria-labelledby="settings">Settings content</TabPanel>
</Tabs>
```

## Props API

### Tabs Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | ReactNode | - | Yes | TabList and TabPanel components |
| defaultSelectedTabId | string | - | No | Initial selected tab (uncontrolled) |
| selectedTabId | string | - | No | Current selected tab (controlled) |
| activationType | `'automatic'` \| `'manual'` | `'automatic'` | No | Tab activation on arrow key navigation |
| iconPosition | `'start'` \| `'top'` | `'start'` | No | Icon placement relative to tab label |
| onSelectedTabIdChange | `(event: KeyboardEvent<HTMLButtonElement> \| MouseEvent<HTMLButtonElement>, id: string) => void` | - | No | Callback when tab selection changes |
| showInContainer | boolean | `true` | No | If true, the tabs container has padding around the tab list and tab panel |
| id | string | - | No | Optional unique identifier for the tabs container |
| className | string | - | No | Additional CSS classes |

**Note:** Tabs extends `ComponentPropsWithoutRef<'div'>`, so it accepts all native div element props.

### TabList Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | ReactNode | - | Yes | Tab components |
| labelOverrides | TabsLabelOverrides | - | No | Custom labels for scroll buttons |
| previousScrollButtonProps | IconButtonOtherProps | - | No | Props to be spread onto the previous scroll button |
| nextScrollButtonProps | IconButtonOtherProps | - | No | Props to be spread onto the next scroll button |
| className | string | - | No | Additional CSS classes |

**TabsLabelOverrides:**
```typescript
{
  previousButtonScreenReaderLabel: string; // Default: 'select previous tab'
  nextButtonScreenReaderLabel: string;     // Default: 'select next tab'
}
```

### Tab Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| id | string | - | Yes | Unique identifier matching TabPanel aria-labelledby |
| children | ReactNode | - | Yes | Tab label text |
| icon | ReactNode | - | No | Icon displayed next to the tab label |
| onClick | MouseEventHandler | - | No | Click handler |
| onKeyDown | KeyboardEventHandler | - | No | Key down handler |
| className | string | - | No | Additional CSS classes |

**Note:** Tab extends `ComponentPropsWithoutRef<'button'>`, so it accepts all native button element props.

### TabPanel Props
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| aria-labelledby | string | - | Yes | ID of corresponding Tab |
| children | ReactNode | - | Yes | Panel content |
| title | ReactElement | - | No | Title element (e.g., <h2>) |
| subtitle | ReactElement | - | No | Subtitle element (e.g., <h3>) |
| className | string | - | No | Additional CSS classes |

**Note:** TabPanel extends `Omit<ComponentPropsWithoutRef<'div'>, 'title'>` (title is typed as ReactElement, not string).

## Common Patterns

### Automatic Activation (Default)
```tsx
<Tabs activationType="automatic" defaultSelectedTabId="fruit" id="food-tabs">
  <TabList>
    <Tab id="fruit">Fruit</Tab>
    <Tab id="vegetable">Vegetable</Tab>
    <Tab id="protein">Protein</Tab>
  </TabList>
  <TabPanel aria-labelledby="fruit" title={<h2>Fruits</h2>}>
    Apple, Banana, Orange
  </TabPanel>
  <TabPanel aria-labelledby="vegetable" title={<h2>Vegetables</h2>}>
    Carrot, Broccoli, Spinach
  </TabPanel>
  <TabPanel aria-labelledby="protein" title={<h2>Proteins</h2>}>
    Chicken, Tofu, Beans
  </TabPanel>
</Tabs>
```

### Manual Activation
```tsx
<Tabs activationType="manual" defaultSelectedTabId="account" id="settings-tabs">
  <TabList>
    <Tab id="account">Account</Tab>
    <Tab id="privacy">Privacy</Tab>
    <Tab id="security">Security</Tab>
  </TabList>
  <TabPanel aria-labelledby="account">Account settings</TabPanel>
  <TabPanel aria-labelledby="privacy">Privacy settings</TabPanel>
  <TabPanel aria-labelledby="security">Security settings</TabPanel>
</Tabs>
```

### With Icons
```tsx
<Tabs defaultSelectedTabId="dashboard" id="icon-tabs" iconPosition="start">
  <TabList>
    <Tab id="dashboard" icon={<IconHome />}>Dashboard</Tab>
    <Tab id="reports" icon={<IconBarChart />}>Reports</Tab>
    <Tab id="alerts" icon={<IconAlert />}>Alerts</Tab>
  </TabList>
  <TabPanel aria-labelledby="dashboard">Dashboard content</TabPanel>
  <TabPanel aria-labelledby="reports">Reports content</TabPanel>
  <TabPanel aria-labelledby="alerts">Alerts content</TabPanel>
</Tabs>
```

### Icons Positioned on Top
```tsx
<Tabs defaultSelectedTabId="home" id="top-icon-tabs" iconPosition="top">
  <TabList>
    <Tab id="home" icon={<IconHome />}>Home</Tab>
    <Tab id="account" icon={<IconAccount />}>Account</Tab>
    <Tab id="settings" icon={<IconSetting />}>Settings</Tab>
  </TabList>
  <TabPanel aria-labelledby="home">Home content</TabPanel>
  <TabPanel aria-labelledby="account">Account content</TabPanel>
  <TabPanel aria-labelledby="settings">Settings content</TabPanel>
</Tabs>
```

### Controlled Tabs
```tsx
const [selectedTab, setSelectedTab] = useState('tab1');

<Tabs 
  selectedTabId={selectedTab}
  onSelectedTabIdChange={(event, id) => setSelectedTab(id)}
  id="controlled-tabs"
>
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel aria-labelledby="tab1">Content 1</TabPanel>
  <TabPanel aria-labelledby="tab2">Content 2</TabPanel>
</Tabs>
```

### With Many Tabs (Overflow Handling)
```tsx
<Tabs activationType="automatic" defaultSelectedTabId="five" id="overflow-tabs">
  <TabList>
    <Tab id="one">One</Tab>
    <Tab id="two">Two</Tab>
    <Tab id="three">Three</Tab>
    <Tab id="four">Four</Tab>
    <Tab id="five">Five</Tab>
    <Tab id="six">Six</Tab>
    <Tab id="seven">Seven</Tab>
    <Tab id="eight">Eight</Tab>
  </TabList>
  <TabPanel aria-labelledby="one">Content 1</TabPanel>
  <TabPanel aria-labelledby="two">Content 2</TabPanel>
  <TabPanel aria-labelledby="three">Content 3</TabPanel>
  <TabPanel aria-labelledby="four">Content 4</TabPanel>
  <TabPanel aria-labelledby="five">Content 5</TabPanel>
  <TabPanel aria-labelledby="six">Content 6</TabPanel>
  <TabPanel aria-labelledby="seven">Content 7</TabPanel>
  <TabPanel aria-labelledby="eight">Content 8</TabPanel>
</Tabs>
```

### With Subtitle
```tsx
<Tabs defaultSelectedTabId="summary" id="tabs-with-subtitle">
  <TabList>
    <Tab id="summary">Summary</Tab>
    <Tab id="details">Details</Tab>
  </TabList>
  <TabPanel 
    aria-labelledby="summary" 
    title={<h2>Transaction Summary</h2>}
    subtitle={<h3>Last 30 days</h3>}
  >
    Summary content
  </TabPanel>
  <TabPanel 
    aria-labelledby="details"
    title={<h2>Transaction Details</h2>}
  >
    Details content
  </TabPanel>
</Tabs>
```

### Without Container Padding
```tsx
<Tabs defaultSelectedTabId="tab1" id="no-padding-tabs" showInContainer={false}>
  <TabList>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel aria-labelledby="tab1">Content without padding</TabPanel>
  <TabPanel aria-labelledby="tab2">More content</TabPanel>
</Tabs>
```

## Accessibility Requirements

### Required
- Each Tab must have a unique `id`
- Each TabPanel's `aria-labelledby` must match a Tab's `id`
- Tab labels must be clear and descriptive
- Keyboard navigation: Arrow keys move focus, Enter/Space activate (manual mode)
- Automatic activation: Tab activates on arrow key press
- Manual activation: Tab activates only on Enter/Space

### Recommended
- Use 3-9 tabs total (minimum 3, maximum 9)
- Keep tab labels to 1-2 words
- Use title case for labels
- First panel should be most relevant for users
- Avoid deep nesting of content within tabs

### Avoid
- Don't rely solely on color to indicate selected tab
- Don't nest tab groups within tab groups
- Don't hide critical functions/forms in tabs
- Don't use tabs for unrelated content
- Don't truncate tab labels

## Anti-Patterns

❌ **Don't use for navigation to different pages**
```tsx
// Tabs change context within same page, not navigation
<Tab id="home" onClick={() => navigate('/home')}>Home</Tab>
<Tab id="products" onClick={() => navigate('/products')}>Products</Tab>
```

✅ **Use navigation components for page navigation**
```tsx
<Navigation>
  <NavigationItem href="/home">Home</NavigationItem>
  <NavigationItem href="/products">Products</NavigationItem>
</Navigation>
```

---

❌ **Don't nest tabs**
```tsx
<Tabs>
  <TabPanel>
    <Tabs> {/* Don't do this */}
      <TabList>...</TabList>
    </Tabs>
  </TabPanel>
</Tabs>
```

---

❌ **Don't use for progress indication**
```tsx
// Use MultiStepTracker instead
<Tab id="step1">Step 1</Tab>
<Tab id="step2">Step 2</Tab>
```

✅ **Use MultiStepTracker for progress**
```tsx
<MultiStepTracker currentStep={2} totalSteps={3} />
```

---

❌ **Don't put critical forms in tabs**
```tsx
// Important functions should be prominent, not hidden
<TabPanel aria-labelledby="payment">
  <PaymentForm /> {/* Avoid */}
</TabPanel>
```

---

❌ **Don't mismatch Tab id and TabPanel aria-labelledby**
```tsx
<Tab id="profile">Profile</Tab>
{/* ... */}
<TabPanel aria-labelledby="account"> {/* Wrong! Should be "profile" */}
  Content
</TabPanel>
```

✅ **Always match Tab id and TabPanel aria-labelledby**
```tsx
<Tab id="profile">Profile</Tab>
{/* ... */}
<TabPanel aria-labelledby="profile">
  Profile content
</TabPanel>
```

## Best Practices

- Use tabs to chunk related content into predictable sections
- Aim for 3-5 tabs (minimum 3, maximum 9)
- Labels should clearly communicate panel content
- Use short, scannable labels (1-2 words, title case)
- Don't use punctuation or sentences in labels
- First panel should contain most commonly accessed content
- Users shouldn't need to view all panels simultaneously
- Tabs automatically handle overflow with scroll buttons
- Selected tab has visual indicator (underline/highlight)
- Hidden panels use `hidden` attribute (not removed from DOM)
- Overflow buttons appear when tabs exceed container width
- Icon position can be `start` (left) or `top` (above text)
- Use automatic activation (default) for most cases
- Use manual activation when tab panels load slowly or have side effects

## Advanced Usage

### Custom Label Overrides
```tsx
<Tabs defaultSelectedTabId="tab1" id="custom-labels">
  <TabList labelOverrides={{
    previousButtonScreenReaderLabel: 'Previous tab',
    nextButtonScreenReaderLabel: 'Next tab'
  }}>
    <Tab id="tab1">Tab 1</Tab>
    <Tab id="tab2">Tab 2</Tab>
    <Tab id="tab3">Tab 3</Tab>
  </TabList>
  <TabPanel aria-labelledby="tab1">Content 1</TabPanel>
  <TabPanel aria-labelledby="tab2">Content 2</TabPanel>
  <TabPanel aria-labelledby="tab3">Content 3</TabPanel>
</Tabs>
```

### Custom Scroll Button Props
```tsx
<Tabs defaultSelectedTabId="tab1" id="custom-scroll-buttons">
  <TabList 
    previousScrollButtonProps={{ 'aria-label': 'Go to previous tab' }}
    nextScrollButtonProps={{ 'aria-label': 'Go to next tab' }}
  >
    {/* Many tabs... */}
  </TabList>
  {/* TabPanels... */}
</Tabs>
```

### Keyboard Interactions
- **Arrow Left/Right**: Navigate between tabs
- **Home**: Jump to first tab
- **End**: Jump to last tab
- **Enter/Space**: Activate focused tab (manual mode only)
- Automatic mode: Tab activates immediately on arrow key
- Manual mode: Tab activates only on Enter/Space

### Responsive Behavior
- Tabs work at all breakpoints
- Overflow buttons appear when tabs exceed container width
- Scroll buttons navigate left/right through overflowed tabs
- Active tab automatically scrolls into view
- `showInContainer` prop controls whether padding is applied

## Related Components

- [Accordion](accordion.md) - For collapsible sections (use for sentences/FAQ)
- [MultiStepTracker](multi-step-tracker.md) - For showing progress through steps
- [Navigation](../recipes/navigation.md) - For primary site navigation
- [SegmentedControl](segmented-control.md) - For simpler view switching (2-3 options)
