# Feature video card QA

Reference: https://xpress.site/ (inspected 10 October 2026).

Desktop cards were compared with the reference. Mobile rendering and interactions are now verified; a full comparison of every mobile card against Xpress remains outside the responsive hero fix below.

## Implemented scope

The existing marketing page now uses the reference's Plus Jakarta Sans headings, Bricolage Grotesque desktop card titles, IBM Plex Sans descriptions and Inter controls. Measured source values were used for the 1280px container, 40px outer corners, 32px white panels, 45/55 desktop split, 660px panel height, 60/75px padding, coloured backgrounds, rotated badges and carousel controls. Mobile uses a video above a white text panel with expandable details.

Desktop orders use the reference's media-above-three-columns arrangement. Desktop payments use its media-left and selectable-description-cards-right arrangement. A fifth group covers additional StoreKit features.

Intentional content differences: StoreKit branding, SS Mensware store callout, real StoreKit recordings and descriptions of supported features replace Xpress branding, merchant testimonials and Xpress-only capabilities. Actual app recordings have different screen proportions and content. This is not a pixel-identical copy of the entire reference website.

## Evidence

- `docs/feature-video-qa/reference-desktop.png`
- `docs/feature-video-qa/implementation-desktop.png`
- `docs/feature-video-qa/desktop-comparison.png` (reference left, implementation right)
- Native Chrome showed setup video advancing through the actual name and address inputs.
- Pause changed to Play and stopped the video.
- All 16 MP4 endpoints returned HTTP 200 with `video/mp4` and every file decoded successfully with FFmpeg.
- `npm run lint` and `npm run build` passed.

Remaining: final mobile reference/implementation screenshots and interaction comparison. Earlier screenshots of the superseded tabbed gallery are not evidence for this layout.

## Responsive hero follow-up

Responsive verification result: passed.

Tested in native Chrome responsive mode: laptop 1366 × 768, mobile 390 × 844 and small phone 320 × 740. Production and development were both checked. Native screenshots are 2940 × 1670 including DevTools; content-only captures crop the visible viewport and normalize the phone view to 390 × 844. Laptop content is 1366 × 768.

Resolved findings:

- P1: Next development hydration failed because production CSP blocked the development runtime's source-map evaluation. The store carousel started with zero opacity and never became visible. Added a development-only evaluation allowance, and made the carousel visible in its server-rendered state. Verified that production CSP excludes unsafe-eval.
- P2: The phone hero used the desktop fan's generous vertical spacing. Reduced the mobile heading, preview widths and section gaps; retained the laptop layout. Download actions and the demo link are now visible within the 390 × 844 viewport.
- P2: At 320px, the first feature card's Next button was clipped by the dot/pause group. Reduced progress-group spacing at that breakpoint; both arrow buttons are now visible. Verified pause, next-slide selection and expanded descriptions.
- P2: At 320px, the Apple download badge label wrapped and made the buttons uneven. Tightened small-phone badge typography and kept labels on one line.

Evidence:

- `docs/feature-video-qa/hero-mobile-content.png` — production phone hero.
- `docs/feature-video-qa/second-hero-laptop-content.png` — production laptop second section, including visible store cards.
- `docs/feature-video-qa/hero-small-phone-after.png` — 320px hero.
- `docs/feature-video-qa/mobile-video-details-after.png` — actual description expansion.

Typography and wrapping are readable at the tested widths; spacing fits the phone actions and laptop store rail; colours and images retain the existing site assets; supported-feature descriptions and SS Mensware naming remain consistent. No runtime console errors after reload in either mode. The production mobile menu opens and closes. Build and lint pass.

This follow-up verifies the reported hero and control defects. It does not certify a pixel-identical copy of every Xpress section.
