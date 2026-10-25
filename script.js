(() => {
  const nav = document.querySelector('#site-nav');
  const menuOpen = document.querySelector('#menu-open');
  const menuClose = document.querySelector('#menu-close');
  const scrim = document.querySelector('#nav-scrim');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main .section[id]')];
  const bookingForm = document.querySelector('#booking-form');
  const formNote = document.querySelector('#form-note');
  // Add the band's confirmed booking email here before launch.
  const BOOKING_EMAIL = '';

  function setDrawer(open) {
    nav.classList.toggle('is-open', open);
    scrim.classList.toggle('is-visible', open);
    document.body.classList.toggle('drawer-open', open);
    menuOpen?.setAttribute('aria-expanded', String(open));
    if (open) menuClose?.focus();
    else menuOpen?.focus();
  }
  menuOpen?.addEventListener('click', () => setDrawer(true));
  menuClose?.addEventListener('click', () => setDrawer(false));
  scrim?.addEventListener('click', () => setDrawer(false));
  navLinks.forEach((link) => link.addEventListener('click', () => {
    navLinks.forEach((item) => {
      const active = item === link;
      item.classList.toggle('is-active', active);
      if (active) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
    if (window.matchMedia('(max-width: 620px)').matches) setDrawer(false);
  }));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) setDrawer(false);
    if (event.key === 'Tab' && nav.classList.contains('is-open')) {
      const focusable = [...nav.querySelectorAll('a[href],button:not([disabled])')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.dataset.section === visible.target.id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -48% 0px', threshold: [0, .1, .25, .5] });
    sections.forEach((section) => observer.observe(section));
  }
  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    if (!BOOKING_EMAIL) {
      formNote.textContent = 'The form is ready. Add the confirmed booking email to BOOKING_EMAIL in script.js before launch.';
      formNote.classList.add('form-note-warning');
      return;
    }
    const data = new FormData(bookingForm);
    const subject = `Booking inquiry — ${String(data.get('event') || 'SUNKNGARDNS')}`;
    const body = [
      `Name: ${data.get('name')}`, `Email: ${data.get('email')}`,
      `Event / Venue: ${data.get('event') || 'Not specified'}`,
      `Location: ${data.get('location') || 'Not specified'}`, '', 'Message:', data.get('message')
    ].join('\n');
    window.location.href = `mailto:${encodeURIComponent(BOOKING_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 620px)').matches) {
      nav.classList.remove('is-open');
      scrim.classList.remove('is-visible');
      document.body.classList.remove('drawer-open');
      menuOpen?.setAttribute('aria-expanded', 'false');
    }
  }, { passive: true });
})();

/* Render the uploaded English wordmark while removing its baked-in checkerboard. */
(() => {
  const canvas = document.querySelector('#english-wordmark-canvas');
  if (!canvas) return;

  const sourceImage = new Image();
  sourceImage.onload = () => {
    const source = document.createElement('canvas');
    source.width = sourceImage.naturalWidth;
    source.height = sourceImage.naturalHeight;
    const sourceContext = source.getContext('2d', { willReadFrequently: true });
    if (!sourceContext) return;
    sourceContext.drawImage(sourceImage, 0, 0);

    let minX = source.width, minY = source.height, maxX = -1, maxY = -1;
    const full = sourceContext.getImageData(0, 0, source.width, source.height);
    const pixels = full.data;

    // Detect the black ink silhouette to crop away the large transparent-looking margins.
    for (let y = 0; y < source.height; y++) {
      for (let x = 0; x < source.width; x++) {
        const i = (y * source.width + x) * 4;
        const luminance = .2126 * pixels[i] + .7152 * pixels[i + 1] + .0722 * pixels[i + 2];
        if (luminance < 72) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return;

    const pad = 8;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(source.width - 1, maxX + pad);
    maxY = Math.min(source.height - 1, maxY + pad);
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const cropped = sourceContext.getImageData(minX, minY, cropWidth, cropHeight);
    const croppedPixels = cropped.data;

    // Convert the white and grey checker squares to alpha while preserving antialiased ink edges.
    for (let i = 0; i < croppedPixels.length; i += 4) {
      const luminance = .2126 * croppedPixels[i] + .7152 * croppedPixels[i + 1] + .0722 * croppedPixels[i + 2];
      const alpha = Math.max(0, Math.min(255, Math.round(((190 - luminance) / 190) * 255)));
      croppedPixels[i] = 0;
      croppedPixels[i + 1] = 0;
      croppedPixels[i + 2] = 0;
      croppedPixels[i + 3] = Math.min(croppedPixels[i + 3], alpha);
    }

    const cleaned = document.createElement('canvas');
    cleaned.width = cropWidth;
    cleaned.height = cropHeight;
    const cleanedContext = cleaned.getContext('2d');
    if (!cleanedContext) return;
    cleanedContext.putImageData(cropped, 0, 0);

    const outputWidth = 800;
    const outputHeight = Math.round(cropHeight * outputWidth / cropWidth);
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const outputContext = canvas.getContext('2d');
    if (!outputContext) return;
    outputContext.clearRect(0, 0, outputWidth, outputHeight);
    outputContext.drawImage(cleaned, 0, 0, outputWidth, outputHeight);
    canvas.dataset.ready = 'true';
  };
  sourceImage.src = 'assets/Gemini_Generated_Image_gadfxbgadfxbgadf.png';
})();
