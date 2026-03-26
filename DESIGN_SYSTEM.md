# LaunchPad Pro — Design System & UI Specifications

Based on the Figma design, here's the complete design system for implementation.

---

## 1. Color Palette

### Primary Colors
- **Deep Navy Background:** `#0A0A0B` (main app background)
- **Electric Indigo:** `#6366F1` (primary accent, buttons, highlights)
- **Indigo Glow:** `#818CF8` (secondary accent, hover states)

### Semantic Colors
- **Success:** `#10B981` (emerald green)
- **Warning:** `#F59E0B` (amber)
- **Danger:** `#EF4444` (red)
- **Info:** `#3B82F6` (blue)

### Neutral Colors
- **Card Background:** `#1A1A1E` (slightly lighter than main bg)
- **Border:** `#2D2D33` (subtle borders)
- **Text Primary:** `#F5F5F5` (off-white)
- **Text Secondary:** `#A0A0A8` (muted gray)
- **Text Tertiary:** `#6B6B75` (darker gray)

### Glassmorphism
- **Glass Background:** `rgba(26, 26, 30, 0.7)` with backdrop blur
- **Glass Border:** `rgba(255, 255, 255, 0.08)`

---

## 2. Typography

### Font Stack
- **Primary Font:** Inter (sans-serif)
- **Monospace:** JetBrains Mono (for code/data)

### Font Sizes & Weights
| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| H1 (Page Title) | 32px | 700 | 1.2 |
| H2 (Section) | 24px | 600 | 1.3 |
| H3 (Subsection) | 18px | 600 | 1.4 |
| Body Large | 16px | 400 | 1.6 |
| Body Regular | 14px | 400 | 1.6 |
| Body Small | 12px | 400 | 1.5 |
| Label | 11px | 500 | 1.4 |
| Caption | 10px | 400 | 1.4 |

---

## 3. Component Styling

### Buttons
- **Primary Button:** Indigo background with shimmer animation on hover
- **Secondary Button:** Transparent with indigo border
- **Ghost Button:** No background, text-only
- **Disabled State:** 50% opacity, cursor not-allowed
- **Border Radius:** 8px
- **Padding:** 12px 24px (large), 8px 16px (medium), 6px 12px (small)

### Cards
- **Background:** `#1A1A1E` with glassmorphism effect
- **Border:** 1px solid `rgba(255, 255, 255, 0.08)`
- **Border Radius:** 12px
- **Padding:** 24px
- **Box Shadow:** `0 8px 32px rgba(0, 0, 0, 0.3)`
- **Hover Effect:** Subtle lift with increased shadow

### Inputs
- **Background:** `#0F0F13`
- **Border:** 1px solid `#2D2D33`
- **Border Radius:** 8px
- **Padding:** 12px 16px
- **Focus State:** Border color changes to indigo, subtle glow

### Badges
- **Background:** Colored with low opacity (e.g., `rgba(99, 102, 241, 0.15)`)
- **Text Color:** Matching semantic color
- **Border Radius:** 6px
- **Padding:** 4px 12px

---

## 4. Dashboard Layout (Bento Grid)

### Grid Structure
- **Main Grid:** 4 columns on desktop, 2 on tablet, 1 on mobile
- **Gap:** 24px
- **Responsive Breakpoints:**
  - Desktop: 1280px+ (4 columns)
  - Tablet: 768px-1279px (2 columns)
  - Mobile: <768px (1 column)

### Dashboard Cards

#### 1. Revenue Potential Card
- **Size:** 2x1 (spans 2 columns)
- **Content:** Large number display with trend indicator
- **Visualization:** Mini area chart showing growth
- **Colors:** Indigo accent with emerald trend

#### 2. Market Score Card
- **Size:** 1x1
- **Content:** Circular progress indicator (0-100%)
- **Visualization:** Gauge chart
- **Colors:** Indigo to emerald gradient

#### 3. Leads Found Card
- **Size:** 1x1
- **Content:** Large number with percentage change
- **Visualization:** Mini bar chart
- **Colors:** Blue accent

#### 4. Courses Outlined Card
- **Size:** 1x1
- **Content:** Large number with recent activity
- **Visualization:** Mini line chart
- **Colors:** Amber accent

#### 5. Activity Feed Card
- **Size:** 2x2 (spans 2 columns, 2 rows)
- **Content:** Timeline of recent actions
- **Items:** Market research generated, course created, email sent
- **Each Item:** Icon, title, timestamp, status badge

#### 6. Quick Actions Card
- **Size:** 1x1
- **Content:** 4 action buttons in grid
- **Actions:** New Research, Create Course, Generate Emails, View ROI

#### 7. Recent Assets Card
- **Size:** 2x1
- **Content:** List of 5 most recent assets
- **Each Item:** Asset name, type badge, date, action menu

#### 8. Subscription Status Card
- **Size:** 1x1
- **Content:** Current plan, usage metrics, upgrade button
- **Visualization:** Progress bar for usage

---

## 5. ROI Predictor Design

### Layout
- **Left Panel (40%):** Input form and analysis parameters
- **Right Panel (60%):** Visualization and results

### Visualizations

#### Main Gauge Chart
- **Type:** Circular progress indicator
- **Range:** 0-100%
- **Color Gradient:** Red (0%) → Amber (33%) → Green (66%) → Emerald (100%)
- **Size:** 280px diameter
- **Center Display:** Large percentage number with label

#### Risk vs. Reward Breakdown
- **Type:** Horizontal stacked bar chart
- **Segments:** Risk (red), Neutral (gray), Opportunity (green)
- **Labels:** Percentage for each segment
- **Height:** 40px per bar

#### Success Factors List
- **Type:** Vertical list with icons
- **Items:** 5-7 key factors
- **Each Item:** Icon, factor name, importance score (1-10)
- **Colors:** Color-coded by importance

#### Revenue Potential Breakdown
- **Type:** Pie chart or donut chart
- **Segments:** By market segment or strategy
- **Colors:** Different indigo shades
- **Center:** Total revenue number

---

## 6. AI Output Reader

### Layout
- **Header:** Document title, metadata, export buttons
- **Content Area:** Full-width markdown rendering
- **Sidebar (optional):** Table of contents, bookmarks

### Styling
- **Background:** `#0A0A0B`
- **Text Color:** `#F5F5F5`
- **Code Blocks:** Dark gray background with syntax highlighting
- **Blockquotes:** Left border in indigo, italic text
- **Tables:** Bordered with alternating row colors
- **Links:** Indigo color with underline on hover

### Export Options
- **PDF:** Branded with LaunchPad Pro header/footer
- **Markdown:** Raw .md file download
- **Copy:** Copy all content to clipboard

---

## 7. Navigation & Sidebar

### Sidebar Layout
- **Width:** 280px (desktop), collapsible on mobile
- **Background:** `#0A0A0B` with subtle border
- **Items:** Vertical list with icons

### Navigation Items
1. **Dashboard** (icon: grid)
2. **Market Research** (icon: search)
3. **Course Architect** (icon: book)
4. **Cold Emailer** (icon: mail)
5. **ROI Predictor** (icon: trending-up)
6. **Asset Library** (icon: folder)
7. **Pricing** (icon: credit-card)
8. **Settings** (icon: gear)

### Active State
- **Background:** Subtle indigo tint
- **Left Border:** 3px solid indigo
- **Text:** Indigo color

---

## 8. Animations & Transitions

### Micro-interactions
- **Button Hover:** Shimmer effect, slight scale up
- **Card Hover:** Lift effect with shadow increase
- **Input Focus:** Subtle glow, border color change
- **Loading:** Skeleton shimmer effect
- **Success:** Green checkmark with fade-in

### Page Transitions
- **Duration:** 300ms
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Effect:** Fade + slight slide

### Chart Animations
- **Duration:** 800ms
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (bounce)
- **Effect:** Bars/lines grow from baseline

---

## 9. Spacing System

| Scale | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |

---

## 10. Shadow System

| Level | Value |
|-------|-------|
| sm | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| md | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| lg | `0 8px 16px rgba(0, 0, 0, 0.15)` |
| xl | `0 12px 32px rgba(0, 0, 0, 0.2)` |
| 2xl | `0 20px 48px rgba(0, 0, 0, 0.3)` |

---

## 11. Border Radius System

| Size | Value |
|------|-------|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

---

## 12. Implementation Checklist

- [ ] Update CSS variables in `index.css` with new color palette
- [ ] Create reusable component library (Button, Card, Badge, etc.)
- [ ] Implement bento-grid dashboard layout
- [ ] Build ROI Predictor visualizations with Recharts
- [ ] Update all pages to use new design system
- [ ] Add animations and transitions
- [ ] Test responsive design on mobile/tablet
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## 13. Design Tokens (CSS Variables)

```css
/* Colors */
--color-navy: #0A0A0B;
--color-card: #1A1A1E;
--color-indigo: #6366F1;
--color-indigo-light: #818CF8;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-danger: #EF4444;
--color-info: #3B82F6;
--color-text-primary: #F5F5F5;
--color-text-secondary: #A0A0A8;
--color-text-tertiary: #6B6B75;
--color-border: #2D2D33;

/* Spacing */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;

/* Typography */
--font-primary: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Shadows */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.15);
--shadow-xl: 0 12px 32px rgba(0, 0, 0, 0.2);
```

---

**Last Updated:** March 26, 2026  
**Status:** Ready for Implementation  
**Next Steps:** Apply design system to all pages, starting with Dashboard and ROI Predictor
