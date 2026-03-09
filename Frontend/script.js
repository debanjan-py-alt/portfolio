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

/* ── CONTACT FORM — Netlify Forms ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

/**
 * Netlify Forms AJAX submission.
 * Posts encoded form data to '/' so Netlify intercepts it at the CDN level.
 * No page redirect — success message is shown inline.
 */
function encodeFormData(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText     = submitBtn.querySelector('.btn-text');
    const originalText = btnText.textContent;

    // — Loading state —
    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    const payload = {
      'form-name': 'contact',
      name:        contactForm.name.value.trim(),
      email:       contactForm.email.value.trim(),
      subject:     contactForm.subject.value.trim(),
      message:     contactForm.message.value.trim(),
    };

    try {
      const response = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    encodeFormData(payload),
      });

      if (response.ok) {
        // ✅ Success — show inline message
        formSuccess.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Thank you! Your message has been sent.
        `;
        formSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.remove('show'), 7000);
      } else {
        alert('⚠️ Something went wrong. Please try again or email me at hello@debanjandas.design');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      alert('⚠️ Could not submit the form. Please try again later or email me directly at hello@debanjandas.design');
    } finally {
      // — Restore button —
      submitBtn.disabled = false;
      btnText.textContent = originalText;
    }
  });
}


/* ── SCROLL PROGRESS BAR ─────────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  z-index: 9999;
  width: 0%;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── PARALLAX ORB MOUSE MOVEMENT ─────────────────────────────────────────── */
const orbs = document.querySelectorAll('.orb');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 0.5;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ── TILT EFFECT ON PROJECT CARDS ────────────────────────────────────────── */
document.querySelectorAll('.project-card, .tool-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.05s linear';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

/* ── GLOWING CURSOR TRAIL ─────────────────────────────────────────────────── */
const cursor = document.createElement('div');
cursor.style.cssText = `
  pointer-events: none;
  position: fixed;
  z-index: 9998;
  width: 8px;
  height: 8px;
  background: rgba(99,102,241,0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, opacity 0.2s;
  mix-blend-mode: screen;
  box-shadow: 0 0 12px rgba(99,102,241,0.9);
`;
document.body.appendChild(cursor);

const cursorRing = document.createElement('div');
cursorRing.style.cssText = `
  pointer-events: none;
  position: fixed;
  z-index: 9997;
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(99,102,241,0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.15s linear, width 0.25s, height 0.25s, border-color 0.2s;
`;
document.body.appendChild(cursorRing);

let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top  = cursorY + 'px';
});

function animateRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Scale cursor on hoverable elements
const hoverables = document.querySelectorAll('a, button, .project-card, .skill-card, .tool-card, .testi-card');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '14px';
    cursor.style.height = '14px';
    cursorRing.style.width  = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.borderColor = 'rgba(168,85,247,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.borderColor = 'rgba(99,102,241,0.4)';
  });
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
    step.style.boxShadow = '0 20px 50px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15)';
  });
  step.addEventListener('mouseleave', () => {
    step.style.boxShadow = '';
  });
});

/* ── HIDE CURSOR ON MOBILE ───────────────────────────────────────────────── */
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  cursor.style.display     = 'none';
  cursorRing.style.display = 'none';
}

console.log('%c✦ Debanjan Das Portfolio', 'color:#6366f1;font-size:1.4rem;font-weight:800;');
console.log('%cBuilt with passion for design.', 'color:#a855f7;font-size:0.9rem;');
