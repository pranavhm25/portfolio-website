/* ══════════════════════════════════════════
   PRANAV PORTFOLIO — shared.js
   Utilities shared across ALL pages:
   - Navbar active link detection
   - Mobile menu
   - Custom cursor
   - Scroll progress bar
   - Page loader
   - Particle canvas
   - Scroll reveal
   - Hover attr helpers
══════════════════════════════════════════ */

/* ── CONFIG ── */
const API = "http://localhost:5000/api";
// Change to deployed URL for production:
// const API = "https://pranav-portfolio-api.onrender.com/api";


/* ════════════════════════
   PAGE LOADER
════════════════════════ */
(function initLoader() {
  const msgs = ["Initializing...", "Loading...", "Almost there...", "Welcome!"];
  const bar  = document.getElementById("loaderBar");
  const text = document.getElementById("loaderText");
  if (!bar || !text) return;

  let prog = 0, mi = 0;
  const iv = setInterval(() => {
    prog += Math.random() * 18 + 4;
    if (prog > 100) prog = 100;
    bar.style.width = prog + "%";
    if (prog > 30 && mi === 0) { text.textContent = msgs[1]; mi = 1; }
    if (prog > 65 && mi === 1) { text.textContent = msgs[2]; mi = 2; }
    if (prog >= 100) {
      text.textContent = msgs[3];
      clearInterval(iv);
      setTimeout(() => document.getElementById("loader")?.classList.add("hidden"), 600);
    }
  }, 120);
})();


/* ════════════════════════
   CUSTOM CURSOR
════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  });
  (function loop() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();
})();


/* ════════════════════════
   SCROLL PROGRESS BAR
════════════════════════ */
(function initProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + "%";
  }, { passive: true });
})();


/* ════════════════════════
   PARTICLE CANVAS
════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const colors = ["rgba(255,111,216,","rgba(250,204,21,","rgba(74,222,128,","rgba(59,130,246,"];
  let P = [];
  function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  for (let i = 0; i < 120; i++) P.push({
    x: Math.random()*innerWidth, y: Math.random()*innerHeight,
    r: Math.random()*1.5+.3, dx:(Math.random()-.5)*.25, dy:(Math.random()-.5)*.25,
    color: colors[Math.floor(Math.random()*colors.length)], alpha: Math.random()*.5+.2
  });
  (function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    P.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.color+p.alpha+")"; ctx.fill();
      p.x+=p.dx; p.y+=p.dy;
      if(p.x<0||p.x>canvas.width) p.dx*=-1;
      if(p.y<0||p.y>canvas.height) p.dy*=-1;
    });
    requestAnimationFrame(draw);
  })();
})();


/* ════════════════════════
   SCROLL REVEAL
════════════════════════ */
(function initReveal() {
  const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal,.reveal-l,.reveal-r").forEach(el => obs.observe(el));
})();


/* ════════════════════════
   NAVBAR — highlight current page
════════════════════════ */
(function initNavbar() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(a => {
    const href = a.getAttribute("href")?.split("/").pop();
    if (href === path) a.classList.add("active");
  });
})();

function toggleMenu() { document.getElementById("mobileMenu")?.classList.toggle("open"); }
function closeMenu()  { document.getElementById("mobileMenu")?.classList.remove("open"); }


/* ════════════════════════
   HOVER ATTR HELPERS
   data-hover="color"  → border color on hover
════════════════════════ */
(function initHoverAttrs() {
  document.querySelectorAll("[data-hover]").forEach(el => {
    el.addEventListener("mouseenter", () => el.style.borderColor = el.dataset.hover);
    el.addEventListener("mouseleave", () => el.style.borderColor = "");
  });
})();


/* ════════════════════════
   VISITOR COUNTER (runs on every page)
════════════════════════ */
async function initVisitorCounter() {
  try {
    const res  = await fetch(`${API}/visitors/ping`, { method: "POST" });
    const data = await res.json();
    const badge = document.getElementById("visitor-badge");
    if (badge && data.total) badge.textContent = ` · ${data.total.toLocaleString()} visitors`;
  } catch (_) {}
}

document.addEventListener("DOMContentLoaded", initVisitorCounter);
