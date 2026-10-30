# SUNKNGARDNS — one-page band website

A mobile-first, vertically scrollable website with four sections: **Listen**, **About**, **Music**, and **Booking**. The page uses original artwork already in `assets/`; source art is never edited or deleted. The tree illustration is `assets/1000114676.jpeg`, the release covers are kept as supplied, and the logo PNG is also used for the favicon and Apple touch icon.

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

- Replace platform search links with verified artist profiles and release URLs.
- Add the confirmed booking address to `BOOKING_EMAIL` in `script.js`; the current form opens a prefilled email draft and does not submit to a server.
- Replace the concept biography with the band's approved final copy when provided.

## Main files

- `index.html` — the four sections, release links and favicon
- `styles.css` — responsive composition and image layout
- `script.js` — drawer, active navigation and booking email draft
- `.vscode/` — browser launch/debug setup (localhost:8080 server + Edge debugger)
- `assets/` — original artwork
