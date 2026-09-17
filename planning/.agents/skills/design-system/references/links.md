# Links Component Reference
> AI agent-friendly reference for DLS Links component

## Quick Reference
Links navigate users to different pages, sections, or external resources. Five variants available: Link (standalone), BackLink (previous page), LinkOut (external), LinksList (grouped links), and CallToAction (prominent action links). Always blue with visual signifiers (chevron/underline).

## Import
```tsx
import { 
  Link, 
  BackLink, 
  LinkOut, 
  LinksList,
  CallToAction 
} from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
// Standalone Link
<Link href="/account">View Account Details</Link>

// Back Link
<BackLink href="/previous">Back to Previous Page</BackLink>

// External Link
<LinkOut href="https://example.com">Visit External Site</LinkOut>

// Links List
<LinksList aria-label="Quick Links">
  <Link href="/link1">Link One</Link>
  <Link href="/link2">Link Two</Link>
</LinksList>

// Call to Action
<CallToAction href="/apply">Apply Now</CallToAction>
```

## Props API

**Link Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | No | '#' | Link destination URL |
| children | ReactNode | Yes | - | Link text (should be descriptive) |
| isInline | boolean | No | false | Whether link is inline with text |
| icon | ReactElement | No | - | Custom icon (replaces chevron) |
| onClick | (event: MouseEvent) => void | No | - | Click handler |
| asChild | boolean | No | false | Render as Slot for composition |
| className | string | No | - | Additional CSS classes |
| target | '_blank' \| '_self' \| '_parent' \| '_top' | No | - | Link target |
| rel | string | No | - | Link relationship (auto-set for `target="_blank"`) |
| aria-describedby | string | No | - | ID of element that describes link (for accessibility) |

**BackLink Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | No | '#' | Link destination URL |
| children | ReactNode | Yes | - | Link text (describe destination, not just "Back") |
| icon | ReactElement | No | - | Custom icon (additional to chevron) |
| onClick | (event: MouseEvent) => void | No | - | Click handler |
| asChild | boolean | No | false | Render as Slot for composition |
| className | string | No | - | Additional CSS classes |
| aria-describedby | string | No | - | ID of element that describes link (for accessibility) |

**LinkOut Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | No | '#' | External URL |
| children | ReactNode | Yes | - | Link text |
| icon | ReactElement | No | - | Custom icon (additional to link-out icon) |
| isInline | boolean | No | false | Whether link is inline with text |
| onClick | (event: MouseEvent) => void | No | - | Click handler |
| asChild | boolean | No | false | Render as Slot for composition |
| className | string | No | - | Additional CSS classes |
| target | string | No | - | Link target. Recommended: use `_blank` for external links (not set by default) |
| aria-describedby | string | No | - | ID of element that describes link (for accessibility) |

**LinksList Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactElement<LinkProps>[] | Yes | - | Link components |
| isNavigation | boolean | No | true | Whether list is for navigation (renders as `<nav>`) |
| orientation | 'vertical' \| 'horizontal' | No | 'vertical' | Layout direction |
| variant | 'default' \| 'minimal' \| 'underline' | No | 'default' | Visual style variant |
| hasDividers | boolean | No | false | Show dividers between links |
| headingSlot | ReactNode | No | - | Optional heading for navigation. When provided with `isNavigation={true}`, use `aria-labelledby` to reference its `id`. Cannot be used when `isNavigation={false}`. |
| aria-label | string | Conditional | - | Required if `isNavigation={true}` and no `aria-labelledby` |
| aria-labelledby | string | Conditional | - | Reference to heading id (alternative to `aria-label`) |
| className | string | No | - | Additional CSS classes |

**CallToAction Props**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| href | string | No | - | Link destination URL |
| children | ReactNode | Yes | - | Link text |
| variant | 'primary' \| 'secondary' | No | 'primary' | Visual prominence |
| icon | ReactElement | No | - | Custom icon (replaces chevron) |
| hasChevron | boolean | No | true | Whether to show the chevron icon |
| onClick | (event: MouseEvent) => void | No | - | Click handler |
| asChild | boolean | No | false | Render as Slot for composition |
| className | string | No | - | Additional CSS classes |
| aria-describedby | string | No | - | ID of element that describes link (for accessibility) |

## Common Patterns

### Standalone Link (Navigating to Page)
```tsx
<Link href="/account/settings">Account Settings</Link>
```

### Inline Link (Within Paragraph)
```tsx
<p>
  Read our <Link isInline href="/terms">terms and conditions</Link> for 
  more information.
</p>
```

### Link with Custom Icon
```tsx
<Link href="/home" icon={<IconHome />}>
  Return to Homepage
</Link>
```

### Link with asChild pattern
```tsx
import { Link as RouterLink } from '@americanexpress/one-app-router';

<Link asChild={true}>
  <RouterLink to="/products">
    Product List
  </RouterLink>
</Link>
```

### Back Link to Specific Page
```tsx
<BackLink href="/products">Back to Product List</BackLink>
```

### Back Link with Custom Icon
```tsx
<BackLink href="/dashboard" icon={<IconDashboard />}>
  Dashboard
</BackLink>
```

### External Link
```tsx
<LinkOut 
  href="https://www.example.com" 
  target="_blank"
  rel="noopener noreferrer"
>
  Visit External Website
</LinkOut>
```

### Inline External Link
```tsx
<p>
  For more details, visit <LinkOut isInline href="https://example.com">
    our partner site
  </LinkOut>.
</p>
```

### Inline External Link with Accessible New Window Announcement

```tsx
<Link asChild={true} isInline={true}>
  <a href="/products" target="_blank" rel="noopener noreferrer">
    <span className="margin-1-r">Products</span>
    <IconLinkOut size="sm" title="opens in new window" />
  </a>
</Link>
```

### External Link to PDF
```tsx
<LinkOut href="/documents/terms.pdf" target="_blank">
  Download Terms and Conditions (PDF)
</LinkOut>
```

### Links List (Navigation)
```tsx
<LinksList 
  aria-labelledby="quick-links-heading"
  headingSlot={
    <h2 id="quick-links-heading">Quick Links</h2>
  }
>
  <Link href="/account">Account Overview</Link>
  <Link href="/statements">View Statements</Link>
  <Link href="/rewards">Rewards Program</Link>
  <Link href="/support">Help & Support</Link>
</LinksList>
```

### Links List (Horizontal)
```tsx
<LinksList 
  orientation="horizontal"
  aria-label="Footer Links"
>
  <Link href="/privacy">Privacy Policy</Link>
  <Link href="/terms">Terms of Service</Link>
  <Link href="/contact">Contact Us</Link>
</LinksList>
```

### Links List (Minimal Variant)
```tsx
<LinksList 
  variant="minimal"
  aria-label="Related Pages"
>
  <Link href="/page1">Related Page 1</Link>
  <Link href="/page2">Related Page 2</Link>
  <Link href="/page3">Related Page 3</Link>
</LinksList>
```

### Links List (With Dividers)
```tsx
<LinksList 
  hasDividers
  aria-label="Main Navigation"
>
  <Link href="/products">Products</Link>
  <Link href="/services">Services</Link>
  <Link href="/about">About Us</Link>
</LinksList>
```

### Call to Action (Primary)
```tsx
<CallToAction variant="primary" href="/apply">
  Apply for Card
</CallToAction>
```

### Call to Action (Secondary)
```tsx
<CallToAction variant="secondary" href="/learn-more">
  Learn More About Benefits
</CallToAction>
```

### Call to Action Without Chevron
```tsx
<CallToAction variant="primary" href="/apply" hasChevron={false}>
  Apply Now
</CallToAction>
```

### Call to Action with Custom Icon
```tsx
<CallToAction variant="primary" href="/home" icon={<IconHome />}>
  Return to Homepage
</CallToAction>
```

### Non-Navigation Links List
```tsx
<LinksList isNavigation={false}>
  <Link href="/doc1.pdf">Download Document 1</Link>
  <Link href="/doc2.pdf">Download Document 2</Link>
</LinksList>
```

## Link Variants

| Variant | Description | Visual Indicator | Use Case |
|---------|-------------|------------------|----------|
| **Link** | Standard standalone link | Right chevron (RTL: left) | Navigation to internal pages, actions |
| **BackLink** | Navigate to previous page | Left chevron (RTL: right) + optional icon | Multi-page journeys, breadcrumb-style navigation |
| **LinkOut** | External navigation | Link-out icon (top-right arrow) | External websites, PDFs, partner platforms |
| **LinksList** | Grouped links | Chevrons on each link | Navigation menus, related links, footer |
| **CallToAction** | Prominent action link | Right chevron, styled like button | Primary/secondary actions, conversions |

## Accessibility Requirements

**Required:**
- Link text must be descriptive and make sense out of context
- Never use "click here", "learn more", or "link" as standalone text
- Links must be visually distinct from surrounding text (color + underline/chevron)
- Maintain 3:1 contrast ratio with background
- Minimum 44x44px target size for standalone links
- External links should indicate they open new window/tab in text or label
- `LinksList` with `isNavigation={true}` requires `aria-label` or `aria-labelledby`

**Recommended:**
- Put important information first in link text
- Use sentence case (not ALL CAPS) for readability
- For external links, include domain in brackets: "Log In (example.com)"
- Open external links in new tab (`target="_blank"`) to preserve context
- Include `rel="noopener noreferrer"` for `target="_blank"` links (security)
- Use `isInline` for links within paragraphs
- Use standalone links for buttons/calls-to-action outside paragraphs

**Avoid:**
- Don't use links for actions (use Button for delete, submit, etc.)
- Don't style buttons to look like links
- Don't use URLs as link text
- Don't rely only on color to identify links
- Don't use vague text like "click here" or "read more"
- Don't give different labels to links serving same purpose
- Don't use BackLink with generic "Back" label (describe destination)

## Anti-Patterns

❌ **Wrong: Vague link text**
```tsx
<Link href="/terms">Click here</Link>
<Link href="/features">Learn more</Link>
```
✅ **Correct: Descriptive link text**
```tsx
<Link href="/terms">Read Terms and Conditions</Link>
<Link href="/features">Explore Premium Features</Link>
```

❌ **Wrong: URL as link text**
```tsx
<Link href="https://www.example.com/privacy">
  https://www.example.com/privacy
</Link>
```
✅ **Correct: Descriptive text with domain indicator**
```tsx
<Link href="https://www.example.com/privacy">
  Privacy Policy (example.com)
</Link>
```

❌ **Wrong: Generic "Back" label**
```tsx
<BackLink href="/previous">Back</BackLink>
```
✅ **Correct: Descriptive destination**
```tsx
<BackLink href="/products">Back to Product List</BackLink>
```

❌ **Wrong: Using link for action**
```tsx
<Link onClick={handleDelete}>Delete Account</Link>
```
✅ **Correct: Use button for actions**
```tsx
<Button variant="tertiary" onClick={handleDelete}>
  Delete Account
</Button>
```

❌ **Wrong: External link without indication**
```tsx
<Link href="https://external.com">
  Visit Partner Site
</Link>
```
✅ **Correct: Use LinkOut for external links**
```tsx
<LinkOut href="https://external.com" target="_blank">
  Visit Partner Site
</LinkOut>
```

❌ **Wrong: Navigation LinksList without label**
```tsx
<LinksList isNavigation={true}>
  <Link href="/link1">Link 1</Link>
  <Link href="/link2">Link 2</Link>
</LinksList>
```
✅ **Correct: Provide accessible label**
```tsx
<LinksList 
  isNavigation={true}
  aria-label="Site Navigation"
>
  <Link href="/link1">Products</Link>
  <Link href="/link2">Services</Link>
</LinksList>
```

## Best Practices

- **Navigation vs Actions:**
  - Use Link for navigating to pages
  - Use Button for actions (submit, delete, open modal)
  - Links should always navigate (not trigger actions)
- **Link text guidelines:**
  - Start with keywords (most important information first)
  - 2-6 words ideal, be specific
  - Make sense when read out of context
  - "View Account Details" not "Click Here"
  - "Update Marketing Preferences (Settings)" puts important info first
- **External links:**
  - Always use `LinkOut` component
  - Open in new tab (`target="_blank"`)
  - Include domain name in brackets or separated by "|"
  - Example: "Log In | American Express US"
  - Include security attributes: `rel="noopener noreferrer"`
- **BackLink usage:**
  - Use for multi-page journeys where users need to go back
  - Describe destination, not just "Back"
  - "Back to Product List" not "Back"
  - Don't use if previous page is unknown
- **LinksList best practices:**
  - Use `isNavigation={true}` for site/page navigation
  - Use `isNavigation={false}` for download links or non-nav groups
  - Provide visible heading via `headingSlot` when possible
  - Use `aria-label` or `aria-labelledby` for navigation lists
  - Keep to 5-7 links per list for optimal scanability
- **Visual styling:**
  - Links are always blue
  - Standalone links have chevron icon
  - Inline links underline on hover
  - Don't remove color/underline (accessibility requirement)
  - Active and hover states provide feedback
- **Responsive:**
  - Link text wraps to new line when too long
  - Maintains 44x44px touch target on mobile
  - Chevron/icon stays inline with text

## Writing Guidelines

**Link Text Checklist:**
1. **Does it navigate?** Links should go to new page/location (not open modals)
2. **Does it give context?** "Edit Email Address" not "Edit"
3. **Does it give purpose?** "Update Marketing Preferences (Settings)" not just URL
4. **Important info first?** "Products (opens in new tab)" not "Link opens in new window: Products"
5. **Is it readable?** Use sentence case, not ALL CAPS
6. **Does it look like a link?** Don't style as button

**Do:**
- Put important information first
- Use domain name for external links
- Be specific and descriptive
- Use verb + noun construction ("View Details", "Edit Profile")
- Use sentence case for readability

**Don't:**
- Use "click here", "learn more", "link to", "read more" alone
- Use URLs as link text
- Use ALL CAPS (except proper acronyms like "USA")
- Give different labels to same-purpose links
- Use directional language ("click button below")

## Related Components
- [Button](button.md) - For actions (not navigation)
- [Breadcrumbs](breadcrumbs.md) - For hierarchical navigation
- [Menu](menu.md) - For dropdown navigation menus
- [Tabs](tabs.md) - For view switching within same page
