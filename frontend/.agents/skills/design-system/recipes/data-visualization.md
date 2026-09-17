---
name: Data Visualization
description: Guidelines for how to create a data visualization or data chart.
---

Follow the below instructions in order to create a chart of the following type:

- Bar
- Line
- Area
- Scatter
- Bubble
- Pie
- Donut

### Installation

Ensure that `package.json` has the following dependencies installed:

- `ag-charts-community@^10.3.9`
- `ag-charts-react@^10.3.9`
- `@americanexpress/dls-data-visualization@7.15.0`

If they are not installed, install them via `npm`:

```bash
npm install ag-charts-community@^10.3.9 ag-charts-react@^10.3.9 @americanexpress/dls-data-visualization
```

### Usage

If working in JavaScript, follow the below code example.

```jsx
import React from 'react';
import { AgCharts } from 'ag-charts-react';
import {
  dlsTheme,
  dlsThemeDark,
} from '@americanexpress/dls-data-visualization/ag-charts-10';

const [mode, setMode] = useState('light');
const barChartOptions = {
  // populate other properties based on the chart type
  theme: mode === 'dark' ? dlsThemeDark : dlsTheme,
};

return <AgCharts options={barChartOptions} />;
```

If working in TypeScript, follow the below code example.

```tsx
import React from 'react';
import { AgCharts, AgChartProps } from 'ag-charts-react';
import {
  dlsTheme,
  dlsThemeDark,
} from '@americanexpress/dls-data-visualization/ag-charts-10';

const [mode, setMode] = useState('light');
const barChartOptions: AgChartProps['options'] = {
  // populate other properties based on the chart type
  theme: mode === 'dark' ? dlsThemeDark : dlsTheme,
};

return <AgCharts options={barChartOptions} />;
```

Based on the Chart Type, refer to the Documentation URL:

| Chart Type        | Documentation URL                                                       |
| ----------------- | ----------------------------------------------------------------------- |
| Bar Chart         | https://www.ag-grid.com/charts/archive/10.3.9/react/bar-series          |
| Line Chart        | https://www.ag-grid.com/charts/archive/10.3.9/react/line-series         |
| Area Chart        | https://www.ag-grid.com/charts/archive/10.3.9/react/area-series         |
| Scatter Chart     | https://www.ag-grid.com/charts/archive/10.3.9/react/scatter-series      |
| Bubble Chart      | https://www.ag-grid.com/charts/archive/10.3.9/react/bubble-series       |
| Pie Chart         | https://www.ag-grid.com/charts/archive/10.3.9/react/pie-series          |
| Donut Chart       | https://www.ag-grid.com/charts/archive/10.3.9/react/donut-series        |
| Combination Chart | https://www.ag-grid.com/charts/archive/10.3.9/react/combination-series/ |
