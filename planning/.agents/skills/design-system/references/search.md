# Search Component Reference

> AI agent-friendly reference for DLS Search component

## Quick Reference

Search input with optional typeahead/autocomplete functionality. Use for helping users find content quickly with optional result suggestions.

## Import

```tsx
import { Search, SearchResult } from "@americanexpress/dls-react";
```

## Minimal Example

```tsx
<Search id="search" label="Search" hint="Search for products" />
```

## Label Overrides

**SearchLabelOverrides**

| Property                             | Type                                                                                    | Required | Description                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| clearButtonScreenReaderLabel         | string                                                                                  | No       | Screen reader label for the clear search button                                       |
| searchButtonScreenReaderLabel        | string                                                                                  | No       | Screen reader label for the search button                                             |
| searchButtonLoadingScreenReaderLabel | string                                                                                  | No       | Screen reader label for the search button when loading                                |
| resultsLoadingLabel                  | string                                                                                  | No       | Loading label shown in the popup for search results                                   |
| getNoResultsLabel                    | `(searchTerm: string) => string`                                                        | No       | Callback that returns the "no results" message based on the search term               |
| getLiveScreenReaderLabel             | `(context: { searchTerm: string; isLoading: boolean; resultLength: number }) => string` | No       | Callback for live region screen reader announcement describing search results context |

## Props API

### Search Props

| Prop                 | Type                                                                                                                                                                                                          | Required | Default | Description                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| showSearchButton     | boolean                                                                                                                                                                                                       | No       | `true`  | If true, shows search button. Otherwise, shows search icon                                                                                                                                 |
| isOpen               | boolean                                                                                                                                                                                                       | No       | -       | Controlled mode, popup stays open                                                                                                                                                          |
| defaultIsOpen        | boolean                                                                                                                                                                                                       | No       | -       | Popup is open on first load                                                                                                                                                                |
| isOpenOnFocus        | boolean                                                                                                                                                                                                       | No       | `true`  | If true, popup will open when input receives focus                                                                                                                                         |
| label                | string                                                                                                                                                                                                        | No       | -       | Text that will be used as the visual and accessible label for the component                                                                                                                |
| getFilteredResults   | ((query: string) => (string \| number \| ReactElement<any, string \| JSXElementConstructor<any>> \| Iterable<ReactNode> \| ReactPortal)[])                                                                    | No       | -       | Custom filter function that takes the search query and returns an array of React elements                                                                                                  |
| onActiveResultChange | KeyboardEventHandler<HTMLInputElement>                                                                                                                                                                        | No       | -       | Function to be called when the active result changes via keyboard navigation                                                                                                               |
| onResultSelect       | ((event: KeyboardEvent<HTMLInputElement> \| MouseEvent<HTMLLIElement, MouseEvent>, resultId: string) => void)                                                                                                 | No       | -       | Function to be called when the result is either clicked or selected via Enter/Return key                                                                                                   |
| onResultsClose       | (() => void)                                                                                                                                                                                                  | No       | -       | Function to be called when results are closed                                                                                                                                              |
| action               | string                                                                                                                                                                                                        | No       | -       | Specifies the URL where the form data should be sent when submitted. If omitted, form data will be submitted against the current page.                                                     |
| id                   | string                                                                                                                                                                                                        | Yes      | -       | The id of the input component, used to associate the input with the built-in accessible label and hint                                                                                     |
| disabled             | boolean                                                                                                                                                                                                       | No       | -       | @deprecated use `aria-disabled` instead. The `disabled` prop **removes** the element from the Accessibility Tree and prevents it from receiving focus.                                     |
| aria-disabled        | Booleanish                                                                                                                                                                                                    | No       | -       | If true, styles component as disabled and prevents interactivity. Screen reader reads as "dimmed" or "disabled".                                                                           |
| ref                  | ((instance: HTMLInputElement \| null) => void) \| RefObject<HTMLInputElement> \| null                                                                                                                         | No       | -       |                                                                                                                                                                                            |
| autoComplete         | string                                                                                                                                                                                                        | No       | -       | Must be defined when the form control collects user personal data. Attribute value must match the tokens defined in [input purposes section](https://www.w3.org/TR/WCAG21/#input-purposes) |
| name                 | string                                                                                                                                                                                                        | No       | -       | The name attribute of the input field, will default to the id provided                                                                                                                     |
| required             | boolean                                                                                                                                                                                                       | No       | -       | Flag to allow for default validation message to show                                                                                                                                       |
| type                 | HTMLInputTypeAttribute                                                                                                                                                                                        | No       | -       | The type of the input component, defaults to 'text'                                                                                                                                        |
| value                | string                                                                                                                                                                                                        | No       | -       | Value shown in input (controlled mode)                                                                                                                                                     |
| onChange             | ChangeEventHandler<HTMLInputElement>                                                                                                                                                                          | No       | -       | The onChange event handler to attach to the input field (controlled)                                                                                                                       |
| defaultValue         | string                                                                                                                                                                                                        | No       | -       | Default value to be used as the search query and shown in input                                                                                                                            |
| aria-describedby     | string                                                                                                                                                                                                        | No       | -       | The id of the container of the text describing the input, intended for custom hint text                                                                                                    |
| childrenPosition     | "start" \| "end"                                                                                                                                                                                              | No       | -       | Positions the slot (children) to the left or right of the other content within the container                                                                                               |
| status               | 'default' \| 'error' \| 'success'                                                                                                                                                                             | No       | -       | Default, error, or success state. Will use the value provided by the context when wrapped in a `FieldControl` component.                                                                   |
| statusMessage        | string                                                                                                                                                                                                        | No       | -       | The status message to be displayed if status is 'success' or 'error'.                                                                                                                      |
| containerRef         | RefObject<HTMLDivElement> \| ((instance: HTMLDivElement \| null) => void)                                                                                                                                     | No       | -       | A ref to the container element                                                                                                                                                             |
| containerProps       | Omit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">                                                                                                                                | No       | -       | Props to be spread onto the parent div container                                                                                                                                           |
| onClearSearch        | MouseEventHandler<HTMLButtonElement>                                                                                                                                                                          | No       | -       | Function called when clear search term button is clicked                                                                                                                                   |
| onSearch             | FormEventHandler<HTMLFormElement>                                                                                                                                                                             | No       | -       | Function called when search button is clicked and when form is submitted                                                                                                                   |
| isLoading            | boolean                                                                                                                                                                                                       | No       | -       | If true, show loading state for search                                                                                                                                                     |
| searchButtonProps    | IconButtonOtherProps                                                                                                                                                                                          | No       | -       | Props to be spread onto search button                                                                                                                                                      |
| clearButtonProps     | IconButtonOtherProps                                                                                                                                                                                          | No       | -       | Props to be spread onto clear search query button                                                                                                                                          |
| hint                 | string                                                                                                                                                                                                        | No       | -       | Hint text to use inbuilt hint instead of a custom label                                                                                                                                    |
| isHintVisuallyHidden | boolean                                                                                                                                                                                                       | No       | -       | If true, visually hides the hint text (it will still be accessible to screen readers)                                                                                                      |
| tooltip              | ReactElement<({ id, placement: placementProp, disableHover, isOpen: openProp, defaultIsOpen, onIsOpenChange, children, shouldCreatePortal, }: TooltipProps) => Element, string \| JSXElementConstructor<any>> | No       | -       | The slot for the tooltip                                                                                                                                                                   |
| reactlytics          | ReactlyticsProp                                                                                                                                                                                               | No       | -       |                                                                                                                                                                                            |
| labelOverrides       | SearchLabelOverrides                                                                                                                                                                                          | No       | -       | Overrides for labels that have been defaulted in the component (see Label Overrides section above).                                                                                        |
| children             | ReactNode                                                                                                                                                                                                     | No       | -       | The `SearchResult` children. Results are auto-filtered by default or can use custom `getFilteredResults` function.                                                                         |

### SearchResult Props

| Prop           | Type                                  | Required | Default | Description                                                                                         |
| -------------- | ------------------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------- |
| id             | string                                | No       | -       | ID for each li element (passed to `onResultSelect` callback when selected)                          |
| value          | string                                | No       | -       | Value for the result item. Used for filtering and as fallback display text if no children provided. |
| children       | ReactNode                             | No       | -       | Content to display in the result item. If omitted, `value` will be displayed.                       |
| onFocus        | FocusEventHandler<HTMLLIElement>      | No       | -       | Function called when li element receives focus (internal use)                                       |
| onMouseDown    | MouseEventHandler<HTMLLIElement>      | No       | -       | Function called on mouse down event on li element (internal use)                                    |
| onMouseEnter   | MouseEventHandler<HTMLLIElement>      | No       | -       | Function called on mouse enter event on li element (internal use)                                   |
| selectedResult | { id: string \| null; index: number } | No       | -       | Object that contains the id and index of the selected li element (internal use)                     |
| ...            | HTMLLIElement props                   | No       | -       | All standard HTML li element attributes (className, style, etc.)                                    |

## Common Patterns

### Basic Search (No Results)

```tsx
<Search
  id="search"
  label="Search"
  placeholder="Search for products"
  onSearch={(e) => handleSearch(e)}
/>
```

### With Static Results

```tsx
<Search id="search" label="Search" hint="Start typing to see results">
  <SearchResult id="result-1" value="apple" />
  <SearchResult id="result-2" value="banana" />
  <SearchResult id="result-3" value="orange" />
  <SearchResult id="result-4" value="pear" />
</Search>
```

### With Custom Filter Logic

```tsx
const customFilter = (searchTerm) => {
  return products
    .filter(
      (p) => p.name.includes(searchTerm) || p.category.includes(searchTerm),
    )
    .map((p) => (
      <SearchResult key={p.id} id={p.id}>
        {p.name}
      </SearchResult>
    ));
};

<Search
  id="search"
  label="Search Products"
  getFilteredResults={customFilter}
/>;
```

### Search With Loading State

```tsx
<Search
  id="search"
  label="Search"
  isLoading={isSearching}
  onSearch={async (e) => {
    setIsSearching(true);
    await fetchResults();
    setIsSearching(false);
  }}
/>
```

### Controlled with Selection Handling

```tsx
const [searchTerm, setSearchTerm] = useState("");
const [selectedId, setSelectedId] = useState(null);
const [results, setResults] = useState([]);

<Search
  id="search"
  label="Search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onResultSelect={(e, resultId) => {
    setSelectedId(resultId);
    console.log("Selected:", resultId);
  }}
>
  {results.map((r) => (
    <SearchResult key={r.id} id={r.id}>
      {r.name}
    </SearchResult>
  ))}
</Search>;
```

### Without Search Button

```tsx
<Search
  id="search"
  label="Search"
  showSearchButton={false}
  placeholder="Type to filter..."
>
  <SearchResult id="opt-1" value="Option 1" />
  <SearchResult id="opt-2" value="Option 2" />
  <SearchResult id="opt-3" value="Option 3" />
</Search>
```

## Accessibility Requirements

**Required:**

- Provide visible `label` prop or use accessible labeling with `aria-label`/`aria-labelledby`
- Use `role="combobox"` pattern (auto-applied)
- Announce results to screen readers via live region (auto-provided via `getLiveScreenReaderLabel`)
- Navigate results with arrow keys (auto-provided)
- Support Enter to select and Escape to close (auto-provided)
- Each `SearchResult` should have a unique `id` prop for proper selection tracking

**Recommended:**

- Provide specific placeholder text ("Search for products" not "Search")
- Use descriptive labels and hint text
- Show loading/error states clearly
- Provide informative "no results" messages

**Avoid:**

- Critical information only in placeholder
- Unclear result labels
- Missing keyboard navigation

## Anti-Patterns

❌ **Don't use vague placeholder:**

```tsx
<Search id="search" placeholder="Search" />
```

✅ **Do be specific:**

```tsx
<Search
  id="search"
  label="Search"
  placeholder="Search for products"
  hint="Find products by name, category, or brand"
/>
```

❌ **Don't hide results without loading state:**

```tsx
<Search
  id="search"
  label="Search"
  // Missing isLoading during fetch
  onSearch={fetchResults}
/>
```

✅ **Do show loading state:**

```tsx
<Search
  id="search"
  label="Search"
  isLoading={isSearching}
  onSearch={handleSearch}
/>
```

## Best Practices

- Make placeholder specific to the content being searched
- Use descriptive labels ("Search Products" not "Search")
- Show loading indicators during async operations with `isLoading` prop
- Customize "no results" messages with `labelOverrides.getNoResultsLabel`
- Use concise, scannable result labels and descriptions
- Support keyboard navigation with arrow keys, Enter to select, Escape to close (auto-provided)
- Customize live region announcements with `labelOverrides.getLiveScreenReaderLabel` for context
- Minimum width: 300px for responsive reflow
- Use semantic `<search>` landmark (auto-applied)
- Provide custom `getFilteredResults` for client-side filtering or handle server-side search via `onSearch`
- Pass `SearchResult` children directly to `Search` - results popup styling/behavior is handled internally
- Use `clearButtonProps` and `searchButtonProps` to customize button styling/behavior if needed
- Provide either `value` prop or `children` for each `SearchResult` (or both)

## Localization Notes

For RTL markets, layout is automatically mirrored. Ensure result text is properly aligned for RTL languages.

## Anti-Pattern: Missing value or children

❌ **Wrong: SearchResult without value or children**

```tsx
<Search id="search" label="Search">
  <SearchResult id="result-1" />
</Search>
```

✅ **Correct: SearchResult with value prop**

```tsx
<Search id="search" label="Search">
  <SearchResult id="result-1" value="Apple" />
  <SearchResult id="result-2" value="Banana" />
</Search>
```

✅ **Also correct: SearchResult with children**

```tsx
<Search id="search" label="Search">
  <SearchResult id="result-1">Apple</SearchResult>
  <SearchResult id="result-2">Banana</SearchResult>
</Search>
```

## Related Components

- [Input](./input.md) - For non-search text input
- [Filter](./filter.md) - For categorizing/filtering visible content
- [SelectCustom](./select-custom.md) - For choosing from predefined options
- [SelectNative](./select-native.md) - For choosing from predefined options with native select element
