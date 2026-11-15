# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with five content-led sections: **Listen**, **About**, **Music**, **Videos**, and **Booking**. Original artwork is retained in `assets/`; source files are never overwritten. The tree illustration is `assets/Ink Tree Cluster on Transparent Background.png`, and `assets/1000114676.jpeg` is the LATIFE album cover.


## Performance and image optimization

The page uses generated WebP derivatives in `assets/optimized/` for browser delivery. The original artwork remains untouched in `assets/`.

- The Listen wordmark is preprocessed once by the asset pipeline, rather than scanned pixel-by-pixel in the visitor's browser.
- The LATIFE cover and video posters have responsive `srcset` variants; video posters are pre-cropped to their 16:9 display frame.
- Key landing visuals are preloaded, while below-the-fold artwork remains lazy-loaded.
- Netlify caches the generated derivatives for repeat visits.
- `tools/optimize_assets.py` regenerates the derivatives. The GitHub Actions workflow runs it when source images or relevant markup change.

## Run in VS Code (F5 debugs on localhost:8080)

No Node.js, no npm, no Vite, nothing to install. Just open the folder in VS Code and press **F5**. It starts a local HTTP server on `http://localhost:8080/` using Python (built into Windows), launches Edge with remote debugging, and attaches the VS Code debugger. Breakpoints in `script.js` work.

Choose "Attach to Edge (localhost:8080)" from the Run and Debug panel.

**Note:** VS Code launches Edge with a separate profile (`%TEMP%\sunkngardns-debug`), so your existing Edge windows and tabs are completely untouched.

## Run on localhost manually

Python is preinstalled on most devices. From the repo folder:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/` in any browser.

## Open without a server

You can also just double-click `index.html` to open it directly in any browser. No installation required on any device.

## Original assets in the repository

- `1000114676.jpeg` — original ink-tree artwork
- `logo_sunkngardns.png` — band logo, favicon, and touch icon
- `coverart_rukhsar.png` and `coverart_sarhadein.jpg` — original release art
- `donkey_transparent.png` — booking illustration
- `art_spotify.jpg` and `djinn_animated.gif` — other supplied originals, preserved untouched

Lazy-loaded images now include explicit width and height attributes to prevent layout shifts.

## Before launch

- Add the confirmed YouTube video IDs to `data-youtube-id` on the two cards in the Videos section. Until then, the cards link to matching YouTube search results; once IDs are added, clicking a poster loads the embedded player.
- Replace platform search links with verified artist profiles and release URLs.
- Add the confirmed booking address to `BOOKING_EMAIL` in `script.js`; the current form opens a prefilled email draft and does not submit to a server.
- Replace the concept biography with the band's approved final copy when provided.

## Main files

- `index.html` — the four sections, release links and favicon
- `styles.css` — shared site styles, navigation and typography
- `landing.css` — Listen masthead and landing-page composition
- `sections.css` — shared heading system, content-led layouts and responsive styling for all five sections
- `script.js` — drawer, active navigation, lazy YouTube embeds and booking email draft
- `.vscode/` — browser launch/debug setup (localhost:8080 server + Edge debugger)
- `assets/` — original artwork
