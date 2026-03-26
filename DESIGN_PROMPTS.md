# LaunchPad Pro — Design Implementation Prompts

Use these prompts with Figma AI or design tools to generate professional mockups for each page.

---

## 1. Dashboard Page Design Prompt

**Prompt:**
```
Design a sophisticated B2B SaaS dashboard for "LaunchPad Pro" - an AI-powered business growth platform.

Style: Dark enterprise aesthetic with deep navy background (#0A0A0B), electric indigo accents (#6366F1), 
and glassmorphism cards.

Layout: Bento-grid dashboard with 4 key metric cards:
1. Revenue Potential (2x1 grid span) - Large number display ($124,500) with mini area chart showing growth trend
2. Market Score (1x1) - Circular gauge chart showing 78% market fit score with emerald gradient
3. Leads Found (1x1) - Large number (342) with weekly trend (+18) and mini bar chart
4. Courses Outlined (1x1) - Large number (12) with 3 mini progress bars for course completion

Additional cards:
- Activity Feed (2x2) - Timeline of recent actions (market research, course creation, emails, ROI analysis)
- Quick Actions (1x1) - 4 action buttons in grid layout
- Subscription Status (1x1) - Plan info, usage meter, upgrade button
- Recent Assets (2x1) - List of 5 recent generated assets with type badges

Color coding by feature:
- Market Research: Indigo/Violet
- Courses: Blue
- Emails: Emerald Green
- ROI Analysis: Amber/Gold

Typography: Inter font, clean hierarchy with H2 for sections, body text for descriptions.
Animations: Subtle hover lift on cards, smooth transitions on metrics.
```

---

## 2. Landing Page Design Prompt

**Prompt:**
```
Design a modern, high-converting landing page for "LaunchPad Pro" - an AI B2B growth suite.

Hero Section:
- Headline: "Launch Faster. Grow Smarter." (large, bold, with gradient text from indigo to purple)
- Subheadline: "The all-in-one AI platform for entrepreneurs — from deep market research 
  and course creation to hyper-personalized cold outreach. Built for global founders."
- CTA Buttons: "Start Free Trial" (primary indigo button with shimmer effect) and "View Pricing" (secondary)
- Background: Dark navy with subtle animated mesh gradient (indigo and purple radial gradients)
- Hero Image/Graphic: Dashboard preview or abstract AI visualization

Features Section (3 columns):
1. AI Market Research
   - Icon: Magnifying glass / chart
   - Title: "AI Market Research"
   - Description: "Generate deep-dive competitor and market analysis reports in minutes"
   
2. Course Architect
   - Icon: Book / graduation cap
   - Title: "AI Course Architect"
   - Description: "Transform topics into structured 8-module courses with lesson scripts"
   
3. Cold Emailer
   - Icon: Mail / sparkles
   - Title: "Hyper-Personalized Outreach"
   - Description: "AI-generated custom opening lines based on lead's recent activity"

Stats Section:
- 4+ AI Providers (OpenRouter, Gemini, OpenAI, Anthropic)
- 3 Core Tools (Market Research, Courses, Emails)
- 8 Course Modules (per course)
- ∞ Asset Storage

Pricing Section:
- 3 tiers: Starter ($49/mo), Pro ($99/mo), Agency ($199/mo)
- Feature comparison table
- "Global Payments via Paddle" badge

CTA Section:
- "Ready to scale your business?" headline
- "Start your free trial today" button
- "No credit card required" subtext

Color Scheme: Navy background, indigo accents, emerald for success/features, amber for highlights
Typography: Large bold headlines, clean body text, monospace for code/data
```

---

## 3. Market Research Page Design Prompt

**Prompt:**
```
Design a professional AI-powered market research tool interface.

Left Panel (40% width):
- Title: "AI Market Research"
- Subtitle: "Generate deep-dive competitor and market analysis reports"
- Input Form:
  * Topic/Industry input field (placeholder: "e.g., AI-powered CRM for SMBs")
  * Competitors textarea (placeholder: "e.g., Salesforce, HubSpot, Pipedrive")
  * Research Depth selector (3 buttons: Quick Scan, Standard, Comprehensive)
  * AI Provider dropdown (Auto, OpenRouter, OpenAI, Anthropic, Gemini)
  * Generate button (large, indigo, with shimmer effect)
- Pro Tips card with 4 tips (checkmark icons)

Right Panel (60% width):
- Loading State: Animated spinner with "Analyzing Market..." text and progress steps
- Result State:
  * Header with "Report Generated" badge, provider/model info
  * Action buttons: Copy, Download .md, Export PDF
  * Markdown content viewer with syntax highlighting
  * Scrollable content area with proper markdown styling

Color Scheme: Dark cards with indigo accents, violet icons for research
Interactions: Smooth transitions, loading animations, success toasts
```

---

## 4. Course Architect Page Design Prompt

**Prompt:**
```
Design an AI course creation tool interface.

Layout: 2-column (form + output)

Left Panel - Course Input Form:
- Title: "AI Course Architect"
- Subtitle: "Transform topics into structured 8-module courses"
- Topic input field
- Target Audience textarea
- Course Level selector (Beginner, Intermediate, Advanced)
- Generate button

Right Panel - Course Output:
- Loading state with animation
- Result state showing:
  * Course title
  * 8 expandable module cards with:
    - Module name
    - Learning objectives (bullet list)
    - Lesson names
    - Slide outline
    - Estimated duration
  * Export buttons (PDF, Markdown, Save to Assets)

Module Card Design:
- Accordion-style with expand/collapse
- Color-coded by module (gradient from indigo to emerald)
- Icons for each module type
- Smooth animations on expand/collapse

Color Scheme: Blue accents for courses, indigo for primary actions
Typography: Clean hierarchy, monospace for code examples
```

---

## 5. Cold Emailer Page Design Prompt

**Prompt:**
```
Design a hyper-personalized email generation tool.

Layout: 2-column (input + output)

Left Panel - Lead Information:
- Title: "Hyper-Personalized Cold Emailer"
- Subtitle: "AI-generated custom opening lines based on lead's recent activity"
- Form fields:
  * Lead name input
  * Company name input
  * Recent activity/context textarea (placeholder: "Recent LinkedIn posts, news, product launches")
  * Number of variations slider (1-5)
  * Generate button

Right Panel - Email Output:
- Loading state
- Result state showing:
  * Multiple email variations (tabs or cards)
  * Each email with:
    - Subject line (bold)
    - Opening line (highlighted)
    - Body paragraphs
    - CTA with link
    - Signature
  * Copy, Download, Save buttons for each variation

Email Styling:
- Clean, professional formatting
- Personalization highlighted in indigo
- Easy-to-copy sections

Color Scheme: Emerald accents for emails, indigo for highlights
Interactions: Tab switching between variations, smooth transitions
```

---

## 6. ROI Predictor Page Design Prompt

**Prompt:**
```
Design an advanced ROI prediction and analysis tool.

Layout: 2-column (input + visualization)

Left Panel - Analysis Input:
- Title: "Market ROI Predictor"
- Subtitle: "Analyze market research data to predict success probability"
- Market research data input (textarea or paste)
- Analysis parameters:
  * Market size estimate
  * Competition level (slider)
  * Target audience size
  * Analyze button

Right Panel - ROI Visualization:
- Main Circular Gauge Chart (280px diameter):
  * Shows success probability (0-100%)
  * Color gradient: Red (0%) → Amber (33%) → Green (66%) → Emerald (100%)
  * Large percentage number in center
  * Label below gauge

- Risk vs. Reward Breakdown:
  * Horizontal stacked bar chart
  * Segments: Risk (red), Neutral (gray), Opportunity (green)
  * Percentage labels

- Success Factors List:
  * 5-7 key factors with importance scores
  * Color-coded by importance
  * Icons for each factor

- Revenue Potential Breakdown:
  * Pie or donut chart
  * Segments by market segment
  * Total revenue number in center

Color Scheme: Gradient from red to emerald, indigo accents
Visualizations: Smooth animations, data-driven styling
Typography: Large numbers, clear labels
```

---

## 7. Pricing Page Design Prompt

**Prompt:**
```
Design a modern SaaS pricing page.

Hero Section:
- Headline: "Simple, Transparent Pricing"
- Subheadline: "Choose the plan that fits your business"
- Toggle: Monthly / Annual (with discount badge)

Pricing Cards (3 columns):
1. Starter - $49/month
   - Icon: Rocket
   - Description: "Perfect for solopreneurs"
   - Features: 10 market research reports, 5 courses, 50 cold emails/month
   - CTA: "Start Free Trial"

2. Pro - $99/month (highlighted/featured)
   - Icon: Zap
   - Description: "For growing businesses"
   - Features: Unlimited research, 20 courses, 500 cold emails/month, ROI predictor
   - Badge: "Most Popular"
   - CTA: "Get Started"

3. Agency - $199/month
   - Icon: Crown
   - Description: "For agencies and teams"
   - Features: Everything in Pro + team collaboration, API access, custom integrations
   - CTA: "Contact Sales"

Each card shows:
- Price
- Billing cycle
- Feature list with checkmarks
- CTA button
- Hover effect with lift animation

Feature Comparison Table:
- Rows: All features across plans
- Columns: Starter, Pro, Agency
- Checkmarks for included features
- "Coming soon" for future features

FAQ Section:
- 5-6 common questions
- Accordion-style with smooth expand/collapse

Payment Note:
- "Global payments via Paddle - handles international taxes for non-US residents"

Color Scheme: Indigo for primary CTA, emerald for popular/recommended, navy background
```

---

## 8. Settings Page Design Prompt

**Prompt:**
```
Design a user settings and profile management page.

Layout: Sidebar navigation + main content area

Left Sidebar:
- Profile section (avatar, name, email)
- Settings menu items:
  * Profile
  * Subscription & Billing
  * API Keys
  * Notifications
  * Integrations
  * Security
  * Sign Out

Main Content Area:

Profile Tab:
- Name, email, avatar upload
- Bio/company info
- Save button

Subscription Tab:
- Current plan display
- Usage metrics (AI calls, tokens, success rate)
- Upgrade/downgrade buttons
- Billing history table

API Keys Tab:
- List of API keys
- Generate new key button
- Copy/delete actions for each key
- Usage statistics

Notifications Tab:
- Toggle switches for different notification types
- Email frequency selector

Security Tab:
- Password change form
- Active sessions list
- Sign out all devices button

Color Scheme: Indigo accents, emerald for success actions
Interactions: Smooth transitions, confirmation dialogs for destructive actions
```

---

## 9. Asset Library / History Page Design Prompt

**Prompt:**
```
Design an asset management and history page.

Header:
- Title: "Asset Library"
- Search bar (with icon)
- Filter buttons: All, Market Research, Courses, Emails
- Sort dropdown: Newest, Oldest, A-Z, Most Used

Asset Grid (3 columns on desktop, 2 on tablet, 1 on mobile):
- Each asset card shows:
  * Type icon and badge (colored by type)
  * Title
  * Brief description (first 100 chars)
  * Creation date
  * Action menu (view, export, delete)
  * Hover effect with preview

Empty State:
- Icon
- "No assets yet"
- "Create your first asset by running Market Research or building a Course"
- CTA button

Asset Detail View (modal or separate page):
- Full title
- Metadata (type, created date, last modified)
- Export options (PDF, Markdown, Copy)
- Full markdown content viewer
- Delete button

Filters & Search:
- Search by title/description
- Filter by type
- Sort options
- Results counter

Color Scheme: Type-specific colors (indigo for research, blue for courses, emerald for emails)
Interactions: Smooth transitions, confirmation dialogs for delete
```

---

## 10. Design System Implementation Checklist

### Colors
- [ ] Update all color variables to match design system
- [ ] Implement color-coded feature icons and badges
- [ ] Create gradient utilities for text and backgrounds
- [ ] Test color contrast for accessibility (WCAG AA)

### Typography
- [ ] Verify Inter font is loaded and applied
- [ ] Implement font size scale (H1-H6, body, caption)
- [ ] Apply font weights (400, 500, 600, 700)
- [ ] Test line heights for readability

### Components
- [ ] Update Button styles (primary, secondary, ghost, disabled)
- [ ] Update Card styles with glassmorphism effect
- [ ] Update Input/Textarea styles
- [ ] Create Badge component with color variants
- [ ] Create Gauge chart component for ROI predictor

### Animations
- [ ] Implement shimmer loading effect
- [ ] Add card hover lift animation
- [ ] Add button shimmer/glow effect
- [ ] Add smooth page transitions
- [ ] Add chart animation effects

### Responsive Design
- [ ] Test on mobile (375px), tablet (768px), desktop (1280px)
- [ ] Verify grid layouts adapt correctly
- [ ] Test touch interactions on mobile
- [ ] Optimize performance on slower connections

### Accessibility
- [ ] Verify color contrast ratios
- [ ] Test keyboard navigation
- [ ] Add ARIA labels where needed
- [ ] Test with screen readers

---

## 11. Quick Implementation Guide

### For Developers:

1. **Update CSS Variables** in `client/src/index.css`:
   ```css
   :root {
     --color-navy: #0A0A0B;
     --color-card: #1A1A1E;
     --color-indigo: #6366F1;
     --color-indigo-light: #818CF8;
     --color-emerald: #10B981;
     --color-blue: #3B82F6;
     --color-amber: #F59E0B;
   }
   ```

2. **Create Gauge Component** for ROI Predictor:
   ```tsx
   // Use Recharts for circular progress visualization
   import { PieChart, Pie, Cell } from 'recharts';
   ```

3. **Implement Bento Grid** for Dashboard:
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     {/* Cards with specific col-span values */}
   </div>
   ```

4. **Add Animations** in CSS:
   ```css
   @keyframes shimmer { ... }
   @keyframes pulse-glow { ... }
   .card-hover:hover { transform: translateY(-2px); }
   ```

---

**Last Updated:** March 26, 2026  
**Status:** Ready for Implementation  
**Next Steps:** Use these prompts with Figma AI or design tools, then implement CSS/component updates
