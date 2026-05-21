/* =====================================================
   DIARY.JS - Diário Emocional Avançado
   ===================================================== */

(function() {
  // Estado do diário
  const diaryState = {
    selectedMood: null,
    selectedTags: [],
    entries: []
  };

  // Mapeamento de humor para emoji
  const moodEmojis = {
    'muito-mal': '😢',
    'mal': '😕',
    'neutro': '😐',
    'bem': '🙂',
    'muito-bem': '😊'
  };

  // Categorias de humor
  const moodCategories = {
    positive: ['bem', 'muito-bem'],
    neutral: ['neutro'],
    negative: ['mal', 'muito-mal']
  };

  // Elementos DOM
  const elements = {};

  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos na página do diário
    if (!document.getElementById('diaryFormFull')) return;

    // Capturar elementos
    elements.form = document.getElementById('diaryFormFull');
    elements.textArea = document.getElementById('diaryTextFull');
    elements.charCount = document.getElementById('charCount');
    elements.entriesList = document.getElementById('diaryEntriesList');
    elements.filterPeriod = document.getElementById('filterPeriod');
    elements.clearAllBtn = document.getElementById('clearAllEntries');
    elements.positiveCount = document.getElementById('positiveCount');
    elements.neutralCount = document.getElementById('neutralCount');
    elements.negativeCount = document.getElementById('negativeCount');

    // Carregar entradas salvas
    loadEntries();

    // Event listeners
    initMoodSelection();
    initTagSelection();
    initTextArea();
    initForm();
    initFilter();
    initClearAll();
  });

  /**
   * Inicializa seleção de humor
   */
  function initMoodSelection() {
    const moodOptions = document.querySelectorAll('.mood-option');
    
    moodOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remover seleção anterior
        moodOptions.forEach(o => o.classList.remove('selected'));
        
        // Adicionar seleção atual
        option.classList.add('selected');
        diaryState.selectedMood = option.dataset.mood;
      });
    });
  }

  /**
   * Inicializa seleção de tags
   */
  function initTagSelection() {
    const tags = document.querySelectorAll('.emotion-tag');
    
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const tagValue = tag.dataset.tag;
        
        if (tag.classList.contains('selected')) {
          tag.classList.remove('selected');
          diaryState.selectedTags = diaryState.selectedTags.filter(t => t !== tagValue);
        } else {
          tag.classList.add('selected');
          diaryState.selectedTags.push(tagValue);
        }
      });
    });
  }

  /**
   * Inicializa contador de caracteres
   */
  function initTextArea() {
    if (!elements.textArea) return;

    elements.textArea.addEventListener('input', () => {
      const length = elements.textArea.value.length;
      elements.charCount.textContent = length;
      
      if (length > 500) {
        elements.textArea.value = elements.textArea.value.substring(0, 500);
        elements.charCount.textContent = 500;
      }
    });
  }

  /**
   * Inicializa o formulário
   */
  function initForm() {
    if (!elements.form) return;

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEntry();
    });
  }

  /**
   * Inicializa filtro de período
   */
  function initFilter() {
    if (!elements.filterPeriod) return;

    elements.filterPeriod.addEventListener('change', () => {
      renderEntries();
    });
  }

  /**
   * Inicializa botão de limpar tudo
   */
  function initClearAll() {
    if (!elements.clearAllBtn) return;

    elements.clearAllBtn.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja apagar todos os registros? Esta acao nao pode ser desfeita.')) {
        localStorage.removeItem('diaryEntries');
        diaryState.entries = [];
        renderEntries();
        updateSummary();
      }
    });
  }

  /**
   * Salva uma entrada no diário
   */
  function saveEntry() {
    if (!diaryState.selectedMood) {
      alert('Por favor, selecione como voce esta se sentindo.');
      return;
    }

    const entry = {
      id: Date.now(),
      mood: diaryState.selectedMood,
      moodEmoji: moodEmojis[diaryState.selectedMood],
      tags: [...diaryState.selectedTags],
      text: elements.textArea.value.trim(),
      date: new Date().toISOString()
    };

    // Adicionar ao estado
    diaryState.entries.unshift(entry);

    // Limitar a 100 entradas
    if (diaryState.entries.length > 100) {
      diaryState.entries = diaryState.entries.slice(0, 100);
    }

    // Salvar no LocalStorage
    localStorage.setItem('diaryEntries', JSON.stringify(diaryState.entries));

    // Limpar formulário
    clearForm();

    // Atualizar UI
    renderEntries();
    updateSummary();

    // Feedback
    showFeedback('Registro salvo com sucesso! 💚');
  }

  /**
   * Limpa o formulário
   */
  function clearForm() {
    // Limpar mood
    diaryState.selectedMood = null;
    document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('selected'));

    // Limpar tags
    diaryState.selectedTags = [];
    document.querySelectorAll('.emotion-tag').forEach(t => t.classList.remove('selected'));

    // Limpar texto
    elements.textArea.value = '';
    elements.charCount.textContent = '0';
  }

  /**
   * Carrega entradas do LocalStorage
   */
  function loadEntries() {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      diaryState.entries = JSON.parse(saved);
    }
    renderEntries();
    updateSummary();
  }

  /**
   * Renderiza a lista de entradas
   */
  function renderEntries() {
    const filter = elements.filterPeriod ? elements.filterPeriod.value : 'all';
    let filteredEntries = filterEntriesByPeriod(diaryState.entries, filter);

    if (filteredEntries.length === 0) {
      elements.entriesList.innerHTML = '<p class="diary-empty-full">Nenhum registro encontrado para este periodo.</p>';
      return;
    }

    const html = filteredEntries.map(entry => {
      const date = new Date(entry.date);
      const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const tagsHtml = entry.tags && entry.tags.length > 0
        ? `<div class="entry-tags">${entry.tags.map(t => `<span class="entry-tag">${t}</span>`).join('')}</div>`
        : '';

      return `
        <div class="diary-entry-full" data-id="${entry.id}">
          <div class="entry-header">
            <div class="entry-mood">
              <span class="entry-emoji">${entry.moodEmoji || moodEmojis[entry.mood] || '😐'}</span>
              <span class="entry-mood-label">${getMoodLabel(entry.mood)}</span>
            </div>
            <span class="entry-date">${formattedDate}</span>
          </div>
          ${tagsHtml}
          ${entry.text ? `<p class="entry-text">${escapeHTML(entry.text)}</p>` : ''}
          <button class="entry-delete" onclick="deleteEntry(${entry.id})" aria-label="Excluir registro">
            🗑️
          </button>
        </div>
      `;
    }).join('');

    elements.entriesList.innerHTML = html;
  }

  /**
   * Filtra entradas por período
   */
  function filterEntriesByPeriod(entries, period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (period) {
      case 'today':
        return entries.filter(e => new Date(e.date) >= today);
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return entries.filter(e => new Date(e.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return entries.filter(e => new Date(e.date) >= monthAgo);
      default:
        return entries;
    }
  }

  /**
   * Atualiza o resumo emocional
   */
  function updateSummary() {
    let positive = 0;
    let neutral = 0;
    let negative = 0;

    diaryState.entries.forEach(entry => {
      if (moodCategories.positive.includes(entry.mood)) {
        positive++;
      } else if (moodCategories.neutral.includes(entry.mood)) {
        neutral++;
      } else {
        negative++;
      }
    });

    if (elements.positiveCount) elements.positiveCount.textContent = positive;
    if (elements.neutralCount) elements.neutralCount.textContent = neutral;
    if (elements.negativeCount) elements.negativeCount.textContent = negative;
  }

  /**
   * Retorna o label do humor
   */
  function getMoodLabel(mood) {
    const labels = {
      'muito-mal': 'Muito mal',
      'mal': 'Mal',
      'neutro': 'Neutro',
      'bem': 'Bem',
      'muito-bem': 'Muito bem'
    };
    return labels[mood] || mood;
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Mostra feedback visual
   */
  function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.className = 'feedback-toast';
    feedback.textContent = message;
    document.body.appendChild(feedback);

    setTimeout(() => {
      feedback.classList.add('show');
    }, 10);

    setTimeout(() => {
      feedback.classList.remove('show');
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }

  /**
   * Deleta uma entrada (função global)
   */
  window.deleteEntry = function(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      diaryState.entries = diaryState.entries.filter(e => e.id !== id);
      localStorage.setItem('diaryEntries', JSON.stringify(diaryState.entries));
      renderEntries();
      updateSummary();
    }
  };
})();
