/* ==========================================================================
   Harsh Portfolio - Main Interactive Script (Enhanced v8)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Preloader with Butterfly Logo & Progress Animation
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 700);
    });
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 2800);
  }

  // ==========================================================================
  // REALISTIC ANIMATED GALAXY BACKGROUND CANVAS ENGINE
  // ==========================================================================
  const galaxyCanvas = document.getElementById('galaxy-bg-canvas');
  if (galaxyCanvas) {
    const gCtx = galaxyCanvas.getContext('2d');
    let gWidth = (galaxyCanvas.width = window.innerWidth);
    let gHeight = (galaxyCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      gWidth = galaxyCanvas.width = window.innerWidth;
      gHeight = galaxyCanvas.height = window.innerHeight;
    });

    let gMouseX = gWidth / 2;
    let gMouseY = gHeight / 2;

    window.addEventListener('mousemove', (e) => {
      gMouseX = e.clientX;
      gMouseY = e.clientY;
    });

    class Star {
      constructor() {
        this.x = Math.random() * gWidth;
        this.y = Math.random() * gHeight;
        this.size = Math.random() * 2 + 0.6;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = gWidth;
        if (this.x > gWidth) this.x = 0;
        if (this.y < 0) this.y = gHeight;
        if (this.y > gHeight) this.y = 0;

        this.alpha = this.baseAlpha + Math.sin(Date.now() * this.twinkleSpeed) * 0.25;
      }

      draw(context, offsetX, offsetY) {
        context.save();
        context.globalAlpha = Math.max(0.1, Math.min(1, this.alpha));
        context.fillStyle = '#ffffff';
        context.shadowColor = 'rgba(255, 255, 255, 0.8)';
        context.shadowBlur = this.size * 3;
        context.beginPath();
        context.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const stars = Array.from({ length: 130 }, () => new Star());

    function renderGalaxy() {
      gCtx.clearRect(0, 0, gWidth, gHeight);

      const offsetX = (gMouseX - gWidth / 2) * 0.02;
      const offsetY = (gMouseY - gHeight / 2) * 0.02;

      const nebulaGrad = gCtx.createRadialGradient(
        gWidth * 0.3 + offsetX, gHeight * 0.4 + offsetY, 50,
        gWidth * 0.3 + offsetX, gHeight * 0.4 + offsetY, gWidth * 0.6
      );
      nebulaGrad.addColorStop(0, 'rgba(99, 102, 241, 0.07)');
      nebulaGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      gCtx.fillStyle = nebulaGrad;
      gCtx.fillRect(0, 0, gWidth, gHeight);

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            gCtx.save();
            gCtx.globalAlpha = (1 - dist / 100) * 0.18;
            gCtx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            gCtx.lineWidth = 0.6;
            gCtx.beginPath();
            gCtx.moveTo(stars[i].x + offsetX, stars[i].y + offsetY);
            gCtx.lineTo(stars[j].x + offsetX, stars[j].y + offsetY);
            gCtx.stroke();
            gCtx.restore();
          }
        }
      }

      stars.forEach(star => {
        star.update();
        star.draw(gCtx, offsetX, offsetY);
      });

      requestAnimationFrame(renderGalaxy);
    }

    requestAnimationFrame(renderGalaxy);
  }

  // ==========================================================================
  // TIME-BASED THEME ENGINE (MORNING / SUNSET / NIGHT)
  // ==========================================================================
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    document.body.classList.add('theme-morning');
  } else if (currentHour >= 17 && currentHour < 20) {
    document.body.classList.add('theme-sunset');
  } else {
    document.body.classList.add('theme-night');
  }

  // ==========================================================================
  // SYNTHESIZED WEB AUDIO API SOUND EFFECTS & MUTE TOGGLE
  // ==========================================================================
  let isMuted = localStorage.getItem('harsh_portfolio_muted') === 'true';
  const soundToggleBtn = document.getElementById('sound-toggle');

  function updateSoundIcon() {
    if (!soundToggleBtn) return;
    const icon = soundToggleBtn.querySelector('i');
    if (icon) {
      icon.className = isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }
  }
  updateSoundIcon();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('harsh_portfolio_muted', isMuted);
      updateSoundIcon();
      if (!isMuted) playSoundChime(587.33);
    });
  }

  let audioCtx = null;
  function playSoundChime(freq = 523.25, type = 'sine', duration = 0.25) {
    if (isMuted) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {
      // Fallback
    }
  }

  // ==========================================================================
  // TOP SCROLL PROGRESS INDICATOR & FLYING SCROLL BUTTERFLY
  // ==========================================================================
  const progressBar = document.getElementById('scroll-progress-bar');
  const butterflyIndicator = document.getElementById('scroll-butterfly-indicator');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }
    if (butterflyIndicator) {
      butterflyIndicator.style.left = `${Math.min(98, Math.max(2, scrollPercent))}%`;
    }
  });

  // ==========================================================================
  // MAGNETIC CTA BUTTONS
  // ==========================================================================
  const magneticBtns = document.querySelectorAll('.btn, .social-icon, .contact-card-icon, .sound-toggle-btn');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;

        const distX = e.clientX - btnX;
        const distY = e.clientY - btnY;

        btn.style.transform = `translate(${distX * 0.28}px, ${distY * 0.28}px) scale(1.04)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });
  }

  // ==========================================================================
  // IDLE BUTTERFLY LANDING & TAKEOFF LOOP
  // ==========================================================================
  const landingButterfly = document.getElementById('landing-butterfly');

  function triggerIdleButterflyLanding() {
    if (!landingButterfly || !isFinePointer) return;

    const targets = [
      document.querySelector('.hero-card'),
      document.querySelector('.logo')
    ].filter(Boolean);

    if (targets.length === 0) return;
    const target = targets[Math.floor(Math.random() * targets.length)];
    const rect = target.getBoundingClientRect();

    const landX = rect.left + rect.width * (Math.random() * 0.6 + 0.2);
    const landY = rect.top + rect.height * (Math.random() * 0.5 + 0.2);

    landingButterfly.style.left = `${landX}px`;
    landingButterfly.style.top = `${landY}px`;
    landingButterfly.classList.add('resting');

    playSoundChime(659.25, 'sine', 0.2);

    setTimeout(() => {
      landingButterfly.style.transform = `translate(${(Math.random() - 0.5) * 300}px, -300px) scale(0.2) rotate(45deg)`;
      landingButterfly.style.opacity = '0';

      setTimeout(() => {
        landingButterfly.classList.remove('resting');
        landingButterfly.style.transform = 'none';
      }, 1000);
    }, 4500);
  }

  setInterval(triggerIdleButterflyLanding, 24000);
  setTimeout(triggerIdleButterflyLanding, 6000);

  // ==========================================================================
  // EASTER EGG BUTTERFLY SWARM & CLICK COUNTER
  // ==========================================================================
  let butterflyClickCount = 0;
  const easterModal = document.getElementById('easter-egg-modal');
  const closeEasterBtn = document.getElementById('close-easter-modal');

  function triggerButterflySwarm() {
    playSoundChime(880, 'triangle', 0.5);
    for (let i = 0; i < 32; i++) {
      setTimeout(() => {
        if (window.spawnButterfliesFromElement) {
          window.spawnButterfliesFromElement(document.body, 1);
        }
      }, i * 60);
    }
    if (easterModal) {
      easterModal.classList.add('open');
    }
  }

  if (closeEasterBtn && easterModal) {
    closeEasterBtn.addEventListener('click', () => {
      easterModal.classList.remove('open');
    });
  }

  // ==========================================================================
  // ANIMATED BUTTERFLY CURSOR & "HV" INITIALS TRAIL ENGINE
  // ==========================================================================
  const butterflyCursor = document.getElementById('butterfly-cursor');
  const particleCanvas = document.getElementById('cursor-particle-canvas');
  const elementButterfliesContainer = document.getElementById('element-butterflies-container');

  if (isFinePointer && butterflyCursor && particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let width = (particleCanvas.width = window.innerWidth);
    let height = (particleCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = particleCanvas.width = window.innerWidth;
      height = particleCanvas.height = window.innerHeight;
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    let currentX = width / 2;
    let currentY = height / 2;
    let angle = 0;
    let currentAngle = 0;

    const particles = [];
    const maxParticles = 90;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Sparkle Particle featuring "HV" Initials Trail
    class SparkleParticle {
      constructor(x, y, isBurst = false, isInitials = false) {
        this.x = x;
        this.y = y;
        this.isBurst = isBurst;
        this.isInitials = isInitials;
        
        if (isBurst) {
          const speed = Math.random() * 4.5 + 1.8;
          const rad = Math.random() * Math.PI * 2;
          this.vx = Math.cos(rad) * speed;
          this.vy = Math.sin(rad) * speed;
          this.size = Math.random() * 3.5 + 2;
          this.alpha = 1;
          this.decay = Math.random() * 0.03 + 0.02;
        } else if (isInitials) {
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = -Math.random() * 0.8 - 0.3; // float gently upward
          this.size = 13;
          this.alpha = 0.95;
          this.decay = 0.022;
        } else {
          this.vx = (Math.random() - 0.5) * 1.2;
          this.vy = Math.random() * 1.5 + 0.5;
          this.size = Math.random() * 2.5 + 1;
          this.alpha = Math.random() * 0.7 + 0.3;
          this.decay = Math.random() * 0.025 + 0.015;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(context) {
        context.save();
        context.globalAlpha = Math.max(0, this.alpha);

        if (this.isInitials) {
          context.font = '700 13px Outfit, sans-serif';
          context.fillStyle = '#ffffff';
          context.shadowColor = 'rgba(255, 255, 255, 0.9)';
          context.shadowBlur = 9;
          context.fillText('HV', this.x, this.y);
        } else {
          context.fillStyle = '#ffffff';
          context.shadowColor = 'rgba(255, 255, 255, 0.9)';
          context.shadowBlur = 8;
          context.beginPath();
          context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
    }

    window.addEventListener('mousedown', (e) => {
      playSoundChime(440 + Math.random() * 200, 'sine', 0.2);

      for (let i = 0; i < 16; i++) {
        particles.push(new SparkleParticle(e.clientX, e.clientY, true));
      }
    });

    const releasedButterflies = [];
    const maxReleasedButterflies = 32;

    function createReleasedButterfly(originX, originY) {
      if (!elementButterfliesContainer) return;

      const size = Math.floor(Math.random() * 14 + 20);
      const el = document.createElement('div');
      el.className = 'flying-element-butterfly';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      el.innerHTML = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="eWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#cbd5e1" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <g class="element-wing-left">
          <path d="M 50,45 C 30,10 5,20 10,48 C 15,62 38,58 50,48 Z" fill="url(#eWingGrad)" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 48,50 C 30,55 18,72 28,85 C 38,92 48,70 48,52 Z" fill="url(#eWingGrad)" stroke="#ffffff" stroke-width="1.5" />
        </g>
        <g class="element-wing-right">
          <path d="M 50,45 C 70,10 95,20 90,48 C 85,62 62,58 50,48 Z" fill="url(#eWingGrad)" stroke="#ffffff" stroke-width="1.5" />
          <path d="M 52,50 C 70,55 82,72 72,85 C 62,92 52,70 52,52 Z" fill="url(#eWingGrad)" stroke="#ffffff" stroke-width="1.5" />
        </g>
        <ellipse cx="50" cy="50" rx="3" ry="14" fill="#ffffff" />
      </svg>`;

      elementButterfliesContainer.appendChild(el);

      const angleRad = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.2 + 1.6;

      const obj = {
        dom: el,
        x: originX,
        y: originY,
        vx: Math.cos(angleRad) * speed,
        vy: Math.sin(angleRad) * speed - 0.8,
        wobbleFreq: Math.random() * 0.08 + 0.04,
        wobbleAmp: Math.random() * 3 + 1.5,
        life: Math.floor(Math.random() * 90 + 110),
        maxLife: 200,
        time: 0
      };

      obj.maxLife = obj.life;
      releasedButterflies.push(obj);

      if (releasedButterflies.length > maxReleasedButterflies) {
        const oldest = releasedButterflies.shift();
        if (oldest && oldest.dom && oldest.dom.parentNode) {
          oldest.dom.parentNode.removeChild(oldest.dom);
        }
      }
    }

    window.spawnButterfliesFromElement = function(element, count = 5) {
      const rect = element.getBoundingClientRect ? element.getBoundingClientRect() : { left: width/2, top: height/2, width: 0, height: 0 };
      for (let i = 0; i < count; i++) {
        const originX = rect.left + Math.random() * (rect.width || 100);
        const originY = rect.top + Math.random() * (rect.height || 100);
        createReleasedButterfly(originX, originY);
      }
    };

    const interactiveSelectors = 'a, button, input, select, textarea, .portfolio-item, .service-card, .contact-card, .filter-btn, .portfolio-view-btn, .social-icon, .spec-item, .skill-card';
    const interactives = document.querySelectorAll(interactiveSelectors);

    interactives.forEach(el => {
      let hoverThrottled = false;

      el.addEventListener('mouseenter', () => {
        butterflyCursor.classList.add('hovering');
        if (!hoverThrottled) {
          hoverThrottled = true;
          window.spawnButterfliesFromElement(el, Math.floor(Math.random() * 2 + 4));
          setTimeout(() => { hoverThrottled = false; }, 800);
        }
      });

      el.addEventListener('mouseleave', () => {
        butterflyCursor.classList.remove('hovering');
      });

      el.addEventListener('click', () => {
        window.spawnButterfliesFromElement(el, Math.floor(Math.random() * 2 + 5));

        butterflyClickCount++;
        if (butterflyClickCount === 5) {
          triggerButterflySwarm();
        }
      });
    });

    let hvParticleCounter = 0;

    function renderLoop(time) {
      ctx.clearRect(0, 0, width, height);

      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      currentX += dx * 0.18;
      currentY += dy * 0.18;

      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 1.5) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        let angleDiff = angle - currentAngle;
        while (angleDiff > 180) angleDiff -= 360;
        while (angleDiff < -180) angleDiff += 360;
        currentAngle += angleDiff * 0.15;
      }

      butterflyCursor.style.left = `${currentX}px`;
      butterflyCursor.style.top = `${currentY}px`;
      butterflyCursor.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg) scale(${butterflyCursor.classList.contains('hovering') ? 1.38 : 1})`;

      // Emit Glowing "HV" Initials Trail on Mouse Movement
      hvParticleCounter++;
      if (speed > 2.2 && hvParticleCounter % 5 === 0) {
        particles.push(new SparkleParticle(currentX, currentY, false, true));
      } else if (speed > 1.2 && Math.random() < 0.4) {
        particles.push(new SparkleParticle(currentX + (Math.random() - 0.5) * 8, currentY + (Math.random() - 0.5) * 8));
      }

      for (let i = releasedButterflies.length - 1; i >= 0; i--) {
        const b = releasedButterflies[i];
        b.time += 1;
        b.life -= 1;

        b.x += b.vx + Math.sin(b.time * b.wobbleFreq) * b.wobbleAmp;
        b.y += b.vy + Math.cos(b.time * b.wobbleFreq * 0.7) * (b.wobbleAmp * 0.5);

        const heading = Math.atan2(b.vy, b.vx) * (180 / Math.PI) + 90;
        const opacity = Math.max(0, b.life / b.maxLife);

        b.dom.style.left = `${b.x}px`;
        b.dom.style.top = `${b.y}px`;
        b.dom.style.transform = `translate(-50%, -50%) rotate(${heading}deg) scale(${opacity * 0.5 + 0.5})`;
        b.dom.style.opacity = opacity;

        if (Math.random() < 0.35) {
          particles.push(new SparkleParticle(b.x, b.y));
        }

        if (b.life <= 0) {
          if (b.dom && b.dom.parentNode) {
            b.dom.parentNode.removeChild(b.dom);
          }
          releasedButterflies.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles);
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  // Mouse Spotlight Cursor Glow & Hero Parallax
  const cursorGlow = document.querySelector('.cursor-glow');
  const heroText = document.querySelector('.hero-text');
  const heroCard = document.querySelector('.hero-card');

  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    }

    if (heroText && heroCard && isFinePointer) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.015;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.015;
      heroText.style.transform = `translate(${moveX}px, ${moveY}px)`;
      heroCard.style.transform = `translate(${-moveX * 1.5}px, ${-moveY * 1.5}px)`;
    }
  });

  // Header Scroll Effect & Mobile Nav
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = '';
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  });

  // Portfolio Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Lightbox Modal
  const modal = document.getElementById('portfolioModal');
  const modalClose = document.querySelector('.modal-close');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCat = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDescription');
  const viewBtns = document.querySelectorAll('.portfolio-view-btn');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-item');
      const imgSrc = card.querySelector('img').getAttribute('src');
      const title = card.querySelector('.portfolio-item-title').textContent;
      const cat = card.querySelector('.portfolio-cat').textContent;
      const desc = card.getAttribute('data-desc') || 'High quality creative production designed with precision, aesthetic grading, and modern visual impact.';

      modalImg.setAttribute('src', imgSrc);
      modalTitle.textContent = title;
      modalCat.textContent = cat;
      modalDesc.textContent = desc;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  }

  // Service Card Quick Select Contact
  const serviceBtns = document.querySelectorAll('.service-btn');
  const projectTypeSelect = document.getElementById('projectType');

  serviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (projectTypeSelect && serviceName) {
        for (let option of projectTypeSelect.options) {
          if (option.value.toLowerCase().includes(serviceName.toLowerCase())) {
            option.selected = true;
            break;
          }
        }
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Contact Form Mailto Handler
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toastNotice');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const company = document.getElementById('companyName').value.trim() || 'N/A';
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const projectType = document.getElementById('projectType').value;
      const budget = document.getElementById('budget').value;
      const details = document.getElementById('projectDetails').value.trim();

      if (!fullName || !email || !phone || !projectType || !budget || !details) {
        showToast('Please fill in all required fields marked with *');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
      }

      const targetEmail = 'harshvariyani24@gmail.com';
      const subject = `New Project Inquiry - ${fullName}`;
      const body = `Dear Harsh,

I visited your portfolio and would like to work with you.

Client Details:

Name: ${fullName}
Company: ${company}
Email: ${email}
Phone: ${phone}
Project Type: ${projectType}
Budget: ${budget}

Project Details:
${details}

Looking forward to your response.

Regards,
${fullName}`;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}?su=${encodedSubject}&body=${encodedBody}`;

      showToast('Opening Gmail with your inquiry details...');

      setTimeout(() => {
        window.location.href = mailtoUrl;
        setTimeout(() => {
          window.open(gmailWebUrl, '_blank');
        }, 800);
      }, 500);
    });
  }

  function showToast(message) {
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .cinematic-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
