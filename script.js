/* ═══════════════════════════════════════════════
   VEDRA BI — Website JavaScript
   Particles · Scroll animations · Counters · Nav
═══════════════════════════════════════════════ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activateNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY + 120 >= sec.offsetTop) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#a78bfa' : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });

/* ── Intersection Observer for reveal animations ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Animated counters ── */
const counters = document.querySelectorAll('.stat-num');

const runCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ── Copy code buttons ── */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.dataset.code;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = prev;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    });
  });
});

/* ══════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════ */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let W, H, particles = [], mouse = { x: null, y: null };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize, { passive: true });

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}, { passive: true });

const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#f472b6', '#fb923c', '#22d3ee'];

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * W;
    this.y = initial ? Math.random() * H : H + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = -(Math.random() * 0.5 + 0.15);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.opacity = Math.random() * 0.5 + 0.1;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.005;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.pulse += this.pulseSpeed;
    this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));

    // Mouse repulsion
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        this.x += dx / dist * force * 1.5;
        this.y += dy / dist * force * 1.5;
      }
    }

    if (this.y < -10) this.reset();
    if (this.x < -10 || this.x > W + 10) this.speedX *= -1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.currentOpacity;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Draw connecting lines between nearby particles
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 100) * 0.08;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

const PARTICLE_COUNT = Math.min(100, Math.floor(W * H / 12000));
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawLines();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

/* ══════════════════════════════════
   DASHBOARD MOCK — bar animation loop
══════════════════════════════════ */
const bars = document.querySelectorAll('.mini-bar-chart .bar');
const heights = ['40%', '65%', '50%', '80%', '60%', '90%', '75%'];
let barStep = 0;

function animateBars() {
  bars.forEach((bar, i) => {
    const newH = parseInt(heights[(i + barStep) % heights.length]);
    bar.style.height = newH + '%';
    bar.style.transition = 'height 0.8s ease';
  });
  barStep++;
}

setInterval(animateBars, 2200);

/* ══════════════════════════════════
   SCROLL PROGRESS INDICATOR
══════════════════════════════════ */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, #a78bfa, #60a5fa, #34d399);
  z-index: 9999; transition: width 0.1s linear;
  box-shadow: 0 0 8px #a78bfa;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = Math.min((scrollTop / docHeight) * 100, 100);
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ══════════════════════════════════
   SMOOTH SECTION HOVER HIGHLIGHT
══════════════════════════════════ */
document.querySelectorAll('.feature-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    const icon = row.querySelector('.feature-icon');
    if (icon) {
      const clr = getComputedStyle(icon).getPropertyValue('--clr').trim();
      row.style.borderColor = clr;
      row.style.boxShadow = `0 0 40px ${clr}18`;
    }
  });
  row.addEventListener('mouseleave', () => {
    row.style.borderColor = '';
    row.style.boxShadow = '';
  });
});

/* ── Typewriter effect on hero title ── */
const heroLines = document.querySelectorAll('.hero-line');
heroLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(20px)';
  line.style.transition = 'all 0.7s ease';
  line.style.transitionDelay = `${0.2 + i * 0.18}s`;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'translateY(0)';
  }, 100);
});

/* ── Tech card hover glow ── */
document.querySelectorAll('.tech-card').forEach((card, i) => {
  const colors = ['#a78bfa','#60a5fa','#34d399','#f472b6','#fb923c','#22d3ee','#facc15'];
  const c = colors[i % colors.length];
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = c;
    card.style.boxShadow = `0 8px 30px ${c}20`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
    card.style.boxShadow = '';
  });
});

/* ── Chart card click expand (subtle) ── */
document.querySelectorAll('.chart-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    card.style.transform = 'scale(0.96)';
    setTimeout(() => { card.style.transform = ''; }, 200);
  });
});

/* ── Add backdrop gradient pulses on hero ── */
function createHeroGlow() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const glowColors = ['rgba(167,139,250,0.06)', 'rgba(96,165,250,0.05)', 'rgba(52,211,153,0.04)'];
  glowColors.forEach((clr, i) => {
    const g = document.createElement('div');
    g.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: ${300 + i*80}px;
      height: ${300 + i*80}px;
      background: radial-gradient(circle, ${clr}, transparent 70%);
      pointer-events: none;
      animation: glow${i} ${8 + i*2}s ease-in-out infinite alternate;
      z-index: 0;
    `;
    // Random position
    g.style.left = `${20 + i * 25}%`;
    g.style.top = `${20 + i * 15}%`;
    hero.style.position = 'relative';
    hero.prepend(g);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow${i} {
        from { transform: translate(0,0) scale(1); opacity: 0.5; }
        to { transform: translate(${(-1)**i * 40}px, ${20 + i*10}px) scale(1.15); opacity: 1; }
      }
    `;
    document.head.append(style);
  });
}
createHeroGlow();

console.log('%c Vedra BI Website ', 'background: linear-gradient(90deg,#a78bfa,#60a5fa,#34d399); color: #0d0d0d; font-weight: bold; font-size: 14px; padding: 6px 12px; border-radius: 4px;');
console.log('%c Built with pure HTML · CSS · JavaScript ', 'color: #94a3b8; font-size: 12px;');
