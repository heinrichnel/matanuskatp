# 🧭 Matanuska Transport – Dashboard UI & Style Guide

> This document defines the layout, colors, components, and behavioral standards for all dashboards in the system. It is designed to support clean, analytical interfaces with seamless front-end/backend alignment.

---

## 🔧 Layout & Structural Standards

| Section        | Description |
|----------------|-------------|
| **Header**     | Contains logo, profile icon, language selector, and notifications |
| **Sidebar**    | Navigation menu with icons and descriptions (Trips, Diesel, Tyres, Costs) |
| **Main Panel** | Dynamic content area that changes based on selected module |
| **Footer (Optional)** | For versioning, system status, or latency if required |

---

## 🎨 Color Palette

| Purpose         | Hex Code        | Usage                       |
|------------------|------------------|------------------------------|
| Primary (Action) | `#005f73`        | Primary buttons, links       |
| Secondary (BG)   | `#f1f1f1`        | Backgrounds, containers      |
| Warning          | `#ffb703`        | Alerts, toast warnings       |
| Error            | `#d90429`        | Critical errors              |
| Success          | `#2a9d8f`        | Approvals, positive statuses |
| Neutral          | `#000` / `#fff`  | Text, background contrast    |

---

## 📦 Core UI Components

### ✅ Primary Components

- **Button**
  - Sizes: `sm` | `md` | `lg`
  - Types: primary, secondary, danger
  - Optional icons

- **Cards**
  - Elevation on hover
  - Title + icon in header
  - Content and optional footer action

- **Tables**
  - Sticky headers
  - Filter/sortable columns
  - Alternating row colors for readability

- **Modals**
  - Max 80% width
  - Can be closed via `X` or outside click
  - Used for:
    - Trip Edit
    - Diesel Debrief
    - Import Costs

---

## 📊 Charts & Analytics Components

| Chart Type | Purpose                                | Example Component             |
|------------|----------------------------------------|-------------------------------|
| Bar        | Compare diesel consumption by fleet    | `/Diesel/Dashboard.tsx`       |
| Pie        | Show cost category distribution        | `/Costs/Overview.tsx`         |
| Line       | KM vs Time tracking                    | `/Trips/Timeline.tsx`         |

Libraries: **Chart.js**, **Recharts**, or **React-Vis**

---

## 💻 Responsive Design Principles

- **Mobile-first** design
- Breakpoints:
  - `sm`: < 640px
  - `md`: 641px – 1024px
  - `lg`: > 1024px
- Sidebars collapse into hamburger menu on mobile

---

## 🔍 UX & Interaction Guidelines

- **Toasts** for success/failure (auto-dismiss after 3–5s)
- **Tooltips** on all icons and shorthand buttons
- **Spinners** for loading Firestore/API operations
- **Cancel/Back** actions always visible
- **Edit/Delete** always require confirmation modal

---

## 🧪 UI Functional Checklist

| Checkpoint                        | Status     |
|----------------------------------|------------|
| Consistent padding and spacing   | ✅          |
| Form field labeling + validation | ✅          |
| Mobile nav collapses correctly   | ✅          |
| Keyboard + ARIA accessibility    | ⏳ In Progress |
| Optional: Dark mode support      | 🔄 Planned  |

---

## 📁 Component Structure (Proposed)

