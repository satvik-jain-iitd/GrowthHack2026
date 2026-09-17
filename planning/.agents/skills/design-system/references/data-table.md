# DataTable Component Reference
> AI agent-friendly reference for DLS DataTable component

## Quick Reference
DataTable organizes two-dimensional data into rows and columns with support for sorting, selection, expandable rows, and additional actions. Use for displaying structured data that users need to scan, compare, and analyze. DataTables maintain their two-dimensional layout even on small screens (may scroll horizontally).

## Import
```tsx
import { 
  DataTable, 
  DataTableHead, 
  DataTableHeadCell,
  DataTableBody, 
  DataTableRow, 
  DataTableCell,
  DataTableExpandableContent 
} from '@americanexpress/dls-react';
```

## Minimal Example
```tsx
<DataTable id="basic-table">
  <DataTableHead>
    <DataTableRow>
      <DataTableHeadCell>Name</DataTableHeadCell>
      <DataTableHeadCell>Amount</DataTableHeadCell>
      <DataTableHeadCell>Date</DataTableHeadCell>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableCell>Payment</DataTableCell>
      <DataTableCell>$125.00</DataTableCell>
      <DataTableCell>01/15/2026</DataTableCell>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

## Props API

### DataTable

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | Yes | - | Unique identifier for the table |
| borders | `'rows'` \| `'columns'` \| `'none'` \| `'all' | No | - | Enable/disable borders (all, columns, rows) |
| zebraStripes | `'rows'` \| `'columns'` \| `'none' | No | - | Enable/disable zebra striping for rows or columns |
| density | `'default'` \| `'compact' | No | - | Change padding density of the cells |
| tableLayout | `'auto'` \| `'fixed' | No | `'auto' | CSS property sets the algorithm used to lay out table cells, rows, and columns |
| isCheckable | boolean | No | - | Indicates whether the table rows are checkable |
| isSelectAllVisible | boolean | No | `true | Indicates whether the 'Select All' checkbox is visible |
| selectAllCheckboxProps | CheckboxIndeterminateProps | No | - | Props to be passed to the 'Select All' checkbox |
| checkableTableLegend | string | No | - | Checkbox group legend for the datatable. Indicates the group label |
| onIsCheckedChange | (isChecked: boolean, id: string) => void | No | - | Callback function when a row checkbox changes state |
| onSelectAllCheckChange | (checked: boolean) => void | No | - | Callback function when the Select All checkbox changes state |
| isExpandable | boolean | No | - | Indicates whether the table is expandable |
| onExpandRowClick | (id: string) => void | No | - | Callback function when a row expands or collapses |
| isSortable | boolean | No | - | Indicates whether the table is sortable |
| sortById | string | No | - | The column identifier currently sorted by |
| sortDirection | `'none'` \| `'ascending'` \| `'descending' | No | - | The direction of the current sort |
| onSortClick | (event: MouseEvent, id: string, colIndex: number) => void | No | - | Callback function when a column header is clicked to sort |
| actionSlot | ReactNode | No | - | Contents of action slot above the table |
| labelOverrides | DataTableLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

### DataTableHead

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| colGroupSlot | ReactNode | No | - | Allows for representing multiple columns with a single header |
| caption | string | No | - | Table caption for accessibility |

### DataTableHeadCell

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| align | `'center'` \| `'left'` \| `'right' | No | - | Align the content of the cell |
| width | string | No | - | Specifies the table head cell's width (and corresponding column) when using a fixed table layout |
| colIndex | number | No | - | The aria-colindex of the column. Use if not all columns are displayed at once |
| isSortable | boolean | No | - | Indicates whether the column is sortable |
| isActionable | boolean | No | - | Indicates whether the column is actionable |
| buttonProps | ButtonBaseProps | No | - | Props spread onto the sortable button |
| labelOverrides | DataTableLabelOverrides | No | - | Overrides for labels that have been defaulted in the component |

### DataTableBody

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | DataTableRow components |

### DataTableRow

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| id | string | No | - | Unique identifier for the row |
| isChecked | boolean | No | - | Indicates whether the row checkbox is checked |
| checkboxScreenReaderLabel | string | No | - | The label for the row checkbox |
| onIsCheckedChange | (isChecked: boolean, id: string) => void | No | - | Callback function when the row checkbox changes state |
| checkboxProps | CheckboxProps | No | - | Props spread onto the checkbox |
| isExpanded | boolean | No | - | Indicates whether the row is expanded |
| defaultIsExpanded | boolean | No | - | Default state of the expandable row |
| expandableButtonScreenReaderLabel | string | No | - | Label for the expandable button |
| expandableButtonProps | IconButtonOtherProps | No | - | Props spread onto the expandable button |
| rowIndex | number | No | - | The aria-rowindex of the row. Use if not all rows are displayed at once |

### DataTableCell

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| children | ReactNode | Yes | - | Cell content |
| align | `'center'` \| `'left'` \| `'right' | No | - | Align the content of the cell |
| colIndex | number | No | - | The aria-colindex of the column. Use if not all columns are displayed at once |

### DataTableExpandableContent

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children | `ReactNode | Yes | - | Content to display when row is expanded |

## Common Patterns

### Basic Table with Headers
```tsx
<DataTable id="transactions">
  <DataTableHead caption="Recent Transactions">
    <DataTableRow>
      <DataTableHeadCell>Date</DataTableHeadCell>
      <DataTableHeadCell>Description</DataTableHeadCell>
      <DataTableHeadCell align="right">Amount</DataTableHeadCell>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableCell>02/15/2026</DataTableCell>
      <DataTableCell>Coffee Shop</DataTableCell>
      <DataTableCell align="right">-$4.50</DataTableCell>
    </DataTableRow>
    <DataTableRow>
      <DataTableCell>02/14/2026</DataTableCell>
      <DataTableCell>Salary Deposit</DataTableCell>
      <DataTableCell align="right">+$3,500.00</DataTableCell>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

### Sortable Table
```tsx
const sortableHeaderItems = {
  dateColumn: {
    id: 'dateColumn',
    label: 'Date',
    sortingParse: (cell) => new Date(cell),
  },
  descriptionColumn: {
    id: 'descriptionColumn',
    label: 'Description',
    sortingParse: (cell) => cell,
  },
  amountColumn: {
    id: 'amountColumn',
    label: 'Amount',
    align: 'right',
    sortingParse: (cell) => Number.parseFloat(cell.slice(1).replace(',', '')),
  },
};

const sortableHeaderOrder = ['dateColumn', 'descriptionColumn', 'amountColumn'];

const sortableRowItems = {
  sainsBury: {
    cells: [
      { label: 'Jan 05, 2020' },
      { label: 'SAINSBURY\u2019S ONLINE-GOL LON' },
      { label: '$8.76', align: 'right' },
    ],
  },
  onlinePayment: {
    cells: [
      { label: 'Mar 16, 2020' },
      { label: 'Online Payment' },
      { label: '$300.00', align: 'right' },
    ],
  },
  swiss: {
    cells: [
      { label: 'Apr 14, 2020' },
      { label: 'SWISS Intl Air LinesBasel CH' },
      { label: '$5,000.00', align: 'right' },
    ],
  },
  musicEnterprise: {
    cells: [
      { label: 'Oct 01, 2020' },
      { label: 'Music Enterprise In' },
      { label: '$10.67', align: 'right' },
    ],
  },
  martins: {
    cells: [
      { label: 'Mar 15, 2020' },
      { label: 'Martin\u2019s News Shops Wellington' },
      { label: '$32.99', align: 'right' },
    ],
  },
};

const initialSortableRowOrder = [
  'sainsBury',
  'onlinePayment',
  'swiss',
  'musicEnterprise',
  'martins',
];


const [sortById, setSortById] = useState('dateColumn');
const [sortDirection, setSortDirection] = useState('descending');
const [rowOrder, setRowOrder] = useState(initialSortableRowOrder);

const getSortedOrder = (
  colIndex: number,
  colId: string,
  direction: 'ascending' | 'descending',
  currentOrder: string[]
) =>
  [...currentOrder].sort((a, b) => {
    const fn = sortableHeaderItems[colId].sortingParse;
    const aParsed = fn(sortableRowItems[a].cells[colIndex - 1].label);
    const bParsed = fn(sortableRowItems[b].cells[colIndex - 1].label);
    if (direction === 'ascending') {
      if (aParsed < bParsed) return -1;
      if (aParsed > bParsed) return 1;
      return 0;
    }
    if (aParsed < bParsed) return 1;
    if (aParsed > bParsed) return -1;
    return 0;
  });

const handleSortClick = (event: MouseEvent, id: string, colIndex: number) => {
  const nextDirection: 'ascending' | 'descending' =
    sortById === id && sortDirection === 'descending' ? 'ascending' : 'descending';
  setSortById(id);
  setSortDirection(nextDirection);
  setRowOrder((prev) => getSortedOrder(colIndex, id, nextDirection, prev));
};

return (
  <DataTable
    id="sortable-table"
    isSortable={true}
    onSortClick={handleSortClick}
    sortById={sortById}
    sortDirection={sortDirection}
  >
    <DataTableHead>
      <DataTableRow id="table-head-row">
        {sortableHeaderOrder.map((headerId, index) => {
          const { id, label } = sortableHeaderItems[headerId];
          return (
            <DataTableHeadCell
              id={id}
              key={`header-${id}`}
              colIndex={index + 1}
              isSortable={true}
            >
              {label}
            </DataTableHeadCell>
          );
        })}
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      {rowOrder.map((rowKey) => {
        const rowData = sortableRowItems[rowKey];
        return (
          <DataTableRow id={`table-row-${rowKey}`} key={`row-${rowKey}`}>
            {rowData.cells.map((cell) => (
              <DataTableCell key={`table-cell-${cell.label}`} align={cell.align}>
                {cell.label}
              </DataTableCell>
            ))}
          </DataTableRow>
        );
      })}
    </DataTableBody>
  </DataTable>
);
```

### Checkable Table with Selection
```tsx
const checkableRows = [
  { id: '1', date: 'Jan 05, 2020', description: "SAINSBURY'S ONLINE-GOL LON", amount: '$8.76' },
  { id: '2', date: 'Mar 16, 2020', description: 'Online Payment', amount: '$300.00' },
  {
    id: '3',
    date: 'Apr 14, 2020',
    description: 'SWISS Intl Air LinesBasel CH',
    amount: '$5000.00',
  },
  { id: '4', date: 'Oct 01, 2020', description: 'Music Enterprise In', amount: '$10.67' },
  {
    id: '5',
    date: 'Mar 15, 2020',
    description: "Martin's News Shops Wellington",
    amount: '$32.99',
  },
];

return (
  <DataTable id="checkable-table" isCheckable={true} checkableTableLegend="Checkable Table Group">
  <DataTableHead>
    <DataTableRow id="checkable-head">
      <DataTableHeadCell>Description</DataTableHeadCell>
      <DataTableHeadCell>Date</DataTableHeadCell>
      <DataTableHeadCell>Amount</DataTableHeadCell>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    {checkableRows.map((row) => (
      <DataTableRow
        key={row.id}
        id={row.id}
        checkboxScreenReaderLabel={`Select ${row.description}`}
      >
        <DataTableCell>{row.description}</DataTableCell>
        <DataTableCell>{row.date}</DataTableCell>
        <DataTableCell>{row.amount}</DataTableCell>
      </DataTableRow>
    ))}
  </DataTableBody>
</DataTable>
);
```

### Expandable Rows
```tsx
const expandableRowItems = {
  sainsBuryE: {
    cells: [
      { label: 'Jan 05, 2020' },
      { label: "SAINSBURY'S ONLINE-GOL LON" },
      { label: '$8.76' },
    ],
    expandedRow: 'Expandable Content 1',
  },
  onlinePaymentE: {
    cells: [{ label: 'Mar 16, 2020' }, { label: 'Online Payment' }, { label: '$300.00' }],
    expandedRow: 'Expandable Content 2',
  },
  swissE: {
    cells: [
      { label: 'Apr 14, 2020' },
      { label: 'SWISS Intl Air LinesBasel CH' },
      { label: '$5,000.00' },
    ],
  },
  musicEnterpriseE: {
    cells: [{ label: 'Oct 01, 2020' }, { label: 'Music Enterprise In' }, { label: '$10.67' }],
    expandedRow: 'Expandable Content 3',
  },
  martinsE: {
    cells: [
      { label: 'Mar 15, 2020' },
      { label: "Martin's News Shops Wellington" },
      { label: '$32.99' },
    ],
  },
};

const expandableRowOrder = [
  'sainsBuryE',
  'onlinePaymentE',
  'swissE',
  'musicEnterpriseE',
  'martinsE',
];

return (
  <DataTable id="table-expandable" isExpandable={true}>
    <DataTableHead>
      <DataTableRow id="table-expandable-header-row">
        <DataTableHeadCell>Date</DataTableHeadCell>
        <DataTableHeadCell>Description</DataTableHeadCell>
        <DataTableHeadCell>Amount</DataTableHeadCell>
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      {expandableRowOrder.map((rowKey) => {
        const rowData = expandableRowItems[rowKey];
        return (
          <DataTableRow
            key={`row-${rowKey}`}
            id={`table-row-${rowKey}`}
            expandableButtonScreenReaderLabel={`Expand ${rowKey}`}
          >
            {rowData.cells.map((cell) => (
              <DataTableCell key={`table-cell-${cell.label}`}>{cell.label}</DataTableCell>
            ))}
            <DataTableExpandableContent>{rowData.expandedRow}</DataTableExpandableContent>
          </DataTableRow>
        );
      })}
    </DataTableBody>
  </DataTable>
)
```

### Checkable + Expandable Table
```tsx
const checkableExpandableRowOrder = ['mercury', 'venus', 'earth', 'mars'];

const [rows, setRows] = useState({
  mercury: {
    cells: [{ label: 'Mercury' }, { label: '57' }],
    isExpanded: false,
    expandedRow: 'Expandable Content for Mercury',
  },
  venus: {
    cells: [{ label: 'Venus' }, { label: '108' }],
    isExpanded: false,
    expandedRow: 'Expandable Content for Venus',
  },
  earth: {
    cells: [{ label: 'Earth' }, { label: '149' }],
    isExpanded: false,
    expandedRow: 'Expandable Content for Earth',
  },
  mars: {
    cells: [{ label: 'Mars' }, { label: '228' }],
    isExpanded: false,
    expandedRow: 'Expandable Content for Mars',
  },
});

const handleExpandRowClick = useCallback((id: string) => {
  setRows((prev) => ({
    ...prev,
    [id]: { ...prev[id], isExpanded: !prev[id].isExpanded },
  }));
}, []);


return (
  <DataTable
    id="checkable-expandable-table"
    isCheckable={true}
    isExpandable={true}
    isSelectAllVisible={true}
    onExpandRowClick={handleExpandRowClick}
    checkableTableLegend="Checkable Table Group"
  >
    <DataTableHead>
      <DataTableRow id="checkable-expandable-header">
        <DataTableHeadCell>Planet</DataTableHeadCell>
        <DataTableHeadCell>Distance from Sun (million km)</DataTableHeadCell>
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      {checkableExpandableRowOrder.map((rowKey) => {
        const rowData = rows[rowKey];
        return (
          <DataTableRow
            key={`row-${rowKey}`}
            id={rowKey}
            isExpanded={rowData.isExpanded}
            expandableButtonScreenReaderLabel={`Expand ${rowKey}`}
            checkboxScreenReaderLabel={`Select ${rowKey}`}
          >
            {rowData.cells.map((cell) => (
              <DataTableCell key={`table-cell-${cell.label}`}>{cell.label}</DataTableCell>
            ))}
            <DataTableExpandableContent>{rowData.expandedRow}</DataTableExpandableContent>
          </DataTableRow>
        );
      })}
    </DataTableBody>
  </DataTable>
);
```

### Table with Row Actions (Menu)
```tsx
  <DataTable id="actionable-table">
    <DataTableHead>
      <DataTableRow id="actionable-head">
        <DataTableHeadCell>
          Planet
        </DataTableHeadCell>
        <DataTableHeadCell isActionable>
          Actions
        </DataTableHeadCell>
      </DataTableRow>
    </DataTableHead>
    <DataTableBody>
      <DataTableRow id="actionable-mercury">
        <DataTableCell>
          Mercury
        </DataTableCell>
        <DataTableCell>
          <Menu
            customTrigger={<IconToggleButton id="overflow-menu-mercury" screenReaderLabel="Mercury" shape="round"><IconMoreVertical isFilled /></IconToggleButton>}
            id="overflow-menu-mercury"
            label="Mercury"
          >
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
          </Menu>
        </DataTableCell>
      </DataTableRow>
      <DataTableRow id="actionable-venus">
        <DataTableCell>
          Venus
        </DataTableCell>
        <DataTableCell>
          <Menu
            customTrigger={<IconToggleButton id="overflow-menu-venus" screenReaderLabel="Venus" shape="round"><IconMoreVertical isFilled /></IconToggleButton>}
            id="overflow-menu-venus"
            label="Venus"
          >
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
          </Menu>
        </DataTableCell>
      </DataTableRow>
      <DataTableRow id="actionable-earth">
        <DataTableCell>
          Earth
        </DataTableCell>
        <DataTableCell>
          <Menu
            customTrigger={<IconToggleButton id="overflow-menu-earth" screenReaderLabel="Earth" shape="round"><IconMoreVertical isFilled /></IconToggleButton>}
            id="overflow-menu-earth"
            label="Earth"
          >
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
            <MenuItem>
              Edit
            </MenuItem>
          </Menu>
        </DataTableCell>
      </DataTableRow>
    </DataTableBody>
  </DataTable>
```

## Accessibility Requirements

**Required:**
- Every DataTable must have a unique `id`
- Use `caption` prop on DataTableHead for table description (or provide context in surrounding content)
- All header cells must be within DataTableHead
- Checkable/expandable rows must have unique `id` props
- Interactive elements (sort buttons, checkboxes) must be keyboard accessible
- Minimum row height of 44px for rows with interactive elements
- Use semantic column headers (DataTableHeadCell)

**Recommended:**
- Provide descriptive header text that clearly identifies column content
- Use `align` prop to match data type (numbers right-aligned, text left-aligned)
- For sortable tables, clearly indicate sort direction visually and to screen readers
- Keep table headers short (1-3 words)
- Provide context for empty tables
- Use aria-label on checkboxes via labelOverrides if default text insufficient

**Avoid:**
- Don't use tables for layout - only for tabular data
- Don't hide column headers visually
- Don't use vague headers ("Data", "Info")
- Don't make rows shorter than 44px if they contain interactive elements
- Don't nest tables (makes screen reader navigation difficult)
- Don't rely on color alone to convey table information

## Anti-Patterns

❌ **Wrong: Missing unique IDs for checkable rows**
```tsx
<DataTable id="table" isCheckable={true}>
  <DataTableBody>
    <DataTableRow>
      <DataTableCell>Row 1</DataTableCell>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```
✅ **Correct: Provide unique IDs**
```tsx
<DataTable id="table" isCheckable={true}>
  <DataTableBody>
    <DataTableRow id="row-1">
      <DataTableCell>Row 1</DataTableCell>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

❌ **Wrong: No table caption or context**
```tsx
<DataTable id="table">
  <DataTableHead>
    {/* headers */}
  </DataTableHead>
</DataTable>
```
✅ **Correct: Provide caption or surrounding context**
```tsx
<div>
  <h3>Recent Transactions</h3>
  <DataTable id="table">
    <DataTableHead caption="Recent Transactions">
      {/* headers */}
    </DataTableHead>
  </DataTable>
</div>
```

❌ **Wrong: Vague column headers**
```tsx
<DataTableHeadCell>Column 1</DataTableHeadCell>
<DataTableHeadCell>Data</DataTableHeadCell>
```
✅ **Correct: Descriptive headers**
```tsx
<DataTableHeadCell>Transaction Date</DataTableHeadCell>
<DataTableHeadCell>Amount</DataTableHeadCell>
```

❌ **Wrong: No expandable content in expandable row**
```tsx
<DataTableRow id="row-1" isExpandable={true}>
  <DataTableCell>Data</DataTableCell>
</DataTableRow>
```
✅ **Correct: Include expandable content**
```tsx
<DataTableRow id="row-1" isExpandable={true}>
  <DataTableCell>Data</DataTableCell>
  <DataTableExpandableContent>
    <p>Additional details here</p>
  </DataTableExpandableContent>
</DataTableRow>
```

❌ **Wrong: Poor number alignment**
```tsx
<DataTableCell>$1,234.56</DataTableCell>
<DataTableCell>$89.00</DataTableCell>
```
✅ **Correct: Right-align numbers**
```tsx
<DataTableCell align="right">$1,234.56</DataTableCell>
<DataTableCell align="right">$89.00</DataTableCell>
```

## Best Practices

- **Structure:**
  - Always use DataTableHead and DataTableBody
  - One DataTableHead per table
  - Place caption on DataTableHead for accessibility
  - Use semantic HTML structure (component renders proper table elements)
- **Headers:**
  - Keep headers concise and descriptive (1-3 words)
  - Use sentence case, not ALL CAPS
  - Match header alignment to data type
  - For sortable columns, indicate sort state clearly
- **Selection:**
  - Provide feedback when rows are selected (count, actions menu)
  - Allow bulk selection with Select All
  - Provide clear actions for selected rows
  - Allow easy deselection
- **Expandable Rows:**
  - Use for supplementary information, not critical data
  - Keep expanded content concise
  - Provide clear visual indicator of expand/collapse state
  - Only one row expanded at a time for clarity
- **Data Formatting:**
  - Right-align numbers and monetary values
  - Left-align text
  - Center-align icons or status indicators
  - Use consistent date/number formatting
- **Responsive:**
  - Tables maintain two-dimensional structure (may scroll horizontally)
  - Wrap table in container with `overflow-x-auto` for horizontal scroll
  - Consider showing fewer columns on mobile
  - Test scrolling behavior on touch devices
- **Performance:**
  - For large datasets (>100 rows), implement pagination or virtual scrolling
  - Minimize re-renders by memoizing row components
  - Use controlled sorting only if needed (uncontrolled is simpler)
- **Empty States:**
  - Always handle empty data gracefully
  - Provide helpful message and next steps
  - Consider showing a loading state while fetching data

## Related Components
- [Checkbox](checkbox.md) - For row selection
- [Menu](menu.md) - For row actions
- [Pagination](pagination.md) - For large datasets
- [IconButton](icon-button.md) - For action buttons in cells
- [Card](card.md) - For displaying data in a non-tabular format on mobile or for small datasets
