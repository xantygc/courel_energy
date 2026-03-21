# Mobile Testing Checklist

**Implementation Date:** 2026-03-16
**Branch:** feature/mobile-optimization
**Build Status:** ✓ Compiled successfully

---

## Automated Verification

### Build Validation
- ✓ Next.js build completes without errors
- ✓ TypeScript compilation passes
- ✓ All pages render (16 routes)
- ✓ No CSS syntax errors

---

## Manual Testing Required

### 1. DevTools Testing Matrix

Test the following in Chrome DevTools Device Mode:

| Device | Width | Priority Tests |
|--------|-------|---------------|
| **iPhone SE** | 375px | • Navigation horizontal scroll<br>• Form inputs don't trigger zoom<br>• Single-column grids<br>• Chart bars readable |
| **iPhone 12** | 390px | • Table sticky first column<br>• Result cards layout<br>• Touch targets comfortable<br>• No horizontal overflow |
| **Galaxy S21** | 360px | • Smallest screen verification<br>• All elements touchable<br>• Text legible without zoom<br>• Footer fits properly |
| **iPad mini** | 768px | • Tablet 2-column layouts<br>• Navigation doesn't scroll<br>• Desktop-like appearance<br>• Breakpoint transition smooth |

### 2. Page-by-Page Validation

For **each device size** above, test:

#### Landing Page (`/`)
- [ ] Header navigation readable and accessible
- [ ] Hero section text legible
- [ ] CTA buttons stacked vertically on mobile
- [ ] Feature grid shows 1 column on small screens
- [ ] Info box (green) displays properly
- [ ] Footer coffee button visible and tappable
- [ ] GitHub icon visible

#### Login Page (`/login`)
- [ ] Email input doesn't trigger iOS zoom (tap to verify)
- [ ] Password input doesn't trigger iOS zoom
- [ ] Touch target for inputs is comfortable (44px)
- [ ] Login button full-width on mobile
- [ ] "Register" link tappable
- [ ] No horizontal scroll

#### Register Page (`/register`)
- [ ] All input fields prevent zoom
- [ ] Register button full-width
- [ ] Form fields have proper spacing
- [ ] Labels legible (11px minimum)
- [ ] Submit button accessible

#### Dashboard (`/dashboard`)
- [ ] **Navigation tabs:**
  - [ ] Scroll horizontally on mobile
  - [ ] No visible scrollbar
  - [ ] All tabs accessible via scroll
  - [ ] Active tab indicator visible
- [ ] **Configuration tab:**
  - [ ] Form grids collapse to single column (<480px)
  - [ ] Inputs prevent zoom (16px font)
  - [ ] Buttons are 44px touch targets
  - [ ] Tarifa cards readable
- [ ] **Consumption tab:**
  - [ ] Month grid shows 2 columns on tiny screens
  - [ ] Input fields comfortable to tap
  - [ ] Table scrolls horizontally if needed
- [ ] **Results tab:**
  - [ ] Result cards show 1 column on small screens
  - [ ] Tariff names wrap to 2 lines max
  - [ ] Prices readable (20px)
  - [ ] Charts display properly:
    - [ ] Y-axis labels visible
    - [ ] Month labels readable (rotated)
    - [ ] Bars don't overlap
    - [ ] Values visible without hover
  - [ ] Tables:
    - [ ] Scroll horizontally
    - [ ] First column sticky
    - [ ] Gradient shadows visible at edges

### 3. Interaction Testing

#### Touch Targets
- [ ] All buttons minimum 44px (use DevTools inspector)
- [ ] Links are easy to tap without mis-taps
- [ ] Form inputs feel comfortable to focus

#### Zoom Prevention
- [ ] Tap on any input field - should NOT zoom in
- [ ] Verify all inputs use 16px or larger font
- [ ] Check in Safari iOS specifically (strictest)

#### Scrolling
- [ ] Body never scrolls horizontally
- [ ] Navigation scrolls horizontally smoothly
- [ ] Tables scroll horizontally smoothly
- [ ] Charts scroll on very small screens (<400px)
- [ ] No "bouncy" overscroll issues

#### Touch Feedback
- [ ] Buttons show scale effect on tap (not hover)
- [ ] Links show opacity change on tap
- [ ] No blue tap highlight flashes

### 4. Real Device Testing

**Test on personal mobile phone:**

1. **Access app:**
   - Option A: If on same network, use local IP (e.g., `http://192.168.1.x:3000`)
   - Option B: Use ngrok or similar tunnel service

2. **Complete user flow:**
   - [ ] Land on home page
   - [ ] Tap "Registrarse"
   - [ ] Fill registration form
   - [ ] Login with new account
   - [ ] Add a tariff
   - [ ] Add consumption data
   - [ ] View simulation results

3. **Real-world validation:**
   - [ ] Can complete all tasks without frustration
   - [ ] No need to pinch-zoom anywhere
   - [ ] All text readable without strain
   - [ ] Navigation feels natural
   - [ ] Forms are easy to fill
   - [ ] Results are easy to understand

### 5. Accessibility Audit

Run Chrome Lighthouse audit in Device Mode:

1. Open DevTools → Lighthouse tab
2. Select "Mobile" device
3. Run "Accessibility" category
4. Target: **Score > 90**

**Common checks:**
- [ ] Touch target sizes (should pass with 44px minimum)
- [ ] Viewport configured correctly
- [ ] Font sizes sufficient
- [ ] Color contrast ratios
- [ ] Focus indicators visible

---

## Known Limitations

These are **intentional trade-offs** of the conservative CSS approach:

1. **Charts on very small screens (<375px):** May require horizontal scroll
2. **Long tariff names:** Wrap to 2 lines maximum, then truncate
3. **Tables with many columns:** Horizontal scroll required (sticky first column helps)
4. **Navigation with many tabs:** Horizontal scroll expected on mobile

These are **not bugs** - they're the chosen solution for mobile constraints.

---

## Passing Criteria

Implementation is validated when:

- [ ] Build succeeds without errors ✓
- [ ] Tested on 4+ viewport sizes in DevTools
- [ ] Tested on real mobile device
- [ ] All interactive elements comfortable to use
- [ ] No horizontal body scroll anywhere
- [ ] Forms can be filled without frustration
- [ ] Navigation accessible on smallest screens
- [ ] Lighthouse Mobile Accessibility > 90

---

## How to Test

### Quick DevTools Test (5 minutes)
```bash
npm run dev
```
1. Open http://localhost:3000 in Chrome
2. F12 → Device Toolbar (Cmd+Shift+M / Ctrl+Shift+M)
3. Select iPhone SE (375px)
4. Navigate through: Landing → Login → Dashboard
5. Verify: No horizontal scroll, all tappable, text legible

### Full Test Suite (30 minutes)
Follow the complete checklist above for all devices and pages.

### Real Device Test (15 minutes)
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://[your-ip]:3000`
3. Complete full user flow
4. Verify comfort and usability

---

## Reporting Issues

If you find issues during testing:

1. **Note the exact viewport width** where issue occurs
2. **Take screenshot** if visual issue
3. **Describe expected vs actual behavior**
4. **Note which page/component** is affected

Most issues can be fixed with CSS adjustments in the mobile section.

---

## Sign-Off

**Tested by:** [Your name]
**Date:** [Date]
**Devices tested:**
- [ ] DevTools: iPhone SE (375px)
- [ ] DevTools: iPhone 12 (390px)
- [ ] DevTools: Galaxy S21 (360px)
- [ ] DevTools: iPad mini (768px)
- [ ] Real device: [Phone model/OS]

**Lighthouse Score:** [X]/100

**Status:** [ ] Passed / [ ] Issues found (see below)

**Issues found:** [List any issues, or write "None"]

---

**Next steps after validation:**
- Update `docs/plans/2026-03-16-mobile-optimization-design.md` with results
- Merge feature branch to develop
- Deploy to staging for broader testing
