/* =====================================================
   GLOBAL-ACCESSIBILITY.JS
   Controles de Acessibilidade Globais
   Funciona em TODAS as páginas do site
   ===================================================== */

(function() {
  'use strict';

  // Estado global de acessibilidade
  const accessibilityState = {
    modoAcolhedor: false,
    fontSize: 100,
    spacing: 'normal',
    reduceMotion: false,
    highContrast: false
  };

  // Carregar configurações salvas imediatamente (antes do DOM)
  loadSettings();
  applySettingsEarly();

  // Inicialização após DOM carregar
  document.addEventListener('DOMContentLoaded', () => {
    initGlobalAccessibility();
    syncUIControls();
    createStarsBackground();
  });

  /**
   * Carrega configurações do LocalStorage
   */
  function loadSettings() {
    // Modo Acolhedor
    const modoAcolhedorSaved = localStorage.getItem('modoAcolhedor');
    accessibilityState.modoAcolhedor = modoAcolhedorSaved === 'true';

    // Outras configurações de acessibilidade
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        Object.assign(accessibilityState, settings);
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
  }

  /**
   * Aplica configurações antes do DOM estar pronto
   * Evita flash de conteúdo sem estilo
   */
  function applySettingsEarly() {
    // Aplicar modo acolhedor imediatamente
    if (accessibilityState.modoAcolhedor) {
      document.documentElement.classList.add('modo-acolhedor');
    }

    // Aplicar tamanho de fonte
    document.documentElement.style.setProperty('--user-font-scale', accessibilityState.fontSize / 100);

    // Aplicar classes de acessibilidade
    if (accessibilityState.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    if (accessibilityState.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    if (accessibilityState.spacing !== 'normal') {
      document.documentElement.classList.add('spacing-' + accessibilityState.spacing);
    }
  }

  /**
   * Inicializa acessibilidade global
   */
  function initGlobalAccessibility() {
    // Também aplicar ao body
    applySettingsToBody();

    // Inicializar toggle do header (presente em todas as páginas)
    const headerToggle = document.getElementById('modoAcolhedor');
    if (headerToggle) {
      headerToggle.checked = accessibilityState.modoAcolhedor;
      headerToggle.addEventListener('change', () => {
        toggleModoAcolhedor(headerToggle.checked);
      });
    }

    // Inicializar toggle principal da página de acessibilidade
    const mainToggle = document.getElementById('modoAcolhedorMain');
    if (mainToggle) {
      mainToggle.checked = accessibilityState.modoAcolhedor;
      mainToggle.addEventListener('change', () => {
        toggleModoAcolhedor(mainToggle.checked);
      });
    }

    // Controles de fonte
    initFontControls();

    // Controles de espaçamento
    initSpacingControls();

    // Controles de movimento
    initMotionControls();

    // Controles de contraste
    initContrastControls();

    // Navegação por teclado
    initKeyboardNavigation();
  }

  /**
   * Aplica configurações ao body
   */
  function applySettingsToBody() {
    const body = document.body;

    // Modo acolhedor
    if (accessibilityState.modoAcolhedor) {
      body.classList.add('modo-acolhedor');
      document.documentElement.classList.add('modo-acolhedor');
    } else {
      body.classList.remove('modo-acolhedor');
      document.documentElement.classList.remove('modo-acolhedor');
    }

    // Espaçamento
    body.classList.remove('spacing-normal', 'spacing-medium', 'spacing-large');
    if (accessibilityState.spacing !== 'normal') {
      body.classList.add('spacing-' + accessibilityState.spacing);
    }

    // Movimento reduzido
    if (accessibilityState.reduceMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }

    // Alto contraste
    if (accessibilityState.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Tamanho da fonte
    document.documentElement.style.setProperty('--user-font-scale', accessibilityState.fontSize / 100);
  }

  /**
   * Alterna o Modo Acolhedor
   */
  function toggleModoAcolhedor(enabled) {
    accessibilityState.modoAcolhedor = enabled;

    // Aplicar classes
    if (enabled) {
      document.body.classList.add('modo-acolhedor');
      document.documentElement.classList.add('modo-acolhedor');
      createStarsBackground();
    } else {
      document.body.classList.remove('modo-acolhedor');
      document.documentElement.classList.remove('modo-acolhedor');
      removeStarsBackground();
    }

    // Sincronizar todos os toggles
    syncAllToggles(enabled);

    // Salvar preferência
    localStorage.setItem('modoAcolhedor', enabled.toString());

    // Atualizar status visual
    updateToggleStatus(enabled);
  }

  /**
   * Sincroniza todos os toggles do modo acolhedor
   */
  function syncAllToggles(enabled) {
    const headerToggle = document.getElementById('modoAcolhedor');
    const mainToggle = document.getElementById('modoAcolhedorMain');

    if (headerToggle) headerToggle.checked = enabled;
    if (mainToggle) mainToggle.checked = enabled;
  }

  /**
   * Atualiza o texto de status do toggle
   */
  function updateToggleStatus(enabled) {
    const statusEl = document.getElementById('toggleStatus');
    if (statusEl) {
      statusEl.textContent = enabled ? 'Ativado' : 'Desativado';
      statusEl.style.color = enabled ? 'var(--sage-green-dark)' : 'var(--text-muted)';
    }
  }

  /**
   * Cria background com estrelas para modo acolhedor
   */
  function createStarsBackground() {
    if (!accessibilityState.modoAcolhedor) return;
    
    // Remove existente se houver
    removeStarsBackground();

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars-background';
    starsContainer.setAttribute('aria-hidden', 'true');

    // Criar estrelas
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = Math.random() * 3 + 's';
      star.style.width = (Math.random() * 2 + 1) + 'px';
      star.style.height = star.style.width;
      starsContainer.appendChild(star);
    }

    document.body.appendChild(starsContainer);
  }

  /**
   * Remove background de estrelas
   */
  function removeStarsBackground() {
    const existing = document.querySelector('.stars-background');
    if (existing) {
      existing.remove();
    }
  }

  /**
   * Inicializa controles de fonte
   */
  function initFontControls() {
    const fontDecrease = document.getElementById('fontDecrease');
    const fontIncrease = document.getElementById('fontIncrease');
    const fontReset = document.getElementById('fontReset');
    const fontCurrent = document.getElementById('fontCurrent');

    if (fontDecrease) {
      fontDecrease.addEventListener('click', () => {
        if (accessibilityState.fontSize > 80) {
          accessibilityState.fontSize -= 10;
          applyFontSize();
          saveSettings();
        }
      });
    }

    if (fontIncrease) {
      fontIncrease.addEventListener('click', () => {
        if (accessibilityState.fontSize < 150) {
          accessibilityState.fontSize += 10;
          applyFontSize();
          saveSettings();
        }
      });
    }

    if (fontReset) {
      fontReset.addEventListener('click', () => {
        accessibilityState.fontSize = 100;
        applyFontSize();
        saveSettings();
      });
    }
  }

  /**
   * Aplica tamanho de fonte
   */
  function applyFontSize() {
    document.documentElement.style.setProperty('--user-font-scale', accessibilityState.fontSize / 100);
    
    const fontCurrent = document.getElementById('fontCurrent');
    if (fontCurrent) {
      fontCurrent.textContent = accessibilityState.fontSize + '%';
    }

    // Aplicar ao preview se existir
    const previewBox = document.getElementById('previewBox');
    if (previewBox) {
      previewBox.style.fontSize = accessibilityState.fontSize + '%';
    }
  }

  /**
   * Inicializa controles de espaçamento
   */
  function initSpacingControls() {
    const spacingBtns = document.querySelectorAll('.spacing-btn');
    
    spacingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        spacingBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        accessibilityState.spacing = btn.dataset.spacing;
        applySpacing();
        saveSettings();
      });
    });
  }

  /**
   * Aplica espaçamento
   */
  function applySpacing() {
    document.body.classList.remove('spacing-normal', 'spacing-medium', 'spacing-large');
    document.body.classList.add('spacing-' + accessibilityState.spacing);

    const previewBox = document.getElementById('previewBox');
    if (previewBox) {
      previewBox.classList.remove('spacing-normal', 'spacing-medium', 'spacing-large');
      previewBox.classList.add('spacing-' + accessibilityState.spacing);
    }
  }

  /**
   * Inicializa controles de movimento
   */
  function initMotionControls() {
    const reduceMotion = document.getElementById('reduceMotion');
    if (reduceMotion) {
      reduceMotion.addEventListener('change', () => {
        accessibilityState.reduceMotion = reduceMotion.checked;
        applyMotion();
        saveSettings();
      });
    }
  }

  /**
   * Aplica configurações de movimento
   */
  function applyMotion() {
    if (accessibilityState.reduceMotion) {
      document.body.classList.add('reduce-motion');
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
      document.documentElement.classList.remove('reduce-motion');
    }
  }

  /**
   * Inicializa controles de contraste
   */
  function initContrastControls() {
    const highContrast = document.getElementById('highContrast');
    if (highContrast) {
      highContrast.addEventListener('change', () => {
        accessibilityState.highContrast = highContrast.checked;
        applyContrast();
        saveSettings();
      });
    }
  }

  /**
   * Aplica configurações de contraste
   */
  function applyContrast() {
    if (accessibilityState.highContrast) {
      document.body.classList.add('high-contrast');
      document.documentElement.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
      document.documentElement.classList.remove('high-contrast');
    }
  }

  /**
   * Inicializa navegação por teclado melhorada
   */
  function initKeyboardNavigation() {
    // Adicionar indicadores de foco visíveis
    document.body.classList.add('keyboard-nav-ready');

    // Detectar uso de teclado vs mouse
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });

    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('#main-content');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
        }
      });
    }
  }

  /**
   * Sincroniza controles da UI com o estado
   */
  function syncUIControls() {
    // Fonte
    const fontCurrent = document.getElementById('fontCurrent');
    if (fontCurrent) {
      fontCurrent.textContent = accessibilityState.fontSize + '%';
    }

    // Espaçamento
    const spacingBtns = document.querySelectorAll('.spacing-btn');
    spacingBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.spacing === accessibilityState.spacing) {
        btn.classList.add('active');
      }
    });

    // Movimento
    const reduceMotion = document.getElementById('reduceMotion');
    if (reduceMotion) {
      reduceMotion.checked = accessibilityState.reduceMotion;
    }

    // Contraste
    const highContrast = document.getElementById('highContrast');
    if (highContrast) {
      highContrast.checked = accessibilityState.highContrast;
    }

    // Status do modo acolhedor
    updateToggleStatus(accessibilityState.modoAcolhedor);
  }

  /**
   * Salva configurações no LocalStorage
   */
  function saveSettings() {
    const settings = {
      fontSize: accessibilityState.fontSize,
      spacing: accessibilityState.spacing,
      reduceMotion: accessibilityState.reduceMotion,
      highContrast: accessibilityState.highContrast
    };
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }

  // Expor funções globalmente se necessário
  window.RespiraAccessibility = {
    toggleModoAcolhedor,
    getState: () => ({ ...accessibilityState })
  };

})();
