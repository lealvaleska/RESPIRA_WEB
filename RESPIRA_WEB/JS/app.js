/* =====================================================
   RESPIRA - JavaScript Principal
   Site de Acolhimento Digital e Saúde Mental
   
   Regras de Negócio Implementadas:
   - RN01: Crise emocional - destaca contatos emergenciais
   - RN02: Ansiedade - mostra exercício de respiração
   - RN03: 3 emoções negativas consecutivas - sugere apoio
   - RN04: Modo acolhedor - melhora acessibilidade
   ===================================================== */

// =====================================================
// CONFIGURAÇÕES E ESTADO
// =====================================================

const state = {
  // RN03: Contador de emoções negativas consecutivas
  negativeEmotionCount: 0,
  
  // Emoções consideradas negativas para RN03
  negativeEmotions: ['ansiedade', 'estresse', 'tristeza', 'sobrecarga', 'crise'],
  
  // Humor selecionado no diário
  selectedMood: null,
  
  // Estado do exercício de respiração
  breathingActive: false,
  breathingInterval: null,
  breathingPhase: 'idle' // idle, inhale, hold, exhale
};

// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initEmotionCards();
  initBreathingExercise();
  initDiary();
  loadDiaryEntries();
});

// =====================================================
// MENU MOBILE
// =====================================================

function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  
  // Fecha o menu ao clicar em um link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// =====================================================
// CARDS DE EMOÇÕES
// =====================================================

function initEmotionCards() {
  const cards = document.querySelectorAll('.emotion-card');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const emotion = card.dataset.emotion;
      
      // Remove classe active de todos os cards
      cards.forEach(c => c.classList.remove('active'));
      
      // Adiciona classe active no card clicado
      card.classList.add('active');
      
      // Processa a emoção selecionada
      handleEmotionSelection(emotion);
    });
  });
}

/**
 * Processa a seleção de uma emoção
 * Implementa as regras de negócio RN01, RN02 e RN03
 */
function handleEmotionSelection(emotion) {
  const contentContainer = document.getElementById('conteudo-emocional');
  
  // RN03: Incrementa contador se for emoção negativa
  if (state.negativeEmotions.includes(emotion)) {
    state.negativeEmotionCount++;
    
    // RN03: Se atingir 3 emoções negativas consecutivas, mostra alerta
    if (state.negativeEmotionCount >= 3) {
      showSupportAlert();
    }
  } else {
    // Reseta contador se emoção for positiva/neutra
    state.negativeEmotionCount = 0;
  }
  
  // Gera conteúdo baseado na emoção
  let content = '';
  let isCrisis = false;
  
  switch (emotion) {
    case 'crise':
      // RN01: Crise emocional - destaca contatos emergenciais
      isCrisis = true;
      content = generateCrisisContent();
      break;
      
    case 'ansiedade':
      // RN02: Ansiedade - mostra exercício de respiração
      content = generateAnxietyContent();
      break;
      
    case 'estresse':
      content = generateStressContent();
      break;
      
    case 'tristeza':
      content = generateSadnessContent();
      break;
      
    case 'sobrecarga':
      content = generateOverloadContent();
      break;
      
    default:
      content = '<p>Selecione uma emoção para ver conteúdo personalizado.</p>';
  }
  
  // Atualiza o conteúdo
  contentContainer.innerHTML = content;
  contentContainer.style.display = 'block';
  
  // RN01: Aplica estilo de crise se necessário
  if (isCrisis) {
    contentContainer.classList.add('crisis-mode');
  } else {
    contentContainer.classList.remove('crisis-mode');
  }
  
  // Scroll suave até o conteúdo
  contentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * RN01: Gera conteúdo para crise emocional
 * Destaca contatos emergenciais e exibe mensagem prioritária
 */
function generateCrisisContent() {
  return `
    <h3>🆘 Você não está sozinho</h3>
    <p><strong>Se você está em crise, por favor, peça ajuda agora.</strong></p>
    <p>Estamos aqui com você. Momentos difíceis passam, e existem pessoas preparadas para te ajudar neste momento.</p>
    
    <div class="emergency-contacts">
      <div class="emergency-contact">
        <span class="emergency-contact-icon">📞</span>
        <div class="emergency-contact-info">
          <h4>CVV - Centro de Valorização da Vida</h4>
          <p>Atendimento 24 horas, gratuito e sigiloso</p>
          <a href="tel:188" class="emergency-contact-phone">Ligue: 188</a>
        </div>
      </div>
      
      <div class="emergency-contact">
        <span class="emergency-contact-icon">🚨</span>
        <div class="emergency-contact-info">
          <h4>SAMU - Emergência Médica</h4>
          <p>Para emergências de saúde</p>
          <a href="tel:192" class="emergency-contact-phone">Ligue: 192</a>
        </div>
      </div>
      
      <div class="emergency-contact">
        <span class="emergency-contact-icon">💬</span>
        <div class="emergency-contact-info">
          <h4>Chat CVV</h4>
          <p>Se preferir conversar por texto</p>
          <a href="https://www.cvv.org.br" target="_blank" class="emergency-contact-phone">Acessar Chat</a>
        </div>
      </div>
    </div>
    
    <p style="margin-top: var(--space-lg); text-align: center;">
      <strong>💚 Sua vida importa. Você importa.</strong>
    </p>
  `;
}

/**
 * RN02: Gera conteúdo para ansiedade
 * Mostra exercício de respiração guiada e técnicas de relaxamento
 */
function generateAnxietyContent() {
  return `
    <h3>🌬️ Vamos acalmar juntos</h3>
    <p>A ansiedade pode ser muito desconfortável, mas existem técnicas que podem ajudar a aliviar esse peso.</p>
    
    <h4>Experimente agora:</h4>
    <ul>
      <li><strong>Exercício de respiração:</strong> Use nosso <a href="#respiracao">exercício de respiração guiada</a> logo abaixo. A técnica 4-7-8 ajuda a acalmar o sistema nervoso.</li>
      <li><strong>Grounding 5-4-3-2-1:</strong> Identifique 5 coisas que você vê, 4 que ouve, 3 que toca, 2 que cheira e 1 que saboreia.</li>
      <li><strong>Relaxamento muscular:</strong> Tensione e relaxe cada grupo muscular do corpo, começando pelos pés.</li>
    </ul>
    
    <h4>Dicas para o dia a dia:</h4>
    <ul>
      <li>Limite o consumo de cafeína e estimulantes</li>
      <li>Pratique exercícios físicos regularmente</li>
      <li>Mantenha uma rotina de sono saudável</li>
      <li>Converse com alguém de confiança sobre seus sentimentos</li>
    </ul>
    
    <p style="margin-top: var(--space-md);">
      <a href="#respiracao" class="btn btn-primary">Ir para exercício de respiração</a>
    </p>
  `;
}

/**
 * Gera conteúdo para estresse
 */
function generateStressContent() {
  return `
    <h3>😮‍💨 Um passo de cada vez</h3>
    <p>O estresse faz parte da vida, mas quando se torna constante, precisamos dar atenção especial a ele.</p>
    
    <h4>Técnicas para aliviar o estresse:</h4>
    <ul>
      <li><strong>Pausa consciente:</strong> Pare por 5 minutos, feche os olhos e apenas respire.</li>
      <li><strong>Organize prioridades:</strong> Liste suas tarefas e foque em uma de cada vez.</li>
      <li><strong>Movimento:</strong> Uma caminhada curta pode fazer grande diferença.</li>
      <li><strong>Limites saudáveis:</strong> Aprenda a dizer não quando necessário.</li>
    </ul>
    
    <h4>Sinais de alerta:</h4>
    <ul>
      <li>Dificuldade para dormir</li>
      <li>Irritabilidade constante</li>
      <li>Dores de cabeça ou tensão muscular frequentes</li>
      <li>Dificuldade de concentração</li>
    </ul>
    
    <p style="margin-top: var(--space-md);">
      Se esses sinais persistirem, considere buscar ajuda profissional. <a href="#apoio">Veja nossos canais de apoio</a>.
    </p>
  `;
}

/**
 * Gera conteúdo para tristeza
 */
function generateSadnessContent() {
  return `
    <h3>💙 Tudo bem não estar bem</h3>
    <p>Sentir tristeza faz parte da experiência humana. Não há nada de errado em se permitir sentir.</p>
    
    <h4>O que pode ajudar:</h4>
    <ul>
      <li><strong>Acolha seus sentimentos:</strong> Não tente forçar a alegria. Permita-se sentir.</li>
      <li><strong>Converse:</strong> Compartilhe com alguém de confiança como você está se sentindo.</li>
      <li><strong>Cuide do básico:</strong> Alimentação, sono e hidratação fazem diferença.</li>
      <li><strong>Pequenos prazeres:</strong> Uma música que você gosta, um chá quente, uma série confortável.</li>
    </ul>
    
    <h4>Quando buscar ajuda:</h4>
    <ul>
      <li>Se a tristeza persistir por mais de duas semanas</li>
      <li>Se você perdeu interesse em coisas que antes gostava</li>
      <li>Se está afetando seu trabalho, estudos ou relacionamentos</li>
      <li>Se você tem pensamentos de se machucar</li>
    </ul>
    
    <p style="margin-top: var(--space-md);">
      <strong>💚 Dias melhores virão.</strong> Se precisar, <a href="#apoio">estamos aqui para ajudar</a>.
    </p>
  `;
}

/**
 * Gera conteúdo para sobrecarga
 */
function generateOverloadContent() {
  return `
    <h3>🌊 Respire, você vai conseguir</h3>
    <p>Quando tudo parece demais, é hora de parar e reorganizar. Você não precisa dar conta de tudo ao mesmo tempo.</p>
    
    <h4>Estratégias para lidar com a sobrecarga:</h4>
    <ul>
      <li><strong>Priorize:</strong> O que realmente precisa ser feito hoje? Foque nisso primeiro.</li>
      <li><strong>Delegue:</strong> Você não precisa fazer tudo sozinho. Peça ajuda quando possível.</li>
      <li><strong>Pausas regulares:</strong> Trabalhe em blocos de tempo com intervalos para descanso.</li>
      <li><strong>Diga não:</strong> Recusar novas demandas é um ato de autocuidado.</li>
    </ul>
    
    <h4>Autocuidado básico:</h4>
    <ul>
      <li>Durma pelo menos 7-8 horas</li>
      <li>Faça refeições regulares e nutritivas</li>
      <li>Reserve tempo para atividades que te dão prazer</li>
      <li>Desconecte-se das telas antes de dormir</li>
    </ul>
    
    <p style="margin-top: var(--space-md);">
      Experimente nosso <a href="#respiracao">exercício de respiração</a> para ajudar a acalmar a mente.
    </p>
  `;
}

/**
 * RN03: Exibe alerta sugerindo buscar apoio psicológico
 * Acionado após 3 emoções negativas consecutivas
 */
function showSupportAlert() {
  const alert = document.getElementById('alerta-apoio');
  alert.style.display = 'flex';
  
  // Reseta o contador após mostrar o alerta
  state.negativeEmotionCount = 0;
  
  // Fecha o alerta ao clicar no botão X
  const closeBtn = alert.querySelector('.support-alert-close');
  closeBtn.onclick = () => {
    alert.style.display = 'none';
  };
  
  // Fecha o alerta ao clicar fora
  alert.onclick = (e) => {
    if (e.target === alert) {
      alert.style.display = 'none';
    }
  };
}

// =====================================================
// EXERCÍCIO DE RESPIRAÇÃO
// =====================================================

function initBreathingExercise() {
  const startBtn = document.getElementById('startBreathing');
  const stopBtn = document.getElementById('stopBreathing');
  const circle = document.getElementById('breathingCircle');
  const text = document.getElementById('breathingText');
  
  // Only initialize if breathing elements exist on this page
  if (!startBtn || !stopBtn) return;
  
  startBtn.addEventListener('click', () => {
    if (!state.breathingActive) {
      startBreathing();
      startBtn.style.display = 'none';
      stopBtn.style.display = 'inline-flex';
    }
  });
  
  stopBtn.addEventListener('click', () => {
    stopBreathing();
    startBtn.style.display = 'inline-flex';
    stopBtn.style.display = 'none';
  });
}

/**
 * Inicia o exercício de respiração
 * Técnica 4-7-8: 4s inspirar, 7s segurar, 8s expirar
 */
function startBreathing() {
  state.breathingActive = true;
  const circle = document.getElementById('breathingCircle');
  const text = document.getElementById('breathingText');
  
  // Ciclo de respiração
  function breathingCycle() {
    if (!state.breathingActive) return;
    
    // Fase 1: Inspirar (4 segundos)
    state.breathingPhase = 'inhale';
    circle.className = 'breathing-circle inhale';
    text.textContent = 'Inspire...';
    
    setTimeout(() => {
      if (!state.breathingActive) return;
      
      // Fase 2: Segurar (7 segundos)
      state.breathingPhase = 'hold';
      circle.className = 'breathing-circle hold';
      text.textContent = 'Segure...';
      
      setTimeout(() => {
        if (!state.breathingActive) return;
        
        // Fase 3: Expirar (8 segundos)
        state.breathingPhase = 'exhale';
        circle.className = 'breathing-circle exhale';
        text.textContent = 'Expire...';
        
        setTimeout(() => {
          if (state.breathingActive) {
            breathingCycle(); // Reinicia o ciclo
          }
        }, 8000);
        
      }, 7000);
      
    }, 4000);
  }
  
  breathingCycle();
}

/**
 * Para o exercício de respiração
 */
function stopBreathing() {
  state.breathingActive = false;
  const circle = document.getElementById('breathingCircle');
  const text = document.getElementById('breathingText');
  
  circle.className = 'breathing-circle';
  text.textContent = 'Iniciar';
}

// =====================================================
// DIÁRIO EMOCIONAL
// =====================================================

function initDiary() {
  const form = document.getElementById('diaryForm');
  const moodBtns = document.querySelectorAll('.mood-btn');
  
  // Only initialize if diary form exists on this page
  if (!form) return;
  
  // Seleção de humor
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selectedMood = btn.dataset.mood;
    });
  });
  
  // Envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveDiaryEntry();
  });
}

/**
 * Salva uma entrada no diário usando LocalStorage
 */
function saveDiaryEntry() {
  const text = document.getElementById('diaryText').value.trim();
  const mood = state.selectedMood;
  
  if (!mood) {
    alert('Por favor, selecione como está seu humor.');
    return;
  }
  
  // Cria objeto da entrada
  const entry = {
    id: Date.now(),
    mood: mood,
    text: text,
    date: new Date().toISOString()
  };
  
  // Obtém entradas existentes
  let entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  
  // Adiciona nova entrada no início
  entries.unshift(entry);
  
  // Limita a 50 entradas
  if (entries.length > 50) {
    entries = entries.slice(0, 50);
  }
  
  // Salva no LocalStorage
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
  
  // Limpa o formulário
  document.getElementById('diaryText').value = '';
  document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
  state.selectedMood = null;
  
  // Atualiza a lista de entradas
  loadDiaryEntries();
  
  // Feedback visual
  alert('Registro salvo com sucesso! 💚');
  
  // RN03: Verifica se o humor é negativo
  const negativeMoods = ['muito-mal', 'mal'];
  if (negativeMoods.includes(mood)) {
    state.negativeEmotionCount++;
    if (state.negativeEmotionCount >= 3) {
      showSupportAlert();
    }
  } else {
    state.negativeEmotionCount = 0;
  }
}

/**
 * Carrega entradas do diário do LocalStorage
 */
function loadDiaryEntries() {
  const container = document.getElementById('diaryEntries');
  const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
  
  if (entries.length === 0) {
    container.innerHTML = '<p class="diary-empty">Você ainda não tem registros. Comece agora!</p>';
    return;
  }
  
  // Mapeia humor para emoji
  const moodEmojis = {
    'muito-mal': '😢',
    'mal': '😕',
    'neutro': '😐',
    'bem': '🙂',
    'muito-bem': '😊'
  };
  
  // Gera HTML das entradas
  const entriesHTML = entries.slice(0, 10).map(entry => {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="diary-entry-card">
        <div class="diary-entry-header">
          <span class="diary-entry-mood">${moodEmojis[entry.mood] || '😐'}</span>
          <span class="diary-entry-date">${formattedDate}</span>
        </div>
        ${entry.text ? `<p class="diary-entry-text">${escapeHTML(entry.text)}</p>` : ''}
      </div>
    `;
  }).join('');
  
  container.innerHTML = entriesHTML;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// =====================================================
// RN04: MODO ACOLHEDOR
// Gerenciado pelo global-accessibility.js
// =====================================================

// =====================================================
// UTILIDADES
// =====================================================

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Skip if href is just '#' or empty
    if (!href || href === '#') {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Fecha menu mobile ao redimensionar para desktop
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    document.querySelector('.mobile-menu-btn').classList.remove('active');
    document.querySelector('.mobile-menu').classList.remove('active');
  }
});
