/**
 * 🎴 甜蜜任务卡 — 板块模块
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

    grid.innerHTML = '';
    let completedCount = 0;
    const completed = new Set();

    cards.forEach((card, index) => {
      const div = document.createElement('div');
      div.className = 'task-card';
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

      // 点击卡片翻转
      div.addEventListener('click', (e) => {
        if (e.target.closest('.card-done-btn')) return;
        if (completed.has(card.id)) return;
        if (div.classList.contains('flipped')) return;
        div.classList.add('flipped');
        // 触觉反馈
        if (navigator.vibrate) navigator.vibrate(15);
      });

      // 完成按钮
      const doneBtn = div.querySelector('.card-done-btn');
      doneBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (completed.has(card.id)) return;
        completed.add(card.id);
        div.classList.add('done');
        completedCount++;
        // 检查是否全部完成
        if (completedCount >= cards.length && celebration) {
          celebration.style.display = 'block';
          celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      grid.appendChild(div);
    });
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskCards);
  } else {
    initTaskCards();
  }
})();
