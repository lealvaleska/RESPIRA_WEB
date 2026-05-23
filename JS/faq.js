/* =====================================================
   FAQ.JS - Accordion para FAQ
   ===================================================== */

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = item.querySelector('.faq-icon');

      if (question && answer) {
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Fechar todos os outros
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('open');
              const otherQuestion = otherItem.querySelector('.faq-question');
              if (otherQuestion) {
                otherQuestion.setAttribute('aria-expanded', 'false');
              }
            }
          });

          // Toggle o item atual
          item.classList.toggle('open');
          question.setAttribute('aria-expanded', !isOpen);
        });
      }
    });
  });
})();
