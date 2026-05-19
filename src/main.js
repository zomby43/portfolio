/* ============================================================
   PORTFOLIO — main.js
   Módulos: hero GSAP | scroll reveal | nav | scroll
   ============================================================ */

import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { initAscii } from './ascii.js';
import { createIcons, ArrowRight, ExternalLink, Mail, MapPin, Sun, Moon } from 'lucide';
import { initSkillIcons } from './skill-icons.js';
import { translations, roleWords } from './i18n.js';

gsap.registerPlugin(ScrambleTextPlugin);

/* ============================================================
   1. ANIMACIÓN DEL HERO — GSAP · estilo TDR
   Secuencia: overline → nombre (clip-path wipe) → meta → bar
   ============================================================ */
function initHeroAnimation() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  /* 0.10s — Overline: desliza desde abajo */
  tl.fromTo('.hero__overline',
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.5 },
    0.10
  );

  /* 0.35s — Logo: wipe de izquierda a derecha (sello TDR) */
  tl.to('#hero-logo',
    { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power4.inOut' },
    0.35
  );

  /* 0.40s — PATRICIO: cada path cae desde arriba, stagger L→R */
  tl.fromTo('.name-patricio path',
    { opacity: 0, y: -45 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
    0.40
  );

  /* 0.55s — INFANTE: cada path sube desde abajo, stagger L→R */
  tl.fromTo('.name-infante path',
    { opacity: 0, y: 45 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
    0.55
  );

  /* 0.90s — Meta (rol + bio + cta): sube */
  tl.fromTo('.hero__meta',
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.6 },
    0.90
  );

  /* 1.10s — Barra inferior */
  tl.fromTo('.hero__bar',
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.45 },
    1.10
  );
}

/* ============================================================
   2. CURSOR PERSONALIZADO
   ============================================================ */
/* ============================================================
   ROLE SCRAMBLE — cicla entre especialidades cada 5s
   Mantiene "Ing. en" fijo, scramble solo la última palabra
   ============================================================ */
function initRoleScramble() {
  const wordEl = document.querySelector('.hero__role-word');
  if (!wordEl) return;

  const savedLang = localStorage.getItem('lang') || 'es';
  let targets = roleWords[savedLang];
  let index = 0;
  let intervalId = null;

  function scrambleTo(word) {
    gsap.to(wordEl, {
      duration: 0.75,
      scrambleText: {
        text: word,
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        revealDelay: 0.15,
        speed: 0.55,
      },
      ease: 'none',
    });
  }

  function startCycle(words) {
    targets = words;
    index = 0;
    if (intervalId) clearInterval(intervalId);
    scrambleTo(targets[index]);
    intervalId = setInterval(() => {
      index = (index + 1) % targets.length;
      scrambleTo(targets[index]);
    }, 5000);
  }

  /* Primera aparición tras la animación del hero */
  gsap.delayedCall(1.4, () => startCycle(targets));

  /* Reiniciar cuando cambia el idioma */
  window.addEventListener('langchange', (e) => {
    startCycle(roleWords[e.detail.lang]);
  });
}

/* ============================================================
   3. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  elements.forEach((el) => {
    const delay = el.dataset.revealDelay || 0;
    el.style.setProperty('--reveal-delay', delay);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ============================================================
   4. SCRAMBLE HEADERS — ScrambleTextPlugin en section__title
   ============================================================ */
function initScrambleHeaders() {
  const titles = document.querySelectorAll('.section__title');
  if (!titles.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const original = el.dataset.original;
        gsap.to(el, {
          duration: 0.9,
          scrambleText: {
            text: original,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            revealDelay: 0.1,
            speed: 0.55,
          },
          ease: 'none',
        });
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  titles.forEach((el) => {
    el.dataset.original = el.textContent.trim();
    observer.observe(el);
  });
}

/* ============================================================
   5. NAV — scroll y sección activa
   ============================================================ */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 20);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0, rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   5. SMOOTH SCROLL con offset del nav
   ============================================================ */
function initSmoothScroll() {
  const nav = document.getElementById('nav');
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (nav?.offsetHeight || 0);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   6. TOGGLE MODO CLARO / OSCURO
   ============================================================ */
function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;
  const html = document.documentElement;

  const saved      = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial    = saved || (prefersDark ? 'dark' : 'light');

  if (initial === 'light') {
    html.setAttribute('data-theme', 'light');
  }

  btn.addEventListener('click', () => {
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}


/* ============================================================
   ASCII AQUARIUM — canvas animado en la sección Sobre Mí
   Clic en la pecera → tira comida → peces la persiguen
   ============================================================ */
function initAsciiAquarium() {
  const container = document.getElementById('about-aquarium');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.title        = 'Haz clic para alimentar a los peces';
  canvas.style.cursor = 'crosshair';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const cssVars   = getComputedStyle(document.documentElement);
  const ACCENT    = cssVars.getPropertyValue('--accent').trim() || '#bd93f9';
  const FONT_SIZE = 13;

  /* ── Tipos de entidades ── */
  const FISH_TYPES = [
    { r: '><>',      l: '<><'      },
    { r: '><(o>',    l: '<o)><'    },
    { r: '><((o>',   l: '<o))><'   },
    { r: '>~>',      l: '<~<'      },
    { r: '>==>',     l: '<==<'     },
    { r: '><*>',     l: '<*><'     },  // pez estrella
    { r: '-<->',     l: '<->-'     },  // pez flecha
    { r: '><(°º>',   l: '<°º)><'   },  // pez gordo
    { r: '>>-->',    l: '<--<<'    },  // pez largo
    { r: '}><{',     l: '}{><'     },  // pez raro
  ];
  const JELLY_BODIES  = ['(·)', '(o)', '(*)', '(°)'];
  const BUBBLE_CHARS  = ['o', '°', '·', 'O'];
  const WEED_CHARS    = ['ψ', 'φ', '¥', 'Ψ', '§', 'ξ'];
  const CORAL_CHARS   = ['†', 'T', 'Y', '*', '┬', '╥'];
  const ROCK_CHARS    = ['▲', '◆', '●', '◇', '○', '▴', '◈'];
  const SHELL_CHARS   = ['(·)', '(o)', '(,)', '(*)'];
  const CRAB_R        = 'd(^)b';
  const CRAB_L        = 'b(^)d';

  function resize() {
    canvas.width  = 0;
    canvas.height = 0;
    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const W = () => canvas.width;
  const H = () => canvas.height;

  /* ── Peces normales ── */
  const fishCount = 4 + Math.floor(Math.random() * 6);
  const fish = Array.from({ length: fishCount }, () => {
    const type      = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    const dir       = Math.random() > 0.5 ? 1 : -1;
    const baseSpeed = 0.35 + Math.random() * 0.7;
    return {
      type, dir, baseSpeed,
      speed:    baseSpeed,
      x:        Math.random() * W(),
      y:        40 + Math.random() * (H() - 110),
      bobFreq:  0.015 + Math.random() * 0.02,
      bobPhase: Math.random() * Math.PI * 2,
      fontSize: 11 + Math.floor(Math.random() * 5),
      t:        Math.random() * 200,
      chasing:  false,
    };
  });

  /* ── Medusas (flotan verticalmente) ── */
  const jellyCount = 1 + Math.floor(Math.random() * 3);
  const jellies = Array.from({ length: jellyCount }, () => ({
    body:     JELLY_BODIES[Math.floor(Math.random() * JELLY_BODIES.length)],
    x:        20 + Math.random() * (W() - 40),
    yBase:    60 + Math.random() * (H() * 0.55),
    amp:      18 + Math.random() * 22,
    freq:     0.007 + Math.random() * 0.006,
    phase:    Math.random() * Math.PI * 2,
    drift:    (Math.random() - 0.5) * 0.12,
    fontSize: 12 + Math.floor(Math.random() * 4),
    opacity:  0.6 + Math.random() * 0.3,
  }));

  /* ── Cangrejos (caminan por el fondo) ── */
  const crabCount = Math.random() > 0.35 ? 1 + Math.floor(Math.random() * 2) : 0;
  const crabs = Array.from({ length: crabCount }, () => ({
    x:          20 + Math.random() * (W() - 40),
    dir:        Math.random() > 0.5 ? 1 : -1,
    speed:      0.18 + Math.random() * 0.22,
    fontSize:   11 + Math.floor(Math.random() * 3),
    pauseTimer: 0,
  }));

  /* ── Burbujas ── */
  const bubbles = Array.from({ length: 10 + Math.floor(Math.random() * 8) }, () => ({
    char:    BUBBLE_CHARS[Math.floor(Math.random() * BUBBLE_CHARS.length)],
    x:       Math.random() * W(),
    y:       Math.random() * H(),
    speed:   0.1 + Math.random() * 0.25,
    opacity: 0.15 + Math.random() * 0.28,
    drift:   (Math.random() - 0.5) * 0.3,
  }));

  /* ── Algas ── */
  const weeds = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => ({
    x:      15 + Math.random() * (W() - 30),
    height: 2 + Math.floor(Math.random() * 6),
    chars:  WEED_CHARS,
    phase:  Math.random() * Math.PI * 2,
    opacity: 0.35 + Math.random() * 0.2,
  }));

  /* ── Coral ── */
  const corals = Array.from({ length: 2 + Math.floor(Math.random() * 4) }, () => ({
    x:      15 + Math.random() * (W() - 30),
    height: 1 + Math.floor(Math.random() * 4),
    chars:  CORAL_CHARS,
    phase:  Math.random() * Math.PI * 2,
    opacity: 0.4 + Math.random() * 0.25,
  }));

  /* ── Rocas y conchas (estáticas) ── */
  const rockCount = 4 + Math.floor(Math.random() * 7);
  const rocks = Array.from({ length: rockCount }, () => ({
    x:       10 + Math.random() * (W() - 20),
    char:    Math.random() > 0.45
               ? ROCK_CHARS[Math.floor(Math.random() * ROCK_CHARS.length)]
               : SHELL_CHARS[Math.floor(Math.random() * SHELL_CHARS.length)],
    size:    9 + Math.floor(Math.random() * 5),
    yOff:    6 + Math.floor(Math.random() * 14),
    opacity: 0.3 + Math.random() * 0.35,
  }));

  /* ── Comida (clic) ── */
  const food = [];
  canvas.addEventListener('click', (e) => {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    food.push({
      x:     (e.clientX - rect.left) * scaleX,
      y:     (e.clientY - rect.top)  * scaleY,
      fall:  0.55 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 0.15,
      eaten: false,
    });
  });

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${FONT_SIZE}px 'Martian Mono', monospace`;

    /* — Rocas / conchas — */
    rocks.forEach(r => {
      ctx.font        = `${r.size}px 'Martian Mono', monospace`;
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = r.opacity;
      ctx.fillText(r.char, r.x, H() - r.yOff);
    });

    /* — Coral — */
    corals.forEach(c => {
      for (let i = 0; i < c.height; i++) {
        const sway = Math.sin(t * 0.022 + c.phase + i * 0.8) * 3;
        ctx.font        = `${FONT_SIZE}px 'Martian Mono', monospace`;
        ctx.fillStyle   = ACCENT;
        ctx.globalAlpha = c.opacity - i * 0.06;
        ctx.fillText(c.chars[i % c.chars.length], c.x + sway, H() - 10 - i * (FONT_SIZE + 2));
      }
    });

    /* — Algas — */
    weeds.forEach(w => {
      for (let i = 0; i < w.height; i++) {
        const sway = Math.sin(t * 0.018 + w.phase + i * 0.6) * 5;
        ctx.font        = `${FONT_SIZE}px 'Martian Mono', monospace`;
        ctx.fillStyle   = ACCENT;
        ctx.globalAlpha = w.opacity;
        ctx.fillText(w.chars[i % w.chars.length], w.x + sway, H() - 8 - i * (FONT_SIZE + 3));
      }
    });

    /* — Burbujas — */
    bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += b.drift;
      if (b.y < -10) { b.y = H() + 5; b.x = Math.random() * W(); }
      ctx.font        = `${FONT_SIZE}px 'Martian Mono', monospace`;
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = b.opacity;
      ctx.fillText(b.char, b.x, b.y);
    });

    /* — Medusas — */
    jellies.forEach(j => {
      const y = j.yBase + Math.sin(t * j.freq + j.phase) * j.amp;
      j.x += j.drift;
      if (j.x < -20)       j.x = W() + 20;
      if (j.x > W() + 20)  j.x = -20;
      ctx.font        = `${j.fontSize}px 'Martian Mono', monospace`;
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = j.opacity;
      ctx.fillText(j.body, j.x, y);
      /* tentáculos */
      ctx.globalAlpha = j.opacity * 0.45;
      ctx.fillText('|||', j.x + 1, y + j.fontSize + 2);
    });

    /* — Cangrejos — */
    crabs.forEach(c => {
      if (c.pauseTimer > 0) {
        c.pauseTimer--;
      } else {
        c.x += c.speed * c.dir;
        if (Math.random() < 0.003) {
          c.pauseTimer = 40 + Math.floor(Math.random() * 80);
          if (Math.random() < 0.4) c.dir *= -1;
        }
        if (c.x < 10 || c.x > W() - 40) c.dir *= -1;
      }
      const text = c.dir === 1 ? CRAB_R : CRAB_L;
      ctx.font        = `${c.fontSize}px 'Martian Mono', monospace`;
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = 0.8;
      ctx.fillText(text, c.x, H() - 8);
    });

    /* — Comida — */
    for (let i = food.length - 1; i >= 0; i--) {
      const fd = food[i];
      if (fd.eaten) { food.splice(i, 1); continue; }
      fd.y += fd.fall;
      fd.x += fd.drift;
      if (fd.y > H() + 10) { food.splice(i, 1); continue; }
      ctx.font        = `${FONT_SIZE}px 'Martian Mono', monospace`;
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = 0.95;
      ctx.fillText('*', fd.x, fd.y);
    }

    /* — Peces — */
    fish.forEach(f => {
      f.t += 1;

      let nearest = null, nearDist = Infinity;
      food.forEach(fd => {
        const dx = fd.x - f.x, dy = fd.y - f.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < nearDist) { nearDist = d; nearest = fd; }
      });

      if (nearest && nearDist < 240) {
        f.dir     = nearest.x >= f.x ? 1 : -1;
        f.y      += (nearest.y - f.y) * 0.028;
        f.speed   = f.baseSpeed * 2.4;
        f.chasing = true;
        if (nearDist < 16) nearest.eaten = true;
      } else {
        f.speed   = f.baseSpeed;
        f.chasing = false;
        f.y += Math.sin(f.t * f.bobFreq + f.bobPhase) * 0.35;
      }

      f.x += f.speed * f.dir;

      const text = f.dir === 1 ? f.type.r : f.type.l;
      ctx.font    = `${f.fontSize}px 'Martian Mono', monospace`;
      const tw    = ctx.measureText(text).width;

      if (f.dir === 1  && f.x >  W() + tw) f.x = -tw - 5;
      if (f.dir === -1 && f.x < -tw - 5)   f.x =  W() + tw;

      const fy = Math.max(20, Math.min(H() - 30, f.y));

      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = f.chasing ? 1.0 : 0.85;
      ctx.fillText(text, f.x, fy);
    });

    ctx.globalAlpha = 1;
    t++;
    requestAnimationFrame(draw);
  }

  draw();
}

/* ============================================================
   EXP STARS — asteriscos giratorios con velocidad por centralidad
   ============================================================ */
function initExpStars() {
  const stars = document.querySelectorAll('.exp-star');
  if (!stars.length) return;

  // Fijar transformOrigin al centro del elemento antes de cualquier rotación
  stars.forEach(star => gsap.set(star, { transformOrigin: '50% 50%', rotation: 30 }));

  const rotations = Array.from(stars).map(() => 30);
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (delta === 0) return;

    stars.forEach((star, i) => {
      const rect   = star.getBoundingClientRect();
      const starCY = rect.top + rect.height / 2;
      const vpCY   = window.innerHeight / 2;
      const dist   = Math.abs(starCY - vpCY);
      const maxDist = window.innerHeight * 0.75;

      // 1 = centrado en viewport, 0 = en el borde
      const centrality = Math.max(0, 1 - dist / maxDist);
      // velocidad: lenta en bordes, rápida en el centro
      const speed = 0.1 + centrality * 1.4;

      rotations[i] += delta * speed * 0.3;
      gsap.set(star, { rotation: rotations[i] });
    });
  }, { passive: true });
}

/* ============================================================
   LANG TOGGLE — ES ↔ EN, persistido en localStorage
   ============================================================ */
function applyLang(lang) {
  const t = translations[lang];
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang.toUpperCase();
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  /* Mantener data-original en sync para scramble headers no disparados aún */
  document.querySelectorAll('.section__title[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.dataset.original = t[key];
  });

  window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  const saved = localStorage.getItem('lang') || 'es';
  let currentLang = saved;
  applyLang(currentLang);

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', currentLang);
    applyLang(currentLang);
  });
}

/* ============================================================
   MASONRY — ResizeObserver span calc para .work-grid
   ============================================================ */
function initMasonry() {
  const grid = document.querySelector('.work-grid');
  if (!grid) return;
  if (window.innerWidth < 768) return; // mobile usa flex

  const ROW = 4;   // grid-auto-rows en CSS
  const GUTTER = 12; // espacio vertical entre cards (px)

  function layoutCard(card) {
    card.style.gridRowEnd = 'auto';
    const spans = Math.ceil((card.scrollHeight + GUTTER) / ROW);
    card.style.gridRowEnd = `span ${spans}`;
  }

  function layout() {
    grid.querySelectorAll('.work-card').forEach(layoutCard);
  }

  // Correr al cargar y cuando terminen las imágenes
  layout();
  grid.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', layout, { once: true });
  });

  const ro = new ResizeObserver(layout);
  grid.querySelectorAll('.work-card').forEach(card => ro.observe(card));
}


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* Dither WebGL — solo en modo oscuro (CSS oculta el canvas en light) */
  const heroSection = document.querySelector('#hero');
  if (heroSection) initAscii(heroSection);

  createIcons({ icons: { ArrowRight, ExternalLink, Mail, MapPin, Sun, Moon } });
  initSkillIcons();

  /* Logo click — flip 3D por path con accent en el medio */
  const heroLogo = document.getElementById('hero-logo');
  if (heroLogo) {
    let animating = false;

    heroLogo.addEventListener('click', () => {
      if (animating) return;
      animating = true;
      /* Leer colores en el momento del click — funciona con toggle de tema */
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue('--accent').trim();
      const fg     = style.getPropertyValue('--fg').trim();
      const paths = [...heroLogo.querySelectorAll('path')];
      const tl = gsap.timeline({ onComplete: () => { animating = false; } });

      /* Cada path gira en Y hasta 90° (desaparece), cambia color, vuelve */
      paths.forEach((path, i) => {
        const delay = i * 0.08;

        /* Ida — gira hasta plano (rotationY 90) */
        tl.to(path, {
          rotationY: 90,
          fill: accent,
          duration: 0.22,
          ease: 'power2.in',
        }, delay);

        /* Vuelta — completa el flip desde -90 a 0 */
        tl.fromTo(path,
          { rotationY: -90 },
          {
            rotationY: 0,
            fill: fg,
            duration: 0.45,
            ease: 'power3.out',
            onComplete() {
              /* Limpia el fill inline para que CSS variable tome el control */
              gsap.set(path, { fill: '' });
            },
          },
          delay + 0.22
        );
      });
    });
  }

  initAsciiAquarium();
  initMasonry();
  initHeroAnimation();
  initRoleScramble();
  initScrollReveal();
  initScrambleHeaders();
  initNavScroll();
  initActiveNav();
  initSmoothScroll();
  initThemeToggle();
  initLangToggle();
  initExpStars();
});
