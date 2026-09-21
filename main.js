/* ═══════════════════════════════════════════════════════
   DEVAPRIYAN C.M — VILLO-STYLE PORTFOLIO
   main.js
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── THEME TOGGLE ─────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = themeToggle.querySelector('.icon-sun');
  const iconMoon = themeToggle.querySelector('.icon-moon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('dev-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('dev-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    } else {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    }
  }

  // ── MOBILE MENU ───────────────────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('nav-mobile-overlay');
  const mobileClose = document.getElementById('nav-mobile-close');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  hamburger.addEventListener('click', () => {
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeMobileMenu() {
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileClose.addEventListener('click', closeMobileMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

  // ── SMOOTH SCROLL ─────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 64;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── ACTIVE NAV LINK (scroll spy) ──────────────────────
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => navObserver.observe(s));

  // ── NAV SCROLL STYLE ──────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 30px rgba(0,0,0,0.4)' : '';
  }, { passive: true });

  // ── SCROLL REVEAL (IntersectionObserver) ─────────────
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0);
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay * 1000);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── HERO PARALLAX (mouse) ────────────────────────────
  const heroSection = document.querySelector('.hero');
  const parallaxSlow = document.querySelectorAll('.js-parallax-slow');
  const parallaxFast = document.querySelectorAll('.js-parallax-fast');
  let mouseX = 0, mouseY = 0;
  let rafRunning = false;

  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    if (!rafRunning) {
      rafRunning = true;
      requestAnimationFrame(applyParallax);
    }
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0; mouseY = 0;
    requestAnimationFrame(applyParallax);
  });

  function applyParallax() {
    rafRunning = false;
    const slowAmt = 6;
    const fastAmt = 14;
    parallaxSlow.forEach(el => {
      el.style.transform = `translate(${mouseX * slowAmt}px, ${mouseY * slowAmt}px)`;
    });
    parallaxFast.forEach(el => {
      // portrait is absolutely positioned — don't override the reveal animation
      // only add transform offset on top if already revealed
      if (el.classList.contains('reveal-load')) return;
      const base = window.innerWidth <= 600 ? '' : `translateY(-55%)`;
      el.style.transform = `${base} translate(${mouseX * fastAmt}px, ${mouseY * fastAmt}px)`;
    });
  }

  // ── CONTACT FORM ─────────────────────────────────────
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    function validate(id, errId, check, msg) {
      const input = document.getElementById(id);
      const err = document.getElementById(errId);
      if (!check(input.value.trim())) {
        input.classList.add('error');
        err.textContent = msg;
        valid = false;
      } else {
        input.classList.remove('error');
        err.textContent = '';
      }
    }

    validate('f-name', 'err-name', v => v.length > 0, 'Name is required.');
    validate('f-email', 'err-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email address.');
    validate('f-subject', 'err-subject', v => v.length > 0, 'Subject is required.');
    validate('f-msg', 'err-msg', v => v.length > 10, 'Message must be at least 10 characters.');

    if (!valid) return;

    // Build mailto link (static site — opens email client)
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const message = document.getElementById('f-msg').value.trim();
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    const mailtoLink = `mailto:dpriyan66@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.open(mailtoLink);
    formStatus.textContent = 'Your email client has been opened. Please send the message from there.';
    formStatus.className = 'form-status success';
    form.reset();
  });

  // Clear errors on input
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // ── AI CHAT ───────────────────────────────────────────
  const aiFab = document.getElementById('ai-fab');
  const aiWindow = document.getElementById('ai-window');
  const aiWinClose = document.getElementById('ai-win-close');
  const aiMsgs = document.getElementById('ai-msgs');
  const aiChips = document.getElementById('ai-chips');
  const aiInput = document.getElementById('ai-input');
  const aiSend = document.getElementById('ai-send');

  let chatOpen = false;

  const aiResponses = {
    who: `Devapriyan C.M is a Computer Science and Engineering student at Lovely Professional University, Phagwara, Punjab. He's passionate about full-stack development, data analysis, and AI-driven technologies.`,
    projects: `He has built three projects:\n\n1. 🚆 Indian Railway Delays Analysis — EDA with Python, Pandas, NumPy, Matplotlib & Seaborn\n\n2. 🖥️ Complaint Management Portal — Full-stack MERN app with React, Tailwind CSS, Node.js, Express.js & MongoDB\n\n3. 🎨 Background Changer Web App — Interactive JavaScript DOM project`,
    skills: `His technical skills include:\n\n• Programming: Java, Python, C\n• Web: React, Tailwind CSS, Node.js, Express.js, HTML, CSS, JavaScript\n• Database: MongoDB, MS SQL Server\n• Data & Tools: Pandas, NumPy, Tableau, ETL`,
    certs: `He holds 6 certifications:\n\n1. Software Engineer — HackerRank\n2. Agentic AI Certified Foundations Associate — Oracle University\n3. Database Management System — Infosys\n4. GenAI Powered Data Analytics Job Simulation — Tata / Forage\n5. Logic Building with AI-Driven Full Stack Development — LPU\n6. Data Analyst 101`,
    tech: `Devapriyan works with: React, Node.js, Express.js, MongoDB, Python, Pandas, NumPy, Java, Tailwind CSS, JavaScript, HTML, CSS, Matplotlib, Seaborn, Tableau, and SQL databases.`,
    contact: `You can reach Devapriyan at:\n\n📧 dpriyan66@gmail.com\n📞 +91 9080470826\n💼 linkedin.com/in/devapriyan-c-m\n🐙 github.com/Devapriyan07\n📍 Phagwara, Punjab, India`,
    default: `I can answer questions about Devapriyan's background, projects, skills, certifications, technologies, and contact details. Try one of the quick questions above! 😊`
  };

  function matchResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('who') || t.includes('devapriyan') || t.includes('about')) return aiResponses.who;
    if (t.includes('project') || t.includes('built') || t.includes('work')) return aiResponses.projects;
    if (t.includes('skill') || t.includes('know') || t.includes('learn')) return aiResponses.skills;
    if (t.includes('cert') || t.includes('hackerrank') || t.includes('oracle') || t.includes('forage')) return aiResponses.certs;
    if (t.includes('tech') || t.includes('technolog') || t.includes('language') || t.includes('stack')) return aiResponses.tech;
    if (t.includes('contact') || t.includes('email') || t.includes('reach') || t.includes('hire')) return aiResponses.contact;
    return aiResponses.default;
  }

  function appendMsg(text, role) {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    const inner = role === 'bot' ? document.createElement('p') : document.createElement('span');
    inner.textContent = text;
    div.appendChild(inner);
    aiMsgs.appendChild(div);
    aiMsgs.scrollTop = aiMsgs.scrollHeight;
  }

  function typingIndicator() {
    const div = document.createElement('div');
    div.className = 'ai-msg bot typing-indicator';
    div.innerHTML = '<p>...</p>';
    div.id = 'ai-typing';
    aiMsgs.appendChild(div);
    aiMsgs.scrollTop = aiMsgs.scrollHeight;
  }

  function sendMessage(text, key) {
    if (!text.trim()) return;
    appendMsg(text, 'user');
    aiInput.value = '';
    aiChips.style.display = 'none';

    typingIndicator();
    setTimeout(() => {
      const typing = document.getElementById('ai-typing');
      if (typing) typing.remove();
      const response = key ? aiResponses[key] : matchResponse(text);
      appendMsg(response, 'bot');
    }, 700 + Math.random() * 400);
  }

  aiFab.addEventListener('click', () => {
    chatOpen = !chatOpen;
    aiWindow.classList.toggle('open', chatOpen);
    aiWindow.setAttribute('aria-hidden', !chatOpen);
    if (chatOpen) aiInput.focus();
  });

  aiWinClose.addEventListener('click', () => {
    chatOpen = false;
    aiWindow.classList.remove('open');
    aiWindow.setAttribute('aria-hidden', 'true');
  });

  aiSend.addEventListener('click', () => sendMessage(aiInput.value, null));
  aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(aiInput.value, null); });

  document.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => sendMessage(chip.textContent, chip.dataset.key));
  });

  // ── SKILL LINE ANIMATION ON CARD REVEAL ──────────────
  const skillCards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillCards.forEach(card => skillObserver.observe(card));

  // ── CERT ITEM ANIMATION ───────────────────────────────
  const certItems = document.querySelectorAll('.cert-item');
  const certObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        certObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  certItems.forEach(item => certObserver.observe(item));


  // ── INNOVATION LAB ───────────────────────────────────
  const body = document.body;
  const recruiterToggle = document.getElementById('recruiter-toggle');
  const recruiterLabToggle = document.getElementById('recruiter-lab-toggle');
  const recruiterSnapshot = document.getElementById('recruiter-snapshot');

  function setRecruiterMode(on) {
    body.classList.toggle('recruiter-mode', on);
    [recruiterToggle, recruiterLabToggle, recruiterSnapshot].forEach(btn => {
      if (btn) btn.classList.toggle('active', on);
    });
    localStorage.setItem('dev-recruiter-mode', on ? '1' : '0');
  }
  const savedRecruiter = localStorage.getItem('dev-recruiter-mode') === '1';
  setRecruiterMode(savedRecruiter);
  [recruiterToggle, recruiterLabToggle, recruiterSnapshot].forEach(btn => {
    if (btn) btn.addEventListener('click', () => setRecruiterMode(!body.classList.contains('recruiter-mode')));
  });

  // 12. Portfolio search — indexes projects, certificates and Lab panels.
  const portfolioSearch = document.getElementById('portfolio-search');
  const searchResults = document.getElementById('search-results');
  if (portfolioSearch && searchResults) {
    const searchable = [
      ...document.querySelectorAll('.project-item'),
      ...document.querySelectorAll('.cert-flip-card'),
      ...document.querySelectorAll('.lab-panel')
    ];
    const clean = value => value.replace(/\s+/g, ' ').trim();
    portfolioSearch.addEventListener('input', () => {
      const q = portfolioSearch.value.trim().toLowerCase();
      searchable.forEach(el => el.classList.remove('search-hit'));
      if (!q) { searchResults.classList.remove('show'); searchResults.innerHTML=''; return; }
      const matches = searchable.filter(el => clean(el.textContent).toLowerCase().includes(q)).slice(0, 10);
      searchResults.classList.add('show');
      searchResults.innerHTML = matches.length ? matches.map((el, i) => {
        const title = clean((el.querySelector('h3,h4,.project-title,.cert-title') || el).textContent).slice(0,80);
        return `<button class="search-result-item" data-index="${i}"><b>${title}</b><span>Open ↗</span></button>`;
      }).join('') : '<div class="search-result-item"><b>No matching result</b><span>Try React, Python, AI, certificate...</span></div>';
      const buttons = searchResults.querySelectorAll('.search-result-item[data-index]');
      buttons.forEach(btn => btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.index); const el = matches[idx];
        el.classList.add('search-hit'); el.scrollIntoView({behavior:'smooth', block:'center'});
        setTimeout(() => el.classList.remove('search-hit'), 1800);
      }));
      matches.forEach(el => el.classList.add('search-hit'));
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== portfolioSearch && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault(); portfolioSearch?.focus();
    }
  });

  // 13. Interactive tech stack / skill galaxy
  const techDescriptions = {
    'React':'Used for component-based interfaces, including the Complaint Management Portal and portfolio UI.',
    'Python':'Used for data analysis, exploratory analysis and problem solving.',
    'JavaScript':'Used for DOM manipulation, interactions and web applications.',
    'Node.js':'Used for backend services and full-stack JavaScript development.',
    'MongoDB':'Used for centralized data storage in the Complaint Management Portal.',
    'Java':'Used for programming and DSA practice.',
    'SQL':'Used for database querying and DBMS work.',
    'Pandas':'Used for cleaning, transforming and exploring datasets.',
    'NumPy':'Used for numerical operations in data analysis.',
    'Tailwind CSS':'Used for responsive UI styling in the MERN project.'
  };
  const techDetail = document.getElementById('tech-detail');
  document.querySelectorAll('[data-tech]').forEach(btn => {
    if (!techDescriptions[btn.dataset.tech]) return;
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tech]').forEach(x => x.classList.remove('active'));
      document.querySelectorAll(`[data-tech="${CSS.escape(btn.dataset.tech)}"]`).forEach(x => x.classList.add('active'));
      if (techDetail) techDetail.innerHTML = `<strong>${btn.dataset.tech}</strong><span>${techDescriptions[btn.dataset.tech]}</span>`;
    });
  });

  // 9. GitHub public activity dashboard
  const activityList = document.getElementById('activity-list');
  const ghAvatar = document.getElementById('gh-avatar');
  const ghBio = document.getElementById('gh-bio');
  const repoStat = document.querySelector('[data-stat="repos"]');
  async function loadGitHubActivity() {
    if (!activityList) return;
    try {
      const user = await fetch('https://api.github.com/users/Devapriyan07', {headers:{Accept:'application/vnd.github+json'}}).then(r => {
        if (!r.ok) throw new Error('GitHub user request failed'); return r.json();
      });
      const events = await fetch('https://api.github.com/users/Devapriyan07/events/public?per_page=8', {headers:{Accept:'application/vnd.github+json'}}).then(r => {
        if (!r.ok) throw new Error('GitHub activity request failed'); return r.json();
      });
      if (repoStat) repoStat.textContent = user.public_repos ?? 1;
      if (ghBio) ghBio.textContent = user.bio || `${user.public_repos || 1} public ${user.public_repos === 1 ? 'repository' : 'repositories'} · ${user.followers || 0} followers`;
      if (ghAvatar && user.avatar_url) ghAvatar.innerHTML = `<img src="${user.avatar_url}" alt="Devapriyan GitHub profile photo" loading="lazy">`;
      const icon = type => ({PushEvent:'↗',CreateEvent:'✦',PullRequestEvent:'⇄',IssuesEvent:'!',WatchEvent:'★',ForkEvent:'⑂'}[type] || '•');
      activityList.innerHTML = events.length ? events.slice(0,6).map(ev => {
        const repo = ev.repo?.name || 'GitHub';
        const type = ev.type.replace('Event','');
        const date = new Date(ev.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric'});
        return `<div class="activity-item"><span class="activity-icon">${icon(ev.type)}</span><span><b>${type}</b> · ${repo}</span><small>${date}</small></div>`;
      }).join('') : '<div class="activity-item"><span class="activity-icon">•</span><span>No public events returned yet.</span></div>';
    } catch (err) {
      activityList.innerHTML = '<div class="activity-item"><span class="activity-icon">↗</span><span>GitHub activity is available on <a href="https://github.com/Devapriyan07" target="_blank" rel="noopener" style="color:var(--accent)">Devapriyan07</a>.</span></div>';
      if (ghBio) ghBio.textContent = 'Public GitHub profile';
    }
  }
  loadGitHubActivity();

  // 7. Live playground — background changer
  const bgDemo = document.getElementById('bg-demo');
  document.querySelectorAll('[data-bg]').forEach(btn => btn.addEventListener('click', () => {
    if (!bgDemo) return;
    bgDemo.classList.add('flash');
    bgDemo.style.background = btn.dataset.bg;
    bgDemo.querySelector('span').textContent = btn.dataset.bg.toUpperCase();
    setTimeout(() => bgDemo.classList.remove('flash'), 220);
  }));

  // 14. Smart resume viewer
  const resumeModal = document.getElementById('resume-modal');
  const openResume = document.getElementById('open-resume');
  const openResumeLab = document.getElementById('open-resume-lab');
  const closeResume = document.getElementById('close-resume');
  function toggleResume(open) {
    if (!resumeModal) return;
    resumeModal.classList.toggle('open', open); resumeModal.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  [openResume, openResumeLab].forEach(btn => btn?.addEventListener('click', () => toggleResume(true)));
  closeResume?.addEventListener('click', () => toggleResume(false));
  resumeModal?.addEventListener('click', e => { if (e.target === resumeModal) toggleResume(false); });

  // 2. Interactive developer terminal
  const terminalModal = document.getElementById('terminal-modal');
  const terminalToggle = document.getElementById('terminal-toggle');
  const closeTerminal = document.getElementById('close-terminal');
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalCommands = {
    help: 'Commands: about · projects · skills · certs · github · contact · resume · game · recruiter · clear',
    about: 'Devapriyan C.M — CSE student focused on full-stack development, data analysis and AI-driven technologies.',
    projects: 'Projects: Indian Railway Delays Analysis · Complaint Management Portal · Background Changer.',
    skills: 'Stack: Java · Python · C · React · JavaScript · Node.js · Express · MongoDB · SQL · Pandas · NumPy · Tailwind CSS.',
    certs: '6 credentials: HackerRank Software Engineer · Oracle Agentic AI · Infosys DBMS · Tata/Forage GenAI Analytics · LPU Full Stack · Data Analyst 101.',
    github: 'github.com/Devapriyan07',
    contact: 'dpriyan66@gmail.com · linkedin.com/in/devapriyan-c-m/',
    resume: 'Opening the smart resume viewer...',
    game: 'Scroll to Innovation Lab → Tech Catcher, or type game and I will take you there.',
    recruiter: 'Recruiter mode toggled.'
  };
  function openTerminal(){ terminalModal?.classList.add('open'); terminalModal?.setAttribute('aria-hidden','false'); setTimeout(()=>terminalInput?.focus(),50); }
  function closeTerminalFn(){ terminalModal?.classList.remove('open'); terminalModal?.setAttribute('aria-hidden','true'); }
  terminalToggle?.addEventListener('click', openTerminal); closeTerminal?.addEventListener('click', closeTerminalFn);
  terminalModal?.addEventListener('click', e => { if(e.target===terminalModal) closeTerminalFn(); });
  function terminalPrint(command, response) {
    if (!terminalOutput) return;
    const cmd = document.createElement('div'); cmd.className='cmd'; cmd.textContent=`› ${command}`;
    const out = document.createElement('div'); out.textContent=response;
    terminalOutput.append(cmd,out); terminalOutput.scrollTop=terminalOutput.scrollHeight;
  }
  terminalForm?.addEventListener('submit', e => {
    e.preventDefault(); const command = terminalInput.value.trim().toLowerCase(); terminalInput.value=''; if(!command)return;
    if(command==='clear'){terminalOutput.innerHTML='';return;}
    if(command==='recruiter'){setRecruiterMode(!body.classList.contains('recruiter-mode')); terminalPrint(command,'Recruiter mode updated.');return;}
    if(command==='resume'){terminalPrint(command,terminalCommands.resume);toggleResume(true);return;}
    if(command==='game'){terminalPrint(command,terminalCommands.game);document.getElementById('game-board')?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(command==='projects'||command==='skills'||command==='certs'||command==='about'){document.getElementById(command==='certs'?'certifications':command)?.scrollIntoView({behavior:'smooth',block:'center'});}
    terminalPrint(command, terminalCommands[command] || 'Unknown command. Type help.');
  });

  // 6. Tech Catcher — falling-box catcher game
  const gameBoard = document.getElementById('game-board');
  const gameStart = document.getElementById('game-start');
  const gameScore = document.getElementById('game-score');
  const gameLives = document.getElementById('game-lives');
  const gameTime = document.getElementById('game-time');
  const gameCatcher = document.getElementById('game-catcher');
  let gameTimer = null, gameSpawn = null, gameFrame = null;
  let gameScoreValue = 0, gameLivesValue = 3, gameRunning = false, gameEndTime = 0;
  let catcherX = 50, catcherTargetX = 50, catcherPixelX = null, lastSpawn = 0, spawnDelay = 650, difficulty = 1;
  let activeDrops = new Set();
  const gameTech = ['JS','PY','AI','SQL','DB','CSS','REACT','JAVA','API','GIT','PANDAS','NUMPY'];

  function clearGameTokens(){
    activeDrops.forEach(drop => drop.remove());
    activeDrops.clear();
    gameBoard?.querySelectorAll('.game-drop, .game-result').forEach(el => el.remove());
  }

  function updateCatcher(immediate = false){
    if(!gameCatcher || !gameBoard) return;
    const rect = gameBoard.getBoundingClientRect();
    const catcherWidth = gameCatcher.offsetWidth || 110;
    const targetPx = (catcherX / 100) * rect.width;
    if(catcherPixelX === null || immediate) catcherPixelX = targetPx;
    else catcherPixelX += (targetPx - catcherPixelX) * 0.28;
    gameCatcher.style.left = '0';
    gameCatcher.style.transform = `translate3d(${catcherPixelX - catcherWidth / 2}px, 0, 0)`;
  }

  function setCatcherPosition(clientX){
    if(!gameBoard) return;
    const rect = gameBoard.getBoundingClientRect();
    catcherTargetX = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    catcherX = catcherTargetX;
  }

  function spawnDrop(){
    if(!gameRunning || !gameBoard) return;
    const drop = document.createElement('div');
    drop.className = 'game-drop';
    const roll = Math.random();
    const type = roll < 0.16 ? 'bug' : roll < 0.23 ? 'bonus' : 'tech';
    drop.dataset.type = type;
    drop.dataset.x = String(Math.random() * 86 + 7);
    drop.dataset.y = '-42';
    drop.dataset.speed = String((95 + Math.random() * 65) * difficulty);
    drop.textContent = type === 'bug' ? '🐛' : type === 'bonus' ? '★' : gameTech[Math.floor(Math.random() * gameTech.length)];
    drop.style.left = `${drop.dataset.x}%`;
    drop.style.top = '-42px';
    drop.setAttribute('aria-label', type === 'bug' ? 'Bug: avoid' : type === 'bonus' ? 'Bonus: catch' : `Catch ${drop.textContent}`);
    gameBoard.appendChild(drop);
    activeDrops.add(drop);
  }

  function removeDrop(drop){
    activeDrops.delete(drop);
    drop.remove();
  }

  function endGame(){
    if(!gameRunning)return;
    gameRunning = false;
    clearInterval(gameTimer); clearInterval(gameSpawn); cancelAnimationFrame(gameFrame);
    gameTimer = gameSpawn = gameFrame = null;
    clearGameTokens();
    const result = document.createElement('div');
    result.className = 'game-result';
    result.setAttribute('role','status');
    const unlocked = gameScoreValue >= 15;
    result.innerHTML = `<span>GAME OVER</span><b>${gameScoreValue}</b><p>${unlocked ? '🔓 Hidden message unlocked: Keep building, keep learning.' : 'Catch 15 points to unlock the hidden message.'}</p><button type="button" class="lab-action game-restart">PLAY AGAIN</button>`;
    gameBoard.appendChild(result);
    gameStart.disabled = false;
    gameStart.textContent = 'PLAY AGAIN';
    result.querySelector('.game-restart')?.addEventListener('click', startGame);
  }

  function gameLoop(now){
    if(!gameRunning) return;
    const rect = gameBoard.getBoundingClientRect();
    const catcherRect = gameCatcher.getBoundingClientRect();
    const boardTop = rect.top;
    const catcherLeft = catcherRect.left - rect.left;
    const catcherRight = catcherLeft + catcherRect.width;
    const dt = Math.min(32, now - (gameLoop.last || now));
    gameLoop.last = now;
    updateCatcher();

    activeDrops.forEach(drop => {
      let y = Number(drop.dataset.y) + (Number(drop.dataset.speed) * dt / 1000);
      drop.dataset.y = String(y);
      drop.style.top = `${y}px`;
      const dropLeft = (parseFloat(drop.dataset.x) / 100) * rect.width - drop.offsetWidth / 2;
      const dropBottom = y + drop.offsetHeight;
      const catcherTop = gameBoard.clientHeight - 42;
      if(dropBottom >= catcherTop && y <= catcherTop + 30 && dropLeft + drop.offsetWidth >= catcherLeft && dropLeft <= catcherRight){
        const type = drop.dataset.type;
        if(type === 'bug'){
          gameLivesValue -= 1;
          gameLives.textContent = String(gameLivesValue);
          drop.classList.add('bad-catch');
          if(gameLivesValue <= 0){ removeDrop(drop); endGame(); return; }
        }else{
          gameScoreValue += type === 'bonus' ? 5 : 1;
          gameScore.textContent = String(gameScoreValue);
          drop.classList.add('good-catch');
        }
        setTimeout(() => removeDrop(drop), 90);
      }else if(y > gameBoard.clientHeight + 20){
        removeDrop(drop);
      }
    });

    if(now - lastSpawn > spawnDelay){
      spawnDrop(); lastSpawn = now;
      difficulty = Math.min(2.1, difficulty + 0.015);
      spawnDelay = Math.max(300, 650 - (difficulty - 1) * 190);
    }
    if(Date.now() >= gameEndTime){ endGame(); return; }
    gameFrame = requestAnimationFrame(gameLoop);
  }

  function startGame(){
    if(!gameBoard || gameRunning)return;
    gameRunning = true; gameScoreValue = 0; gameLivesValue = 3; catcherX = 50; catcherTargetX = 50; catcherPixelX = null; difficulty = 1; spawnDelay = 650; lastSpawn = 0;
    gameScore.textContent = '0'; gameLives.textContent = '3'; gameTime.textContent = '30';
    clearGameTokens(); updateCatcher(true); gameBoard.focus();
    if(gameStart){gameStart.disabled=true;gameStart.textContent='GAME RUNNING…';}
    gameEndTime = Date.now() + 30000;
    gameTimer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((gameEndTime - Date.now()) / 1000));
      gameTime.textContent = String(remaining);
      if(remaining <= 0) endGame();
    }, 250);
    gameLoop.last = performance.now();
    gameFrame = requestAnimationFrame(gameLoop);
  }

  gameStart?.addEventListener('click', startGame);
  gameBoard?.addEventListener('pointermove', e => { if(gameRunning) setCatcherPosition(e.clientX); });
  gameBoard?.addEventListener('pointerdown', e => { if(gameRunning) setCatcherPosition(e.clientX); });
  document.addEventListener('keydown', e => {
    if(!gameRunning || !gameBoard) return;
    if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(e.key)) e.preventDefault();
    if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') catcherTargetX = Math.max(8, catcherTargetX - 5);
    if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') catcherTargetX = Math.min(92, catcherTargetX + 5);
    catcherX = catcherTargetX;
  });

  // 15. Easter eggs
  const toast = document.createElement('div'); toast.className='easter-toast'; document.body.appendChild(toast);
  function showToast(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
  let secret='';
  document.addEventListener('keydown', e => {
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==='d'){setRecruiterMode(!body.classList.contains('recruiter-mode'));showToast('Recruiter mode toggled ✦');return;}
    if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    if(e.key.length===1){secret=(secret+e.key.toLowerCase()).slice(-3);if(secret==='dev'){showToast('Easter egg found: DEV mode activated ✦');document.documentElement.classList.add('dev-easter');setTimeout(()=>document.documentElement.classList.remove('dev-easter'),3000);}}
  });

});
