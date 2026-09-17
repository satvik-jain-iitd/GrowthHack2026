# Carousel Component Reference
> AI agent-friendly reference for DLS Carousel component

## Quick Reference
A rotating set of slides used to highlight prominent but non-essential content. Typically contains 2-5 slides with manual or auto-advance navigation.

## Import
```tsx
import { Carousel, CarouselItem } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Carousel id="basic-carousel">
  <CarouselItem id="item-1">
    <img src="https://example.com/image1.jpg" alt="Slide 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="https://example.com/image2.jpg" alt="Slide 2" />
  </CarouselItem>
  <CarouselItem id="item-3">
    <img src="https://example.com/image3.jpg" alt="Slide 3" />
  </CarouselItem>
</Carousel>
```

## Props API

### Carousel Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the Carousel component |
| children | ReactNode | Yes | - | Children components to be rendered within the carousel |
| shouldAutoPlay | boolean | No | `false` | Whether carousel should auto-play |
| defaultCurrentSlideId | string | No | - | Default slide ID to show for uncontrolled mode |
| currentSlideId | string | No | - | Current slide ID for controlled mode |
| interval | number | No | `3000` | Interval for autoplay in milliseconds |
| isNavigationOnSlides | boolean | No | `false` | Whether navigation controls should be visible on slides |
| onSlideChange | (newSlideId: string) => void | No | - | Event handler when slide changes |
| navigationStyle | `'dots'` \| `'text'` | No | `'dots'` | Whether the navigation should show dots or text |
| isSlideFullWidth | boolean | No | `true` | Whether the carousel should take the full width of its container |
| isInfinite | boolean | No | `true` | Whether the carousel should disable looping from beginning to end and vice versa |
| previousButtonProps | IconButtonOtherProps | No | - | Props passed to the previous IconButton component |
| nextButtonProps | IconButtonOtherProps | No | - | Props passed to the next IconButton component |
| reactlytics | ReactlyticsProp | No | - | Analytics tracking prop |
| labelOverrides | CarouselLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

### CarouselItem Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for slide |
| children | ReactNode | - | - | Slide content |
| className | string | No | - | Additional CSS classes |


### Label Overrides
```typescript
interface CarouselLabelOverrides {
  'aria-label'?: string;
  previousButtonScreenReaderLabel?: string;
  nextButtonScreenReaderLabel?: string;
  playButtonScreenReaderLabel?: string;
  pauseButtonScreenReaderLabel?: string;
  getDotNavigationScreenReaderLabel?: (slideNumber: number) => string;
  getTextNavigationLabel?: (current: number, total: number) => string;
}
```

## Common Patterns

### Manual Control Carousel
```tsx
<Carousel id="manual-carousel" isNavigationOnSlides={true}>
  <CarouselItem id="item-1">
    <img src="https://example.com/img1.jpg" alt="Example 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="https://example.com/img2.jpg" alt="Example 2" />
  </CarouselItem>
  <CarouselItem id="item-3">
    <img src="https://example.com/img3.jpg" alt="Example 3" />
  </CarouselItem>
</Carousel>
```

### Auto-Rotate Carousel
```tsx
<Carousel id="auto-carousel" shouldAutoPlay={true} interval={5000}>
  <CarouselItem id="item-1">
    <img src="https://example.com/img1.jpg" alt="Example 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="https://example.com/img2.jpg" alt="Example 2" />
  </CarouselItem>
  <CarouselItem id="item-3">
    <img src="https://example.com/img3.jpg" alt="Example 3" />
  </CarouselItem>
</Carousel>
```

### Card Slides
```tsx
<Carousel
  id="card-carousel"
  isInfinite
  labelOverrides={{
    'aria-label': 'Product Carousel'
  }}
>
  <CarouselItem id="item-1">
    <Card className="pad-1">
      <CardContent
        subtitle={<h3>Subtitle</h3>}
        title={<h2>Slide 1</h2>}
      >
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </CardContent>
    </Card>
  </CarouselItem>
  <CarouselItem id="item-2">
    <Card className="pad-1">
      <CardContent
        subtitle={<h3>Subtitle</h3>}
        title={<h2>Slide 2</h2>}
      >
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </CardContent>
    </Card>
  </CarouselItem>
  <CarouselItem id="item-3">
    <Card className="pad-1">
      <CardContent
        subtitle={<h3>Subtitle</h3>}
        title={<h2>Slide 3</h2>}
      >
        <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
      </CardContent>
    </Card>
  </CarouselItem>
</Carousel>
```

### Text Navigation Style
```tsx
<Carousel
  id="text-nav-carousel"
  navigationStyle="text"
  labelOverrides={{
    'aria-label': 'Image Gallery',
    getTextNavigationLabel: (current, total) => `Image ${current} of ${total}`
  }}
>
  <CarouselItem id="item-1">
    <img src="https://example.com/img1.jpg" alt="Image 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="https://example.com/img2.jpg" alt="Image 2" />
  </CarouselItem>
  <CarouselItem id="item-3">
    <img src="https://example.com/img3.jpg" alt="Image 3" />
  </CarouselItem>
</Carousel>
```

### Carousel in Card
```tsx
<Card orientation="horizontal">
  <CardMedia>
    <Carousel id="card-media-carousel" isNavigationOnSlides={true}>
      <CarouselItem id="item-1">
        <img src="https://example.com/img1.jpg" alt="Product view 1" />
      </CarouselItem>
      <CarouselItem id="item-2">
        <img src="https://example.com/img2.jpg" alt="Product view 2" />
      </CarouselItem>
      <CarouselItem id="item-3">
        <img src="https://example.com/img3.jpg" alt="Product view 3" />
      </CarouselItem>
    </Carousel>
  </CardMedia>
  <CardLayout>
    <CardContent title={<h2>Product Title</h2>} subtitle={<h3>Subtitle</h3>}>
      <p>Product description goes here.</p>
    </CardContent>
    <CardActions>
      <Button variant="secondary">Learn More</Button>
      <Button>Add to Cart</Button>
    </CardActions>
  </CardLayout>
</Card>
```

### Controlled Carousel
```tsx
function ControlledCarousel() {
  const [currentSlide, setCurrentSlide] = useState('item-1');
  
  return (
    <Carousel
      id="controlled-carousel"
      currentSlideId={currentSlide}
      onSlideChange={setCurrentSlide}
    >
      <CarouselItem id="item-1">
        <img src="https://example.com/img1.jpg" alt="Slide 1" />
      </CarouselItem>
      <CarouselItem id="item-2">
        <img src="https://example.com/img2.jpg" alt="Slide 2" />
      </CarouselItem>
      <CarouselItem id="item-3">
        <img src="https://example.com/img3.jpg" alt="Slide 3" />
      </CarouselItem>
    </Carousel>
  );
}
```

### Non-Infinite Carousel
```tsx
<Carousel id="finite-carousel" isInfinite={false}>
  <CarouselItem id="item-1">
    <img src="https://example.com/img1.jpg" alt="Slide 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="https://example.com/img2.jpg" alt="Slide 2" />
  </CarouselItem>
  <CarouselItem id="item-3">
    <img src="https://example.com/img3.jpg" alt="Slide 3" />
  </CarouselItem>
</Carousel>
```

## Accessibility Requirements

**Required:**
- Carousel and each CarouselItem must have unique ID
- Provide meaningful alt text for images
- Include accessible labels via labelOverrides
- Auto-play must be pausable (automatically included if shouldAutoPlay=true)

**Recommended:**
- Use 'aria-label' to describe carousel purpose
- Customize screen reader labels for navigation buttons
- Set appropriate interval for auto-play (min 3000ms)
- Use text navigation for clarity/accessibility priority

**Avoid:**
- Auto-advancing without pause control
- Using carousels for critical content
- Nesting carousels within carousels
- Using text as images within slides

## Anti-Patterns

❌ **WRONG: Critical content in carousel**
```tsx
<Carousel id="bad-usage">
  <CarouselItem id="item-1">
    <h2>Step 1: Create Account</h2>
    <Button>Sign Up</Button>
  </CarouselItem>
  <CarouselItem id="item-2">
    <h2>Step 2: Verify Email</h2>
  </CarouselItem>
</Carousel>
```

✅ **CORRECT: Use carousel for supplementary content**
```tsx
<div>
  <h2>Create Your Account</h2>
  <Button>Sign Up</Button>
  
  <Carousel id="features-carousel">
    <CarouselItem id="feature-1">
      <img src="feature1.jpg" alt="Feature 1" />
    </CarouselItem>
    <CarouselItem id="feature-2">
      <img src="feature2.jpg" alt="Feature 2" />
    </CarouselItem>
  </Carousel>
</div>
```

❌ **WRONG: Nested carousels**
```tsx
<Carousel id="outer">
  <CarouselItem id="item-1">
    <Carousel id="inner">
      <CarouselItem id="inner-1">Content</CarouselItem>
    </Carousel>
  </CarouselItem>
</Carousel>
```

✅ **CORRECT: Single level carousel**
```tsx
<Carousel id="gallery">
  <CarouselItem id="item-1">
    <img src="img1.jpg" alt="Image 1" />
  </CarouselItem>
  <CarouselItem id="item-2">
    <img src="img2.jpg" alt="Image 2" />
  </CarouselItem>
</Carousel>
```

❌ **WRONG: Too many slides**
```tsx
<Carousel id="too-many">
  {/* 10+ slides - users won't engage */}
  <CarouselItem id="item-1">Slide 1</CarouselItem>
  <CarouselItem id="item-2">Slide 2</CarouselItem>
  {/* ... 8 more slides */}
</Carousel>
```

✅ **CORRECT: 2-5 related slides**
```tsx
<Carousel id="optimal">
  <CarouselItem id="item-1">Slide 1</CarouselItem>
  <CarouselItem id="item-2">Slide 2</CarouselItem>
  <CarouselItem id="item-3">Slide 3</CarouselItem>
</Carousel>
```

## Best Practices

**When to Use:**
- Showcase content like images or article previews
- Multiple pieces of content in prime real estate
- Content that is NOT critical to user's task
- Collection of 2-5 related slides
- High quality images with optional headings/CTAs

**When Not to Use:**
- Essential functionality or content
- Content critical to completing a task
- Misleading slides without context
- More than 5 slides
- Nested within interactive elements like tabs
- Critical calls-to-action that must not be missed

**Slide Content Guidelines:**
- Some users only see first slide - plan accordingly
- Separate text from images (for accessibility/resize)
- Consider context: where, surrounding hierarchy, fold position
- Keep slide content consistent (CTA location, importance)
- Provide alt text for images

**Navigation Options:**
- **Off-slide** (default): Positioned below carousel, preserves slide space
- **On-slide**: Overlays on slides, saves vertical space but may obstruct content
- Choose light/dark mode based on slide background
- Text-based for clarity ("Slide 1 of 5") or dots for minimalist design

**Auto-Play Guidelines:**
- Use when slides are equal in importance
- Slides equal in importance/prominence
- Always provide pause control (automatic)
- Respects prefers-reduced-motion
- Set appropriate interval (default 3000ms)

**Responsive Behavior:**
- Works at all breakpoints
- Follow slide content and grid guidelines for reflow
- Full-width or card-based layouts
- Navigation adapts to screen size

## Advanced Usage

### Custom Accessibility Labels
```tsx
<Carousel
  id="custom-labels"
  labelOverrides={{
    'aria-label': 'Product Image Gallery',
    previousButtonScreenReaderLabel: 'View previous image',
    nextButtonScreenReaderLabel: 'View next image',
    playButtonScreenReaderLabel: 'Start automatic slideshow',
    pauseButtonScreenReaderLabel: 'Pause automatic slideshow',
    getDotNavigationScreenReaderLabel: (num) => `Go to image ${num}`,
    getTextNavigationLabel: (current, total) => `Viewing ${current} of ${total} images`
  }}
>
  <CarouselItem id="img-1">
    <img src="product1.jpg" alt="Product front view" />
  </CarouselItem>
  <CarouselItem id="img-2">
    <img src="product2.jpg" alt="Product side view" />
  </CarouselItem>
</Carousel>
```

## Related Components
- [Card](card.md) - For carousel slide content
- [IconButton](icon-button.md) - For navigation buttons
- [Button](button.md) - For slide CTAs