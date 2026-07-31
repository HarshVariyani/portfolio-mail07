/* ==========================================================================
   Harsh Portfolio - Main Interactive Script (Enhanced v2)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 600);
    });
    // Fallback hide
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 2500);
  }

  // Mouse Spotlight Cursor Glow Effect
  const cursorGlow = document.querySelector('.cursor-glow');
  if (cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // Card 3D Tilt Effect on Mousemove
  const tiltCards = document.querySelectorAll('.hero-card, .service-card, .portfolio-item, .contact-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
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

    // Scroll active link highlight
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

      // Form Validation
      if (!fullName || !email || !phone || !projectType || !budget || !details) {
        showToast('Please fill in all required fields marked with *');
        return;
      }

      // Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address');
        return;
      }

      // Target Recipient Email
      const targetEmail = 'harshvariyani24@gmail.com';

      // Build Mail Subject & Body exactly as requested
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

      // Encode URI Component
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);

      // Create Mailto URL
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

      // Create Direct Gmail Web URL Fallback
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;

      showToast('Opening Gmail with your inquiry details...');

      // Attempt Mailto
      setTimeout(() => {
        window.location.href = mailtoUrl;
        // Fallback open Gmail web compose window in new tab after slight delay if mailto isn't default
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
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
