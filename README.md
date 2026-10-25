# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with four sections: **Listen**, **About**, **Music**, and **Booking**. The visual layout follows the approved illustration: a numbered transparent left rail, warm paper texture, large band identity, restrained original tree artwork, compact releases, and a dark booking section. Mobile uses a transparent top bar and slide-in drawer.

## Add the original artwork

The page and favicon now point directly to the five supplied source assets (not the redrawn SVG placeholders):

- `assets/logo_sunkngardns.png`
- `assets/tree-art.jpg`
- `assets/coverart_rukhsar.png`
- `assets/coverart_sarhadein.jpg`
- `assets/donkey_transparent.png`

Copy these from the supplied `sunkngardns-original-assets.zip` into the repository's `assets/` directory, then commit and push them. The same logo PNG is used for the page logo, browser favicon, and Apple touch icon.

For the ZIP from your Downloads folder on macOS, run from the repository root:

```bash
unzip ~/Downloads/sunkngardns-original-assets.zip -d /tmp/sunkngardns-assets
cp /tmp/sunkngardns-assets/sunkngardns-original-assets-pack/assets/* ./assets/
git add assets/logo_sunkngardns.png assets/tree-art.jpg assets/coverart_rukhsar.png assets/coverart_sarhadein.jpg assets/donkey_transparent.png
git commit -m "Add original SUNKNGARDNS artwork"
git push origin main
```

## Run and debug in VS Code

**Requirements:** Node.js `20.19+` or `22.12+` and npm. Install Node.js from https://nodejs.org/.

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal, normally `http://127.0.0.1:5173/`. Keep the server running while viewing the site. Stop it with **Ctrl+C**.

For browser debugging, choose **Run and Debug → Launch SUNKNGARDNS in Chrome** or **Launch SUNKNGARDNS in Edge**, then press **F5**.

## Production build

```bash
npm run build
npm run preview
```

Vite writes the production output to `dist/`.

## Before launch

- **Streaming links:** currently open platform search results. Replace them with the band's official artist and release pages.
- **Booking:** add the confirmed booking address to `BOOKING_EMAIL` in `script.js`. The form opens a prefilled email draft; it does not send data to a server.
- **Biography:** replace the concept copy in the About section with the band's approved biography.
- **Release details:** update release cards and streaming links in `index.html` as needed.

## Design and accessibility

- One continuous page with normal browser scrolling; no scroll hijacking.
- Fixed numbered navigation on desktop; transparent slide-in navigation on mobile.
- Original artwork is used sparingly, so future releases can be added without redesigning the page.
- Keyboard-friendly drawer, active section tracking, visible focus indicators, and reduced-motion support.

## Main files

- `index.html` — the four sections and destination URLs
- `styles.css` — responsive design and layout
- `script.js` — drawer, active section, and booking email draft
- `.vscode/launch.json` and `.vscode/tasks.json` — VS Code debugging
- `assets/` — original artwork (add the five supplied files listed above)
