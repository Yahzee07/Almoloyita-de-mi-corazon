/* ============================
   script.js - ENHANCED UI
   ============================ */

/* Helper: debounce */
function debounce(fn, wait = 100) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ---------- 1) Form: confirmation (existing but improved) ---------- */
/* ---------- 1) Form: confirmation with centered popup ---------- */
(function setupForm() {
  const form = document.getElementById('formContacto');
  const popup = document.getElementById('msgPopup');
  const popupText = document.getElementById('msgPopupText');

  if (!form || !popup || !popupText) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = form.querySelector('#nombre')?.value || 'amigo/a';

    popupText.textContent = `Gracias ${nombre}, tu mensaje fue enviado correctamente.`;
    popup.classList.add('popup-confirmacion', 'show');

    // quitar popup después de 3 segundos
    setTimeout(() => {
      popup.classList.remove('show');
    }, 3000);

    form.reset();
  });
})();

/* ---------- 2) Page fade-in ---------- */
(function pageFade() {
  document.body.style.opacity = 0;
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.transition = 'opacity .9s ease';
    document.body.style.opacity = 1;
  });
})();

/* ---------- 3) IntersectionObserver: Scroll reveal (optimizado) ---------- */
(function scrollReveal() {
  const opts = { threshold: 0.12 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('mostrar', 'visible');
        observer.unobserve(e.target);
      }
    });
  }, opts);

  const targets = document.querySelectorAll('.card, .section-img, .contenido, h2, p, img, .fade-in, .fade-up, .fade-down, .zoom');
  targets.forEach(t => observer.observe(t));
})();

/* ---------- 4) Banner parallax + blur on scroll ---------- */
(function bannerEffects() {
  const bannerImg = document.querySelector('.banner img');
  const banner = document.querySelector('.banner');
  if (!bannerImg || !banner) return;

  // make banner image smoother
  bannerImg.classList.add('parallax');

  // parallax on mouse move (subtle)
  banner.addEventListener('mousemove', (ev) => {
    const r = banner.getBoundingClientRect();
    const px = (ev.clientX - r.left) / r.width;
    const py = (ev.clientY - r.top) / r.height;
    const tx = (px - 0.5) * 6; // horizontal shift
    const ty = (py - 0.5) * 6; // vertical shift
    bannerImg.style.transform = `scale(1.03) translate(${tx}px, ${ty}px)`;
  });
  banner.addEventListener('mouseleave', () => bannerImg.style.transform = 'scale(1) translate(0,0)');

  // blur on scroll (subtle) and parallax scroll
  const onScroll = () => {
    const y = window.scrollY;
    // small parallax effect by translating background upward a bit
    const s = Math.min(0.08 * y, 30);
    bannerImg.style.transform = `translateY(${s}px) scale(1)`;
    if (y > 60) banner.classList.add('blur'); else banner.classList.remove('blur');
  };
  window.addEventListener('scroll', debounce(onScroll, 12));
})();

/* ---------- 5) Create Header Controls: dark mode + hamburger ---------- */
(function headerControls() {
  const header = document.querySelector('header');
  if (!header) return;

  const darkBtn = document.querySelector('.dark-toggle'); // botón oscuro ya existente en HTML
  const hamburger = document.querySelector('.hamburger'); // botón hamburguesa ya existente en HTML
  const nav = header.querySelector('nav');

  // Dark mode toggle
  if (darkBtn) {
    const applyDark = (on) => {
      document.body.classList.toggle('dark', on);
      localStorage.setItem('site-dark', on ? '1' : '0');
    };
    applyDark(localStorage.getItem('site-dark') === '1');
    darkBtn.addEventListener('click', () => applyDark(!document.body.classList.contains('dark')));
  }

  // Hamburger toggle
  if (hamburger && nav) {
    const toggleNav = () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('open');
    };
    hamburger.addEventListener('click', toggleNav);
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && window.innerWidth < 900) toggleNav();
    });
  }
})();


/* ---------- 6) Card 3D tilt on hover ---------- */
(function cardTilt() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (ev) => {
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rotateY = (px - 0.5) * 12; // left-right
      const rotateX = (0.5 - py) * 10; // up-down
      card.classList.add('tilt');
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
      card.style.boxShadow = `${-rotateY}px ${Math.abs(rotateX)}px 30px rgba(0,0,0,0.18)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.classList.remove('tilt');
    });
  });
})();

/* ---------- 7) Typing effect (intro text) ---------- */
(function typingEffect() {
  const introP = document.getElementById('typingText');

  if (!introP) return;
  const fullText = introP.textContent.trim();
  introP.textContent = '';
  introP.classList.add('typing');

  let i = 0;
  const speed = 22; // ms per char
  function type() {
    if (i <= fullText.length) {
      introP.textContent = fullText.slice(0, i);
      i++;
      setTimeout(type, speed);
    } else {
      // remove cursor after finished
      setTimeout(() => introP.classList.remove('typing'), 800);
    }
  }
  // delay a little for page fade-in
  setTimeout(type, 450);
})();

/* ---------- 8) Simple slider/carousel for .destacados -> transform card-grid ---------- */
(function sliderSetup() {
  const grid = document.querySelector('.destacados .card-grid');
  if (!grid) return;

  // wrap items
  const wrap = document.createElement('div');
  wrap.className = 'slider-wrap';
  const track = document.createElement('div');
  track.className = 'slider-track';

  // move children
  const items = Array.from(grid.children);
  items.forEach(it => {
    it.classList.add('slider-item');
    track.appendChild(it);
  });
  wrap.appendChild(track);
  // replace grid with wrap
  grid.parentNode.replaceChild(wrap, grid);
  wrap.appendChild(track);

  // controls
  const controls = document.createElement('div');
  controls.className = 'slider-controls';
  const prev = document.createElement('button');
  prev.className = 'slider-btn';
  prev.innerText = '◀';
  const next = document.createElement('button');
  next.className = 'slider-btn';
  next.innerText = '▶';
  controls.appendChild(prev);
  controls.appendChild(next);
  wrap.appendChild(controls);

  let index = 0;
  const visibleCount = () => {
    const w = wrap.clientWidth;
    if (w < 520) return 1;
    if (w < 900) return 2;
    return 3;
  };

  function update() {
    const count = visibleCount();
    const itemW = track.children[0].getBoundingClientRect().width + 18; // gap
    const maxIndex = Math.max(0, track.children.length - count);
    index = Math.min(Math.max(0, index), maxIndex);
    const offset = -(itemW * index);
    track.style.transform = `translateX(${offset}px)`;
  }

  prev.addEventListener('click', () => { index -= 1; update(); });
  next.addEventListener('click', () => { index += 1; update(); });

  // autoplay
  let autoplay = setInterval(() => { index += 1; update(); }, 4200);
  wrap.addEventListener('mouseenter', () => clearInterval(autoplay));
  wrap.addEventListener('mouseleave', () => autoplay = setInterval(() => { index += 1; update(); }, 4200));

  window.addEventListener('resize', debounce(update, 120));
  // initial
  setTimeout(update, 200);
})();

/* ---------- 9) lightweight accessibility + small UX helpers ---------- */
(function extras() {
  // focus outlines for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-outline');
  });
  // remove outline after mouse interaction
  document.addEventListener('mousedown', () => document.body.classList.remove('show-outline'));
})();
/* ====== FLIP CARD CLICK ====== */
(function flipCards() {
  const cards = document.querySelectorAll('.flip-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });
})();
