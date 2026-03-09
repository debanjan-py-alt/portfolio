/* ─────────────────────────────────────────────────────────────────────────
   DEBANJAN DAS PORTFOLIO — script.js
   Scroll Reveal · Navbar · Skill Bars · Form · Cursor · Scroll Progress
   ───────────────────────────────────────────────────────────────────────── */

'use strict';

/* ── NAVBAR SCROLL BEHAVIOR ─────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── HAMBURGER MENU ─────────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── ACTIVE NAV LINK HIGHLIGHT ──────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

function updateActiveLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollPos >= top && scrollPos < top + height) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ── INTERSECTION OBSERVER – SCROLL REVEAL ──────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ── SKILL BAR ANIMATION ─────────────────────────────────────────────────── */
// Skill bars animate via CSS when .in-view is added from RevealObserver.
// We re-observe skill cards specifically to trigger the bar.
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
skillCards.forEach(card => skillObserver.observe(card));

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── CONTACT FORM — Netlify Forms (native submit, no JS required) ────────── */
// Form submits natively via Netlify. No fetch() or API calls needed.
// Netlify intercepts the POST at the CDN level and handles delivery.



/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #7c3aed, #c026d3, #e879f9);
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(192,38,211,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── UNIFIED MOUSE TRACKING (single listener, all DOM writes via rAF) ────── */
// Store raw coords only — no DOM writes in the event handler.
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
// Tilt / magnetic state (written by event, consumed by rAF)
let tiltTarget = null, tiltX = 0, tiltY = 0;
let magTarget = null, magX = 0, magY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

/* ── TILT EFFECT ON PROJECT CARDS ────────────────────────────────────────── */
document.querySelectorAll('.project-card, .tool-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    tiltTarget = card;
    tiltX = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    tiltY = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
  }, { passive: true });
  card.addEventListener('mouseleave', () => {
    if (tiltTarget === card) tiltTarget = null;
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    card.style.transform = '';
  }, { passive: true });
});

/* ── CURSOR (single element, instant snap, no blend mode) ────────────────── */
// One ring that snaps instantly — no lerp lag, no mix-blend-mode,
// no per-frame box-shadow repaint.
const cursorEl = document.createElement('div');
cursorEl.id = 'cursor-ring';
cursorEl.style.cssText = `
  pointer-events: none;
  position: fixed;
  top: 0; left: 0;
  width: 28px;
  height: 28px;
  border: 2px solid rgba(192,38,211,0.8);
  border-radius: 50%;
  /* transform is the ONLY property changed in rAF — no layout, no paint */
  will-change: transform;
  /* size/opacity transitions are CSS-only; rAF only updates translate */
  transition: width 0.18s ease, height 0.18s ease,
              border-color 0.18s ease, opacity 0.25s ease;
  z-index: 9998;
  /* Static glow stays on the element permanently — not animated per-frame */
  filter: drop-shadow(0 0 6px rgba(192,38,211,0.55));
`;
document.body.appendChild(cursorEl);

/* Center offset so the ring is always centred on the pointer */
const RING_SIZE = 28;
const RING_HALF = RING_SIZE / 2;

let spotlightFrame = 0;

/* Single rAF render loop — all DOM writes happen here, once per frame */
function renderLoop() {
  // Instantly snaps to pointer — no lerp = zero perceived lag
  cursorEl.style.transform = `translate(${mouseX - RING_HALF}px, ${mouseY - RING_HALF}px)`;

  // Spotlight CSS vars — update every 2nd frame to halve repaint cost
  if (spotlightFrame++ % 2 === 0) {
    document.body.style.setProperty('--mouse-x', mouseX + 'px');
    document.body.style.setProperty('--mouse-y', mouseY + 'px');
  }

  // Flush tilt write inside rAF (avoids sync layout in mousemove)
  if (tiltTarget) {
    tiltTarget.style.transition = 'transform 0.05s linear';
    tiltTarget.style.transform = `translateY(-6px) rotateX(${-tiltY}deg) rotateY(${tiltX}deg)`;
  }

  // Flush magnetic button write inside rAF
  if (magTarget) {
    magTarget.style.transform = `translateY(-3px) translate(${magX}px, ${magY}px)`;
  }

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

// Expand ring on hoverable elements (CSS class toggle — no inline style writes per frame)
const hoverables = document.querySelectorAll('a, button, .project-card, .skill-card, .tool-card, .testi-card');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorEl.style.width        = '48px';
    cursorEl.style.height       = '48px';
    cursorEl.style.borderColor  = 'rgba(232,121,249,0.9)';
  }, { passive: true });
  el.addEventListener('mouseleave', () => {
    cursorEl.style.width        = '28px';
    cursorEl.style.height       = '28px';
    cursorEl.style.borderColor  = 'rgba(192,38,211,0.8)';
  }, { passive: true });
});

/* ── TYPED HEADLINE EFFECT ────────────────────────────────────────────────── */
// Animated counter for hero stats
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.floor(eased * target) + '+';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statTargets = [50, 30, 5];
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const index = Array.from(statNums).indexOf(entry.target);
      if (index !== -1) {
        animateCounter(entry.target, statTargets[index]);
        counterObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.5 });

statNums.forEach(num => counterObserver.observe(num));

/* ── PROCESS STEP HOVER GLOW ─────────────────────────────────────────────── */
document.querySelectorAll('.process-step').forEach(step => {
  step.addEventListener('mouseenter', () => {
    step.style.boxShadow = '0 20px 50px rgba(124,58,237,0.2), 0 0 0 1px rgba(124,58,237,0.15)';
  });
  step.addEventListener('mouseleave', () => {
    step.style.boxShadow = '';
  });
});

/* ── MAGNETIC BUTTON EFFECT ─────────────────────────────────────────────── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    magTarget = btn;
    magX = (e.clientX - rect.left - rect.width  / 2) * 0.22;
    magY = (e.clientY - rect.top  - rect.height / 2) * 0.22;
  }, { passive: true });
  btn.addEventListener('mouseleave', () => {
    if (magTarget === btn) magTarget = null;
    btn.style.transform = '';
  }, { passive: true });
});

/* ── HIDE CURSOR ON MOBILE ───────────────────────────────────────────────── */
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  cursorEl.style.display = 'none';
}

console.log('%c✦ Debanjan Das Portfolio', 'color:#c026d3;font-size:1.4rem;font-weight:800;');
console.log('%cBuilt with passion for design.', 'color:#e879f9;font-size:0.9rem;');
