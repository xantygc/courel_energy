# Mobile Optimization Design - Courel Energy

**Date:** 2026-03-16
**Status:** Approved
**Approach:** CSS Incremental Conservador (Conservative CSS Enhancement)

---

## Executive Summary

This design addresses mobile usability issues in Courel Energy by applying targeted CSS improvements while maintaining the existing structure and behavior. The goal is to make the entire application comfortably usable on mobile devices (375px - 768px) without modifying JavaScript or HTML structure.

**Success Criteria:** The application should be comfortably usable from a personal mobile device without frustration.

---

## Context and Requirements

### Current State
- Next.js application with custom CSS and dark theme
- Complex dashboard with tabs, tables, forms, and charts
- Basic responsive CSS with breakpoints at 600px and 700px
- Layout max-width: 1100px

### Target Devices
- Standard mobile phones: 375px - 414px (primary)
- Large phones/phablets: 414px - 600px
- Tablets portrait: 768px

### Constraints
- **Conservative approach**: Maintain existing CSS structure
- **No JavaScript changes**: Pure CSS solution
- **No HTML restructuring**: Work with current component structure
- **Low risk**: Surgical changes, easy to test incrementally

---

## Architecture and Strategy

### Breakpoint System

New granular breakpoints to replace/enhance current ones:

```css
/* Mobile Small */
@media (max-width: 375px) { /* iPhone SE, compact Android */ }

/* Mobile Standard */
@media (max-width: 480px) { /* Most smartphones */ }

/* Mobile Large / Phablet */
@media (max-width: 600px) { /* Current breakpoint enhanced */ }

/* Tablet Portrait */
@media (max-width: 768px) { /* iPad mini, tablets */ }

/* Tablet Landscape */
@media (max-width: 1024px) { /* Desktop small */ }
```

### Viewport Configuration

Add to `app/layout.tsx` if not present:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
```

### CSS Organization

All mobile optimizations will be added to `app/globals.css` in a dedicated section at the end:

```css
/* ── MOBILE OPTIMIZATIONS ────────────────────── */
```

This keeps changes isolated and easy to review/modify.

### Container Strategy

`.app` container adaptation:
- Desktop: `padding: 2rem 1.5rem`
- Mobile: `padding: 1rem` (reduces horizontal space waste)

---

## Component Design Details

### 1. Navigation and Header

#### Navigation Container (`.nav`)

**Current issues:**
- Horizontal tabs overflow with long text
- Logo + multiple tabs don't fit on 375px
- 2rem lateral padding wastes space

**Solutions:**

```css
@media (max-width: 600px) {
  .nav {
    padding: 0 1rem; /* Reduce from 2rem */
  }
}
```

#### Logo (`.nav-logo`)

```css
@media (max-width: 600px) {
  .nav-logo {
    font-size: 16px; /* Reduce from 20px */
    padding: 0.75rem 1rem 0.75rem 0; /* Compact */
  }
}

@media (max-width: 400px) {
  .nav-logo {
    /* Show only icon + initial, hide full text */
  }
}
```

#### Tab Buttons (`.tab-btn`)

**Enable horizontal scroll:**

```css
@media (max-width: 768px) {
  .nav {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Hide scrollbar visually */
  }

  .nav::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 0.75rem 1rem; /* Reduce from 1rem 1.25rem */
    font-size: 13px; /* Reduce from 15px */
    white-space: nowrap;
  }
}
```

#### Secondary Tabs (`.tab-btn-sm`)

```css
@media (max-width: 600px) {
  .tab-btn-sm {
    padding: 4px 0; /* Reduce from 6px */
  }
}
```

---

### 2. Forms and Input Fields

#### All Inputs (input, select)

**Critical: iOS zoom prevention and touch area:**

```css
@media (max-width: 768px) {
  input[type=number],
  input[type=text],
  input[type=email],
  input[type=password],
  select {
    font-size: 16px; /* Prevent iOS zoom (>= 16px required) */
    min-height: 44px; /* iOS touch guideline */
    padding: 10px; /* Increase from 7px */
  }
}
```

#### Field Grids (`.g2`, `.g3`, `.g4`, `.g5`)

**Collapse to appropriate columns:**

```css
@media (max-width: 480px) {
  .g2, .g3, .g4, .g5 {
    grid-template-columns: 1fr; /* Single column */
    gap: 8px; /* Reduce from 12px */
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .g3, .g4, .g5 {
    grid-template-columns: repeat(2, 1fr); /* 2 columns max */
    gap: 10px;
  }
}
```

#### Buttons

**Touch-friendly sizing:**

```css
@media (max-width: 600px) {
  button, .btn {
    min-height: 44px; /* Touch target */
    padding: 10px 16px; /* Increase from 7px 14px */
  }

  .btn-sm {
    min-height: 36px;
    padding: 8px 12px; /* Increase from 4px 10px */
  }
}

@media (max-width: 480px) {
  .btn-primary {
    width: 100%; /* Full-width primary actions */
    margin-bottom: 0.75rem;
  }
}
```

#### Tarifa Form (`.tarifa-form`)

```css
@media (max-width: 600px) {
  .tarifa-form {
    padding: 1rem; /* Reduce from 1.25rem */
  }
}
```

---

### 3. Tables and Tabular Data

#### Table Container (`.tbl-wrap`)

**Enable scroll with visual indicators:**

```css
.tbl-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
}

@media (max-width: 768px) {
  .tbl-wrap {
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);

    /* Gradient shadow for scroll feedback */
    background:
      linear-gradient(90deg, var(--bg2) 30%, transparent),
      linear-gradient(90deg, transparent, var(--bg2) 70%) 100% 0,
      linear-gradient(90deg, rgba(255,255,255,0.1), transparent 30%),
      linear-gradient(270deg, rgba(255,255,255,0.1), transparent 30%) 100% 0;
    background-repeat: no-repeat;
    background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
    background-attachment: local, local, scroll, scroll;
  }
}
```

#### Sticky First Column

```css
@media (max-width: 768px) {
  table th:first-child,
  table td:first-child {
    position: sticky;
    left: 0;
    background: var(--bg2);
    z-index: 1;
    box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  }
}
```

#### Table Typography

```css
@media (max-width: 600px) {
  table {
    font-size: 12px; /* Reduce from 13px */
  }

  th {
    font-size: 10px; /* Reduce from 11px */
    padding: 6px 8px; /* Reduce from 8px 10px */
  }

  td {
    padding: 6px 8px;
  }

  td input {
    font-size: 14px; /* Prevent iOS zoom */
    padding: 6px;
  }
}
```

#### Interactive Rows

```css
@media (max-width: 768px) {
  tbody tr {
    min-height: 44px;
  }
}
```

---

### 4. Grids, Cards, and Layouts

#### Grid System Enhancement

```css
@media (max-width: 480px) {
  .g2, .g3, .g4, .g5 {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (min-width: 481px) and (max-width: 600px) {
  .g3, .g4, .g5 {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

@media (min-width: 601px) and (max-width: 768px) {
  .g4, .g5 {
    grid-template-columns: repeat(2, 1fr);
  }
  .g3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### Cards (`.card`, `.card-sm`)

```css
@media (max-width: 600px) {
  .card {
    padding: 1rem; /* Reduce from 1.5rem */
    margin-bottom: 1rem; /* Reduce from 1.25rem */
  }

  .card-sm {
    padding: 0.75rem; /* Reduce from 1rem */
  }
}
```

#### Result Cards (`.res-card`)

**Grid adaptation:**

```css
@media (max-width: 480px) {
  .res-grid {
    grid-template-columns: 1fr; /* Single column */
    gap: 10px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .res-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 fixed columns */
  }
}
```

**Card content:**

```css
@media (max-width: 600px) {
  .res-card .nom {
    white-space: normal; /* Allow wrap */
    overflow: visible;
    text-overflow: clip;
    max-height: 2.8em; /* ~2 lines */
    line-height: 1.4;
  }

  .res-card .price {
    font-size: 20px; /* Reduce from 22px */
  }
}
```

#### Chips (`.chips`, `.chip`)

```css
@media (max-width: 600px) {
  .chips {
    gap: 6px; /* Reduce from 8px */
  }

  .chip {
    padding: 6px 10px; /* Reduce from 8px 12px */
  }

  .chip .cv {
    font-size: 13px; /* Reduce from 15px */
  }
}
```

#### Month Grid (`.month-grid`)

```css
@media (max-width: 375px) {
  .month-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columns for tiny screens */
  }
}

@media (min-width: 376px) and (max-width: 600px) {
  .month-grid {
    grid-template-columns: repeat(3, 1fr); /* Current breakpoint */
  }
}
```

---

### 5. Typography and Readability

#### Body Text

```css
@media (max-width: 768px) {
  body {
    font-size: 14px; /* Maintain current */
    line-height: 1.6; /* Increase from 1.5 for better readability */
  }
}
```

#### Headings

```css
@media (max-width: 600px) {
  .sec-title {
    letter-spacing: 0.08em; /* Slightly reduce */
  }

  .auth-title {
    font-size: 24px; /* Reduce from 28px */
  }
}
```

#### Monospace (data display)

```css
@media (max-width: 600px) {
  .r, td.r {
    font-size: 12px; /* Ensure minimum legibility */
  }
}
```

#### Section Spacing

```css
@media (max-width: 600px) {
  .sec-head {
    margin-bottom: 0.75rem; /* Reduce from 1rem */
  }

  .card {
    margin-bottom: 1rem; /* Reduce from 1.25rem */
  }
}
```

---

### 6. Charts and Visualizations

#### Consumption Chart (`.chart-container`)

**Container adaptation:**

```css
@media (max-width: 600px) {
  .chart-bars {
    height: 180px; /* Reduce from 220px */
    padding-left: 36px; /* Reduce from 52px for Y-axis */
    gap: 8px; /* Reduce from 12px */
  }
}
```

#### Bar Sizing

```css
@media (max-width: 600px) {
  .chart-bar-wrap {
    min-width: 24px; /* Reduce from 40px */
    max-width: 32px; /* Reduce from 60px */
  }
}
```

#### Y-Axis

```css
@media (max-width: 600px) {
  .chart-y-axis {
    width: 32px; /* Reduce from 48px */
  }

  .chart-y-label {
    font-size: 8px; /* Reduce from 9px */
  }
}
```

#### Month Labels

```css
@media (max-width: 600px) {
  .chart-label {
    font-size: 9px; /* Reduce from 10px */
    transform: rotate(-20deg); /* Increase from -15deg */
  }
}
```

#### Value Display

```css
@media (max-width: 768px) {
  .chart-bar-val {
    font-size: 9px; /* Reduce from 10px */
  }

  /* Always show on mobile (no hover needed) */
  .chart-bar-wrap .chart-bar-val {
    opacity: 1;
  }
}
```

#### Alternative: Horizontal Scroll

If 12 bars don't fit comfortably:

```css
@media (max-width: 480px) {
  .chart-bars {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 3rem; /* Extra space for scrollbar */
  }

  .chart-bar-wrap {
    min-width: 40px; /* Maintain readability */
  }
}
```

#### Invoice Display (`.inv`)

```css
@media (max-width: 600px) {
  .inv {
    padding: 1rem; /* Reduce from 1.25rem */
  }

  .inv-row {
    font-size: 12px; /* Reduce from 13px */
  }

  .inv-total .val {
    font-size: 18px; /* Reduce from 20px */
  }
}
```

---

### 7. Specific Pages

#### Landing Page (`app/page.tsx`)

**Header:**

```css
@media (max-width: 600px) {
  /* Landing header - hide text, show icons only */
  .landing-page header {
    padding: 1rem 1.5rem;
  }

  /* Compact buttons */
  .landing-page header .btn-sm {
    font-size: 12px;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  /* Hide button text, keep icons */
  .landing-page header a:not(.nav-logo) {
    font-size: 0; /* Hide text */
  }

  .landing-page header svg {
    font-size: initial; /* Keep icons visible */
  }
}
```

**Hero section:**

```css
@media (max-width: 600px) {
  .landing-page main {
    padding: 2rem 1rem; /* Reduce from 4rem 2rem */
  }

  /* Badge */
  .landing-page main span {
    font-size: 0.75rem; /* Reduce from 0.875rem */
  }

  /* CTA buttons stack */
  .landing-page main > div > div:last-child {
    flex-direction: column;
    width: 100%;
  }

  .landing-page main .btn-primary,
  .landing-page main .btn-sm {
    width: 100%;
  }
}
```

**Feature grid:**

```css
@media (max-width: 600px) {
  .landing-page main > div:last-child > div {
    grid-template-columns: 1fr;
    padding: 1.5rem; /* Reduce from 2rem */
  }
}
```

**Info box:**

```css
@media (max-width: 600px) {
  .landing-page main > div > div[style*="rgba(61, 255, 192"] {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }
}
```

#### Auth Pages (Login, Register)

```css
@media (max-width: 600px) {
  .auth-container {
    padding: 0 1rem;
    margin-top: 2rem; /* Reduce from 4rem */
  }

  .auth-title {
    font-size: 24px; /* Reduce from 28px */
  }

  .auth-field input {
    min-height: 44px;
  }

  /* Full-width buttons */
  .auth-container button,
  .auth-container .btn {
    width: 100%;
  }
}
```

#### FAQ and Terms

```css
@media (max-width: 768px) {
  /* Content readability */
  .faq-content,
  .terms-content {
    padding: 1rem;
    line-height: 1.7;
  }
}
```

---

### 8. Utilities and Auxiliary Elements

#### Footer

```css
@media (max-width: 600px) {
  .footer {
    padding: 1.5rem 1rem 2rem; /* Reduce from 2.5rem 1.5rem 3rem */
  }

  .footer-hl {
    font-size: 20px; /* Reduce from 24px */
  }

  .footer-sub {
    font-size: 12px; /* Reduce from 13px */
    line-height: 1.6;
  }

  .coffee-btn-lg {
    padding: 10px 20px; /* Reduce from 12px 24px */
    font-size: 12px; /* Reduce from 13px */
  }
}
```

#### Empty States (`.empty`)

```css
@media (max-width: 600px) {
  .empty {
    padding: 2rem; /* Reduce from 3rem */
  }

  .empty svg {
    width: 32px; /* Reduce from 40px */
    height: 32px;
  }
}
```

#### Scrollbars

```css
@media (max-width: 600px) {
  ::-webkit-scrollbar {
    width: 4px; /* Reduce from 6px */
    height: 4px;
  }
}
```

#### Touch Interactions

**Hover states:**

```css
/* Only apply hover on devices with cursor */
@media (hover: hover) {
  button:hover,
  .btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .tab-btn:hover {
    color: var(--text);
  }
}

/* Touch feedback */
@media (hover: none) {
  button:active,
  .btn:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.05);
  }
}
```

**Tap highlight:**

```css
* {
  -webkit-tap-highlight-color: transparent;
}

button:active,
.btn:active,
a:active {
  opacity: 0.8;
}
```

---

## Performance Considerations

### CSS Transitions

Optimize for GPU acceleration:

```css
/* Good - GPU accelerated */
.element {
  transition: transform 0.2s, opacity 0.2s;
}

/* Avoid - causes reflow */
/* transition: width 0.2s, height 0.2s, padding 0.2s; */
```

### Will-Change Hints

For frequently animated elements:

```css
.chart-bar {
  will-change: transform;
}

/* Remove after animation */
.chart-bar.animated {
  will-change: auto;
}
```

### Font Loading

Add to Google Fonts import if needed:

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');

/* Becomes */
@import url('...&display=swap'); /* Already set ✓ */
```

---

## Testing Strategy

### Device Matrix

**Primary testing targets:**

1. **Mobile Standard (375px - 414px)**
   - iPhone 12/13/14 (390px)
   - Samsung Galaxy S21 (360px)
   - Google Pixel 5 (393px)

2. **Tablet Portrait (768px)**
   - iPad mini (768px)
   - iPad Air (820px)

### Validation Checklist

- [ ] All buttons have minimum 44px touch target
- [ ] Inputs don't trigger iOS zoom (16px font-size minimum)
- [ ] Navigation works without visible overflow
- [ ] Tables scroll horizontally with sticky first column
- [ ] Forms are fillable without frustration
- [ ] Charts are legible without overlapping
- [ ] No text cutoff or buttons outside viewport
- [ ] Footer and header display correctly
- [ ] Auth flows work smoothly
- [ ] No horizontal scroll on body (except intentional scrollable components)

### Testing Tools

- **Chrome DevTools**: Device Toolbar with preset devices
- **Firefox**: Responsive Design Mode
- **Real device**: Test on personal mobile phone (primary validation)
- **Lighthouse Mobile**: Accessibility and performance audit

### Testing Flow

1. Test landing page first (simpler structure)
2. Test login/register (form validation)
3. Test dashboard progressively:
   - Navigation and tabs
   - Configuration forms
   - Data tables
   - Charts
   - Results grid
4. Adjust CSS values based on findings
5. Re-test modified components

---

## Implementation Plan

### Phase 1: Foundation (30 min)
1. Add viewport meta tag to `app/layout.tsx`
2. Create `/* MOBILE OPTIMIZATIONS */` section in `globals.css`
3. Add base breakpoint structure

### Phase 2: Core Components (2-3 hours)
1. Navigation and header
2. Forms and inputs
3. Tables
4. Grids and cards

### Phase 3: Specific Elements (1-2 hours)
1. Charts
2. Typography
3. Page-specific adjustments

### Phase 4: Polish (1 hour)
1. Touch interactions
2. Performance tweaks
3. Testing and adjustments

### Total Estimated Time: 5-7 hours

---

## Rollout Strategy

### Deployment
1. Implement all changes in `globals.css`
2. Test locally on multiple viewports
3. Test on real device before deploying
4. Deploy to staging/production
5. Monitor for issues

### Rollback Plan
If issues arise:
- CSS changes are isolated in one section
- Easy to comment out entire `/* MOBILE OPTIMIZATIONS */` block
- No JavaScript or structural changes to revert

---

## Success Metrics

### Qualitative
- Personal mobile usage is comfortable and frustration-free
- All functionality is accessible without zooming or excessive scrolling
- Text is legible, buttons are tappable, forms are fillable

### Quantitative (optional)
- Lighthouse Mobile score > 90
- No horizontal scroll on body element
- All interactive elements meet 44px minimum
- All text inputs use 16px+ font-size

---

## Future Enhancements (Out of Scope)

If this conservative approach proves insufficient:

1. **Navigation drawer**: Hamburger menu for mobile
2. **Component modals**: Full-screen overlays for complex forms
3. **Data virtualization**: For very long tables/lists
4. **Progressive disclosure**: Accordion patterns for dense content
5. **Touch gestures**: Swipe for navigation, pinch to zoom charts

These would require JavaScript changes and are not part of this design.

---

## Appendix: CSS Structure Template

```css
/* ── MOBILE OPTIMIZATIONS ────────────────────── */

/* ── Foundation ────────────────────────────── */
@media (max-width: 768px) {
  body { line-height: 1.6; }
  .app { padding: 1rem; }
}

/* ── Navigation ────────────────────────────── */
@media (max-width: 600px) {
  .nav { padding: 0 1rem; }
  .nav-logo { font-size: 16px; }
  .tab-btn { padding: 0.75rem 1rem; font-size: 13px; }
}

/* ── Forms ─────────────────────────────────── */
@media (max-width: 768px) {
  input, select { font-size: 16px; min-height: 44px; }
  button, .btn { min-height: 44px; }
}

/* ── Tables ────────────────────────────────── */
@media (max-width: 768px) {
  .tbl-wrap { overflow-x: auto; }
  table th:first-child,
  table td:first-child { position: sticky; left: 0; }
}

/* ── Grids ─────────────────────────────────── */
@media (max-width: 480px) {
  .g2, .g3, .g4, .g5 { grid-template-columns: 1fr; }
}

/* ── Charts ────────────────────────────────── */
@media (max-width: 600px) {
  .chart-bars { height: 180px; padding-left: 36px; }
  .chart-bar-wrap { min-width: 24px; max-width: 32px; }
}

/* ── Pages ─────────────────────────────────── */
@media (max-width: 600px) {
  .auth-container { margin-top: 2rem; }
  .footer { padding: 1.5rem 1rem 2rem; }
}

/* ── Touch ─────────────────────────────────── */
* { -webkit-tap-highlight-color: transparent; }

@media (hover: hover) {
  button:hover { border-color: var(--accent); }
}

@media (hover: none) {
  button:active { transform: scale(0.98); }
}
```

---

**End of Design Document**
