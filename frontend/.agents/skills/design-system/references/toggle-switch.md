# ToggleSwitch Component Reference
> AI agent-friendly reference for DLS ToggleSwitch component

## Quick Reference
ToggleSwitch allows users to toggle between two binary states (on/off) instantly without submission. Always has a default state. Use for system settings, preferences, and features that take immediate effect.

## Import
```tsx
import { ToggleSwitch } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<ToggleSwitch
  id="toggle"
  label="Text Alerts"
  hint="Enroll your mobile number to receive alerts"
  onText="On"
  offText="Off"
/>
```

## Props API

### ToggleSwitch
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier |
| label | string | Yes* | - | Visible label text |
| aria-labelledby | string | Yes* | - | ID of label element |
| hint | string | No | - | Helper text |
| onText | string | No | - | Text shown when on |
| offText | string | No | - | Text shown when off |
| checked | boolean | No | - | Checked state (controlled) |
| defaultChecked | boolean | No | `false` | Default checked state (uncontrolled) |
| iconOn | ReactNode | No | IconCheck | Custom icon for on state |
| iconOff | ReactNode | No | IconClose | Custom icon for off state |
| hideToggleIcon | boolean | No | `false` | Hides icon indicators |
| hideToggleStatus | boolean | No | `false` | Hides text indicators |
| showDivider | boolean | No | `false` | Shows divider after toggle if switch is in a list |
| isHintVisuallyHidden | boolean | No | `false` | Hides hint visually but still accessible to screen readers |
| onClick | `(event: MouseEvent<HTMLButtonElement>, checked: boolean) => void` | No | - | Click handler; `checked` is the NEW state (after click) |
| disabled | boolean | No | - | @deprecated use aria-disabled instead. Removes element from Accessibility Tree and prevents focus |
| aria-disabled | boolean \| `'true'` \| `'false'` | No | - | Accessible disabled state |
| aria-label | string | No | - | Accessible label (alternative to label prop) |
| aria-describedby | string | No | - | ID of description element |
| className | string | No | - | Additional CSS classes |

**\*Either `label` OR `aria-labelledby` must be provided** (at least one is required).

**Note:** ToggleSwitch extends `ButtonBaseProps` which extends `ComponentPropsWithRef<'button'>`, so it accepts all native button element props.

## Common Patterns

### Basic ToggleSwitch
```tsx
<ToggleSwitch
  id="toggle"
  label="Text Alerts"
  hint="Enroll your mobile number to receive account alerts"
  onText="On"
  offText="Off"
/>
```

### Default On State (Uncontrolled)
```tsx
<ToggleSwitch
  id="toggle"
  label="Fraud Protection"
  hint="Enable real-time fraud monitoring"
  onText="On"
  offText="Off"
  defaultChecked={true}
/>
```

### Controlled ToggleSwitch
```tsx
const [isEnabled, setIsEnabled] = useState(false);

<ToggleSwitch
  id="toggle"
  label="Dark Mode"
  onText="On"
  offText="Off"
  checked={isEnabled}
  onClick={(event, newState) => {
    setIsEnabled(newState);
  }}
/>
```

### List with Dividers
```tsx
<>
  <ToggleSwitch
    id="toggle-1"
    label="Email Notifications"
    hint="Receive updates via email"
    onText="On"
    offText="Off"
    showDivider={true}
  />
  <ToggleSwitch
    id="toggle-2"
    label="SMS Notifications"
    hint="Receive updates via text message"
    onText="On"
    offText="Off"
    showDivider={true}
  />
  <ToggleSwitch
    id="toggle-3"
    label="Push Notifications"
    hint="Receive updates on your device"
    onText="On"
    offText="Off"
  />
</>
```

### Custom Icons
```tsx
<ToggleSwitch
  id="toggle"
  label="Security Lock"
  onText="Locked"
  offText="Unlocked"
  iconOn={<IconLock />}
  iconOff={<IconUnlock />}
/>
```

### Without Indicators
```tsx
<ToggleSwitch
  id="toggle"
  label="Simple Toggle"
  hint="No status text or icons shown"
  hideToggleIcon={true}
  hideToggleStatus={true}
/>
```

### Disabled State
```tsx
<ToggleSwitch
  id="toggle"
  label="Unavailable Feature"
  hint="This feature is currently unavailable"
  onText="On"
  offText="Off"
  aria-disabled="true"
/>
```

### Using aria-labelledby Instead of label
```tsx
<div>
  <h3 id="alerts-heading">Alert Preferences</h3>
  <ToggleSwitch
    id="text-alerts"
    aria-labelledby="alerts-heading"
    hint="Receive notifications via text"
    onText="On"
    offText="Off"
  />
</div>
```

### With Click Handler
```tsx
<ToggleSwitch
  id="feature"
  label="Advanced Feature"
  onText="Enabled"
  offText="Disabled"
  onClick={(event, newState) => {
    console.log(`Feature is now ${newState ? 'enabled' : 'disabled'}`);
  }}
/>
```

## Accessibility Requirements

**Required:**
- Provide either a visible `label` or `aria-labelledby`
- Always provide a unique `id`
- Text indicators (on/off) are aria-hidden to prevent redundant announcements
- State is announced via `aria-checked` attribute
- Component uses `role="switch"` for proper screen reader support

**Recommended:**
- Use `hint` to provide additional context
- Use `aria-disabled="true"` instead of `disabled` when possible
- Keep labels clear and descriptive
- Ensure onText/offText are brief and clear

**Never:**
- Use disabled state when possible (provide informative alternative)
- Use generic labels like "Light/Dark" without context
- Use for choices requiring submission (use Checkbox instead)
- End labels with punctuation, colons, or commas
- Position label to the right of toggle

## Anti-Patterns

❌ **Wrong: Label with punctuation**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Text Alerts!" 
  onText="On" 
  offText="Off" 
/>
```

✅ **Correct: No ending punctuation**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Text Alerts" 
  onText="On" 
  offText="Off" 
/>
```

---

❌ **Wrong: Label on right side**
```tsx
<div style={{ display: 'flex' }}>
  <ToggleSwitch id="toggle" onText="On" offText="Off" />
  <div>Text Alerts</div>
</div>
```

✅ **Correct: Label on left (user reads first, then acts)**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Text Alerts" 
  onText="On" 
  offText="Off" 
/>
```

---

❌ **Wrong: Using for terms and conditions**
```tsx
<ToggleSwitch 
  id="agree" 
  label="Agree to Terms and Conditions?" 
  onText="Yes" 
  offText="No" 
/>
```

✅ **Correct: Use Checkbox for terms acceptance**
```tsx
<Checkbox 
  id="agree" 
  label="I have read and agree to Terms and Conditions" 
/>
```

---

❌ **Wrong: Using for opposing options (not binary)**
```tsx
<ToggleSwitch 
  id="view" 
  label="Select View" 
  onText="Map View" 
  offText="List View" 
/>
```

✅ **Correct: Use SegmentedControl for alternate views**
```tsx
<SegmentedControl defaultSelected="list">
  <SegmentedButton id="list">List View</SegmentedButton>
  <SegmentedButton id="map">Map View</SegmentedButton>
</SegmentedControl>
```

---

❌ **Wrong: Redundant text in indicators**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Security" 
  onText="Fraud Protection On" 
  offText="Fraud Protection Off" 
/>
```

✅ **Correct: Simple on/off indicators**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Fraud Protection" 
  onText="On" 
  offText="Off" 
/>
```

---

❌ **Wrong: Same icon for both states**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Feature" 
  iconOn={<IconCheck />}
  iconOff={<IconCheck />}
/>
```

✅ **Correct: Different, meaningful icons**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Feature" 
  iconOn={<IconCheck />}
  iconOff={<IconClose />}
/>
```

---

❌ **Wrong: No label provided**
```tsx
<ToggleSwitch 
  id="toggle" 
  onText="On" 
  offText="Off" 
/>
```

✅ **Correct: Always provide label**
```tsx
<ToggleSwitch 
  id="toggle" 
  label="Text Alerts"
  onText="On" 
  offText="Off" 
/>
```

## Best Practices

- Use for binary on/off states that take immediate effect
- Perfect for system settings, preferences, and features
- Always provide clear, descriptive labels
- Label positioned to the left of toggle control
- Avoid ending labels with punctuation, colons, or commas
- Text indicators should be brief (on/off, show/hide, etc.)
- Icon indicators should be simple, well-known metaphors (check/close)
- Consider localization when choosing icons
- Use consistent icons for the same meaning across the site
- Avoid disabled state when possible; provide informative alternative
- Text indicators are aria-hidden (state announced via aria-checked)
- When label is too long, it wraps to another line
- When stacked as list, toggle control is always aligned top
- Use `showDivider` for visual separation in lists
- Default icons: IconCheck (on), IconClose (off)

## Common Use Cases

**Use ToggleSwitch for:**
- Turning features on/off (e.g., "Text Alerts")
- Enabling/disabling system settings
- Showing/hiding content
- Activating/deactivating modes
- Immediate state changes without submission

**Never use ToggleSwitch for:**
- Selecting options from a list (use Radio instead)
- Selecting multiple items (use MultiSelect instead)
- Choices requiring submission (use Checkbox instead)
- Alternate views of content (use SegmentedControl instead)
- Terms and conditions acceptance (use Checkbox)

## Comparison with Other Selection Controls

| Feature | Radio | Checkbox | SegmentedControl | ToggleSwitch |
|---------|-------|----------|------------------|--------------|
| Choices | At least 2 | At least 1 | At least 2 | Only 2 (on/off) |
| Single selection only? | Yes | No | Yes | Yes |
| Can leave unselected? | Not ideal | Yes | No | No (has default) |
| Requires submission? | Typically yes | Typically yes | No | No |
| Primary use | Forms | Forms/selections | Alternate views | Settings/preferences |
| Error state? | Yes | Yes | Yes | No |



## Related Components

- **Checkbox** - For selections requiring submission
- **Radio** - For selecting one option from multiple
- **SegmentedControl** - For alternate views or related content
- **ButtonBase** - Used internally for toggle implementation
