// Ativa a flag has-js imediatamente para suportar as animações de scroll
document.documentElement.classList.add('has-js');

document.addEventListener('DOMContentLoaded', () => {
  initDownloadConfig();
  initHeaderScroll();
  initMobileNav();
  initScrollReveal();
  initScrollProgressBar();
  initScrollSpy();
  initScrollToTop();
  initFaqAccordion();
  initDownloadFeedback();
  initSmoothScroll();
});

function initDownloadConfig() {
  if (typeof CLIPDROP_CONFIG === 'undefined') return;

  const winConfig = CLIPDROP_CONFIG.downloads?.windows;
  if (winConfig) {
    const winButtons = document.querySelectorAll(
      '#hero-download-btn, #platform-win-btn, [data-download-platform="windows"]'
    );
    winButtons.forEach(btn => {
      if (winConfig.url) {
        btn.setAttribute('href', winConfig.url);
        btn.setAttribute('download', winConfig.fileName || 'ClipDrop.Setup.exe');
      }
    });

    const versionElements = document.querySelectorAll(
      '#win-version-badge, [data-release-version="windows"], [data-app-version], .app-version'
    );
    versionElements.forEach(el => {
      el.textContent = winConfig.version;
    });

    const toastText = document.querySelector('#download-toast .toast-text');
    if (toastText) {
      toastText.textContent = `Download do ClipDrop ${winConfig.version} iniciado!`;
    }
  }

  if (CLIPDROP_CONFIG.repositoryUrl) {
    const repoLinks = document.querySelectorAll('[data-repo-url]');
    repoLinks.forEach(link => {
      link.setAttribute('href', CLIPDROP_CONFIG.repositoryUrl);
    });
  }
}

/**
 * 1. Efeito de elevação da barra de navegação no scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 3. Acordeão de Perguntas Frequentes (FAQ)
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Fecha outros itens para manter elegância minimalista
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Alterna o item atual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Recalibra dinamicamente a altura máxima caso a janela mude de dimensão ou orientação
  window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.faq-item.active');
    if (activeItem) {
      const activeAnswer = activeItem.querySelector('.faq-answer');
      if (activeAnswer) {
        activeAnswer.style.maxHeight = activeAnswer.scrollHeight + 'px';
      }
    }
  }, { passive: true });
}

/**
 * 4. Feedback visual e Toast para botões de download
 */
function initDownloadFeedback() {
  const toast = document.getElementById('download-toast');
  const winButtons = [
    document.getElementById('hero-download-btn'),
    document.getElementById('platform-win-btn')
  ];

  winButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!toast) return;

      const toastText = toast.querySelector('.toast-text');
      if (toastText && typeof CLIPDROP_CONFIG !== 'undefined') {
        const ver = CLIPDROP_CONFIG.downloads?.windows?.version || CLIPDROP_CONFIG.version;
        toastText.textContent = `Download do ClipDrop ${ver} iniciado!`;
      }

      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4500);
    });
  });
}

/**
 * 5. Rolagem suave aprimorada para âncoras internas
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/**
 * 6. Animações de Revelação no Scroll (Intersection Observer)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback gracioso para navegadores legados
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * 7. Barra de Progresso de Scroll/Leitura no Topo
 */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

/**
 * 8. Destaque automático de item ativo no menu ao rolar a página (Scrollspy)
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .mobile-nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const handleScrollspy = () => {
    const scrollPosition = (window.scrollY || document.documentElement.scrollTop) + 120;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (currentId && href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollspy();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleScrollspy();
}

/**
 * 9. Botão Flutuante Voltar ao Topo
 */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-to-top');
  if (!scrollTopBtn) return;

  const toggleBtnVisibility = () => {
    if (window.scrollY > 380) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBtnVisibility, { passive: true });
  toggleBtnVisibility();

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 10. Menu de Navegação Mobile (Gaveta / Drawer Acessível)
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const header = document.getElementById('site-header');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-actions a');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openMenu = () => {
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('is-active');
    backdrop.setAttribute('aria-hidden', 'false');
    if (header) header.classList.add('menu-open');
    document.body.classList.add('mobile-menu-active');
  };

  const closeMenu = () => {
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('is-active');
    backdrop.setAttribute('aria-hidden', 'true');
    if (header) header.classList.remove('menu-open');
    document.body.classList.remove('mobile-menu-active');
  };

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  toggleBtn.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Fecha com a tecla Escape para total conformidade de acessibilidade
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  });

  // Fecha e redefine classes caso a janela seja redimensionada para desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && drawer.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
}


