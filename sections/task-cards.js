/**
 * 🎴 甜蜜任务卡 — 分2页，只能翻3张
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

    const MAX_FLIP = 3;
    const flipped = new Set();
    let flipCount = 0;
    const completedSet = new Set();
    let completedCount = 0;
    const CARDS_PER_PAGE = 5;

    let currentPage = 0;
    const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);

    function buildCard(card) {
      const div = document.createElement('div');
      div.className = 'task-card';
      if (flipped.has(card.id) || completedSet.has(card.id)) div.classList.add('flipped');
      if (completedSet.has(card.id)) div.classList.add('done');

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

      div.addEventListener('click', (e) => {
        if (e.target.closest('.card-done-btn')) return;
        if (flipped.has(card.id) || completedSet.has(card.id)) return;
        if (div.classList.contains('flipped')) return;
        if (flipCount >= MAX_FLIP) return;
        flipped.add(card.id);
        flipCount++;
        div.classList.add('flipped');
        if (navigator.vibrate) navigator.vibrate(15);
        updateHint();
      });

      div.querySelector('.card-done-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (completedSet.has(card.id) || !flipped.has(card.id)) return;
        completedSet.add(card.id);
        div.classList.add('done');
        completedCount++;
        if (completedCount >= cards.length && celebration) {
          celebration.style.display = 'block';
          celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      return div;
    }

    function renderPage(page) {
      currentPage = page;
      grid.innerHTML = '';
      const start = page * CARDS_PER_PAGE;
      const end = Math.min(start + CARDS_PER_PAGE, cards.length);
      for (let i = start; i < end; i++) {
        grid.appendChild(buildCard(cards[i]));
      }
      updatePagination();
      updateHint();
    }

    function updateHint() {
      const remain = MAX_FLIP - flipCount;
      let el = document.getElementById('taskFlipHint');
      if (!el) {
        el = document.createElement('p');
        el.id = 'taskFlipHint';
        el.style.cssText = 'text-align:center;font-size:13px;color:var(--text-light);margin:12px 0 0;';
        grid.after(el);
      }
      el.textContent = remain > 0 ? '✨ 还可以翻开 ' + remain + ' 张' : '✅ 已选满3张，快去完成任务吧！';
    }

    // 左右滑动切换页面
    let touchStartX = 0;
    grid.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    grid.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage < totalPages - 1) renderPage(currentPage + 1);
        else if (diff < 0 && currentPage > 0) renderPage(currentPage - 1);
      }
    }, { passive: true });

    function updatePagination() {
      if (totalPages <= 1) return;
      let el = document.getElementById('taskPageInfo');
      if (!el) {
        el = document.createElement('p');
        el.id = 'taskPageInfo';
        el.style.cssText = 'text-align:center;font-size:13px;color:var(--text-light);margin:12px 0 0;letter-spacing:2px;';
        updateHint(); // hint already inserted after grid
        const hint = document.getElementById('taskFlipHint');
        if (hint) hint.after(el);
        else grid.after(el);
      }
      el.textContent = '👈 ' + (currentPage + 1) + '/' + totalPages + ' 👉';
    }

    renderPage(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskCards);
  } else {
    initTaskCards();
  }
})();
