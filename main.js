/* =============================================
   STACKLY AI - Main JavaScript
   ============================================= */

'use strict';

// ─── LOADING SCREEN ────────────────────────────
window.addEventListener('load', () => {
  const loading = document.getElementById('loading-screen');
  if (loading) {
    setTimeout(() => loading.classList.add('hidden'), 1500);
  }
  initAOS();
  initCounters();
});

// ─── SCROLL PROGRESS ────────────────────────────
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = pct + '%';
  });
}

// ─── NAVBAR ─────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Hamburger
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
}

const mobileClose = document.querySelector('.mobile-nav-close');
if (mobileClose && mobileNav) {
  mobileClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
}

// Mobile nav links close on click
document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileNav) mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}
setActiveNav();

// ─── TYPING EFFECT ─────────────────────────────
const typingEl = document.querySelector('.typing-container');
if (typingEl) {
  const words = ['Business Automation', 'Customer Insights', 'Smarter Workflows', 'Predictive Models', 'Future-Ready Systems'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function typeWord() {
    const word = words[wIdx];
    if (!deleting) {
      typingEl.textContent = word.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === word.length) { deleting = true; setTimeout(typeWord, 2000); return; }
    } else {
      typingEl.textContent = word.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }
    setTimeout(typeWord, deleting ? 60 : 90);
  }
  typeWord();
}

// ─── AOS (Scroll Animations) ────────────────────
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ─── COUNTER ANIMATION ─────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
  }, 16);
}

// ─── FAQ ACCORDION ─────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq-answer').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ─── TESTIMONIAL SLIDER ────────────────────────
function initSlider() {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.slider-dot');
  let current = 0;
  const perView = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  const max = Math.max(0, cards.length - perView);

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, max));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.slider-prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.slider-next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto
  let autoTimer = setInterval(() => goTo(current >= max ? 0 : current + 1), 4000);
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo(current >= max ? 0 : current + 1), 4000); });

  goTo(0);
}
initSlider();

// ─── PRICING TOGGLE ────────────────────────────
const pricingToggle = document.querySelector('.toggle-switch');
const prices = document.querySelectorAll('[data-monthly]');

if (pricingToggle) {
  pricingToggle.addEventListener('click', () => {
    pricingToggle.classList.toggle('on');
    const isAnnual = pricingToggle.classList.contains('on');
    prices.forEach(el => {
      el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
    });
  });
}

// ─── DEMO TABS ─────────────────────────────────
document.querySelectorAll('.demo-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    document.querySelectorAll('.demo-pane').forEach(p => {
      p.style.display = p.dataset.pane === target ? 'block' : 'none';
    });
  });
});

// ─── PARTICLES ─────────────────────────────────
function createParticles(container) {
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
}
createParticles(document.querySelector('.particles'));

// ─── FORM SUBMISSIONS ─────────────────────────
// document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ Sent!';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
   
  });
// });

// ─── SMOOTH SCROLL ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ─── FEATURE TABS ──────────────────────────────
document.querySelectorAll('.feature-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.feature-item').forEach(f => f.classList.remove('active'));
    item.classList.add('active');
  });
});

// Init first feature active
const firstFeature = document.querySelector('.feature-item');
if (firstFeature) firstFeature.classList.add('active');

// ─── BLOG CATEGORIES ─────────────────────────
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── AUTH ROLE SELECTOR ───────────────────────
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const role = btn.dataset.role;
    // Redirect to appropriate dashboard
    const loginBtn = document.querySelector('.auth-card [type="submit"]');
    if (loginBtn) loginBtn.dataset.role = role;
  });
});

// ─── DASHBOARD SIDEBAR MOBILE ────────────────
const dashHamburger = document.getElementById("dashHam");;
const sidebar =  document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");

if (dashHamburger && sidebar) {
  dashHamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    sidebarOverlay?.classList.toggle("open");
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
  });
}

dashHamburger.addEventListener("click", () => {
  sidebar.classList.toggle("open");
   sidebarOverlay.classList.remove("open");
    console.log(sidebar.className);
});


// ─── DASHBOARD SIDEBAR LINKS ─────────────────
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    // Close on mobile
    if (window.innerWidth < 768) {
      sidebar?.classList.remove('open');
      sidebarOverlay?.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});

// ─── LOGIN REDIRECT ───────────────────────────
const loginSubmit = document.querySelector('#login-form [type="submit"]');
if (loginSubmit) {
  document.querySelector('#login-form')?.addEventListener('submit', e => {
    e.preventDefault();

    const role =
      document.querySelector('.role-btn.active')?.dataset.role || 'user';

    window.location.href =
      role === 'admin'
      ? 'admin-dashboard.html'
      : 'user-dashboard.html';
  });
}
// ─── MINI CHART BARS ─────────────────────────
document.querySelectorAll('.chart-bar').forEach(bar => {
  const h = Math.random() * 60 + 20;
  bar.style.height = h + '%';
});

// ─── BACK TO TOP ─────────────────────────────
const backTop = document.querySelector('#back-to-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
    backTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── TOAST NOTIFICATIONS ─────────────────────
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type === 'success' ? '#065f46' : '#1e3a5f'};
    border:1px solid ${type === 'success' ? '#10b981' : '#2563eb'};
    color:#fff;padding:14px 20px;border-radius:12px;
    font-size:0.875rem;font-family:var(--font-body);
    box-shadow:0 8px 30px rgba(0,0,0,0.4);
    transform:translateY(20px);opacity:0;
    transition:all 0.3s ease;max-width:320px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
  setTimeout(() => { toast.style.transform = 'translateY(20px)'; toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}
window.showToast = showToast;

// ─── NEWSLETTER FORM ─────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('🎉 You\'re subscribed! Welcome to Stackly AI.', 'success');
    form.querySelector('input')?.value && (form.querySelector('input').value = '');
  });
});

