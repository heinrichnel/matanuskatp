# UI Modernization Guide

## Overview

This guide outlines the new UI patterns and components implemented in the application to ensure a consistent, responsive, and user-friendly interface across all pages.

## Core Layout Structure

### App Shell Layout

The application uses a modern app shell layout with these key components:

```tsx
<div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
  {/* Top header */}
  <header className="bg-white shadow p-4 flex items-center">
    <span className="font-bold text-lg mr-4">MATANUSKA TRANSPORT</span>
    {/* ...other nav items */}
  </header>

  <div className="flex flex-1">
    {/* Sidebar */}
    <aside className="w-64 bg-white border-r flex flex-col min-h-screen">
      {/* Sidebar content */}
    </aside>

    {/* Main content area */}
    <main className="flex-1 p-8">
      {/* Page content */}
    </main>
  </div>
</div>
```

### Page Structure

Each page should follow this basic structure:

```tsx
<div className="space-y-6">
  {/* Page header with title and actions */}
  <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow">
    <div>
      <h1 className="text-2xl font-bold">Page Title</h1>
      <p className="text-sm text-gray-500">Page subtitle or description</p>
    </div>
    <div className="flex items-center gap-2">
      {/* Action buttons */}
    </div>
  </div>
  
  {/* Content sections */}
  <Card>
    <CardHeader heading="Section Title" />
    <CardContent>
      {/* Section content */}
    </CardContent>
  </Card>
</div>
```

## Reusable Components

### Card Components

Use the Card component family for all content sections:

```tsx
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";

<Card className="border border-gray-200">
  <CardHeader 
    heading="Section Title" 
    subtitle="Optional section description" 
  />
  <CardContent>
    {/* Content goes here */}
  </CardContent>
  <CardFooter>
    {/* Optional footer actions */}
  </CardFooter>
</Card>
```

### Filter Controls

Use the FilterControls component for consistent filtering UIs:

```tsx
import { FilterControls, FilterButton } from "../ui/FilterControls";

// In your component:
const [isFilterExpanded, setIsFilterExpanded] = useState(false);
const [filterOptions, setFilterOptions] = useState([
  { id: "option1", label: "Option 1", checked: false },
  { id: "option2", label: "Option 2", checked: true },
]);

// Render:
<>
  <FilterButton 
    isExpanded={isFilterExpanded}
    onClick={() => setIsFilterExpanded(!isFilterExpanded)} 
  />
  
  {isFilterExpanded && (
    <FilterControls
      title="Filters"
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      onApply={() => setIsFilterExpanded(false)}
      onClose={() => setIsFilterExpanded(false)}
    />
  )}
</>
```

## Grid Layouts

Use responsive grid layouts for arranging content:

```tsx
{/* For cards/widgets */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards go here */}
</div>

{/* For stats/small info cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stats cards go here */}
</div>
```

## Typography

Use consistent typography classes:

- Page titles: `text-2xl font-bold text-gray-800 dark:text-white`
- Section headings: `text-xl font-semibold text-gray-800 dark:text-white`
- Subsection headings: `text-lg font-medium text-gray-700 dark:text-gray-200`
- Labels/field names: `text-sm font-medium text-gray-500 uppercase`
- Body text: `text-gray-600 dark:text-gray-300`
- Small/helper text: `text-xs text-gray-500`

## Buttons and Actions

Use consistent button styles:

- Primary action: `px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg`
- Secondary action: `px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50`
- Danger action: `px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg`

For icon buttons:
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  <IconComponent size={16} />
  <span>Button Text</span>
</button>
```

## Form Elements

Use consistent form element styles:

- Text inputs: `block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`
- Checkboxes: `w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500`
- Select menus: `block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500`

## Tables

Use this structure for data tables:

```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Column 1
        </th>
        {/* More column headers */}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((item) => (
        <tr key={item.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{item.value}</div>
          </td>
          {/* More cells */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

## Status Indicators

Use consistent status indicators:

```tsx
<span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
  status === 'Active' ? 'bg-green-100 text-green-800' : 
  status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
  status === 'Error' ? 'bg-red-100 text-red-800' :
  'bg-gray-100 text-gray-800'
}`}>
  {status}
</span>
```

## Implementation Checklist

When modernizing a page:

1. **Structure**: Use the app shell and page structure patterns
2. **Components**: Replace divs with Card components
3. **Grid**: Use responsive grid layouts for content organization
4. **Typography**: Apply consistent text styling
5. **Controls**: Use FilterControls for filter interfaces
6. **Tables**: Update tables to use the consistent table pattern
7. **Actions**: Format buttons with the appropriate styles
8. **Forms**: Use consistent form element styles
9. **Testing**: Verify the page works on mobile, tablet, and desktop sizes
