/**
 * 🎴 甜蜜任务卡 — 只能翻3张
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

    // 更新剩余可翻数量
    function updateRemainingHint() {
      const remain = MAX_FLIP - flipCount;
      let hint = document.getElementById('taskFlipHint');
      if (!hint) {
        hint = document.createElement('p');
        hint.id = 'taskFlipHint';
        hint.style.cssText = 'text-align:center;font-size:13px;color:var(--text-light);margin-top:12px;';
        grid.after(hint);
      }
      if (remain > 0) {
        hint.textContent = `✨ 还可以翻开 ${remain} 张任务卡`;
      } else {
        hint.textContent = '✅ 已选满3张，快去完成任务吧！';
      }
    }

    cards.forEach((card) => {
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

      // 点击卡片翻转（限制3张）
      div.addEventListener('click', (e) => {
        if (e.target.closest('.card-done-btn')) return;
        if (flipped.has(card.id)) return;
        if (completedSet.has(card.id)) return;
        if (div.classList.contains('flipped')) return;
        // 已翻满3张则阻止
        if (flipCount >= MAX_FLIP) return;
        flipped.add(card.id);
        flipCount++;
        div.classList.add('flipped');
        if (navigator.vibrate) navigator.vibrate(15);
        updateRemainingHint();
      });

      // 完成按钮
      const doneBtn = div.querySelector('.card-done-btn');
      doneBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (completedSet.has(card.id)) return;
        // 必须先翻开才能完成
        if (!flipped.has(card.id)) return;
        completedSet.add(card.id);
        div.classList.add('done');
        completedCount++;
        if (completedCount >= cards.length && celebration) {
          celebration.style.display = 'block';
          celebration.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      grid.appendChild(div);
    });

    updateRemainingHint();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskCards);
  } else {
    initTaskCards();
  }
})();
