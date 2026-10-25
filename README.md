# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with exactly four sections: **Listen**, **About**, **Music**, and **Booking**. The visual system takes cues from the band's ink illustrations and cover art while using album artwork sparingly.

## Run and debug in VS Code

**Requirements:** Node.js `20.19+` or `22.12+` and npm. Download a supported Node.js release from https://nodejs.org/.

1. Open the repository folder in VS Code (not just the `index.html` file).
2. Open **Terminal → New Terminal**.
3. Run this once after pulling the project:

   ```bash
   npm install
   ```

4. Press **F5** and choose **Launch SUNKNGARDNS in Chrome** or **Launch SUNKNGARDNS in Edge**. The configured pre-launch task starts Vite on `http://127.0.0.1:5173/` before opening the browser.

### Start the server manually

If you prefer not to use the debugger:

```bash
npm run dev
```

Open the local address printed in the terminal (normally http://127.0.0.1:5173/). Keep that terminal running while you view the site. Stop it with **Ctrl+C**.

### Troubleshooting localhost

- If the browser reports that it cannot reach localhost, check the VS Code terminal for a Vite startup error. The server must remain running.
- If `npm` is not recognized, install Node.js, close and reopen VS Code, then run `node -v` and `npm -v`.
- If dependencies have not been installed in this checkout, run `npm install`.
- If port `5173` is already in use, stop the other server or close its terminal before debugging.
- If the debugger cannot find Chrome or Edge, install the relevant browser or use **Run and Debug** to select the browser installed on your computer.

## Build for production

```bash
npm run build
npm run preview
```

Vite writes the production output to `dist/`.

## Deploy with GitHub Pages

For a simple static deployment, GitHub Pages can serve the repository root as configured under **Settings → Pages**. If you instead deploy the Vite build output, configure the Pages workflow to publish `dist/` and set Vite's `base` to the repository path for a project site.

## Before launch

- **Streaming links:** the current URLs open platform search results. Replace them in `index.html` with the band's official artist / release pages when available.
- **Booking:** add the band's confirmed booking address to `BOOKING_EMAIL` in `script.js`. The form opens a prefilled email draft; it does not send data to a server.
- **Biography:** replace the concept copy in the About section with the band's approved biography.
- **Releases:** add future releases as new `.release-row` items in `index.html`; small thumbnails preserve the quieter visual rhythm.

## Design & accessibility

- One continuous page, without full-page scroll hijacking.
- Fixed transparent numbered navigation on desktop; slide-in drawer on mobile.
- Warm paper, black ink, and selective pink / mustard accents.
- Native anchor navigation, active-section tracking, Escape-to-close, visible focus indicators, and reduced-motion support.
- Vite provides a local development server and production build.

## Files

- `index.html` — content and destination URLs
- `styles.css` — responsive visual design
- `script.js` — drawer behavior, section tracking, booking email draft
- `.vscode/launch.json` — Chrome / Edge browser debugging
- `.vscode/tasks.json` — starts the local server for F5
- `assets/` — band mark, artwork, favicon
