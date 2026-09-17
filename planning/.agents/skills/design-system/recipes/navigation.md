---
title: Navigation
description: Guidelines and examples for using the DLS Navigation component to create vertical and horizontal navigation menus with nested items and icons.
---

## When to Use

Use to help customers navigate the site and guide them to tasks they want to perform. Navigation supports vertical and horizontal layouts with collapsible items, icons, and nested hierarchies.

## Vertical Navigation with Nested Items

- Use `defaultOpenPanelIds` to set which panels are open by default
- `shouldAllowMultipleExpanded` allows multiple items to be expanded simultaneously
- `showInContainer` adds a bordered container styling

```tsx
() => (
  <Navigation
    defaultOpenPanelIds={["my-account", "card-accounts"]}
    shouldAllowMultipleExpanded
    showInContainer
  >
    <NavigationItem id="my-account" label="My Account">
      <NavigationItem id="card-accounts" label="Card Accounts">
        <NavigationItem href="#" label="Account Services" />
        <NavigationItem href="#" label="Account Home" />
      </NavigationItem>
      <NavigationItem id="business-accounts" label="Business Accounts">
        <NavigationItem href="#" label="Small Business" />
      </NavigationItem>
      <NavigationItem href="#" label="Personal Checking and Loans" />
    </NavigationItem>
    <NavigationItem label="Cards">
      <NavigationItem href="#" label="Personal Cards" />
      <NavigationItem href="#" label="View All Credit Cards" />
    </NavigationItem>
    <NavigationItem href="#" label="Banking" />
    <NavigationItem href="#" label="Travel" />
  </Navigation>
)
```

## Vertical Navigation with Icons and Section Headings

- Add icons to navigation items with the `icon` prop
- Use `NavigationHeading` to organize items into sections within expandable groups

```tsx
() => (
  <Navigation>
    <NavigationItem icon={<IconAccount />} label="My Account">
      <NavigationHeading>Card Accounts</NavigationHeading>
      <NavigationItem href="#" label="Account Services" />
      <NavigationItem href="#" label="Account Home" />
      <NavigationHeading>Business Accounts</NavigationHeading>
      <NavigationItem href="#" label="Small Business" />
    </NavigationItem>
    <NavigationItem icon={<IconAccount />} label="Cards">
      <NavigationItem href="#" label="Personal Cards" />
      <NavigationItem href="#" label="View All Credit Cards" />
    </NavigationItem>
  </Navigation>
)
```

## Horizontal Navigation

- Use `variant="horizontal"` for top navigation bar style
- Works with both simple flat items and nested dropdowns

```tsx
() => (
  <Navigation variant="horizontal">
    <NavigationItem href="#" label="My Account" />
    <NavigationItem href="#" label="Cards" />
    <NavigationItem label="Banking">
      <NavigationItem href="#" label="Personal Loans" />
      <NavigationItem href="#" label="View All Savings Products" />
    </NavigationItem>
  </Navigation>
)
```
