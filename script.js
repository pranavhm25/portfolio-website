  /* ── Typewriter ── */
  const phrases = ['PYTHON DEVELOPER','FULL STACK DEVELOPER','PROBLEM SOLVER','TECH ENTHUSIAST','BUILDING USEFUL TOOLS'];
  let pi=0,ci=0,del=false;
  const twEl = document.getElementById('tw');
  function type() {
    const w = phrases[pi];
    if (!del) {
      twEl.textContent = w.slice(0,++ci);
      if (ci===w.length) { del=true; setTimeout(type,1800); return; }
      setTimeout(type, 55+Math.random()*30);
    } else {
      twEl.textContent = w.slice(0,--ci);
      if (ci===0) { del=false; pi=(pi+1)%phrases.length; setTimeout(type,350); return; }
      setTimeout(type,30);
    }
  }
  type();

  /* ── Scroll reveal ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => revealObs.observe(el));

  /* ── Tech bar animation ── */
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.tech-level-bar').forEach(bar => {
          const w = bar.dataset.w + '%';
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = w; }, 150);
        });
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const grid = document.getElementById('techGrid');
  if (grid) barObs.observe(grid);

  /* ── Tech stack filter ── */
  function filterStack(cat, el) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.querySelectorAll('.tech-card').forEach(card => {
      card.style.display = (cat==='all' || card.dataset.cat===cat) ? 'flex' : 'none';
    });
  }

  /* ── Navbar active on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    navAs.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#'+cur) a.classList.add('active');
    });
  }, { passive: true });

  /* ── Mobile menu ── */
  function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
  function closeMenu()  { document.getElementById('mobileMenu').classList.remove('open'); }

  /* ── Contact form ── */
  function handleSubmit() {
    const name = document.getElementById('fname').value.trim();
    const email = document.getElementById('femail').value.trim();
    const msg = document.getElementById('fmessage').value.trim();
    if (!name || !email || !msg) {
      const btn = document.querySelector('.submit-btn');
      btn.style.background = 'linear-gradient(135deg,#f97316,#e11d48)';
      btn.innerHTML = '⚠ Please fill all fields';
      setTimeout(() => {
        btn.style.background = 'linear-gradient(135deg,var(--pink),var(--yellow))';
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Send Message';
      }, 2000);
      return;
    }
    document.getElementById('formContent').style.display = 'none';
    const s = document.getElementById('successMsg');
    s.style.display = 'flex';
  }
  function resetForm() {
    ['fname','femail','fmessage'].forEach(id => document.getElementById(id).value='');
    document.getElementById('fsubject').selectedIndex = 0;
    const fc = document.getElementById('formContent');
    fc.style.display = 'flex';
    document.getElementById('successMsg').style.display = 'none';
  }