# Mobile Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make Courel Energy comfortably usable on mobile devices (375px - 768px) through targeted CSS improvements without modifying JavaScript or HTML structure.

**Architecture:** Add granular media queries and mobile-specific CSS rules to `globals.css` in an isolated section. All changes are purely presentational (CSS-only) and maintain existing functionality. Conservative approach with surgical, low-risk modifications.

**Tech Stack:** CSS3, Media Queries, CSS Variables (already in use)

**Design Document:** `docs/plans/2026-03-16-mobile-optimization-design.md`

---

## Testing Strategy

Since this is CSS-only work, testing is manual and visual:
- **DevTools Testing**: Chrome Device Toolbar with preset viewports (iPhone 12: 390px, Galaxy S21: 360px, iPad mini: 768px)
- **Real Device Testing**: Test on personal mobile phone at key milestones
- **Verification**: Check that all interactive elements are touchable (44px minimum), text is legible, no horizontal overflow

---

## Task 1: Foundation Setup

**Files:**
- Modify: `app/layout.tsx` (add viewport meta tag)
- Modify: `app/globals.css` (create mobile section)

**Step 1: Add viewport meta tag**

Open `app/layout.tsx` and locate the `<head>` section. If there's no explicit `<head>`, add viewport to the HTML return:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body suppressHydrationWarning>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

**Note:** If Next.js gives an error about `<head>` in app directory, use the `Metadata` API instead (check Next.js 16 docs if needed).

**Step 2: Create mobile optimization section**

Open `app/globals.css` and scroll to the very end (after line 615). Add:

```css

/* ── MOBILE OPTIMIZATIONS ────────────────────── */
/* Added: 2026-03-16 */
/* Design Doc: docs/plans/2026-03-16-mobile-optimization-design.md */

/* Breakpoint Reference:
   375px  - Mobile Small (iPhone SE, compact Android)
   480px  - Mobile Standard (most smartphones)
   600px  - Mobile Large / Phablet
   768px  - Tablet Portrait
   1024px - Tablet Landscape / Desktop Small
*/

/* ── Foundation ────────────────────────────── */

/* Base mobile adjustments */
@media (max-width: 768px) {
  body {
    line-height: 1.6; /* Increased from 1.5 for better readability */
  }

  .app {
    padding: 1rem; /* Reduced from 2rem 1.5rem */
  }
}
```

**Step 3: Test foundation changes**

1. Run dev server: `npm run dev`
2. Open Chrome DevTools → Device Toolbar
3. Select "iPhone 12 Pro" (390px)
4. Verify:
   - No pinch-zoom UI elements (viewport working)
   - `.app` container has less padding
5. Check console for any Next.js warnings about metadata

**Step 4: Commit foundation**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(mobile): add viewport meta and mobile CSS foundation

- Add viewport meta tag to prevent mobile zoom
- Create mobile optimizations section in globals.css
- Adjust base app padding for mobile screens"
```

---

## Task 2: Navigation and Header

**Files:**
- Modify: `app/globals.css` (lines after mobile section created in Task 1)

**Step 1: Add navigation mobile styles**

Append to the `/* MOBILE OPTIMIZATIONS */` section:

```css

/* ── Navigation ────────────────────────────── */

/* Reduce navigation padding on mobile */
@media (max-width: 600px) {
  .nav {
    padding: 0 1rem; /* Reduced from 0 2rem */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Hide scrollbar Firefox */
  }

  .nav::-webkit-scrollbar {
    display: none; /* Hide scrollbar Chrome/Safari */
  }

  .nav-logo {
    font-size: 16px; /* Reduced from 20px */
    padding: 0.75rem 1rem 0.75rem 0; /* More compact */
    margin-right: 1rem; /* Reduced from 1.5rem */
  }

  .nav-logo svg {
    width: 18px; /* Reduced from 22px */
    height: 18px;
  }

  .tab-btn {
    padding: 0.75rem 1rem; /* Reduced from 1rem 1.25rem */
    font-size: 13px; /* Reduced from 15px */
    white-space: nowrap;
  }

  .tab-btn-sm {
    padding: 4px 0; /* Reduced from 6px */
    font-size: 12px; /* Reduced from 13px */
  }
}

/* Extra small screens - hide logo text, show only icon */
@media (max-width: 400px) {
  .nav-logo {
    font-size: 0; /* Hide text */
  }

  .nav-logo svg {
    font-size: initial; /* Keep icon visible */
    width: 20px;
    height: 20px;
  }
}
```

**Step 2: Test navigation responsiveness**

1. Refresh browser in DevTools Device Mode
2. Test at 375px (iPhone SE):
   - Logo should be compact
   - Tabs should scroll horizontally without wrapping
   - No visible scrollbar
3. Test at 390px (iPhone 12):
   - All tabs accessible via scroll
   - Touch targets feel comfortable
4. Test at 768px (iPad):
   - Navigation should look normal

**Step 3: Commit navigation changes**

```bash
git add app/globals.css
git commit -m "feat(mobile): optimize navigation for small screens

- Enable horizontal scroll for tabs on mobile
- Reduce nav padding and font sizes
- Hide logo text on very small screens (<400px)
- Hide scrollbar while maintaining functionality"
```

---

## Task 3: Forms and Input Fields

**Files:**
- Modify: `app/globals.css`

**Step 1: Add form mobile styles**

Append to mobile section:

```css

/* ── Forms and Inputs ──────────────────────── */

/* Touch-friendly inputs with iOS zoom prevention */
@media (max-width: 768px) {
  input[type=number],
  input[type=text],
  input[type=email],
  input[type=password],
  select {
    font-size: 16px; /* Must be >= 16px to prevent iOS zoom */
    min-height: 44px; /* iOS touch target guideline */
    padding: 10px; /* Increased from 7px 10px */
  }

  /* Labels maintain readability */
  label {
    font-size: 11px; /* Keep current, but ensure spacing */
    margin-bottom: 6px; /* Increased from 4px */
  }

  /* Auth form inputs (override font-family) */
  .auth-field input[type=email],
  .auth-field input[type=password],
  .auth-field input[type=text] {
    font-size: 16px; /* Override to prevent zoom */
  }
}

/* Button touch targets */
@media (max-width: 600px) {
  button,
  .btn {
    min-height: 44px; /* Touch-friendly */
    padding: 10px 16px; /* Increased from 7px 14px */
  }

  .btn-sm {
    min-height: 36px; /* Smaller buttons still touchable */
    padding: 8px 12px; /* Increased from 4px 10px */
  }

  /* Tarifa form compact */
  .tarifa-form {
    padding: 1rem; /* Reduced from 1.25rem */
  }
}

/* Full-width primary buttons on very small screens */
@media (max-width: 480px) {
  .btn-primary {
    width: 100%;
    margin-bottom: 0.75rem;
  }

  /* Auth page full-width buttons */
  .auth-container button,
  .auth-container .btn {
    width: 100%;
  }
}
```

**Step 2: Test form interactions**

1. Navigate to `/register` in DevTools (375px)
2. Tap on email input:
   - Should NOT trigger iOS zoom (verify font-size >= 16px in inspector)
   - Input height should be comfortably tappable
3. Test button interactions:
   - Verify 44px minimum height
   - Check touch feedback (active state)
4. Test on real mobile device if possible

**Step 3: Commit form improvements**

```bash
git add app/globals.css
git commit -m "feat(mobile): improve form usability and touch targets

- Set input font-size to 16px to prevent iOS zoom
- Increase min-height to 44px for touch accessibility
- Make primary buttons full-width on small screens
- Adjust padding for better touch ergonomics"
```

---

## Task 4: Grid System Responsiveness

**Files:**
- Modify: `app/globals.css`

**Step 1: Add grid collapse styles**

Append to mobile section:

```css

/* ── Grid System ───────────────────────────── */

/* Single column on very small screens */
@media (max-width: 480px) {
  .g2, .g3, .g4, .g5 {
    grid-template-columns: 1fr; /* Force single column */
    gap: 8px; /* Reduced from 12px */
  }
}

/* Two columns for medium grids */
@media (min-width: 481px) and (max-width: 600px) {
  .g3, .g4, .g5 {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

/* Tablet adjustments */
@media (min-width: 601px) and (max-width: 768px) {
  .g4, .g5 {
    grid-template-columns: repeat(2, 1fr);
  }

  .g3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Month grid specific (already has 600px breakpoint, enhance it) */
@media (max-width: 375px) {
  .month-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for tiny screens */
    gap: 4px;
  }
}

@media (min-width: 376px) and (max-width: 600px) {
  .month-grid {
    grid-template-columns: repeat(3, 1fr); /* Current behavior maintained */
  }
}
```

**Step 2: Test grid responsiveness**

1. Navigate to dashboard page (need to be logged in)
2. Test at 375px:
   - All grids (g2, g3, g4, g5) should show 1 column
   - Month grid shows 2 columns
3. Test at 500px:
   - g3, g4, g5 show 2 columns
   - g2 shows 2 columns
4. Test at 700px:
   - Check existing breakpoint behavior maintained

**Step 3: Commit grid changes**

```bash
git add app/globals.css
git commit -m "feat(mobile): make grids responsive with column collapse

- Single column layout for all grids on <480px
- Two columns for complex grids on 480-600px
- Month grid shows 2 columns on smallest screens
- Responsive gap sizing for better mobile spacing"
```

---

## Task 5: Tables with Horizontal Scroll

**Files:**
- Modify: `app/globals.css`

**Step 1: Add table mobile styles**

Append to mobile section:

```css

/* ── Tables ────────────────────────────────── */

/* Horizontal scroll with visual indicators */
@media (max-width: 768px) {
  .tbl-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    position: relative;

    /* Gradient shadows for scroll feedback */
    background:
      linear-gradient(90deg, var(--bg2) 30%, transparent),
      linear-gradient(90deg, transparent, var(--bg2) 70%) 100% 0,
      linear-gradient(90deg, rgba(255,255,255,0.1), transparent 30%),
      linear-gradient(270deg, rgba(255,255,255,0.1), transparent 30%) 100% 0;
    background-repeat: no-repeat;
    background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
    background-attachment: local, local, scroll, scroll;
  }

  /* Sticky first column */
  table th:first-child,
  table td:first-child {
    position: sticky;
    left: 0;
    background: var(--bg2);
    z-index: 1;
    box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  }

  /* Reduce table typography */
  table {
    font-size: 12px; /* Reduced from 13px */
  }

  th {
    font-size: 10px; /* Reduced from 11px */
    padding: 6px 8px; /* Reduced from 8px 10px */
  }

  td {
    padding: 6px 8px;
  }

  /* Table inputs prevent zoom */
  td input {
    font-size: 14px; /* Prevent iOS zoom */
    padding: 6px;
    min-height: 36px; /* Touch-friendly but compact */
  }

  /* Interactive rows touch-friendly */
  tbody tr {
    min-height: 44px;
  }
}
```

**Step 2: Test table functionality**

1. Navigate to a page with tables (rates/consumptions in dashboard)
2. Test at 375px:
   - Table should scroll horizontally
   - First column should stay fixed (sticky)
   - Gradient shadows visible at edges
3. Try editing table inputs:
   - Should not trigger zoom
   - Touch targets comfortable
4. Verify no horizontal body scroll (only table scrolls)

**Step 3: Commit table improvements**

```bash
git add app/globals.css
git commit -m "feat(mobile): add horizontal scroll with sticky column for tables

- Enable touch-friendly horizontal scroll for wide tables
- Make first column sticky for context while scrolling
- Add gradient shadows for scroll position feedback
- Reduce typography for better mobile fit
- Ensure table inputs prevent iOS zoom"
```

---

## Task 6: Cards and Result Grid

**Files:**
- Modify: `app/globals.css`

**Step 1: Add card and result grid styles**

Append to mobile section:

```css

/* ── Cards and Result Grid ─────────────────── */

/* Compact cards */
@media (max-width: 600px) {
  .card {
    padding: 1rem; /* Reduced from 1.5rem */
    margin-bottom: 1rem; /* Reduced from 1.25rem */
  }

  .card-sm {
    padding: 0.75rem; /* Reduced from 1rem */
  }

  /* Detail panel */
  .detail-panel {
    padding: 1rem; /* Reduced from 1.5rem */
  }

  /* Invoice display */
  .inv {
    padding: 1rem; /* Reduced from 1.25rem */
  }

  .inv-row {
    font-size: 12px; /* Reduced from 13px */
  }

  .inv-total .val {
    font-size: 18px; /* Reduced from 20px */
  }
}

/* Result cards grid adaptation */
@media (max-width: 480px) {
  .res-grid {
    grid-template-columns: 1fr; /* Single column */
    gap: 10px; /* Reduced from 12px */
  }

  .res-card .nom {
    white-space: normal; /* Allow text wrap */
    overflow: visible;
    text-overflow: clip;
    max-height: 2.8em; /* Approx 2 lines */
    line-height: 1.4;
  }

  .res-card .price {
    font-size: 20px; /* Reduced from 22px */
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .res-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 fixed columns */
  }
}

/* Chips compact */
@media (max-width: 600px) {
  .chips {
    gap: 6px; /* Reduced from 8px */
  }

  .chip {
    padding: 6px 10px; /* Reduced from 8px 12px */
  }

  .chip .cv {
    font-size: 13px; /* Reduced from 15px */
  }
}
```

**Step 2: Test cards and grids**

1. Navigate to simulation results page
2. Test at 375px:
   - Result cards show 1 per row
   - Tariff names wrap to 2 lines max
   - Card padding feels appropriate
3. Test at 500px:
   - Result cards show 2 per row
4. Test chips display (if any visible):
   - Compact but readable

**Step 3: Commit card optimizations**

```bash
git add app/globals.css
git commit -m "feat(mobile): optimize cards and result grids for small screens

- Reduce card padding for better space utilization
- Single column result grid on small screens
- Allow tariff names to wrap (max 2 lines)
- Compact chip sizing and spacing
- Adjust invoice display typography"
```

---

## Task 7: Typography and Readability

**Files:**
- Modify: `app/globals.css`

**Step 1: Add typography adjustments**

Append to mobile section:

```css

/* ── Typography and Spacing ────────────────── */

/* Section spacing reduction */
@media (max-width: 600px) {
  .sec-head {
    margin-bottom: 0.75rem; /* Reduced from 1rem */
  }

  .sec-title {
    font-size: 11px; /* Maintain, but ensure legibility */
    letter-spacing: 0.08em; /* Slightly reduced from 0.12em */
  }

  /* Auth page typography */
  .auth-title {
    font-size: 24px; /* Reduced from 28px */
  }

  .auth-subtitle {
    font-size: 13px; /* Maintain readability */
  }
}

/* Monospace minimum legibility */
@media (max-width: 600px) {
  .r,
  td.r {
    font-size: 12px; /* Ensure minimum 12px for numbers */
  }
}
```

**Step 2: Test typography**

1. Check various pages at 375px
2. Verify:
   - All text is legible without zooming
   - Section titles are clear
   - Numbers in tables are readable
3. Check auth pages:
   - Title appropriately sized
   - Form labels clear

**Step 3: Commit typography**

```bash
git add app/globals.css
git commit -m "feat(mobile): adjust typography for mobile readability

- Reduce section spacing for better density
- Adjust auth page title sizing
- Ensure minimum 12px for numeric data
- Fine-tune letter spacing for mobile"
```

---

## Task 8: Charts and Visualizations

**Files:**
- Modify: `app/globals.css`

**Step 1: Add chart mobile styles**

Append to mobile section:

```css

/* ── Charts and Visualizations ─────────────── */

/* Consumption chart compact */
@media (max-width: 600px) {
  .chart-container {
    padding: 0.75rem 0; /* Reduced from 1rem 0 */
  }

  .chart-bars {
    height: 180px; /* Reduced from 220px */
    padding-left: 36px; /* Reduced from 52px for Y-axis */
    padding-bottom: 2rem; /* Reduced from 2.5rem */
    gap: 8px; /* Reduced from 12px */
  }

  .chart-bar-wrap {
    min-width: 24px; /* Reduced from 40px */
    max-width: 32px; /* Reduced from 60px */
    gap: 6px; /* Reduced from 8px */
  }

  /* Y-axis compact */
  .chart-y-axis {
    width: 32px; /* Reduced from 48px */
  }

  .chart-y-label {
    font-size: 8px; /* Reduced from 9px */
    right: 6px; /* Adjusted from 8px */
  }

  .chart-y-tick {
    width: 4px; /* Reduced from 5px */
  }

  /* Month labels */
  .chart-label {
    font-size: 9px; /* Reduced from 10px */
    transform: rotate(-20deg); /* Increased from -15deg for better fit */
  }

  /* Values always visible on mobile (no hover needed) */
  .chart-bar-val {
    font-size: 9px; /* Reduced from 10px */
    opacity: 1; /* Always show */
  }
}

/* Alternative: Enable horizontal scroll if bars too cramped */
@media (max-width: 400px) {
  .chart-bars {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 3rem; /* Extra space for scrollbar */
  }

  .chart-bar-wrap {
    min-width: 32px; /* Increase slightly for readability */
  }
}
```

**Step 2: Test chart rendering**

1. Navigate to dashboard page with consumption chart
2. Test at 375px:
   - All 12 month bars visible (may be tight)
   - Y-axis labels readable
   - Month labels clear with rotation
   - Values visible without hover
3. If bars overlap, the 400px breakpoint adds scroll
4. Test at 768px - ensure desktop appearance maintained

**Step 3: Commit chart optimizations**

```bash
git add app/globals.css
git commit -m "feat(mobile): optimize consumption chart for small screens

- Reduce chart height and spacing for mobile
- Compact Y-axis and bar sizing
- Make values always visible (no hover needed)
- Add horizontal scroll fallback for very small screens
- Adjust label rotation for better fit"
```

---

## Task 9: Page-Specific Optimizations

**Files:**
- Modify: `app/globals.css`

**Step 1: Add landing page styles**

Append to mobile section:

```css

/* ── Page-Specific Adjustments ─────────────── */

/* Landing page mobile */
@media (max-width: 600px) {
  /* Landing header compact */
  .landing-page header {
    padding: 1rem 1.5rem; /* Reduced from 1.5rem 3rem */
  }

  .landing-page header .btn-sm {
    font-size: 12px;
    padding: 0.5rem 0.75rem;
  }

  /* Landing hero */
  .landing-page main {
    padding: 2rem 1rem; /* Reduced from 4rem 2rem */
  }

  /* CTA buttons stack vertically */
  .landing-page main > div > div:last-of-type {
    flex-direction: column;
    width: 100%;
  }

  .landing-page main .btn-primary,
  .landing-page main > div > div:last-of-type .btn-sm {
    width: 100%;
  }

  /* Feature cards */
  .landing-page main > div:last-of-type > div {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem; /* Reduced from 2rem */
  }
}

/* Hide text on very small screens, show icons only */
@media (max-width: 480px) {
  .landing-page header a:not(.nav-logo):not(.btn-primary) {
    font-size: 0; /* Hide text */
    padding: 0.5rem;
  }

  .landing-page header a:not(.nav-logo) svg {
    font-size: initial; /* Keep icons visible */
  }

  /* Info box compact */
  .landing-page main > div > div[style*="rgba(61, 255, 192"] {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }
}

/* Auth pages */
@media (max-width: 600px) {
  .auth-container {
    padding: 0 1rem;
    margin-top: 2rem; /* Reduced from 4rem */
  }

  .auth-field {
    margin-bottom: 1rem; /* Ensure spacing */
  }
}

/* Footer */
@media (max-width: 600px) {
  .footer {
    padding: 1.5rem 1rem 2rem; /* Reduced from 2.5rem 1.5rem 3rem */
  }

  .footer-hl {
    font-size: 20px; /* Reduced from 24px */
  }

  .footer-sub {
    font-size: 12px; /* Reduced from 13px */
    line-height: 1.6;
  }

  .coffee-btn-lg {
    padding: 10px 20px; /* Reduced from 12px 24px */
    font-size: 12px; /* Reduced from 13px */
  }
}
```

**Step 2: Test page-specific changes**

1. Test landing page (`/`):
   - Header compact at 375px
   - CTA buttons stacked
   - Feature grid single column
2. Test auth pages (`/login`, `/register`):
   - Reduced top margin
   - Full-width buttons
3. Test footer:
   - Appropriately sized
   - Coffee button fits

**Step 3: Commit page optimizations**

```bash
git add app/globals.css
git commit -m "feat(mobile): optimize landing, auth, and footer for mobile

- Compact landing page header and hero sections
- Stack CTA buttons vertically on mobile
- Single column feature grid
- Reduce auth page spacing and make buttons full-width
- Adjust footer sizing and spacing"
```

---

## Task 10: Touch Interactions and Utilities

**Files:**
- Modify: `app/globals.css`

**Step 1: Add touch and utility styles**

Append to mobile section (final section):

```css

/* ── Touch Interactions and Utilities ─────── */

/* Remove default tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Hover effects only on hover-capable devices */
@media (hover: hover) {
  button:hover,
  .btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .btn-primary:hover {
    background: rgba(198, 241, 53, 0.22);
  }

  .tab-btn:hover {
    color: var(--text);
  }

  tbody tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
}

/* Touch feedback on touch devices */
@media (hover: none) {
  button:active,
  .btn:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.05);
  }

  a:active {
    opacity: 0.7;
  }
}

/* Empty states compact */
@media (max-width: 600px) {
  .empty {
    padding: 2rem; /* Reduced from 3rem */
  }

  .empty svg {
    width: 32px; /* Reduced from 40px */
    height: 32px;
  }
}

/* Scrollbar sizing */
@media (max-width: 600px) {
  ::-webkit-scrollbar {
    width: 4px; /* Reduced from 6px */
    height: 4px;
  }
}

/* END MOBILE OPTIMIZATIONS */
```

**Step 2: Test touch interactions**

1. On real mobile device (if available):
   - Tap buttons - should see scale feedback
   - No blue tap highlight flashing
   - Links show opacity feedback on tap
2. On desktop:
   - Hover effects should still work normally
   - No active/touch effects on mouse hover

**Step 3: Commit touch utilities**

```bash
git add app/globals.css
git commit -m "feat(mobile): add touch interactions and final utilities

- Remove default tap highlight for custom feedback
- Separate hover effects for pointer vs touch devices
- Add touch-specific active states with scale feedback
- Reduce scrollbar size on mobile
- Compact empty state sizing"
```

---

## Task 11: Final Testing and Validation

**Files:**
- N/A (testing only)

**Step 1: Comprehensive DevTools testing**

Test matrix in Chrome DevTools Device Mode:

| Device | Width | Test Points |
|--------|-------|-------------|
| iPhone SE | 375px | Navigation scroll, form zoom prevention, single-column grids |
| iPhone 12 | 390px | Table sticky column, chart bars, result cards |
| Galaxy S21 | 360px | Smallest screen - verify no overflow, all touchable |
| iPad mini | 768px | Tablet behavior, 2-column layouts |

For each device:
1. Navigate through all pages (landing, login, register, dashboard)
2. Interact with all forms
3. Check tables scroll and sticky column works
4. View charts
5. Resize and verify no horizontal body scroll

**Step 2: Real device testing**

On personal mobile phone:
1. Visit localhost via network IP or ngrok
2. Complete full user flow:
   - Landing → Register → Login → Dashboard
3. Try adding consumption data
4. View simulation results
5. Check all touch targets feel comfortable
6. No pinch-zoom needed anywhere

**Step 3: Accessibility check**

1. Use Chrome Lighthouse Mobile audit
2. Focus on:
   - Touch target sizes (should pass)
   - Viewport configuration (should pass)
   - Font sizes (should pass)
3. Aim for Accessibility score > 90

**Step 4: Document testing results**

Create a test report comment in the plan file or commit message:

```bash
git commit --allow-empty -m "test(mobile): validation completed

Tested on:
- Chrome DevTools: iPhone SE, 12, Galaxy S21, iPad mini
- Real device: [Your phone model]

Validation checklist:
✓ All buttons 44px touch targets
✓ Inputs 16px font (no iOS zoom)
✓ Navigation scrolls without overflow
✓ Tables scroll with sticky first column
✓ Grids collapse appropriately
✓ Charts legible on small screens
✓ No horizontal body scroll
✓ Footer and header display correctly

Lighthouse Mobile Score: [X]/100"
```

---

## Task 12: Documentation and Completion

**Files:**
- Update: `docs/plans/2026-03-16-mobile-optimization-design.md` (add completion notes)
- Create: `docs/mobile-testing-guide.md` (optional)

**Step 1: Add completion notes to design doc**

At the end of `docs/plans/2026-03-16-mobile-optimization-design.md`:

```markdown
---

## Implementation Completed

**Date:** 2026-03-16
**Branch:** feature/mobile-optimization
**Commits:** [List commit SHAs from Task 1-11]

### Changes Summary
- Added viewport meta tag to prevent mobile zoom
- Implemented granular breakpoints (375px, 480px, 600px, 768px)
- Optimized navigation with horizontal scroll
- Made all forms touch-friendly (44px targets, 16px font)
- Added horizontal scroll with sticky columns for tables
- Collapsed grids to appropriate columns per breakpoint
- Optimized charts for mobile viewing
- Page-specific adjustments for landing, auth, footer
- Touch interaction feedback for mobile devices

### Testing Results
- Tested on: iPhone SE (375px), iPhone 12 (390px), Galaxy S21 (360px), iPad mini (768px)
- Real device: [Your phone]
- All validation criteria met ✓

### Next Steps
- Merge to develop
- Deploy to staging for broader testing
- Monitor for any user-reported issues
```

**Step 2: Commit documentation**

```bash
git add docs/plans/2026-03-16-mobile-optimization-design.md
git commit -m "docs: add implementation completion notes to mobile design

- Document all commits and changes
- Record testing results
- Mark validation criteria as complete"
```

**Step 3: Push feature branch**

```bash
git push origin feature/mobile-optimization
```

**Step 4: Create PR (optional, or wait for user instruction)**

Prepare PR description:

```
## Mobile Optimization - Conservative CSS Approach

### Summary
Implements comprehensive mobile optimizations for Courel Energy using pure CSS enhancements. Makes the entire application comfortably usable on devices from 375px (small phones) to 768px (tablets).

### Approach
- Conservative: No JavaScript or HTML structure changes
- Granular breakpoints for precise control
- Touch-friendly sizing (44px minimum targets)
- iOS zoom prevention (16px input font-size)

### Key Changes
- Navigation with horizontal scroll on mobile
- Forms with proper touch targets and zoom prevention
- Tables with sticky first column and horizontal scroll
- Responsive grids collapsing to appropriate columns
- Optimized charts for small screens
- Page-specific mobile adaptations

### Testing
Tested across:
- Mobile: 375px, 390px, 360px
- Tablet: 768px
- Real device: [Phone model]

All validation criteria met ✓

### Design Doc
See `docs/plans/2026-03-16-mobile-optimization-design.md`

### Related Issues
Closes #[issue number if any]
```

---

## Rollback Plan

If critical issues discovered after merge:

**Quick rollback:**
```bash
# In globals.css, comment out entire mobile section:
/* ── MOBILE OPTIMIZATIONS ────────────────────── */
/* TEMPORARILY DISABLED - rollback
... all mobile CSS ...
*/

# Or revert the merge commit:
git revert [merge-commit-sha]
```

All changes are isolated in one section of one file, making rollback safe and fast.

---

## Success Criteria

Implementation is complete when:

- [ ] All 12 tasks committed
- [ ] Tested on 4+ viewport sizes
- [ ] Tested on real mobile device
- [ ] All validation checklist items pass
- [ ] No horizontal scroll on body (except intentional components)
- [ ] All interactive elements are comfortably touchable
- [ ] Documentation updated
- [ ] Branch pushed

**Target completion time:** 5-7 hours of focused work

---

## Notes for Implementer

- **Save frequently**: Small commits are better than one giant commit
- **Test as you go**: Don't wait until the end to test everything
- **Real device crucial**: DevTools is good, but real device reveals issues
- **Be precise**: Use exact pixel values from design doc
- **Don't optimize prematurely**: Stick to the plan, iterate later if needed
- **Ask questions**: If anything is unclear, clarify before implementing

---

**Plan complete and ready for execution.**
