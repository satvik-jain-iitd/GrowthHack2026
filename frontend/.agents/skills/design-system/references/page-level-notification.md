# PageLevelNotification Component Reference
> AI agent-friendly reference for DLS PageLevelNotification component

## Quick Reference
Notifications are alerts that succinctly message relevant information. They appear at the page level (below navigation, above content) and can be informational, success, caution, or critical. They can be permanent or dismissible with optional action links.

## Import
```tsx
import { PageLevelNotification } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<PageLevelNotification 
  headingSlot={<h2>Heading</h2>}
>
  <p>Your message content goes here.</p>
</PageLevelNotification>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| type | "success" \| "caution" \| "info" \| "critical" | No | info | Determines icon and color of notification. "success", "caution", "info", or "critical" |
| children | ReactNode | No | - | Contents of message body |
| isDismissible | boolean | No | true | If false, hides the close button |
| aria-live | "off" \| "assertive" \| "polite" | No | - | Set aria-live politeness level to "assertive", "polite", or "off" |
| headingSlot | ReactNode | No | - | Text content of heading |
| actionSlot | ReactNode | No | - | Contents of action slot at the bottom of notification. Intended for links and buttons |
| actionSlotOrientation | "horizontal" \| "vertical" | No | horizontal | Sets the orientation of the contents of the action slot. "horizontal" or "vertical" The orientation sets a flex direction and margins on each child in the action slot |
| icon | ReactNode | No | - | Custom icon displayed in notification |
| defaultShow | boolean | No | true | If false, hides the contents inside aria-live container but keeps aria-live container mounted on page |
| onDismiss | MouseEventHandler<HTMLButtonElement> | No | () => {} | Callback function when the notification is dismissed |
| isIconFilled | boolean | No | true | If false, shows unfilled icon |
| id | string | No | - | id of element with notification message contents |
| role | "log" \| "status" \| "alert" \| "progressbar" \| "marquee" \| "timer" | No | - | The aria role attribute of the element |
| closeButtonProps | Object | No | - | Props to spread to the close button |
| variant | "default" \| "compact" | No | default | Visual variant of the notification. "default" renders the headingSlot, message body, and actionSlot each on their own line. "compact" hides the headingSlot and places the actionSlot inline with the message body. |
| labelOverrides | PageLevelNotificationLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |


## Common Patterns

### Information Notification
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>System Maintenance</h2>}
>
  <p>
    Our systems will undergo scheduled maintenance on Saturday, 
    February 22nd from 2:00 AM to 6:00 AM EST.
  </p>
</PageLevelNotification>
```

### Success Notification
```tsx
<PageLevelNotification 
  type="success"
  headingSlot={<h2>Application Submitted</h2>}
>
  <p>
    Your application has been successfully submitted. 
    You'll receive a confirmation email within 24 hours.
  </p>
</PageLevelNotification>
```

### Caution Notification
```tsx
<PageLevelNotification 
  type="caution"
  headingSlot={<h2>Action Required</h2>}
>
  <p>
    Your payment method expires soon. Please update your 
    information to avoid service interruption.
  </p>
</PageLevelNotification>
```

### Critical (Error) Notification
```tsx
<PageLevelNotification 
  type="critical"
  headingSlot={<h2>Payment Failed</h2>}
  isDismissible={false}
>
  <p>
    We were unable to process your payment. Please verify your 
    payment method and try again.
  </p>
</PageLevelNotification>
```

### With Action Links (Horizontal)
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>New Features Available</h2>}
  actionSlot={
    <>
      <Link showIcon={false} href="/features">
        Learn More
      </Link>
      <Link showIcon={false} href="/settings">
        Update Settings
      </Link>
    </>
  }
>
  <p>We've added new features to enhance your experience.</p>
</PageLevelNotification>
```

### With Action Links (Vertical)
```tsx
<PageLevelNotification 
  type="caution"
  headingSlot={<h2>Security Alert</h2>}
  actionSlot={
    <>
      <Link showIcon={false} href="/security">
        Review Activity
      </Link>
      <Link showIcon={false} href="/settings/password">
        Change Password
      </Link>
    </>
  }
  actionSlotOrientation="vertical"
>
  <p>We detected unusual activity on your account.</p>
</PageLevelNotification>
```

### With Inline Link in Content
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>Privacy Policy Updated</h2>}
>
  <p>
    We've updated our <a href="/privacy">privacy policy</a> to 
    better protect your information.
  </p>
</PageLevelNotification>
```

### Non-Dismissible Notification
```tsx
<PageLevelNotification 
  type="critical"
  headingSlot={<h2>Network Error</h2>}
  isDismissible={false}
>
  <p>
    Connection lost. Please check your internet connection and 
    reload the page.
  </p>
</PageLevelNotification>
```

### Controlled Visibility
```tsx
const [showNotification, setShowNotification] = useState(true);

<PageLevelNotification 
  type="success"
  headingSlot={<h2>Changes Saved</h2>}
  defaultShow={showNotification}
  onDismiss={() => setShowNotification(false)}
>
  <p>Your changes have been saved successfully.</p>
</PageLevelNotification>
```

### Custom Icon
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>Notification</h2>}
  icon={<IconAlert />}
>
  <p>You have 3 new notifications.</p>
</PageLevelNotification>
```

### Form Error Summary
```tsx
<PageLevelNotification 
  type="critical"
  headingSlot={<h2>Form Errors</h2>}
  isDismissible={false}
>
  <p>Please correct the following errors:</p>
  <ul>
    <li>Email address is required</li>
    <li>Password must be at least 8 characters</li>
    <li>Terms and conditions must be accepted</li>
  </ul>
</PageLevelNotification>
```

## Notification Types

| Type | Description | Use Case | Default Icon |
|------|-------------|----------|--------------|
| **info** | Informational messages | Helpful, non-critical information related to content | IconInfo |
| **success** | Success messages | Successful completion of an action with optional next steps | IconSuccess |
| **caution** | Warning messages | Requires attention but not a critical blocker | IconWarning |
| **critical** | Error messages | Negative messages needing immediate attention and resolution | IconWarning |

## Accessibility Requirements

**Required:**
- Use `role="alert"` for time-sensitive, critical messages (default for `aria-live="assertive"`)
- Use `role="status"` for non-critical notifications (default for `aria-live="polite"`)
- Always provide a heading via `headingSlot` for better context
- Use `aria-live="polite"` for non-critical notifications
- Use `aria-live="assertive"` for urgent, time-sensitive messages
- Provide descriptive `closeButtonScreenReaderLabel` if customizing
- Do not use notifications for content that requires user input (use forms instead)

**Recommended:**
- Use h2-h6 for `headingSlot` (not h1)
- Place notifications directly below navigation, above all content
- Keep messages concise and actionable
- Provide clear next steps when applicable
- Use non-dismissible (`isDismissible={false}`) for critical errors requiring resolution

**Avoid:**
- Don't use notifications with timeouts (no automatic dismissal)
- Don't animate notification dismissal (causes visual distraction)
- Don't use notifications as the only means of conveying critical information
- Don't use multiple notifications at once (strive for one at a time)
- Don't use ALL CAPS in message text
- Don't use vague language like "Something went wrong"

## Anti-Patterns

❌ **Wrong: No heading**
```tsx
<PageLevelNotification type="info">
  <p>Your session will expire in 5 minutes.</p>
</PageLevelNotification>
```
✅ **Correct: Include heading for context**
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>Session Expiring Soon</h2>}
>
  <p>Your session will expire in 5 minutes.</p>
</PageLevelNotification>
```

❌ **Wrong: Dismissible critical error**
```tsx
<PageLevelNotification type="critical">
  <p>Payment failed. Card declined.</p>
</PageLevelNotification>
```
✅ **Correct: Non-dismissible for errors requiring action**
```tsx
<PageLevelNotification 
  type="critical"
  headingSlot={<h2>Payment Failed</h2>}
  isDismissible={false}
>
  <p>Your card was declined. Please update your payment method.</p>
</PageLevelNotification>
```

❌ **Wrong: Vague error message**
```tsx
<PageLevelNotification type="critical">
  <p>Something went wrong. Please try again.</p>
</PageLevelNotification>
```
✅ **Correct: Specific, actionable message**
```tsx
<PageLevelNotification 
  type="critical"
  headingSlot={<h2>Unable to Load Account</h2>}
>
  <p>
    We were unable to load your account information. 
    Please refresh the page or try again later.
  </p>
</PageLevelNotification>
```

❌ **Wrong: Using for actions**
```tsx
<PageLevelNotification type="info">
  <Button>Delete Account</Button>
</PageLevelNotification>
```
✅ **Correct: Use buttons directly on page, not in notifications**
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>Account Settings</h2>}
  actionSlot={
    <Link href="/settings/delete">Manage Account</Link>
  }
>
  <p>Visit account settings to manage your preferences.</p>
</PageLevelNotification>
```

❌ **Wrong: Multiple notifications with different styles**
```tsx
<PageLevelNotification type="info">...</PageLevelNotification>
<PageLevelNotification type="success">...</PageLevelNotification>
<PageLevelNotification type="caution">...</PageLevelNotification>
```
✅ **Correct: One notification at a time**
```tsx
<PageLevelNotification 
  type="info"
  headingSlot={<h2>Multiple Updates</h2>}
>
  <ul>
    <li>Profile updated successfully</li>
    <li>New features available</li>
    <li>Maintenance scheduled for next week</li>
  </ul>
</PageLevelNotification>
```

## Best Practices

- **Placement:** Always place below navigation and above all other page content
- **One at a time:** Strive to show only one notification at a time
- **Message tone:**
  - Get straight to the point with important information first
  - Use 8th grade reading level (13-14 year old)
  - Write in conversational tone (use "we" or "us" instead of "American Express")
  - Focus on solutions, not blame
  - End messages with a period
- **Error messages:**
  - Clearly identify the problem
  - Provide actionable solutions
  - Avoid technical jargon
  - Don't apologize excessively
  - Own mistakes and be proactive
- **Dismissibility:**
  - Use `isDismissible={true}` (default) for informational/success messages
  - Use `isDismissible={false}` for critical errors requiring user action
  - Never use automatic timeouts
  - Never animate dismissal (causes reflow distraction)
- **Action links:**
  - Use Link components, not Buttons
  - Keep to 2-3 actions maximum
  - Use `horizontal` orientation for 2 or fewer actions
  - Use `vertical` orientation for 3+ actions or long link text
- **Responsive:** Horizontal padding matches grid gutter sizing at each breakpoint
- **Interface language:** Use device-agnostic terms like "select" instead of "click"

## Writing Guidelines

**Do:**
- Use the most appropriate notification type (info, success, caution, critical)
- Make users feel supported
- Make next actions easy to understand
- Use interface-agnostic language ("select" not "click")
- Avoid directional language ("select Submit button" not "click red button below")
- Provide error summaries in forms (use page notification + component notifications)

**Don't:**
- Be verbose or waste time with unnecessary details
- Make users guess what the error is
- Hide key information in long paragraphs
- Use curt, threatening, or accusatory language
- Make generalizations
- Use "American Express" (use "we"/"us" instead)

## Related Components
- [ComponentLevelNotification](component-level-notification.md) - For form field errors
- [Modal](modal.md) - For actions requiring immediate user interaction
- [Tooltip](tooltip.md) - For supplemental, non-critical information
