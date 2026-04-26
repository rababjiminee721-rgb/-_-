'use strict';

const Lang = {
  current: localStorage.getItem('worshati_lang') || 'ar',

  set(lang) {
    this.current = lang;
    localStorage.setItem('worshati_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ltr-mode', lang !== 'ar');
    this.updateUI();
  },

  get() {
    return this.current;
  },

  t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[this.current] || obj['ar'] || '';
  },

  toggle() {
    this.set(this.current === 'ar' ? 'en' : 'ar');
  },

  updateUI() {
    const langBtns = document.querySelectorAll('.nav-lang-btn');
    langBtns.forEach(btn => {
      btn.textContent = this.current === 'ar' ? 'EN' : 'عربي';
    });
    if (typeof renderCurrentPage === 'function') {
      renderCurrentPage();
    }
  },

  init() {
    document.documentElement.lang = this.current;
    document.documentElement.dir = this.current === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('ltr-mode', this.current !== 'ar');
    this.updateUI();
  }
};

const Navigation = {
  navbar: null,
  hamburger: null,
  mobileMenu: null,
  lastScroll: 0,

  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.nav-hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');

    if (!this.navbar) return;

    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    const closeBtn = document.querySelector('.mobile-menu-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeMobile());
    }

    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });

    this.setActiveLink();

    document.querySelectorAll('.nav-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => Lang.toggle());
    });

    document.querySelectorAll('.nav-search-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = 'search.html';
      });
    });
  },

  handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
    this.lastScroll = scrollY;
  },

  toggleMobile() {
    const isActive = this.hamburger.classList.toggle('active');
    if (this.mobileMenu) {
      this.mobileMenu.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    }
  },

  closeMobile() {
    if (this.hamburger) this.hamburger.classList.remove('active');
    if (this.mobileMenu) this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  },

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

const HeroParticles = {
  init() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < count; i++) {
      this.createParticle(container);
    }
  },

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 5}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(particle);
  }
};

const ScrollAnimations = {
  observer: null,

  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => {
      this.observer.observe(el);
    });
  }
};

const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('ar') + suffix;
    }, 16);
  }
};

const Accordion = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isActive = header.classList.contains('active');

        document.querySelectorAll('.accordion-header.active').forEach(h => {
          h.classList.remove('active');
          h.nextElementSibling.classList.remove('active');
        });

        if (!isActive) {
          header.classList.add('active');
          body.classList.add('active');
        }
      });
    });
  }
};

const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, icon = 'fa-check-circle', duration = 3000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slide-in-toast 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

const FilterTabs = {
  init() {
    document.querySelectorAll('.filter-tabs').forEach(tabsContainer => {
      const tabs = tabsContainer.querySelectorAll('.filter-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const filter = tab.getAttribute('data-filter');
          const targetContainer = document.querySelector(tab.getAttribute('data-target') || '.filter-target');

          if (targetContainer) {
            const items = targetContainer.querySelectorAll('[data-category]');
            items.forEach(item => {
              if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = '';
                item.classList.add('fade-in', 'visible');
              } else {
                item.style.display = 'none';
              }
            });
          }
        });
      });
    });
  }
};

const CarTypeSelector = {
  selected: null,

  init() {
    document.querySelectorAll('.car-type-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.car-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selected = card.getAttribute('data-type');
        Storage.set('selectedCarType', this.selected);

        const event = new CustomEvent('carTypeSelected', { detail: { type: this.selected } });
        document.dispatchEvent(event);
      });
    });

    const saved = Storage.get('selectedCarType');
    if (saved) {
      const card = document.querySelector(`.car-type-card[data-type="${saved}"]`);
      if (card) {
        card.classList.add('selected');
        this.selected = saved;
      }
    }
  }
};

const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }
};

const SearchOverlay = {
  init() {
    const searchInput = document.querySelector('.hero-search-input, #quick-search');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
          }
        }
      });
    }
  }
};

const BackToTop = {
  btn: null,

  init() {
    this.btn = document.createElement('button');
    this.btn.className = 'back-to-top';
    this.btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    this.btn.setAttribute('aria-label', 'Back to top');
    this.btn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--green-gradient);
      color: var(--white);
      border: none;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-gold);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      z-index: 500;
    `;
    document.body.appendChild(this.btn);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        this.btn.style.opacity = '1';
        this.btn.style.transform = 'translateY(0)';
      } else {
        this.btn.style.opacity = '0';
        this.btn.style.transform = 'translateY(20px)';
      }
    }, { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

const LazyImages = {
  init() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
};

const Utils = {
  formatNumber(num) {
    return num.toLocaleString('ar-SA');
  },

  truncate(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'class') el.className = val;
      else if (key === 'html') el.innerHTML = val;
      else if (key === 'text') el.textContent = val;
      else el.setAttribute(key, val);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.insertAdjacentHTML('beforeend', child);
      else el.appendChild(child);
    });
    return el;
  },

  getSeverityLabel(severity) {
    const labels = {
      critical: { ar: 'حرج', en: 'Critical' },
      warning: { ar: 'تحذير', en: 'Warning' },
      info: { ar: 'معلومة', en: 'Info' }
    };
    return labels[severity] || labels.info;
  },

  getSeverityColor(severity) {
    const colors = {
      critical: '#D64045',
      warning: '#F4A261',
      info: '#1B4F72'
    };
    return colors[severity] || colors.info;
  }
};

const PageLoader = {
  init() {
    document.body.classList.add('page-loaded');

    document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('javascript')) {
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Lang.init();
  Navigation.init();
  HeroParticles.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  Accordion.init();
  Toast.init();
  FilterTabs.init();
  CarTypeSelector.init();
  SmoothScroll.init();
  SearchOverlay.init();
  BackToTop.init();
  LazyImages.init();
  PageLoader.init();
});

window.WorkshatiApp = {
  Lang,
  Navigation,
  Toast,
  Utils,
  FilterTabs,
  CarTypeSelector
};