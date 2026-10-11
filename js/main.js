document.addEventListener('DOMContentLoaded', () => {
  initDownloadConfig();
  initHeaderScroll();
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
