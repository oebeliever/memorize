/**
 * 📅 时光胶囊 — 板块模块
 */
(function() {
  'use strict';

  function initTimeCapsule() {
    const container = document.getElementById('capsuleContainer');
    if (!container) return;

    const capsules = CONFIG.timeCapsule || [];
    if (capsules.length === 0) {
      container.innerHTML = '<p style="color:#999;padding:20px;">还没有时光胶囊哦~</p>';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const openedSet = new Set();

    capsules.forEach((cap, index) => {
      const targetDate = new Date(cap.date);
      targetDate.setHours(0, 0, 0, 0);
      const isUnlocked = targetDate <= today;
      const isOpened = openedSet.has(cap.id);

      const div = document.createElement('div');
      div.className = `capsule-item ${isUnlocked ? 'unlocked' : 'locked'} ${isOpened ? 'opened' : ''}`;
      div.innerHTML = `
        <div class="capsule-emoji">${isOpened ? '💌' : (isUnlocked ? '📩' : '📬')}</div>
        <div class="capsule-date">${cap.date}</div>
        <div class="capsule-title">${isOpened ? cap.title : (isUnlocked ? cap.title : '🔒 等待开启')}</div>
        ${!isUnlocked ? `<div class="capsule-lock">🔒 ${Math.ceil((targetDate - today) / (1000*60*60*24))}天后解锁</div>` : ''}
      `;

      if (isUnlocked && !isOpened) {
        div.addEventListener('click', () => openCapsule(cap, div));
      }

      container.appendChild(div);
    });

    function openCapsule(cap, element) {
      // 创建弹窗
      const overlay = document.createElement('div');
      overlay.className = 'capsule-modal-overlay';
      overlay.innerHTML = `
        <div class="capsule-modal">
          <div class="cm-emoji">${cap.emoji || '💌'}</div>
          <div class="cm-title">${cap.title}</div>
          <div class="cm-content">${cap.content}</div>
          <button class="cm-close">收下这份心意 💗</button>
        </div>
      `;

      overlay.querySelector('.cm-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
      });

      document.body.appendChild(overlay);
      if (element) {
        openedSet.add(cap.id);
        element.classList.add('opened');
        element.querySelector('.capsule-emoji').textContent = '💌';
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimeCapsule);
  } else {
    initTimeCapsule();
  }
})();
