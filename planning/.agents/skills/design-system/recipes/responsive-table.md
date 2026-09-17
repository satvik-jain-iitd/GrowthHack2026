---
title: Responsive DataTables
description: Examples of responsive tables that adapt to different screen sizes, including transforming into card layouts on small screens, and adding sorting and action capabilities.
---

## Responsive Table to Card Example

```tsx
import React from "react";
import { DataTable, DataTableHead, DataTableRow, DataTableHeadCell, DataTableBody, DataTableCell } from "@americanexpress/dls-react";
import { Card, CardLayout, CardContent } from "@americanexpress/dls-react";
import { useMediaQuery } from "@americanexpress/dls-react";

const tableData = [
  ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3", "Row 1 Col 4"],
  ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3", "Row 2 Col 4"],
  ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3", "Row 3 Col 4"],
  ["Row 4 Col 1", "Row 4 Col 2", "Row 4 Col 3", "Row 4 Col 4"],
  ["Row 5 Col 1", "Row 5 Col 2", "Row 5 Col 3", "Row 5 Col 4"],
];

export default function ResponsiveTableToCard() {
  // Use DLS breakpoint for small screens (max-width: 767px)
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  return (
    <div className="container-responsive">
      {isSmallScreen ? (
        <div className="flex flex-column">
          {tableData.map((row, i) => (
            <Card key={i} className="margin-responsive-b" orientation="vertical">
              <CardLayout>
                <CardContent title={<h2>Row {i + 1}</h2>}>
                  {row.map((cell, j) => (
                    <div key={j} className="pad-responsive-b">
                      <strong>Column {j + 1}:</strong> {cell}
                    </div>
                  ))}
                </CardContent>
              </CardLayout>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <DataTable id="responsive-table">
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Column 1</DataTableHeadCell>
                <DataTableHeadCell>Column 2</DataTableHeadCell>
                <DataTableHeadCell>Column 3</DataTableHeadCell>
                <DataTableHeadCell>Column 4</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {tableData.map((row, i) => (
                <DataTableRow key={i}>
                  {row.map((cell, j) => (
                    <DataTableCell key={j}>{cell}</DataTableCell>
                  ))}
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </div>
      )}
    </div>
  );
}
```

- Shows a 4 column, 5 row table on medium and larger screens.
- On small screens, each row is rendered as a Card using DLS utility classes for layout and spacing.


# Responsive Sortable Table

```tsx
import React, { useState, useCallback } from "react";
import {
  DataTable,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell,
  Card,
  CardLayout,
  CardContent,
  useMediaQuery,
  IconButton,
  Button
} from "@americanexpress/dls-react";
import { IconChevronUp, IconChevronDown } from "@americanexpress/dls-icons";

const columns = [
  { id: "col1", label: "Column 1" },
  { id: "col2", label: "Column 2" },
  { id: "col3", label: "Column 3" },
  { id: "col4", label: "Column 4" },
];

const initialTableData = [
  ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3", "Row 1 Col 4"],
  ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3", "Row 2 Col 4"],
  ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3", "Row 3 Col 4"],
  ["Row 4 Col 1", "Row 4 Col 2", "Row 4 Col 3", "Row 4 Col 4"],
  ["Row 5 Col 1", "Row 5 Col 2", "Row 5 Col 3", "Row 5 Col 4"],
];

function sortData(data, colIndex, direction) {
  return [...data].sort((a, b) => {
    if (a[colIndex] < b[colIndex]) return direction === "ascending" ? -1 : 1;
    if (a[colIndex] > b[colIndex]) return direction === "ascending" ? 1 : -1;
    return 0;
  });
}

export default function ResponsiveSortableTableToCard() {
  const isSmallScreen = useMediaQuery("(max-width: 767px)");
  const [sortById, setSortById] = useState(columns[0].id);
  const [sortDirection, setSortDirection] = useState("ascending");
  const [tableData, setTableData] = useState(initialTableData);

  const handleSortClick = useCallback((event, id, colIndex) => {
    let direction = sortDirection;
    if (sortById === id) {
      direction = direction === "ascending" ? "descending" : "ascending";
    } else {
      direction = "ascending";
    }
    setSortById(id);
    setSortDirection(direction);
    setTableData(sortData(tableData, colIndex - 1, direction));
  }, [sortById, sortDirection, tableData]);

  // For Cards, allow sorting by clicking column headers above cards
  const renderSortButtons = () => (
    <div className="flex flex-row margin-responsive-b">
      {columns.map((col, idx) => (
        <Button
          icon={sortById === col.id && sortDirection === "ascending" ? <IconChevronUp /> : <IconChevronDown />}
          key={col.id}
          variant="secondary"
          screenReaderLabel={`Sort by ${col.label}`}
          onClick={() => {
            let direction = sortDirection;
            if (sortById === col.id) {
              direction = direction === "ascending" ? "descending" : "ascending";
            } else {
              direction = "ascending";
            }
            setSortById(col.id);
            setSortDirection(direction);
            setTableData(sortData(tableData, idx, direction));
          }}
          className="margin-responsive-r"
        >
          {col.label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="container-responsive">
      {true ? (
        <>
          {renderSortButtons()}
          <div className="flex flex-column">
            {tableData.map((row, i) => (
              <Card key={i} className="margin-responsive-b" orientation="vertical">
                <CardLayout>
                  <CardContent title={<h2>Row {i + 1}</h2>}>
                    {row.map((cell, j) => (
                      <div key={j} className="pad-responsive-b">
                        <strong>Column {j + 1}:</strong> {cell}
                      </div>
                    ))}
                  </CardContent>
                </CardLayout>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <DataTable
          id="responsive-table"
          isSortable
          sortById={sortById}
          sortDirection={sortDirection}
          onSortClick={handleSortClick}
        >
          <DataTableHead>
            <DataTableRow>
              {columns.map((col, idx) => (
                <DataTableHeadCell
                  key={col.id}
                  id={col.id}
                  colIndex={idx + 1}
                  isSortable
                >
                  {col.label}
                </DataTableHeadCell>
              ))}
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {tableData.map((row, i) => (
              <DataTableRow key={i}>
                {row.map((cell, j) => (
                  <DataTableCell key={j}>{cell}</DataTableCell>
                ))}
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      )}
    </div>
  );
}
```

# DataTable with Action Slots Example

You can add action slots to a DLS DataTable for common actions such as add, edit, and delete. Use DLS utility classes for layout and spacing, and DLS Button/IconButton components for actions.

```tsx
import React from "react";
import {
  DataTable,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
  DataTableCell,
  Button,
  IconButton
} from "@americanexpress/dls-react";
import { IconEdit, IconDelete, IconAdd } from "@americanexpress/dls-icons";

const tableData = [
  ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3", "Row 1 Col 4"],
  ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3", "Row 2 Col 4"],
  ["Row 3 Col 1", "Row 3 Col 2", "Row 3 Col 3", "Row 3 Col 4"],
  ["Row 4 Col 1", "Row 4 Col 2", "Row 4 Col 3", "Row 4 Col 4"],
  ["Row 5 Col 1", "Row 5 Col 2", "Row 5 Col 3", "Row 5 Col 4"],
];

export default function DataTableWithActions() {
  function handleAdd() {
    // Add row logic
  }
  function handleEdit(rowIndex) {
    // Edit row logic
  }
  function handleDelete(rowIndex) {
    // Delete row logic
  }

  return (
    <div className="container-responsive">
      <div className="flex flex-justify-end margin-responsive-b">
        <Button variant="primary" onClick={handleAdd}>
          <IconAdd size="sm" /> Add Row
        </Button>
      </div>
      <DataTable id="actions-table">
        <DataTableHead>
          <DataTableRow>
            <DataTableHeadCell>Column 1</DataTableHeadCell>
            <DataTableHeadCell>Column 2</DataTableHeadCell>
            <DataTableHeadCell>Column 3</DataTableHeadCell>
            <DataTableHeadCell>Column 4</DataTableHeadCell>
            <DataTableHeadCell>Actions</DataTableHeadCell>
          </DataTableRow>
        </DataTableHead>
        <DataTableBody>
          {tableData.map((row, i) => (
            <DataTableRow key={i}>
              {row.map((cell, j) => (
                <DataTableCell key={j}>{cell}</DataTableCell>
              ))}
              <DataTableCell>
                <div className="flex flex-justify-start flex-align-center">
                  <IconButton
                    icon={<IconEdit size="sm" />}
                    screenReaderLabel="Edit row"
                    onClick={() => handleEdit(i)}
                    className="margin-responsive-r"
                  />
                  <IconButton
                    icon={<IconDelete size="sm" />}
                    screenReaderLabel="Delete row"
                    onClick={() => handleDelete(i)}
                  />
                </div>
              </DataTableCell>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
}
```

- The table includes an "Actions" column with edit and delete buttons for each row.
- An "Add Row" button is placed above the table.
- Use DLS utility classes for spacing and alignment.

