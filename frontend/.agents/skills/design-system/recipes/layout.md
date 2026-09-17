---
title: Layout Component Reference
description: Guidelines and examples for using the DLS Layout component to render a basic white container with a box shadow and rounded corners.
---

## When to Use

Use when you need a basic white container with a box shadow and rounded corners to group related content or create a card-like appearance. Users can customize the inner container's padding and spacing using the `innerContainerClassName` prop. Users can pass in any content as children, such as headings, text, images, or other components.

## Basic Card with Heading and Text Example

- `innerContainerClassName="pad-2"` adds padding to the inner container, so the content doesn't touch the edges of the card

```tsx
<Layout innerContainerClassName="pad-2" variant="card">
  <React.Fragment key=".0">
    <Heading level={1} variant="sans-large-book">
      Card Layout
    </Heading>
    <div className="margin-2-tb">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
  </React.Fragment>
</Layout>
```

## Card with Heading, Text, and Buttons Example

- Creates a card with a heading, some text, and two buttons aligned horizontally at the bottom using `flex` and `stack-r` utility classes for spacing between the buttons.

```tsx
<Layout innerContainerClassName="pad-2" variant="card">
  <React.Fragment key=".0">
    <Heading level={1} variant="sans-large-book">
      Card Layout
    </Heading>
    <div className="margin-2-tb">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua.
    </div>
    <div className="stack-r flex">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  </React.Fragment>
</Layout>
```
