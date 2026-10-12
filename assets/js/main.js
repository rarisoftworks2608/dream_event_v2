/* =============================================
   DREAM EVENT — MAIN JAVASCRIPT
   ============================================= */

'use strict';

// ===== SCROLL PROGRESS =====
const initScrollProgress = () => {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
};

// ===== NAVBAR =====
const initNavbar = () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const updateNavbar = () => {
    if (window.pageYOffset > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('hero-nav');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('hero-nav');
    }
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
};

// ===== BACK TO TOP =====
const initBackToTop = () => {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// ===== INTERSECTION OBSERVER REVEALS =====
const initRevealAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  targets.forEach(el => observer.observe(el));
};

// ===== ANIMATED COUNTERS =====
const initCounters = () => {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

// ===== TESTIMONIAL SLIDER =====
const initTestimonialSlider = () => {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.t-dot');
  const prevBtn = document.querySelector('.t-nav-btn.prev');
  const nextBtn = document.querySelector('.t-nav-btn.next');

  let current = 0;
  let autoInterval;
  const isMobile = () => window.innerWidth <= 768;

  const slideTo = (index) => {
    const total = cards.length;
    current = ((index % total) + total) % total;
    const cardWidth = cards[0]?.offsetWidth || 0;
    const gap = 28;
    
    if (isMobile()) {
      track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    } else {
      track.style.transform = `translateX(-${current * (cardWidth / 2 + gap / 2)}px)`;
    }

    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  prevBtn?.addEventListener('click', () => { slideTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { slideTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { slideTo(i); resetAuto(); }));

  const startAuto = () => {
    autoInterval = setInterval(() => slideTo(current + 1), 5000);
  };

  const resetAuto = () => {
    clearInterval(autoInterval);
    startAuto();
  };

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      slideTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  startAuto();
  slideTo(0);
};

// ===== GALLERY FILTER =====
const initGalleryFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      items.forEach(item => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if (show) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = 'block';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (item.dataset.category !== filter && filter !== 'all') {
              item.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });
};

// ===== LIGHTBOX =====
const initLightbox = () => {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
  const nextBtn = lightbox.querySelector('.lightbox-nav.next');
  const items = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    lightboxImg.src = items[currentIndex]?.src || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    currentIndex = ((currentIndex + direction) + items.length) % items.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = items[currentIndex]?.src || '';
      lightboxImg.style.opacity = '1';
    }, 200);
  };

  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', () => navigateLightbox(-1));
  nextBtn?.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
};

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });
};

// ===== PARALLAX EFFECTS =====
const initParallax = () => {
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (!parallaxItems.length) return;

  const handleParallax = () => {
    const scrollY = window.pageYOffset;
    parallaxItems.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener('scroll', handleParallax, { passive: true });
};

// ===== MAGNETIC BUTTONS =====
const initMagneticButtons = () => {
  const buttons = document.querySelectorAll('.btn-primary, .btn-gold, .nav-cta');
  
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

// ===== NEWSLETTER FORM =====
const initNewsletter = () => {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    const email = input?.value;
    
    if (!email || !email.includes('@')) {
      input?.setAttribute('style', 'border-color: var(--burgundy)');
      return;
    }

    btn.textContent = '✓';
    btn.style.background = 'var(--forest)';
    input.value = '';
    input.placeholder = 'Thank you! You\'re subscribed.';
    
    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
      input.placeholder = 'Your email address';
    }, 4000);
  });
};

// ===== CONTACT FORM VALIDATION =====
const initContactForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'var(--forest)';
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 4000);
      }, 1500);
    }
  });
};

// ===== VIDEO LAZY LOAD =====
const initVideoLoading = () => {
  const video = document.querySelector('.hero-video-wrap video');
  if (!video || video.closest('.hero-plain')) return; // home hero has its own controls
  
  // Ensure video plays
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay was prevented - add play button
      const playBtn = document.createElement('button');
      playBtn.className = 'hero-play-btn';
      playBtn.innerHTML = '▶';
      playBtn.style.cssText = `
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        z-index:3;background:rgba(255,255,255,0.15);border:2px solid rgba(255,255,255,0.6);
        color:white;width:80px;height:80px;border-radius:50%;font-size:1.5rem;cursor:pointer;
        backdrop-filter:blur(4px);transition:all 0.3s ease;
      `;
      playBtn.addEventListener('click', () => {
        video.play();
        playBtn.remove();
      });
      video.parentElement.appendChild(playBtn);
    });
  }
};

// ===== LAZY LOAD IMAGES =====
const initLazyLoad = () => {
  if (!('IntersectionObserver' in window)) return;

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
};

// ===== STAGGER CHILDREN REVEAL =====
const initStaggerReveal = () => {
  const staggerContainers = document.querySelectorAll('[data-stagger]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.classList.add('revealed');
          }, i * parseInt(entry.target.dataset.stagger || '100'));
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => observer.observe(el));
};

// ===== TEXT REVEAL EFFECT =====
const initTextReveal = () => {
  const texts = document.querySelectorAll('[data-text-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('text-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  texts.forEach(el => {
    el.style.overflow = 'hidden';
    el.style.position = 'relative';
    observer.observe(el);
  });
};

// ===== ACTIVE NAV LINK =====
const initActiveNavLinks = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
};

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  // Core interactions
  initScrollProgress();
  initNavbar();
  initBackToTop();
  
  // Animation systems
  initRevealAnimations();
  initCounters();
  initStaggerReveal();
  initTextReveal();
  initParallax();
  
  // UI Components
  initTestimonialSlider();
  initGalleryFilter();
  initLightbox();
  initSmoothScroll();
  initMagneticButtons();
  initActiveNavLinks();
  
  // Media
  initVideoLoading();
  initLazyLoad();
  
  // Forms
  initNewsletter();
  initContactForm();

  // Set initial navbar state
  const navbar = document.querySelector('.navbar');
  if (navbar && window.pageYOffset === 0) {
    navbar.classList.add('hero-nav');
  }
});

// Handle page visibility for video
document.addEventListener('visibilitychange', () => {
  const video = document.querySelector('.hero-video-wrap video');
  if (!video) return;
  if (document.hidden) {
    if (!video.paused) { video.dataset.autoPaused = '1'; video.pause(); }
  } else if (video.dataset.autoPaused) {
    delete video.dataset.autoPaused;
    video.play().catch(() => {});
  }
});

// ===== HOME HERO VIDEO CONTROLS =====
(() => {
  const hero = document.querySelector('.hero-plain');
  if (!hero) return;
  const video = hero.querySelector('video');
  const playBtn = hero.querySelector('.hv-play');
  const muteBtn = hero.querySelector('.hv-mute');
  const seek = hero.querySelector('.hv-seek');
  const cur = hero.querySelector('.hv-current');
  const dur = hero.querySelector('.hv-duration');
  let dragging = false;

  const fmt = (t) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + String(s).padStart(2, '0');
  };
  const paint = () => {
    const pct = video.duration ? (video.currentTime / video.duration) * 100 : 0;
    if (!dragging) seek.value = Math.round(pct * 10);
    seek.style.setProperty('--progress', (seek.value / 10) + '%');
    cur.textContent = fmt(video.currentTime);
  };
  const syncPlay = () => {
    hero.classList.toggle('is-paused', video.paused);
    playBtn.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
  };
  const syncMute = () => {
    hero.classList.toggle('is-muted', video.muted);
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  };

  playBtn.addEventListener('click', () => {
    delete video.dataset.autoPaused;
    video.paused ? video.play().catch(() => {}) : video.pause();
  });
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    if (!video.muted && video.volume === 0) video.volume = 1;
    if (!video.muted && video.paused) video.play().catch(() => {});
  });

  const seekTo = () => {
    if (video.duration) video.currentTime = (seek.value / 1000) * video.duration;
    paint();
  };
  seek.addEventListener('input', () => { dragging = true; seekTo(); });
  seek.addEventListener('change', () => { dragging = false; seekTo(); });
  seek.addEventListener('pointerup', () => { dragging = false; });

  video.addEventListener('loadedmetadata', () => { dur.textContent = fmt(video.duration); paint(); });
  video.addEventListener('timeupdate', paint);
  video.addEventListener('play', syncPlay);
  video.addEventListener('pause', syncPlay);
  video.addEventListener('volumechange', syncMute);
  if (video.readyState >= 1) dur.textContent = fmt(video.duration);
  syncPlay(); syncMute(); paint();
})();
