/* =====================================================
   ACCESSIBILITY.JS - Controles de Acessibilidade
   ===================================================== */

(function () {
  // Estado de acessibilidade
  const accessibilityState = {
    fontSize: 100,
    spacing: "normal",
    reduceMotion: false,
    highContrast: false,
    modoAcolhedor: false,
  };

  // Elementos DOM
  const elements = {};

  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Verificar se estamos na página de acessibilidade
    if (!document.getElementById("fontIncrease")) return;

    // Capturar elementos
    elements.fontDecrease = document.getElementById("fontDecrease");
    elements.fontIncrease = document.getElementById("fontIncrease");
    elements.fontCurrent = document.getElementById("fontCurrent");
    elements.fontReset = document.getElementById("fontReset");
    elements.spacingBtns = document.querySelectorAll(".spacing-btn");
    elements.reduceMotion = document.getElementById("reduceMotion");
    elements.highContrast = document.getElementById("highContrast");
    elements.previewBox = document.getElementById("previewBox");
    elements.modoAcolhedorMain = document.getElementById("modoAcolhedorMain");
    elements.toggleStatus = document.getElementById("toggleStatus");

    // Carregar configurações salvas
    loadSettings();

    // Event listeners
    initFontControls();
    initSpacingControls();
    initMotionControls();
    initContrastControls();
    initModoAcolhedorMain();

    // Aplicar configurações
    applySettings();
  });

  /**
   * Inicializa controles de fonte
   */
  function initFontControls() {
    if (elements.fontDecrease) {
      elements.fontDecrease.addEventListener("click", () => {
        if (accessibilityState.fontSize > 80) {
          accessibilityState.fontSize -= 10;
          updateFontSize();
          saveSettings();
        }
      });
    }

    if (elements.fontIncrease) {
      elements.fontIncrease.addEventListener("click", () => {
        if (accessibilityState.fontSize < 150) {
          accessibilityState.fontSize += 10;
          updateFontSize();
          saveSettings();
        }
      });
    }

    if (elements.fontReset) {
      elements.fontReset.addEventListener("click", () => {
        accessibilityState.fontSize = 100;
        updateFontSize();
        saveSettings();
      });
    }
  }

  /**
   * Inicializa controles de espaçamento
   */
  function initSpacingControls() {
    elements.spacingBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        elements.spacingBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        accessibilityState.spacing = btn.dataset.spacing;
        updateSpacing();
        saveSettings();
      });
    });
  }

  /**
   * Inicializa controles de movimento
   */
  function initMotionControls() {
    if (elements.reduceMotion) {
      elements.reduceMotion.addEventListener("change", () => {
        accessibilityState.reduceMotion = elements.reduceMotion.checked;
        updateMotion();
        saveSettings();
      });
    }
  }

  /**
   * Inicializa controles de contraste
   */
  function initContrastControls() {
    if (elements.highContrast) {
      elements.highContrast.addEventListener("change", () => {
        accessibilityState.highContrast = elements.highContrast.checked;
        updateContrast();
        saveSettings();
      });
    }
  }

  /**
   * Inicializa o toggle principal do Modo Acolhedor
   */
  function initModoAcolhedorMain() {
    if (elements.modoAcolhedorMain) {
      elements.modoAcolhedorMain.checked = accessibilityState.modoAcolhedor;
      updateModoAcolhedor(accessibilityState.modoAcolhedor, false);

      elements.modoAcolhedorMain.addEventListener("change", () => {
        const isEnabled = elements.modoAcolhedorMain.checked;
        updateModoAcolhedor(isEnabled);
        saveSettings();
      });
    }
  }

  /**
   * Atualiza o modo acolhedor e sincroniza os toggles
   */
  function updateModoAcolhedor(isEnabled, save = true) {
    accessibilityState.modoAcolhedor = isEnabled;

    document.body.classList.toggle("modo-acolhedor", isEnabled);

    const headerToggle = document.getElementById("modoAcolhedor");
    if (headerToggle) {
      headerToggle.checked = isEnabled;
    }

    updateToggleStatus(isEnabled);

    if (save) {
      localStorage.setItem("modoAcolhedor", isEnabled.toString());
    }
  }

  /**
   * Atualiza o status do toggle
   */
  function updateToggleStatus(isEnabled) {
    if (elements.toggleStatus) {
      elements.toggleStatus.textContent = isEnabled ? "Ativado" : "Desativado";
      elements.toggleStatus.style.color = isEnabled
        ? "var(--sage-green-dark)"
        : "var(--text-muted)";
    }
  }

  /**
   * Atualiza o tamanho da fonte
   */
  function updateFontSize() {
    if (elements.fontCurrent) {
      elements.fontCurrent.textContent = accessibilityState.fontSize + "%";
    }

    // Aplicar ao preview
    if (elements.previewBox) {
      elements.previewBox.style.fontSize = accessibilityState.fontSize + "%";
    }

    // Aplicar globalmente
    document.documentElement.style.setProperty(
      "--user-font-scale",
      accessibilityState.fontSize / 100,
    );
  }

  /**
   * Atualiza o espaçamento
   */
  function updateSpacing() {
    const spacing = accessibilityState.spacing;

    document.body.classList.remove(
      "spacing-normal",
      "spacing-medium",
      "spacing-large",
    );
    document.body.classList.add("spacing-" + spacing);

    // Atualizar preview
    if (elements.previewBox) {
      elements.previewBox.classList.remove(
        "spacing-normal",
        "spacing-medium",
        "spacing-large",
      );
      elements.previewBox.classList.add("spacing-" + spacing);
    }
  }

  /**
   * Atualiza configurações de movimento
   */
  function updateMotion() {
    if (accessibilityState.reduceMotion) {
      document.body.classList.add("reduce-motion");
    } else {
      document.body.classList.remove("reduce-motion");
    }
  }

  /**
   * Atualiza configurações de contraste
   */
  function updateContrast() {
    if (accessibilityState.highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }

  /**
   * Aplica todas as configurações
   */
  function applySettings() {
    updateFontSize();
    updateSpacing();
    updateMotion();
    updateContrast();

    // Atualizar UI de controles
    if (elements.reduceMotion) {
      elements.reduceMotion.checked = accessibilityState.reduceMotion;
    }
    if (elements.highContrast) {
      elements.highContrast.checked = accessibilityState.highContrast;
    }

    // Atualizar botões de espaçamento
    elements.spacingBtns.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.spacing === accessibilityState.spacing) {
        btn.classList.add("active");
      }
    });
  }

  /**
   * Salva configurações no LocalStorage
   */
  function saveSettings() {
    localStorage.setItem(
      "accessibilitySettings",
      JSON.stringify(accessibilityState),
    );
  }

  /**
   * Carrega configurações do LocalStorage
   */
  function loadSettings() {
    const saved = localStorage.getItem("accessibilitySettings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        Object.assign(accessibilityState, settings);
      } catch (error) {
        console.warn(
          "Não foi possível carregar as configurações de acessibilidade:",
          error,
        );
      }
    }

    const modoAcolhedorSaved = localStorage.getItem("modoAcolhedor");
    if (modoAcolhedorSaved !== null) {
      accessibilityState.modoAcolhedor = modoAcolhedorSaved === "true";
    }
  }
})();
