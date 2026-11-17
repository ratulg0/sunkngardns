(() => {
  const nav = document.querySelector('#site-nav');
  const menuOpen = document.querySelector('#menu-open');
  const menuClose = document.querySelector('#menu-close');
  const scrim = document.querySelector('#nav-scrim');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main .section[id]')];
  const bookingForm = document.querySelector('#booking-form');
  const videoCards = [...document.querySelectorAll('.video-card[data-youtube-id]')];
  const formNote = document.querySelector('#form-note');
  // Add the band's confirmed booking email here before launch.
  const BOOKING_EMAIL = '';

  const brandBanner = document.querySelector('#brand-banner');
  const brandLayoutButtons = [...document.querySelectorAll('[data-brand-layout]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setBrandLayout(layout) {
    if (!brandBanner || !['stacked', 'compact', 'horizontal'].includes(layout)) return;
    brandBanner.dataset.logoLayout = layout;
    brandLayoutButtons.forEach((button) => {
      const active = button.dataset.brandLayout === layout;
      button.setAttribute('aria-pressed', String(active));
    });
  }

  brandLayoutButtons.forEach((button) => {
    button.addEventListener('click', () => setBrandLayout(button.dataset.brandLayout));
  });

  // Subtle pointer parallax makes the emblem and wordmark respond as separate layers.
  if (brandBanner && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    brandBanner.addEventListener('pointermove', (event) => {
      const bounds = brandBanner.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
      brandBanner.style.setProperty('--wordmark-shift-x', `${(x * 5).toFixed(1)}px`);
      brandBanner.style.setProperty('--wordmark-shift-y', `${(y * 3).toFixed(1)}px`);
      brandBanner.style.setProperty('--emblem-shift-x', `${(-x * 9).toFixed(1)}px`);
      brandBanner.style.setProperty('--emblem-shift-y', `${(-y * 6).toFixed(1)}px`);
    }, { passive: true });

    brandBanner.addEventListener('pointerleave', () => {
      brandBanner.style.setProperty('--wordmark-shift-x', '0px');
      brandBanner.style.setProperty('--wordmark-shift-y', '0px');
      brandBanner.style.setProperty('--emblem-shift-x', '0px');
      brandBanner.style.setProperty('--emblem-shift-y', '0px');
    }, { passive: true });
  }

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
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-in-view');
      });
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
  // Load YouTube only after a visitor chooses to play. Leave the poster/search link
  // active until the confirmed video ID is added to the card in index.html.
  videoCards.forEach((card) => {
    const videoId = (card.dataset.youtubeId || '').trim();
    const trigger = card.querySelector('[data-video-play]');
    const frame = card.querySelector('.video-frame');
    if (!videoId || !trigger || !frame) return;

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      if (card.classList.contains('is-playing')) return;

      const title = card.dataset.videoTitle || 'SUNKNGARDNS video';
      const player = document.createElement('iframe');
      player.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      player.title = `${title} — SUNKNGARDNS on YouTube`;
      player.loading = 'lazy';
      player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      player.allowFullscreen = true;
      frame.replaceChildren(player);
      card.classList.add('is-playing');
    });
  });

  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    if (!BOOKING_EMAIL) {
      formNote.textContent = 'Your inquiry has not been sent because the booking email is not connected yet. Add the confirmed address to BOOKING_EMAIL in script.js before launch.';
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
