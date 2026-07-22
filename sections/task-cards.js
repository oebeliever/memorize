/**
 * 🎴 甜蜜任务卡 — 板块模块（每页3张）
 */
(function() {
  'use strict';

  function initTaskCards() {
    const grid = document.getElementById('taskGrid');
    const celebration = document.getElementById('taskCelebration');
    if (!grid) return;

    const cards = CONFIG.taskCards || [];
    if (cards.length === 0) {
      grid.innerHTML = '<p style="color:#999;">还没有任务卡哦~</p>';
      return;
    }

    const CARDS_PER_PAGE = 3;
    let currentPage = 0;
    const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
    const completed = new Set();
    let completedCount = 0;

    // 创建分页控件
    const bar = document.createElement('div');
    bar.className = 'pagination-bar';
    bar.style.marginTop = '16px';

    function renderPage(page) {
      currentPage = page;
      grid.innerHTML = '';

      const start = page * CARDS_PER_PAGE;
      const end = Math.min(start + CARDS_PER_PAGE, cards.length);

      for (let i = start; i < end; i++) {
        const card = cards[i];
        const div = document.createElement('div');
        div.className = 'task-card' + (completed.has(card.id) ? ' done' : '');

        div.innerHTML = `
          <div class="task-card-face task-card-back">
            <span>${card.isSpecial ? '🎁' : '❓'}</span>
            <span class="card-question">点击翻开</span>
          </div>
          <div class="task-card-face task-card-front">
            <div class="card-emoji">${card.emoji}</div>
            <div class="card-title">${card.title}</div>
            <div class="card-desc">${card.desc}</div>
            <button class="card-done-btn" data-card-id="${card.id}">✅ 完成！</button>
          </div>
        `;

        if (completed.has(card.id)) {
          div.classList.add('flipped');
        }

        div.addEventListener('click', (e) => {
          if (e.target.closest('.card-done-btn')) return;
          if (completed.has(card.id)) return;
          if (div.classList.contains('flipped')) return;
          div.classList.add('flipped');
          if (navigator.vibrate) navigator.vibrate(15);
        });

        const doneBtn = div.querySelector('.card-done-btn');
        doneBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (completed.has(card.id)) return;
          completed.add(card.id);
          div.classList.add('done', 'flipped');
          completedCount++;
          if (completedCount >= cards.length && celebration) {
            celebration.style.display = 'block';
            celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });

        grid.appendChild(div);
      }

      updatePaginationUI();
    }

    function updatePaginationUI() {
      if (totalPages <= 1) { bar.innerHTML = ''; return; }
      bar.innerHTML = `
        <button class="pagination-btn" id="tcPrev">‹ 上一页</button>
        <div class="pagination-dots" id="tcDots"></div>
        <span class="pagination-info">${currentPage+1}/${totalPages}</span>
        <button class="pagination-btn" id="tcNext">下一页 ›</button>
      `;

      const dotsContainer = bar.querySelector('#tcDots');
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = 'pagination-dot' + (i === currentPage ? ' active' : '');
        dot.addEventListener('click', () => renderPage(i));
        dotsContainer.appendChild(dot);
      }

      bar.querySelector('#tcPrev').addEventListener('click', () => {
        if (currentPage > 0) renderPage(currentPage - 1);
      });
      bar.querySelector('#tcNext').addEventListener('click', () => {
        if (currentPage < totalPages - 1) renderPage(currentPage + 1);
      });
      bar.querySelector('#tcPrev').disabled = currentPage <= 0;
      bar.querySelector('#tcNext').disabled = currentPage >= totalPages - 1;
    }

    // 插入分页栏到 grid 后面
    grid.after(bar);
    renderPage(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskCards);
  } else {
    initTaskCards();
  }
})();
