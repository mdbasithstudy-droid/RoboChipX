// Interactive Space Particles & Circuit Background
class Starfield {
  constructor() {
    this.canvas = document.getElementById('space-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };
    this._resizeTimeout = null;

    this.resize();
    this.createParticles();
    this.animate();
    this.setupListeners();
  }

  createParticles() {
    this.particles = [];
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 9000), 120);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        color: Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(189, 0, 255, 0.4)'
      });
    }
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setupListeners() {
    window.addEventListener('resize', () => {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = setTimeout(() => { this.resize(); this.createParticles(); }, 150);
    });
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { this.mouse.x = null; this.mouse.y = null; });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, idx) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / this.mouse.radius)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      for (let j = idx + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 90)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    });
  }
}

// Countdown Timer
function startCountdown() {
  const countdownContainer = document.querySelector('.countdown-container');
  const daysEl    = document.getElementById('days');
  const hoursEl   = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  if (!countdownContainer || !daysEl) return;

  const targetDate = new Date('July 9, 2026 09:00:00').getTime();

  function update() {
    const diff = targetDate - Date.now();
    if (diff <= 0) {
      clearInterval(interval);
      countdownContainer.innerHTML = "<div class='countdown-num' style='font-size:1.5rem;'>CHALLENGE LIVE NOW</div>";
      return;
    }
    daysEl.textContent    = String(Math.floor(diff / 86400000)).padStart(2, '0');
    hoursEl.textContent   = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    minutesEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    secondsEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  update();
  const interval = setInterval(update, 1000);
}

// Scroll Reveal Animations
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => observer.observe(el));
}

// Accordion (FAQ and Schedule)
function initAccordions() {
  function setupAccordion(headerSel, cardSel) {
    document.querySelectorAll(headerSel).forEach(header => {
      const activate = () => {
        const card = header.closest(cardSel);
        if (!card) return;
        const content  = card.querySelector('.schedule-content, .faq-content');
        const isActive = card.classList.contains('active');
        document.querySelectorAll(cardSel).forEach(c => {
          c.classList.remove('active');
          const ct = c.querySelector('.schedule-content, .faq-content');
          if (ct) ct.style.maxHeight = null;
          const hdr = c.querySelector(headerSel);
          if (hdr) hdr.setAttribute('aria-expanded', 'false');
        });
        if (!isActive && content) {
          card.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          header.setAttribute('aria-expanded', 'true');
        }
      };
      header.addEventListener('click', activate);
      header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });
  }
  setupAccordion('.schedule-header', '.schedule-card');
  setupAccordion('.faq-header', '.faq-card');
}

// Mobile Navigation
function initMobileNav() {
  const toggle   = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  const closeNav = () => {
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.querySelector('i').className = 'fa-solid fa-bars';
  };

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) { closeNav(); } else {
      navLinks.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.querySelector('i').className = 'fa-solid fa-xmark';
    }
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) closeNav();
  });
}

// Fit hero title to one line on any screen size — measures the actual
// rendered width and shrinks font-size until it fits, so "ROBOCHIPX 2026"
// (or any hero-title text) never wraps or breaks mid-word on any device.
function fitHeroTitle() {
  const titles = document.querySelectorAll('.hero-title');
  if (!titles.length) return;

  titles.forEach(el => {
    const parent = el.parentElement;
    if (!parent) return;

    // Capture whatever font-size the page originally set (an inline style
    // like registration.html's clamp(), or "" to defer to the CSS class)
    // exactly once, so later passes can restore it before re-measuring.
    if (el.dataset.origFontSizeCaptured !== '1') {
      el.dataset.origFontSize = el.style.fontSize || '';
      el.dataset.origFontSizeCaptured = '1';
    }

    // Restore the natural size first — this lets clamp() recompute fresh
    // for the current viewport before we decide whether to shrink further.
    el.style.fontSize = el.dataset.origFontSize;

    const parentStyle = window.getComputedStyle(parent);
    const availableWidth = parent.clientWidth
      - parseFloat(parentStyle.paddingLeft || 0)
      - parseFloat(parentStyle.paddingRight || 0);

    let fontSize = parseFloat(window.getComputedStyle(el).fontSize);
    const minFontSize = 13; // px floor so text never becomes unreadable
    let guard = 200; // safety cap on iterations

    while (el.scrollWidth > availableWidth && fontSize > minFontSize && guard > 0) {
      fontSize -= 1;
      el.style.fontSize = fontSize + 'px';
      guard--;
    }
  });
}

function initHeroTitleFit() {
  fitHeroTitle();
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(fitHeroTitle, 120);
  });
  // Re-check after web fonts finish loading (font swap can change widths)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeroTitle).catch(() => {});
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  new Starfield();
  startCountdown();
  initScrollAnimations();
  initAccordions();
  initMobileNav();
  initHeroTitleFit();
});
