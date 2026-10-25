# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with four sections: **Listen**, **About**, **Music**, and **Booking**. The visual system takes cues from the band's ink illustrations and cover art while using album artwork sparingly.

## Run locally

No build step or package install is needed. Open `index.html` directly, or run:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Select **Deploy from a branch**, then choose `main` and `/(root)`.
3. Save and wait for the deployment to complete.

## Before launch

- **Streaming links:** the current URLs open platform search results. Replace them in `index.html` with the band's official artist / release pages when available.
- **Booking:** add the band's confirmed booking address to `BOOKING_EMAIL` in `script.js`. The form opens a prefilled email draft; it does not send data to a server.
- **Biography:** replace the concept copy in the About section with the band's approved biography.
- **Releases:** add future releases as new `.release-row` items in `index.html`; small thumbnails preserve the quieter visual rhythm.

## Design & accessibility

- One continuous page, no full-page scroll hijacking.
- Fixed transparent numbered navigation on desktop; slide-in drawer on mobile.
- Warm paper, black ink, and selective pink / mustard accents.
- Native anchor navigation, active-section tracking, Escape-to-close, focus visibility, and reduced-motion support.
- No third-party runtime dependencies.

## Files

- `index.html` — content and destination URLs
- `styles.css` — responsive visual design
- `script.js` — drawer behavior, section tracking, booking email draft
- `assets/` — band mark, artwork, favicon
