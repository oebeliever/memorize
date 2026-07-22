/**
 * 🌟 许愿星空 — 板块模块
 */
(function() {
  'use strict';

  function initStarWishes() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const wishes = CONFIG.starWishes || [];
    if (wishes.length === 0) return;

    const ctx = canvas.getContext('2d');
    const textEl = document.getElementById('starWishText');
    const swText = document.getElementById('swText');
    const swFrom = document.getElementById('swFrom');

    let W, H;
    let stars = [];
    let mouseX = -100, mouseY = -100;
    let trail = [];
    let animId;

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // 创建背景星星（大量小点）
    const bgStars = [];
    for (let i = 0; i < 150; i++) {
      bgStars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.01 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // 创建愿望星
    stars = wishes.map((w, i) => ({
      ...w,
      x: w.x * W,
      y: w.y * H,
      r: w.size === 'large' ? 8 : (w.size === 'medium' ? 5 : 3),
      alpha: 0.6 + Math.random() * 0.4,
      glowPhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
      clicked: false,
      clickAnim: 0,
    }));

    // 星座彩蛋路径
    let constellationPixels = [];

    function drawStar(cx, cy, r, color, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalAlpha = alpha || 1;

      // 光晕
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 4);
      grd.addColorStop(0, color || 'rgba(255,255,200,0.3)');
      grd.addColorStop(1, 'rgba(255,255,200,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, r * 4, 0, Math.PI * 2);
      ctx.fill();

      // 星体
      ctx.fillStyle = color || '#fff';
      ctx.shadowColor = color || '#fff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawTrail() {
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        const ratio = i / trail.length;
        const alpha = ratio * 0.8;
        const radius = 2 + ratio * 6;
        ctx.save();

        // 外层光晕
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = 'rgba(255,180,100,0.3)';
        ctx.shadowColor = 'rgba(255,200,100,0.5)';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 内层亮核
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255,220,150,0.6)';
        ctx.fillStyle = 'rgba(255,240,200,0.9)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // 背景
      const bgGrd = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.7);
      bgGrd.addColorStop(0, '#0f0a2a');
      bgGrd.addColorStop(1, '#06060f');
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, W, H);

      // 背景星星
      const time = Date.now() / 1000;
      bgStars.forEach(s => {
        const alpha = s.alpha * (0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinklePhase));
        drawStar(s.x, s.y, s.r, 'rgba(255,255,255,0.8)', alpha);
      });

      // 愿望星
      stars.forEach(s => {
        if (s.clicked) return;
        const pulse = 1 + 0.15 * Math.sin(time * s.pulseSpeed + s.glowPhase);
        const color = s.isConstellation ? '#ffd700' : '#ffe4b5';
        drawStar(s.x, s.y, s.r * pulse, color, s.alpha);
      });

      // 星轨
      drawTrail();

      // 星座彩蛋检测 - 如果在星座星附近画连接线
      const cs = stars.filter(s => s.isConstellation && !s.clicked);
      if (cs.length >= 2 && Math.random() < 0.3) {
        for (let i = 0; i < cs.length - 1; i++) {
          ctx.save();
          ctx.globalAlpha = 0.15 + 0.1 * Math.sin(time * 0.5);
          ctx.strokeStyle = 'rgba(255,215,0,0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cs[i].x, cs[i].y);
          ctx.lineTo(cs[i+1].x, cs[i+1].y);
          ctx.stroke();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(animate);
    }

    // 触摸/鼠标事件
    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      mouseX = x;
      mouseY = y;

      // 星轨
      trail.push({ x, y });
      if (trail.length > 30) trail.shift();
    }

    function handleClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.changedTouches && e.changedTouches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.changedTouches && e.changedTouches[0].clientY)) - rect.top;

      // 检测点击到了哪颗星
      let hit = null;
      stars.forEach(s => {
        if (s.clicked) return;
        const dist = Math.sqrt((x - s.x) ** 2 + (y - s.y) ** 2);
        if (dist < s.r * 6) hit = s;
      });

      if (hit) {
        hit.clicked = true;
        swText.textContent = hit.text;
        swFrom.textContent = `— ${hit.from}`;
        textEl.classList.add('star-wish-text-show');

        // 流星坠落动画
        let progress = 0;
        const startX = hit.x, startY = hit.y;

        function fall() {
          progress += 0.02;
          if (progress >= 1) return;
          const fx = startX + progress * 200;
          const fy = startY + progress * 300;
          drawStar(fx, fy, 4, 'rgba(255,255,200,0.8)', 1 - progress);
          requestAnimationFrame(fall);
        }
        fall();

        // 触觉反馈
        if (navigator.vibrate) navigator.vibrate(20);
      }
    }

    // 绑定事件
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleMove(e);
    }, { passive: false });
    canvas.addEventListener('touchend', handleClick);

    // 开始动画
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarWishes);
  } else {
    initStarWishes();
  }
})();
