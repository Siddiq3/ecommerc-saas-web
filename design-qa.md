# Feature video card QA

Reference: https://xpress.site/ (inspected 10 October 2026).

Status: blocked for final mobile visual comparison; desktop verified in native Chrome. Chrome is currently being used by the user and rejected test-tab interactions as user changes. No further browser control attempted.

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
