# UI Modernization Guidance

## Modernizing Your UI Components

The recent UI changes have implemented a proper app shell structure with modern layout patterns. When creating new pages or components, follow these best practices:

### Basic Page Structure

```jsx
<div className="space-y-6">
  {/* Page Title */}
  <h1 className="text-2xl font-bold">Page Title</h1>

  {/* Filters Card */}
  <section className="card p-4">
    <div className="flex flex-wrap gap-4 items-center">{/* Filter components here */}</div>
  </section>

  {/* Content Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="card p-6">
      <h2 className="card-title">Chart Title</h2>
      <div className="mt-4">{/* Chart component here */}</div>
    </div>
    <div className="card p-6">
      <h2 className="card-title">Data Table</h2>
      <div className="mt-4">{/* Table component here */}</div>
    </div>
  </div>
</div>
```

### Common Utility Classes

- **Layout Containers**: Use `card`, `p-4`, `p-6` for content boxes
- **Grid Layouts**: Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Flex Layouts**: Use `flex items-center justify-between gap-4`
- **Spacing**: Use `space-y-6` for vertical spacing, `gap-4` for flex/grid gaps
- **Typography**: Use `text-2xl font-bold` for headings, `text-sm text-gray-500` for captions

### Component Best Practices

1. **Cards for Content**: Wrap all content sections in cards for consistency
2. **Responsive Grids**: Use grid layouts that adapt to screen size
3. **Proper Spacing**: Maintain consistent spacing between elements
4. **Consistent Typography**: Follow heading hierarchy (h1, h2, h3)
5. **Interactive Elements**: Ensure buttons and controls have proper padding (min 44px touch targets)

## UI Component Examples

### Data Cards

```jsx
<div className="card p-6">
  <div className="flex justify-between items-center">
    <h2 className="card-title">Revenue Summary</h2>
    <button className="btn btn-ghost">
      <RefreshIcon className="w-4 h-4" />
    </button>
  </div>
  <div className="mt-4">
    <div className="stats">
      <div className="stat">
        <div className="stat-title">Total Revenue</div>
        <div className="stat-value">$45,231</div>
        <div className="stat-desc text-success">↗︎ 14% increase</div>
      </div>
      <div className="stat">
        <div className="stat-title">Pending</div>
        <div className="stat-value">$12,480</div>
        <div className="stat-desc">21 invoices</div>
      </div>
    </div>
  </div>
</div>
```

### Form Layouts

```jsx
<div className="card p-6">
  <h2 className="card-title mb-4">Filter Options</h2>
  <form className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="form-control">
        <label className="label">Date Range</label>
        <select className="select select-bordered w-full">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">Vehicle Type</label>
        <select className="select select-bordered w-full">
          <option>All Types</option>
          <option>Trucks</option>
          <option>Vans</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">Status</label>
        <select className="select select-bordered w-full">
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="form-control pt-8">
        <button className="btn btn-primary">Apply Filters</button>
      </div>
    </div>
  </form>
</div>
```

These examples should help you build consistent, modern UI components throughout the application.
