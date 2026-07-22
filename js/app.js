/**
 * ============================================
 *  💕 纪念日/生日 — 主程序
 * ============================================
 */

// ========== 主题系统 ==========
const ThemeManager = {
  current: CONFIG.theme || 'anniversary',

  /** 获取指定主题的完整配置对象 */
  getThemeConfig(name) {
    if (name === 'birthday-vintage' && typeof BIRTHDAY_THEME !== 'undefined') {
      return BIRTHDAY_THEME;
    }
    // 自定义主题或后备：从 themeCustom 读取自定义 CSS
    const custom = CONFIG.themeCustom || {};
    return {
      css: {
        '--primary': custom.primary || '#ff6b81',
        '--secondary': custom.secondary || '#feca57',
        '--accent': custom.accent || '#ff9ff3',
        '--bg': custom.bg || '#fff5f7',
        '--dark': custom.dark || '#2d3436',
        '--light': custom.light || '#ffffff',
        '--gradient1': custom.gradient1 || 'linear-gradient(135deg, #ff6b81 0%, #ff9ff3 100%)',
        '--gradient2': custom.gradient2 || 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
        '--gradient3': custom.gradient3 || 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
      }
    };
  },

  apply(name) {
    const root = document.documentElement;
    const themeConfig = this.getThemeConfig(name);

    Object.entries(themeConfig.css).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    this.current = name;
  },

  getCurrent() {
    return this.current;
  },

  // 兼容别名
  applyTheme: function(name) { return this.apply(name); },
  getCurrentTheme: function() { return this.getCurrent(); }
};

// 初始化主题
ThemeManager.apply(CONFIG.theme);

// ========== 板块控制系统 ==========
const SectionManager = {
  config: CONFIG.sections,

  isEnabled(name) {
    return this.config.enabled.includes(name);
  },

  getOrdered() {
    return this.config.order.filter(name => this.isEnabled(name));
  },

  init() {
    document.querySelectorAll('[data-section]').forEach(el => {
      const name = el.dataset.section;
      if (!this.isEnabled(name)) {
        el.style.display = 'none';
      }
    });
  }
};

// ========== 页面翻页控制器 ==========
const PageController = {
  current: 0,
  sections: [],

  init() {
    // 只包含启用的板块
    this.sections = Array.from(document.querySelectorAll('[data-section]'))
      .filter(el => el.style.display !== 'none');

    if (this.sections.length === 0) return;

    // 生成导航点
    this.renderDots();

    // 点击空白区域翻页
    document.addEventListener('click', (e) => {
      const target = e.target;
      // 不拦截交互元素
      if (target.closest('button, a, input, textarea, select, .music-toggle, .task-card, .wish-bottle, .capsule-item, .quiz-option, .nav-dot, .nav-arrow, .wish-modal-overlay, .capsule-modal-overlay, .card-done-btn')) return;
      if (target.tagName === 'CANVAS') return;
      this.next();
    });

    // 触控滑动
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 40) {
        if (diff > 0) this.next();
        else this.prev();
      }
    }, { passive: true });

    // 键盘
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); this.next(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); this.prev(); }
    });

    // 滚轮翻页（防抖）
    let wheelTimeout = null;
    document.addEventListener('wheel', (e) => {
      if (wheelTimeout) return;
      wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 800);
      if (e.deltaY > 0) this.next();
      else if (e.deltaY < 0) this.prev();
    }, { passive: true });

    // 监听滚动更新导航点
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = this.sections.indexOf(entry.target);
          if (idx >= 0) this.current = idx;
          this.updateDots();
        }
      });
    }, { threshold: 0.5 });

    this.sections.forEach(s => observer.observe(s));

    this.updateDots();
  },

  goTo(index) {
    if (index < 0 || index >= this.sections.length) return;
    this.current = index;
    this.sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.updateDots();

    // 显示/隐藏底部箭头
    const arrow = document.getElementById('navArrow');
    if (arrow) {
      arrow.style.display = index >= this.sections.length - 1 ? 'none' : 'flex';
    }
  },

  next() {
    if (this.current < this.sections.length - 1) {
      this.goTo(this.current + 1);
    }
  },

  prev() {
    if (this.current > 0) {
      this.goTo(this.current - 1);
    }
  },

  renderDots() {
    const container = document.getElementById('navDots');
    if (!container) return;
    container.innerHTML = '';
    this.sections.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.goTo(i);
      });
      container.appendChild(dot);
    });
  },

  updateDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === this.current);
    });
  }
};

// 暴露给全局（HTML 按钮可用）
window.PageController = PageController;

(function () {
  'use strict';

  // ========== 工具函数 ==========
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // 检测微信浏览器
  const isWeChat = /micromessenger/i.test(navigator.userAgent);

  // ========== 内部分页工具（每个实例独立ID）==========
  let paginatorCounter = 0;
  function createPagination(container, items, itemsPerPage, renderItem) {
    let currentPage = 0;
    const id = ++paginatorCounter;
    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    if (totalPages <= 1) {
      items.forEach((item, i) => renderItem(item, i));
      return { next() {}, prev() {}, goTo() {}, currentPage: () => 0, totalPages: () => 1 };
    }

    const bar = document.createElement('div');
    bar.className = 'pagination-bar';
    bar.innerHTML = `
      <button class="pagination-btn" data-page="prev-${id}">‹ 上一页</button>
      <div class="pagination-dots" data-page="dots-${id}"></div>
      <span class="pagination-info" data-page="info-${id}">1/${totalPages}</span>
      <button class="pagination-btn" data-page="next-${id}">下一页 ›</button>
    `;
    container.after(bar);

    const dotsContainer = bar.querySelector('[data-page="dots-' + id + '"]');
    const infoEl = bar.querySelector('[data-page="info-' + id + '"]');
    const prevBtn = bar.querySelector('[data-page="prev-' + id + '"]');
    const nextBtn = bar.querySelector('[data-page="next-' + id + '"]');

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = 'pagination-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    function renderPage(page) {
      currentPage = page;
      container.innerHTML = '';
      const start = page * itemsPerPage;
      const end = Math.min(start + itemsPerPage, items.length);
      for (let i = start; i < end; i++) {
        renderItem(items[i], i);
      }
      dotsContainer.querySelectorAll('.pagination-dot').forEach((d, j) => {
        d.classList.toggle('active', j === page);
      });
      infoEl.textContent = (page + 1) + '/' + totalPages;
      prevBtn.disabled = page <= 0;
      nextBtn.disabled = page >= totalPages - 1;
    }

    function goTo(p) { if (p >= 0 && p < totalPages) renderPage(p); }
    function next() { goTo(currentPage + 1); }
    function prev() { goTo(currentPage - 1); }

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    renderPage(0);
    return { next, prev, goTo, currentPage: () => currentPage, totalPages: () => totalPages };
  }

  // ========== 粒子系统 ==========
  function initParticles() {
    const canvas = $('#particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const emojis = ['💕', '💗', '💖', '🩷', '✨', '🌸', '💝', '🦋', '🌟', '💫'];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        size: 12 + Math.random() * 18,
        speedY: 0.4 + Math.random() * 1.2,
        speedX: (Math.random() - 0.5) * 0.6,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayAmp: 0.3 + Math.random() * 0.8,
        opacity: 0.4 + Math.random() * 0.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
      };
    }

    // 初始粒子
    for (let i = 0; i < 25; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 补充粒子
      if (particles.length < 35 && Math.random() < 0.3) {
        particles.push(createParticle());
      }

      particles = particles.filter(p => {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.x += p.speedX + Math.sin(p.sway) * p.swayAmp;
        p.rotation += p.rotSpeed;

        // 超出画面则重置到顶部
        if (p.y > canvas.height + 40) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -40) p.x = canvas.width + 40;
        if (p.x > canvas.width + 40) p.x = -40;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
        ctx.restore();

        return true;
      });

      animId = requestAnimationFrame(animate);
    }
    animate();
  }
  initParticles();

  // ========== 音乐控制 ==========
  function initMusic() {
    const btn = $('#musicToggle');
    let audio = null;
    let playing = false;

    if (CONFIG.music.src) {
      audio = new Audio(CONFIG.music.src);
      audio.loop = true;
      audio.volume = 0.5;
    }

    btn.textContent = CONFIG.music.title || '🎵';

    btn.addEventListener('click', () => {
      if (!audio) {
        // 模拟振动反馈（在支持的设备上）
        if (navigator.vibrate) navigator.vibrate(10);
        btn.textContent = '🎵';
        return;
      }

      if (playing) {
        audio.pause();
        btn.classList.remove('playing');
        btn.textContent = '🎵';
      } else {
        // WeChat 中需要用户手势才能播放
        audio.play().then(() => {
          btn.classList.add('playing');
          btn.textContent = '🎶';
        }).catch(() => {
          btn.textContent = '🔇';
        });
      }
      playing = !playing;
    });
  }
  initMusic();

  // ========== Section 1: 开场 ==========
  function initOpening() {
    const { couple, countdown, occasion } = CONFIG;

    // 从 occasion 获取标题
    const titleEl = document.querySelector('.opening-title');
    if (titleEl && occasion) {
      titleEl.textContent = occasion.title;
    }

    // 心形 emoji 根据主题调整
    const heartEl = document.querySelector('.opening-heart');
    if (heartEl) {
      if (CONFIG.theme === 'birthday-vintage') {
        heartEl.textContent = '🎂';
      } else {
        heartEl.textContent = '💗';
      }
    }

    // 设置名字
    $('#openingNames').textContent = `${couple.nickname1 || couple.name1} & ${couple.nickname2 || couple.name2}`;
    $('#openingDesc').textContent = couple.description;

    // 计算在一起的天数
    const anniversary = new Date(couple.anniversary);
    const now = new Date();
    const diffDays = Math.floor((now - anniversary) / (1000 * 60 * 60 * 24));
    const daysEl = $('#daysCount');
    if (daysEl) {
      // 数字递增动画
      animateNumber(daysEl, 0, Math.max(0, diffDays), 1500);
    }

    // 倒计时
    $('#countdownTitle').textContent = countdown.title;
    const countdownTarget = (occasion.type === 'birthday' && couple.birthday)
      ? couple.birthday
      : countdown.targetDate;

    function updateCountdown() {
      const target = new Date(countdownTarget);
      const now = new Date();
      let diff = target - now;

      if (diff <= 0) {
        // 已经过了目标日期
        $('#cd-days').textContent = '🎉';
        $('#cd-hours').textContent = '🎉';
        $('#cd-minutes').textContent = '🎉';
        $('#cd-seconds').textContent = '🎉';
        $('#countdownTitle').textContent = '今天就是纪念日！';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * 1000 * 60 * 60 * 24;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * 1000 * 60 * 60;
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * 1000 * 60;
      const seconds = Math.floor(diff / 1000);

      $('#cd-days').textContent = String(days).padStart(2, '0');
      $('#cd-hours').textContent = String(hours).padStart(2, '0');
      $('#cd-minutes').textContent = String(minutes).padStart(2, '0');
      $('#cd-seconds').textContent = String(seconds).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 数字递增动画
  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  initOpening();

  // ========== Section 2: 时间线（分页）==========
  function initTimeline() {
    const wrapper = $('#timelineWrapper');
    const timeline = CONFIG.timeline;

    const ITEMS_PER_PAGE = 3;

    function renderOne(item, i) {
      const div = document.createElement('div');
      div.className = 'timeline-item visible'; // 直接可见（分页不需要滚动动画）
      div.innerHTML = `
        <div class="timeline-dot">${item.emoji || '💕'}</div>
        <div class="timeline-card">
          <div class="t-date">${item.date}</div>
          <div class="t-title">${item.title}</div>
          <div class="t-desc">${item.desc}</div>
        </div>
      `;
      wrapper.appendChild(div);
    }

    createPagination(wrapper, timeline, ITEMS_PER_PAGE, renderOne);
  }
  initTimeline();

  // ========== Section 3: 照片画廊 ==========
  function initGallery() {
    const track = $('#galleryTrack');
    const dotsContainer = $('#galleryDots');
    const prevBtn = $('#galleryPrev');
    const nextBtn = $('#galleryNext');
    const gallery = CONFIG.gallery;

    let currentIndex = 0;
    let startX = 0;
    let deltaX = 0;
    let isDragging = false;

    // 渲染幻灯片
    gallery.forEach((item, i) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';

      const imgHtml = item.src
        ? `<img src="${item.src}" alt="${item.caption}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-img\\'>📷</div>'">`
        : `<div class="placeholder-img">📷</div>`;

      slide.innerHTML = `
        <div class="gallery-frame">${imgHtml}</div>
        <div class="gallery-caption">${item.caption}</div>
        <div class="gallery-desc">${item.desc}</div>
      `;
      track.appendChild(slide);

      // 小圆点
      const dot = document.createElement('div');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function updateDots() {
      $$('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      if (index < 0) index = gallery.length - 1;
      if (index >= gallery.length) index = 0;
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // 触摸滑动
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      deltaX = e.touches[0].clientX - startX;
      const offset = -currentIndex * 100 + (deltaX / track.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      if (deltaX < -50) goTo(currentIndex + 1);
      else if (deltaX > 50) goTo(currentIndex - 1);
      else goTo(currentIndex); // 回弹
      deltaX = 0;
    });

    // 鼠标拖动（PC调试用）
    track.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startX = e.clientX;
      isDragging = true;
      track.style.transition = 'none';
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      deltaX = e.clientX - startX;
      const offset = -currentIndex * 100 + (deltaX / track.offsetWidth) * 100;
      track.style.transform = `translateX(${offset}%)`;
    });
    track.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      if (Math.abs(deltaX) > 60) {
        deltaX > 0 ? goTo(currentIndex - 1) : goTo(currentIndex + 1);
      } else {
        goTo(currentIndex);
      }
      deltaX = 0;
    });
    track.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        goTo(currentIndex);
        deltaX = 0;
      }
    });
  }
  initGallery();

  // ========== Section 4: 情书 ==========
  function initLoveLetter() {
    const envelope = $('#envelope');
    const letterContent = $('#letterContent');
    const letter = CONFIG.loveLetter;

    // 渲染信件内容
    const paragraphsHtml = letter.paragraphs.map(p => `<p>${p}</p>`).join('\n');
    letterContent.innerHTML = `
      <div class="letter-greeting">${letter.greeting}</div>
      <div class="letter-body">${paragraphsHtml}</div>
      <div class="letter-closing">
        ${letter.closing}<br>
        <span class="name">${letter.signature}</span>
      </div>
      <div class="letter-date">${letter.date}</div>
    `;

    let isOpened = false;

    envelope.addEventListener('click', () => {
      isOpened = !isOpened;
      envelope.classList.toggle('opened', isOpened);

      if (isOpened) {
        // 滚动到信件内容
        setTimeout(() => {
          letterContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      }
    });

    // 初始提示文字
    const frontText = $('.envelope-front p:first-child', envelope);
    if (frontText) {
      frontText.textContent = `📨 ${letter.title}`;
    }
  }
  initLoveLetter();

  // ========== Section 5: 心有灵犀测验 ==========
  function initQuiz() {
    const container = $('#quizContainer');
    const quiz = CONFIG.quiz;

    let currentQ = 0;
    let score = 0;
    let answered = false;

    function renderProgress() {
      const dots = [];
      for (let i = 0; i < quiz.questions.length; i++) {
        let cls = 'quiz-progress-dot';
        if (i < currentQ) cls += ' done';
        if (i === currentQ) cls += ' current';
        dots.push(`<div class="${cls}"></div>`);
      }
      return `<div class="quiz-progress">${dots.join('')}</div>`;
    }

    function renderQuestion(index) {
      answered = false;
      const q = quiz.questions[index];
      const letters = ['A', 'B', 'C', 'D'];
      const optionsHtml = q.options
        .map(
          (opt, i) =>
            `<button class="quiz-option" data-index="${i}">
              <span class="opt-letter">${letters[i]}</span>${opt}
            </button>`
        )
        .join('');

      container.innerHTML = `
        ${renderProgress()}
        <div class="quiz-card">
          <div class="quiz-question-num">第 ${index + 1}/${quiz.questions.length} 题</div>
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">${optionsHtml}</div>
        </div>
      `;

      // 绑定选项点击
      $$('.quiz-option', container).forEach(btn => {
        btn.addEventListener('click', () => handleAnswer(parseInt(btn.dataset.index)));
      });
    }

    function handleAnswer(selected) {
      if (answered) return;
      answered = true;

      const q = quiz.questions[currentQ];
      const correct = q.answer;
      const buttons = $$('.quiz-option', container);

      if (selected === correct) {
        score++;
        buttons[selected].classList.add('correct');
      } else {
        buttons[selected].classList.add('wrong');
        buttons[correct].classList.add('correct');
      }

      // 禁用所有按钮
      buttons.forEach(b => (b.disabled = true));

      // 自动跳转下一题
      setTimeout(() => {
        currentQ++;
        if (currentQ < quiz.questions.length) {
          renderQuestion(currentQ);
        } else {
          showResult();
        }
      }, 1200);
    }

    function showResult() {
      const result = quiz.results.find(r => score >= r.min && score <= r.max) || quiz.results[quiz.results.length - 1];

      container.innerHTML = `
        ${renderProgress().replace(/current/g, 'done')}
        <div class="quiz-result">
          <span class="result-emoji">${result.emoji}</span>
          <div class="result-score">${score} / ${quiz.questions.length} 分</div>
          <div class="result-text">${result.text}</div>
          <button class="quiz-restart" id="quizRestart">🔄 再来一次</button>
        </div>
      `;

      $('#quizRestart', container).addEventListener('click', () => {
        currentQ = 0;
        score = 0;
        renderQuestion(0);
      });
    }

    renderQuestion(0);
  }
  initQuiz();

  // ========== Section 6: 心愿瓶（分页）==========
  function initWishes() {
    const sea = $('#wishesSea');
    const wishes = CONFIG.wishes;
    const modalEl = document.createElement('div');
    modalEl.id = 'wishModal';
    document.body.appendChild(modalEl);

    function openWish(wish) {
      modalEl.style.display = 'block';
      modalEl.innerHTML = `
        <div class="wish-modal-overlay" id="wishOverlay">
          <div class="wish-modal">
            <div class="wish-emoji">💝</div>
            <div class="wish-text">${wish.text}</div>
            <div class="wish-from">— ${wish.from}</div>
            <button class="wish-close" id="wishClose">收下这份心意 💗</button>
          </div>
        </div>
      `;
      $('#wishOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'wishOverlay') closeWish();
      });
      $('#wishClose').addEventListener('click', closeWish);
    }

    function closeWish() {
      modalEl.style.display = 'none';
      modalEl.innerHTML = '';
    }

    const bottleEmojis = ['💝', '💌', '💗', '💖', '🩷', '💕', '✨', '🌟'];
    const BOTTLES_PER_PAGE = 4;

    function renderOne(wish, i) {
      const bottle = document.createElement('div');
      bottle.className = 'wish-bottle';
      bottle.style.background = wish.color || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#ff6b81';
      bottle.textContent = bottleEmojis[i % bottleEmojis.length];
      bottle.style.animationDelay = `${(i % BOTTLES_PER_PAGE) * 0.1}s`;
      bottle.addEventListener('click', () => openWish(wish));
      sea.appendChild(bottle);
    }

    createPagination(sea, wishes, BOTTLES_PER_PAGE, renderOne);
  }
  initWishes();

  // ========== Section 7: 结尾 ==========
  function initEnding() {
    const ending = CONFIG.ending;

    $('#endingTitle').textContent = ending.title;
    $('#endingMessage').textContent = ending.message;
    $('#endingSignature').textContent = ending.signatureLine;
    $('#endingDate').textContent = ending.date;

    // 彩蛋
    const easterEgg = $('#easterEgg');
    let revealed = false;
    easterEgg.addEventListener('click', () => {
      if (!revealed) {
        revealed = true;
        easterEgg.textContent = ending.easterEgg;
        easterEgg.classList.add('revealed');
      }
    });

    // 烟花效果
    const section = $('#section-ending');

    function createFirework() {
      const colors = ending.fireworkColors || ['#ff6b81', '#feca57', '#ff9ff3'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const el = document.createElement('div');
      el.className = 'firework';
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 70 + '%';
      el.style.width = '8px';
      el.style.height = '8px';
      el.style.borderRadius = '50%';
      el.style.background = color;
      el.style.boxShadow = `0 0 12px ${color}, 0 0 24px ${color}`;

      section.appendChild(el);

      // 粒子爆炸
      const particles = 8;
      for (let i = 0; i < particles; i++) {
        const p = document.createElement('div');
        const angle = (i / particles) * Math.PI * 2;
        const distance = 30 + Math.random() * 60;

        p.style.cssText = `
          position: absolute;
          left: ${el.style.left};
          top: ${el.style.top};
          width: 4px; height: 4px;
          border-radius: 50%;
          background: ${color};
          pointer-events: none;
          animation: fireworkBurst ${0.8 + Math.random() * 1}s ease-out forwards;
          --tx: ${Math.cos(angle) * distance}px;
          --ty: ${Math.sin(angle) * distance}px;
        `;

        // 用 CSS 自定义属性做不了动画，改用 JS
        const burst = p.animate(
          [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 },
          ],
          { duration: 800 + Math.random() * 1000, easing: 'ease-out', fill: 'forwards' }
        );

        section.appendChild(p);
        burst.onfinish = () => p.remove();
      }

      // 移除主火球
      const mainAnim = el.animate(
        [
          { transform: 'scale(0)', opacity: 1 },
          { transform: 'scale(3)', opacity: 0 },
        ],
        { duration: 400, easing: 'ease-out', fill: 'forwards' }
      );
      mainAnim.onfinish = () => el.remove();
    }

    // 周期性放烟花
    if (ending.fireworkColors && ending.fireworkColors.length > 0) {
      setInterval(() => {
        if (Math.random() < 0.5) createFirework();
      }, 800);

      // 初始放几个
      for (let i = 0; i < 5; i++) {
        setTimeout(() => createFirework(), i * 300);
      }
    }
  }
  initEnding();

  // ========== 全局滚动效果 ==========
  // 平滑的 section 快速定位
  let touchStartY = 0;

  document.addEventListener(
    'touchstart',
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  // ========== 板块启用控制 ==========
  SectionManager.init();

  // ========== 翻页控制器 ==========
  // 延迟初始化确保所有板块都已渲染
  setTimeout(() => PageController.init(), 100);

  // ========== 启动完成 ==========
  console.log('🎨 惊喜页面已就绪！');
  console.log('💝 在一起的第 ' + Math.floor((new Date() - new Date(CONFIG.couple.anniversary)) / (1000 * 60 * 60 * 24)) + ' 天');
  console.log('✨ 祝' + CONFIG.couple.name1 + '和' + CONFIG.couple.name2 + '永远幸福快乐！');

})();
