# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with four sections: **Listen**, **About**, **Music**, and **Booking**. The layout follows the approved illustration: numbered left rail, warm paper texture, large band identity, original tree artwork, quiet release shelf, and a dark booking section. Mobile uses a transparent top bar and slide-in drawer.

## Run and debug in VS Code

**Requirements:** Node.js `20.19+` or `22.12+` and npm. Install Node.js from https://nodejs.org/.

1. Open the repository folder in VS Code.
2. Open **Terminal → New Terminal**.
3. Run these commands after pulling the latest changes:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal, normally `http://127.0.0.1:5173/`.
5. To debug, use **Run and Debug → Launch SUNKNGARDNS in Chrome** or **Launch SUNKNGARDNS in Edge**, then press **F5**.

Keep the development server running while viewing the site. Stop it with **Ctrl+C**.

## Install the original artwork

The HTML now points to the exact original artwork filenames rather than the hand-redrawn SVG versions. Download the companion **SUNKNGARDNS original assets pack** and copy the five files from its inner `assets/` folder into this repository's `assets/` folder:

- `logo_sunkngardns.png`
- `tree-art.jpg`
- `coverart_rukhsar.png`
- `coverart_sarhadein.jpg`
- `donkey_transparent.png`

The site currently keeps fallbacks so it remains viewable before those original files are copied. Once the originals are in place, the fallbacks are not used. The archive contains copies of the source files supplied for this project.

## Production build

```bash
npm run build
npm run preview
```

Vite writes the production output to `dist/`.

## Before launch

- **Streaming links:** currently open platform search results. Replace them with the band's official artist and release pages.
- **Booking:** add the confirmed booking address to `BOOKING_EMAIL` in `script.js`. The form opens a prefilled email draft; it does not send a message to a server.
- **Biography:** replace the concept copy in the About section with the band's approved biography.
- **Release details:** update the release cards and links in `index.html` when track metadata is confirmed.

## Design and accessibility

- One continuous page with normal browser scrolling; no scroll hijacking.
- Fixed numbered navigation on desktop and transparent slide-in navigation on mobile.
- Original artwork is used sparingly; new releases can be added without redesigning the page.
- Keyboard-friendly drawer, section tracking, visible focus indicators, and reduced-motion support.

## Main files

- `index.html` — the four sections and destination URLs
- `styles.css` — responsive design and layout
- `script.js` — drawer, active section, fallback art handling, booking email draft
- `.vscode/launch.json` and `.vscode/tasks.json` — VS Code debugging
- `assets/` — artwork and favicon
