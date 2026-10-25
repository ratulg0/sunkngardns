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