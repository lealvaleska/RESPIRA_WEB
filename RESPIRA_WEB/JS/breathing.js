/* =====================================================
   BREATHING.JS - Exercício de Respiração Avançado
   ===================================================== */

(function () {
  // Estado do exercício
  const breathingState = {
    active: false,
    phase: "idle",
    cycleCount: 0,
    totalSeconds: 0,
    timer: null,
    soundEnabled: false,
    audioContext: null,
  };

  // Elementos DOM
  const elements = {};

  // Inicialização
  document.addEventListener("DOMContentLoaded", () => {
    // Verificar se estamos na página de respiração
    if (!document.getElementById("breathingCircleLarge")) return;

    // Capturar elementos
    elements.circle = document.getElementById("breathingCircleLarge");
    elements.phase = document.getElementById("breathingPhase");
    elements.counter = document.getElementById("breathingCounter");
    elements.progressBar = document.getElementById("progressBar");
    elements.startBtn = document.getElementById("startBreathingMain");
    elements.stopBtn = document.getElementById("stopBreathingMain");
    elements.resetBtn = document.getElementById("resetBreathingMain");
    elements.cycleCount = document.getElementById("cycleCount");
    elements.totalTime = document.getElementById("totalTime");
    elements.soundToggle = document.getElementById("soundToggle");

    // Event listeners
    if (elements.startBtn) {
      elements.startBtn.addEventListener("click", startBreathingExercise);
    }
    if (elements.stopBtn) {
      elements.stopBtn.addEventListener("click", stopBreathingExercise);
    }
    if (elements.resetBtn) {
      elements.resetBtn.addEventListener("click", resetBreathingExercise);
    }
    if (elements.soundToggle) {
      elements.soundToggle.addEventListener("change", (e) => {
        breathingState.soundEnabled = e.target.checked;
        if (breathingState.soundEnabled) {
          resumeAudioContext();
        }
      });
    }
  });

  /**
   * Inicia o exercício de respiração
   */
  function startBreathingExercise() {
    if (breathingState.active) return;

    breathingState.active = true;

    // Atualizar UI
    elements.startBtn.style.display = "none";
    elements.stopBtn.style.display = "inline-flex";
    elements.resetBtn.style.display = "inline-flex";

    // Garantir que o AudioContext esteja ativo antes de tocar som
    if (breathingState.soundEnabled) {
      resumeAudioContext();
    }

    // Iniciar temporizador total
    breathingState.timer = setInterval(() => {
      breathingState.totalSeconds++;
      updateTotalTime();
    }, 1000);

    // Iniciar ciclo de respiração
    breathingCycle();
  }

  /**
   * Para o exercício de respiração
   */
  function stopBreathingExercise() {
    breathingState.active = false;

    // Atualizar UI
    elements.startBtn.style.display = "inline-flex";
    elements.stopBtn.style.display = "none";
    elements.startBtn.innerHTML = '<span class="btn-icon">▶</span> Continuar';

    // Parar temporizador
    if (breathingState.timer) {
      clearInterval(breathingState.timer);
    }

    // Atualizar fase
    elements.phase.textContent = "Pausado";
    elements.circle.className = "breathing-circle-large";
  }

  /**
   * Reinicia o exercício de respiração
   */
  function resetBreathingExercise() {
    breathingState.active = false;
    breathingState.phase = "idle";
    breathingState.cycleCount = 0;
    breathingState.totalSeconds = 0;

    // Parar temporizador
    if (breathingState.timer) {
      clearInterval(breathingState.timer);
    }

    // Atualizar UI
    elements.startBtn.style.display = "inline-flex";
    elements.stopBtn.style.display = "none";
    elements.resetBtn.style.display = "none";
    elements.startBtn.innerHTML =
      '<span class="btn-icon">▶</span> Iniciar Exercicio';

    elements.phase.textContent = "Preparado";
    elements.counter.textContent = "0";
    elements.cycleCount.textContent = "0";
    elements.totalTime.textContent = "0:00";
    elements.progressBar.style.width = "0%";
    elements.circle.className = "breathing-circle-large";
  }

  /**
   * Ciclo de respiração 4-7-8
   */
  function breathingCycle() {
    if (!breathingState.active) return;

    // Fase 1: Inspirar (4 segundos)
    breathingState.phase = "inhale";
    updatePhaseUI("Inspire...", "inhale");
    if (breathingState.soundEnabled) {
      playSound();
    }
    animateProgress(4, () => {
      if (!breathingState.active) return;

      // Fase 2: Segurar (7 segundos)
      breathingState.phase = "hold";
      updatePhaseUI("Segure...", "hold");
      if (breathingState.soundEnabled) {
        playSound();
      }
      animateProgress(7, () => {
        if (!breathingState.active) return;

        // Fase 3: Expirar (8 segundos)
        breathingState.phase = "exhale";
        updatePhaseUI("Expire...", "exhale");
        if (breathingState.soundEnabled) {
          playSound();
        }
        animateProgress(8, () => {
          if (!breathingState.active) return;

          // Ciclo completo
          breathingState.cycleCount++;
          elements.cycleCount.textContent = breathingState.cycleCount;

          // Tocar som se habilitado
          if (breathingState.soundEnabled) {
            playSound();
          }

          // Continuar próximo ciclo
          breathingCycle();
        });
      });
    });
  }

  /**
   * Atualiza a UI da fase atual
   */
  function updatePhaseUI(text, phase) {
    elements.phase.textContent = text;
    elements.circle.className = "breathing-circle-large " + phase;
  }

  /**
   * Anima a barra de progresso e contador
   */
  function animateProgress(duration, callback) {
    let elapsed = 0;
    elements.progressBar.style.width = "0%";
    elements.counter.textContent = duration;

    const interval = setInterval(() => {
      if (!breathingState.active) {
        clearInterval(interval);
        return;
      }

      elapsed++;
      const remaining = duration - elapsed;
      const progress = (elapsed / duration) * 100;

      elements.counter.textContent = remaining;
      elements.progressBar.style.width = progress + "%";

      if (elapsed >= duration) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 1000);
  }

  /**
   * Atualiza o tempo total
   */
  function updateTotalTime() {
    const minutes = Math.floor(breathingState.totalSeconds / 60);
    const seconds = breathingState.totalSeconds % 60;
    elements.totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Toca um som suave (usando Web Audio API)
   */
  function resumeAudioContext() {
    if (!breathingState.audioContext) {
      breathingState.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    if (breathingState.audioContext.state === "suspended") {
      breathingState.audioContext.resume().catch(() => {
        // Ignorar se não for possível retomar
      });
    }
  }

 function playSound() {
  try {
    resumeAudioContext();

    const audioContext = breathingState.audioContext;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 220;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);

    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  } catch (e) {
    // Ignorar erros de áudio
  }
}
})();
