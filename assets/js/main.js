/* ═══════════════════════════════════════════════════════════════
   C-DOT Systems — Main JS
   Navbar · Counters · Lightbox · Mobile menu · Scroll-top
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── AOS Init ─────────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 750, easing: 'ease-out-cubic', once: true, offset: 50 });
  }

  /* ── Navbar scroll behaviour ──────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    // On inner pages (not hero-based), always keep it solid
    if (navbar.classList.contains('solid')) {
      // already solid, nothing extra needed
    }
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');

      // Scroll-to-top button
      const btn = document.getElementById('scrollTop');
      if (btn) {
        btn.classList.toggle('visible', window.scrollY > 400);
      }
    }, { passive: true });
  }

  /* ── Active nav link ──────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Mobile menu ──────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobileMenu);
    });
  }
  function closeMobileMenu() {
    if (hamburger) hamburger.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Counter animation ────────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const duration = 1800;
        const startTime = performance.now();
        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const value = target * ease;
          el.textContent = target % 1 !== 0
            ? value.toFixed(1)
            : Math.floor(value).toLocaleString();
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target % 1 !== 0 ? target.toFixed(1) : target.toLocaleString();
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  /* ── Lightbox ─────────────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let galleryImages = [];
  let currentIdx = 0;

  document.querySelectorAll('[data-lightbox]').forEach((el, idx) => {
    galleryImages.push(el.dataset.src || el.src || el.querySelector('img')?.src);
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openLightbox(idx));
  });

  function openLightbox(idx) {
    if (!lightbox || !lbImg || !galleryImages.length) return;
    currentIdx = idx;
    lbImg.src = galleryImages[idx];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  function navigate(dir) {
    currentIdx = (currentIdx + dir + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[currentIdx];
  }

  if (lightbox) {
    document.getElementById('lbClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lbPrev')?.addEventListener('click', () => navigate(-1));
    document.getElementById('lbNext')?.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* ── Scroll-to-top ────────────────────────────────────────── */
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Contact form ─────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const note = document.getElementById('formNote');
      if (note) {
        note.style.color = '#16a34a';
        note.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.';
      }
      contactForm.reset();
    });
  }

  /* ── Smooth page-transition on internal links ─────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity .25s ease';
      setTimeout(() => { window.location.href = href; }, 250);
    });
  });

  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .35s ease';
  requestAnimationFrame(() => { document.body.style.opacity = '1'; });

});

/* ═══════════════════════════════════════════════════════════════
   MASKED SLIDE REVEAL
   Converts [data-masked-reveal] elements into word-by-word
   spring slide-up animations, staggered by data-stagger ms.
═══════════════════════════════════════════════════════════════ */
(function initMaskedReveal() {
  const els = document.querySelectorAll('[data-masked-reveal]');
  if (!els.length) return;

  els.forEach(container => {
    const staggerMs  = parseFloat(container.dataset.stagger  || '80');
    const speedMult  = parseFloat(container.dataset.speed    || '1');
    const hlWords    = (container.dataset.highlight || '').split(',').map(s => s.trim().toLowerCase());

    // Collect lines — split on <br> first
    // We'll walk the existing child nodes, respecting spans and BRs
    let wordIdx = 0;

    function wrapNode(node) {
      // Text node → split into words
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        const parts = node.textContent.split(/(\s+)/);
        parts.forEach(part => {
          if (!part || /^\s+$/.test(part)) return; // skip whitespace
          const outer = document.createElement('span');
          outer.className = 'msr-outer';
          const inner = document.createElement('span');
          inner.className = 'msr-inner';
          inner.style.animationDelay = `${(wordIdx * staggerMs) / speedMult}ms`;
          // Check if this word should be highlighted
          if (hlWords.includes(part.toLowerCase())) inner.classList.add('hero-hl');
          inner.textContent = part;
          wordIdx++;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        return frag;
      }
      // BR → keep as-is
      if (node.nodeName === 'BR') {
        return document.createElement('br');
      }
      // Element (e.g. <span class="hl">) → clone shell, recurse children
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false); // shallow
        Array.from(node.childNodes).forEach(child => {
          const result = wrapNode(child);
          if (result) clone.appendChild(result);
        });
        return clone;
      }
      return null;
    }

    // Save inner nodes, clear, rebuild
    const childNodes = Array.from(container.childNodes);
    container.innerHTML = '';
    container.classList.add('masked-reveal');
    childNodes.forEach(child => {
      const result = wrapNode(child);
      if (result) container.appendChild(result);
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   PHOTO GALLERY FAN
   Finds .fan-stage elements, spreads photos via IntersectionObserver,
   and enables mouse + touch drag with spring-snap-back.
═══════════════════════════════════════════════════════════════ */
(function initPhotoFan() {
  const stages = document.querySelectorAll('.fan-stage');
  if (!stages.length) return;

  stages.forEach(stage => {
    const cards = Array.from(stage.querySelectorAll('.fan-card'));
    if (!cards.length) return;

    // ── Spread on scroll into view ─────────────────────────────
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add(`spread-${i}`);
          }, i * 100);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    obs.observe(stage);

    // ── Drag logic ─────────────────────────────────────────────
    cards.forEach((card, cardIdx) => {
      let isDragging = false;
      let startX, startY, origX, origY;
      // Store current spread transform as origin
      const spreadOffsets = [
        { x: -320, y: 15,  r: -2.8 },
        { x: -160, y: 32,  r: -1.3 },
        { x:    0, y:  8,  r:  0.4 },
        { x:  160, y: 22,  r:  1.9 },
        { x:  320, y: 44,  r:  3.1 },
      ];
      const base = spreadOffsets[cardIdx] || { x: 0, y: 0, r: 0 };
      let curX = base.x, curY = base.y;

      function onStart(e) {
        e.preventDefault();
        isDragging = true;
        card.classList.add('dragging');
        card.style.transition = 'box-shadow 0.2s';
        card.style.zIndex = 9999;

        const pt = e.touches ? e.touches[0] : e;
        startX = pt.clientX;
        startY = pt.clientY;
        origX = curX;
        origY = curY;
      }
      function onMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const pt = e.touches ? e.touches[0] : e;
        const dx = pt.clientX - startX;
        const dy = pt.clientY - startY;
        curX = origX + dx;
        curY = origY + dy;
        card.style.transform = `translateX(${curX}px) translateY(${curY}px) rotate(${base.r}deg) scale(1.08)`;
      }
      function onEnd() {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        // Spring snap back to spread position
        card.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.22, 0.64, 1), box-shadow 0.3s';
        card.style.transform = `translateX(${base.x}px) translateY(${base.y}px) rotate(${base.r}deg)`;
        curX = base.x; curY = base.y;
        setTimeout(() => {
          if (!isDragging) card.style.zIndex = String(50 - cardIdx * 10);
        }, 550);
      }

      // Set initial z-index
      card.style.zIndex = String(50 - cardIdx * 10);

      // Mouse
      card.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      // Touch
      card.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);

      // Hover tilt (non-dragging)
      card.addEventListener('mousemove', e => {
        if (isDragging) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const tiltX = ((e.clientY - cy) / (rect.height / 2)) * -5;
        const tiltY = ((e.clientX - cx) / (rect.width / 2)) * 5;
        card.style.transform = `translateX(${base.x}px) translateY(${base.y}px) rotate(${base.r}deg) scale(1.08) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        if (isDragging) return;
        card.style.transform = `translateX(${base.x}px) translateY(${base.y}px) rotate(${base.r}deg)`;
      });
    });
  });
})();
