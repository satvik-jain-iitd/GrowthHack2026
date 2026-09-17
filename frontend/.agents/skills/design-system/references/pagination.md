# Pagination Component Reference

## Quick Reference
Pagination allows users to navigate through large datasets (tables, lists, search results) across multiple pages, displaying page controls and results-per-page options.

## Import
```tsx
import { Pagination } from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<Pagination id="pagination" totalResults={100} />
```

## Common Patterns

### With Custom Results Per Page
```tsx
<Pagination
  id="custom-pagination"
  totalResults={500}
  defaultSelectedPage={3}
  defaultResultsPerPageSelectedValue={25}
  resultsPerPageValues={[10, 25, 50, 100]}
/>
```

### Controlled Pagination
```tsx
const [currentPage, setCurrentPage] = useState(1);
const [resultsPerPage, setResultsPerPage] = useState(25);

<Pagination
  id="controlled-pagination"
  totalResults={500}
  selectedPage={currentPage}
  onChange={(pageNumber, { resultsPerPage, target }) => {
    // target can be:
    // - 'nextButton'
    // - 'previousButton'
    // - 'skipToFirstButton'
    // - 'skipToLastButton'
    // - 'pageSelect'
    // - 'resultsPerPageSelect'
    console.log(`Page changed to ${pageNumber} with ${resultsPerPage} results per page via ${target}`);
    setCurrentPage(pageNumber);
  }}
  resultsPerPageSelectedValue={resultsPerPage}
  onResultsPerPageChange={(value) => {
    setResultsPerPage(value);
    setCurrentPage(1); // Reset to first page
  }}
/>
```

### In Container (Card Style)
```tsx
<Pagination
  id="container-pagination"
  totalResults={200}
  showInContainer
/>
```

### Hide Results Per Page
```tsx
<Pagination
  id="no-results-selector"
  totalResults={150}
  showResultsPerPage={false}
/>
```

### With Custom Button Props
```tsx
<Pagination
  id="custom-buttons"
  totalResults={300}
  skipToFirstButtonProps={{ className: 'custom-class' }}
  previousButtonProps={{ className: 'custom-class' }}
  nextButtonProps={{ className: 'custom-class' }}
  skipToLastButtonProps={{ className: 'custom-class' }}
/>
```

## Props API

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | ID used for accessible labeling |
| totalResults | number | Yes | - | The total number of results |
| selectedPage | number | No | - | The selected page |
| defaultSelectedPage | number | No | - | The default selected page (uncontrolled component) |
| onChange | ((pageNumber: number, { target, resultsPerPage, }: { target: "nextButton" \| "previousButton" \| "skipToFirstButton" \| "skipToLastButton" \| "pageSelect" \| "resultsPerPageSelect"; resultsPerPage: number; }) => void) | No | - | The event handler for changes to the page number. The first parameter is the page number. The second parameter is an object with keys `target` (which element triggered the onChange) and `resultsPerPage` (current number of results per page). |
| onResultsPerPageChange | ((resultsPerPage: number) => void) | No | - | The event handler for changes to the results per page |
| resultsPerPageValues | number[] | No | - | The possible values for results per page dropdown |
| resultsPerPageSelectedValue | number | No | - | The currently selected value for results per page dropdown (controlled component) |
| defaultResultsPerPageSelectedValue | number | No | - | The default selected value for results per page dropdown (uncontrolled component) |
| showResultsPerPage | boolean | No | - | If the results per page is displayed |
| showInContainer | boolean | No | - | If the component is displayed within a container |
| resultsPerPageProps | Omit<ResultsPerPageProps, "id" \| "resultsPerPageSelectedValue" \| "resultsPerPageValues" \| "onResultsPerPageChange" \| "resultsPerPageLabel"> | No | - | Props to be spread onto the ResultsPerPage component |
| skipToFirstButtonProps | PaginationButtonOtherProps | No | - | Props to be spread onto the skip to first button |
| previousButtonProps | PaginationButtonOtherProps | No | - | Props to be spread onto the previous button |
| nextButtonProps | PaginationButtonOtherProps | No | - | Props to be spread onto the next button |
| skipToLastButtonProps | PaginationButtonOtherProps | No | - | Props to be spread onto the skip to last button |
| selectProps | PaginationSelectOtherProps | No | - | Props to be spreadd onto the Pagination Select |
| reactlytics | ReactlyticsProp | No | - |  |
| labelOverrides | PaginationLabelOverrides | No | - | Overrides for labels that have been defaulted in the component. |

## Accessibility Requirements

### Required
- All pagination controls must be keyboard accessible
- Screen reader announces current page and total pages
- Navigation element has accessible label (default: "Pagination")
- Controls are disabled when at first/last page
- Live region announces page changes

### Recommended
- Position pagination consistently on each page/table
- Use single pagination per content section
- Provide descriptive labels for pagination context
- Ensure sufficient spacing between pagination and content (16px recommended)

### Avoid
- Multiple pagination components for same content
- Using pagination as standalone component without content
- Removing first/last page buttons at desktop breakpoints

## Anti-Patterns


❌ **Don't use for view switching**
```tsx
// Use Tabs instead
<Pagination totalResults={3} /> {/* to switch between views */}
```

✅ **Use Tabs for view switching**
```tsx
<Tabs>
  <Tab id="view1">View 1</Tab>
  <Tab id="view2">View 2</Tab>
</Tabs>
```

❌ **Don't use for carousel**
```tsx
// Use Carousel component
<Pagination totalResults={5} /> {/* for slides */}
```

❌ **Don't use without supported content**
```tsx
// Always pair with data
<Pagination totalResults={100} />
{/* No table or list shown */}
```

✅ **Pair with content**
```tsx
<DataTable data={currentPageData} />
<Pagination totalResults={totalCount} onChange={handlePageChange} />
```

## Best Practices

- Use for navigating content split across multiple pages
- Display current page number to maintain user orientation
- Enhance system scalability and performance with large datasets
- Pagination automatically switches to compact variant on mobile (< 800px)
- First/last buttons hidden in compact mode to save space
- Desktop view (≥800px): Shows all navigation buttons
- Mobile view (<800px): Hides first/last buttons, shows only prev/next
- Default results per page: 10, 25, 100
- Changing results per page resets to page 1
- Minimum width: 288px (allows for margins/gutters)
- Full width: 320px minimum (responsive reflow requirement)
- Results per page selector moves below pagination on mobile

## Advanced Usage

### Custom Labels
```tsx
<Pagination
  id="custom-labels"
  totalResults={100}
  labelOverrides={{
    getPaginationStartVisualLabel: () => 'Page',
    getPaginationEndVisualLabel: (_, total) => `of ${total}`,
    getSelectedPageScreenReaderLabel: (current, total) => 
      `Page ${current} of ${total}`,
    nextScreenReaderLabel: 'Next page',
    previousScreenReaderLabel: 'Previous page',
    skipToFirstScreenReaderLabel: 'First page',
    skipToLastScreenReaderLabel: 'Last page',
    resultsPerPageVisualLabel: 'Results per page',
    navScreenReaderLabel: 'Table pagination'
  }}
/>
```

### Responsive Behavior
- **Desktop (≥800px)**: 
  - Full controls (first, previous, page select, next, last)
  - Results per page selector above pagination
- **Mobile (<800px)**:
  - Compact controls (previous, page select, next only)
  - Results per page selector below pagination
  - No first/last buttons (space constraint)

### Keyboard Interactions
- **Tab**: Navigate between controls
- **Enter/Space**: Activate buttons
- **Arrow Up/Down**: Navigate page select dropdown (when focused)

## Related Components

- [DataTable](data-table.md) - Often paired with pagination for large datasets
- [SelectNative](select-native.md) - Used internally for page and results per page selectors
- [IconButton](icon-button.md) - Used for navigation buttons