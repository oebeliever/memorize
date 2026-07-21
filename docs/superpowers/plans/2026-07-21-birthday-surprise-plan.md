# 🎂 惊喜页面系统 — 生日版实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有「一周年纪念页面」基础上，升级为通用惊喜页面系统，新增生日主题（复古浪漫风）和4个互动板块，赶在7月23日前交付。

**Architecture:** 配置驱动 + 渐进式改造。现有 7 个板块保持原位，新增 4 个板块以独立文件形式加入。通过 `config.js` 中的 `sections` 配置控制启用和排序。主题系统通过 CSS 变量热切换。

**Tech Stack:** 纯前端 HTML/CSS/JS（无框架依赖），Canvas 用于粒子/星空特效，Web Audio API 用于音乐波形。

## Global Constraints

- 所有代码必须兼容微信内置浏览器（iOS + Android）
- 不支持 ES Module 语法（微信兼容性），使用传统 script 加载
- 所有交互必须支持触控（移动优先）
- 背景音乐/录音功能需要用户手势触发（微信限制）
- 页面必须单文件可导出（admin 的导出功能）
- 所有文字使用中日韩字体栈：`'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif`

---

### Task 1: Config 重构 + 主题系统

**Files:**
- Modify: `config.js` (全量更新为新结构)
- Create: `themes/birthday.js` (生日主题预设)
- Modify: `index.html` (添加 CSS 变量 + 字体 + meta 更新)
- Modify: `js/app.js` (添加主题切换函数 + 加载主题配置)

**Interfaces:**
- Consumes: 现有的 CONFIG 对象结构
- Produces: `CONFIG` 新结构 + `ThemeManager` 对象（`applyTheme(name)`, `getThemeConfig(name)`, `getCurrentTheme()`）

- [ ] **Step 1: 创建生日主题预设 themes/birthday.js**

```javascript
/**
 * 🎂 生日主题 — 复古浪漫风
 */
const BIRTHDAY_THEME = {
  name: 'birthday-vintage',
  label: '🎂 生日·复古浪漫',
  css: {
    '--primary': '#d4a574',
    '--secondary': '#e8c4a0',
    '--accent': '#c97b5d',
    '--bg': '#fdf6ee',
    '--dark': '#4a3728',
    '--light': '#fffcf7',
    '--gradient1': 'linear-gradient(135deg, #d4a574 0%, #e8c4a0 50%, #c97b5d 100%)',
    '--gradient2': 'linear-gradient(135deg, #e8c4a0 0%, #f5d6c6 100%)',
    '--gradient3': 'linear-gradient(135deg, #c97b5d 0%, #d4a574 100%)',
  },
  decorations: {
    patternBg: "url('data:image/svg+xml,...')", // 羊皮纸纹理
    fontFamily: "'ZCOOL XiaoWei','LXGW WenKai',serif",
    accentEmoji: '🎞️🕯️📜✨',
  },
  opening: {
    heart: '🎂',
    title: '🎉 生日快乐！',
    gradient: 'linear-gradient(135deg, #d4a574 0%, #c97b5d 40%, #8b5e3c 100%)',
  },
  ending: {
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #2a1a0e 50%, #3d2b1f 100%)',
  },
};
```

- [ ] **Step 2: 重构 config.js — 升级为新结构**

将 `config.js` 从现有结构升级，主要变更：
1. 添加 `occasion` 字段
2. 添加 `sections` 板块控制字段
3. `theme` 字段改为主题名称字符串
4. 添加 `couple.birthday` 字段
5. 原有一周年内容保留为默认值

```javascript
const CONFIG = {
  occasion: {
    type: 'birthday',
    title: '🎂 生日快乐！',
    subtitle: '给最特别的你',
    date: '2026-07-23',
  },
  couple: {
    name1: '朱罗纪',
    name2: '孙逊',
    nickname1: '🦕 小狗龙',
    nickname2: '💪 爸爸',
    anniversary: '2025-06-28',
    birthday: '2026-07-23',
    description: '从相遇的那天起，每一天都变得有意义 ✨',
  },
  theme: 'birthday-vintage',
  themeCustom: {},
  sections: {
    enabled: ['opening','timeCapsule','timeline','gallery','musicMemories','letter','taskCards','quiz','wishes','starWishes','ending'],
    order: ['opening','timeCapsule','timeline','gallery','musicMemories','letter','taskCards','quiz','wishes','starWishes','ending'],
  },
  // ... 保留原有字段 (timeline, gallery 等) 并占位新字段
  taskCards: [],
  musicMemories: [],
  timeCapsule: [],
  starWishes: [],
  // ... 原有字段不变
};
```

- [ ] **Step 3: 在 app.js 中添加 ThemeManager**

```javascript
// ========== 主题系统 ==========
const ThemeManager = {
  current: CONFIG.theme || 'anniversary',
  
  apply(name) {
    const root = document.documentElement;
    let themeConfig;
    
    if (name === 'birthday-vintage' && typeof BIRTHDAY_THEME !== 'undefined') {
      themeConfig = BIRTHDAY_THEME;
    } else {
      // 默认使用内置 CSS 变量（从 CONFIG.theme 映射）
      themeConfig = {
        css: {
          '--primary': CONFIG.theme.primary || '#ff6b81',
          '--secondary': CONFIG.theme.secondary || '#feca57',
          '--accent': CONFIG.theme.accent || '#ff9ff3',
          '--bg': CONFIG.theme.bg || '#fff5f7',
          '--dark': CONFIG.theme.dark || '#2d3436',
          '--light': CONFIG.theme.light || '#ffffff',
          '--gradient1': CONFIG.theme.gradient1 || 'linear-gradient(135deg, #ff6b81 0%, #ff9ff3 100%)',
          '--gradient2': CONFIG.theme.gradient2 || 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
          '--gradient3': CONFIG.theme.gradient3 || 'linear-gradient(135deg, #a29bfe 0%, #ff9ff3 100%)',
        }
      };
    }
    
    Object.entries(themeConfig.css).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    this.current = name;
  },
  
  getCurrent() {
    return this.current;
  }
};

// 初始化主题
ThemeManager.apply(CONFIG.theme);
```

- [ ] **Step 4: 更新 index.html — 添加主题相关 head 内容**

```html
<!-- 在 <title> 下方添加 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&family=LXGW+WenKai&display=swap" rel="stylesheet">
<!-- 更新 og:title 为动态（由 JS 设置） -->
<meta property="og:title" content="🎂 生日快乐！">
```

- [ ] **Step 5: 更新 index.html 的开场 section — 适配生日主题**

修改 `#section-opening` 的 HTML，使其能根据主题配置显示不同内容：
- 开场爱心 emoji 改为蛋糕 emoji（通过 JS 设置）
- 标题改为「生日快乐」
- 倒计时目标改为生日日期
- 背景渐变由主题控制（ThemeManager 已处理）

- [ ] **Step 6: 加载主题脚本**

在 `index.html` 的 script 加载顺序中：
```html
<script src="config.js"></script>
<script src="themes/birthday.js"></script>
<script src="js/app.js"></script>
```

---

### Task 2: 开场页改造 + 板块控制系统

**Files:**
- Modify: `js/app.js` (开场页逻辑适配 + 板块排序/启用系统)
- Modify: `index.html` (添加所有新板块的 HTML 容器 + 板块容器添加 data-section 属性)

**Interfaces:**
- Consumes: `CONFIG.sections` (板块启用/排序配置)
- Produces: `SectionManager` 对象 (`renderSections()`, `isEnabled(name)`, `getOrderedSections()`)

- [ ] **Step 1: 在 index.html 中为每个 section 添加 data-section 属性**

```html
<section class="section" id="section-opening" data-section="opening">
<section class="section" id="section-timeline" data-section="timeline">
<!-- 以此类推，所有板块 -->
```

- [ ] **Step 2: 创建 SectionManager**

```javascript
const SectionManager = {
  config: CONFIG.sections,
  
  isEnabled(name) {
    return this.config.enabled.includes(name);
  },
  
  getOrdered() {
    return this.config.order.filter(name => this.isEnabled(name));
  },
  
  init() {
    // 隐藏所有未启用的板块
    document.querySelectorAll('[data-section]').forEach(el => {
      const name = el.dataset.section;
      if (!this.isEnabled(name)) {
        el.style.display = 'none';
      }
    });
  }
};

// 在页面初始化时调用
SectionManager.init();
```

- [ ] **Step 3: 改造开场页逻辑**

修改 `initOpening()` 函数：
```javascript
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
  
  // 设置名字（同前）
  // 计算倒计时（改为倒计时到生日）
  // ... 原有逻辑保留
}
```

- [ ] **Step 4: 更新倒计时逻辑**

修改倒计时目标为 `couple.birthday`（如果是生日主题）或 `countdown.targetDate`：

```javascript
const countdownTarget = (CONFIG.occasion.type === 'birthday' && CONFIG.couple.birthday)
  ? CONFIG.couple.birthday
  : countdown.targetDate;
```

---

### Task 3: 甜蜜任务卡 🎴

**Files:**
- Create: `sections/task-cards.js`
- Modify: `index.html` (添加 #section-task-cards HTML)
- Modify: `config.js` (添加 taskCards 默认数据)

**Interfaces:**
- Consumes: `CONFIG.taskCards` (数组)
- Produces: 渲染后的任务卡片网格，带翻转交互

- [ ] **Step 1: 在 config.js 中添加默认任务卡数据**

```javascript
taskCards: [
  {
    id: 1, emoji: '🤗', title: '给我一个拥抱',
    desc: '现在！立刻！马上！我要一个大大的拥抱~',
    type: 'action', color: '#d4a574', isSpecial: false
  },
  {
    id: 2, emoji: '💬', title: '说出我的三个优点',
    desc: '不许想太久哦，在你心里我有哪些优点？😊',
    type: 'sweet', color: '#e8c4a0', isSpecial: false
  },
  {
    id: 3, emoji: '🌟', title: '许一个愿望',
    desc: '许一个愿望吧，我会努力帮你实现的！✨',
    type: 'wish', color: '#c97b5d', isSpecial: false
  },
  {
    id: 4, emoji: '🍰', title: '一起吃蛋糕',
    desc: '生日怎么可以没有蛋糕！下次我们一起做一个吧~🎂',
    type: 'action', color: '#d4a574', isSpecial: false
  },
  {
    id: 5, emoji: '📸', title: '拍一张合照',
    desc: '现在就用手机拍一张我们的合照吧！要笑着的哦~🤳',
    type: 'action', color: '#e8c4a0', isSpecial: false
  },
  {
    id: 6, emoji: '🎤', title: '唱一首歌给我听',
    desc: '随便唱什么都好，你唱的歌最好听了~🎶',
    type: 'challenge', color: '#c97b5d', isSpecial: false
  },
  {
    id: 7, emoji: '✍️', title: '写一句情话',
    desc: '在本子上写一句你想对我说的话，我要收藏起来！💌',
    type: 'sweet', color: '#d4a574', isSpecial: false
  },
  {
    id: 8, emoji: '☕', title: '一起喝杯东西',
    desc: '忙完这个，我们去喝杯奶茶/咖啡吧，我请客！🥤',
    type: 'action', color: '#e8c4a0', isSpecial: false
  },
  {
    id: 9, emoji: '💝', title: '生日快乐！🎉',
    desc: '找到这张隐藏卡不容易！你是我收到的最好的生日礼物❤️',
    type: 'special', color: '#c97b5d', isSpecial: true
  },
]
```

- [ ] **Step 2: 在 index.html 中添加任务卡板块 HTML**

```html
<!-- 在心愿瓶之后、结尾之前 -->
<section class="section" id="section-task-cards" data-section="taskCards" style="min-height:auto;padding:60px 20px;background:var(--bg);">
  <h2 class="section-title">🎴 甜蜜任务卡</h2>
  <p class="section-subtitle">翻开卡片，完成属于我们的小任务</p>
  <div class="task-grid" id="taskGrid">
    <!-- JS 动态渲染 -->
  </div>
  <div class="task-celebration" id="taskCelebration" style="display:none;text-align:center;margin-top:30px;">
    <div style="font-size:48px;animation:heartbeat 1.2s ease-in-out infinite;">🎉</div>
    <p style="font-size:18px;font-weight:600;color:var(--primary);margin-top:12px;">全部完成！你真是太棒了！💕</p>
  </div>
</section>
```

- [ ] **Step 3: 在 index.html 中添加任务卡 CSS**

在 `<style>` 标签中添加：
```css
/* ========== Task Cards ========== */
.task-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  max-width: 360px;
  width: 100%;
  perspective: 800px;
}
.task-card {
  aspect-ratio: 3/4;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 12px;
}
.task-card.flipped {
  transform: rotateY(180deg);
}
.task-card.done {
  transform: rotateY(180deg);
  filter: grayscale(0.6);
  opacity: 0.7;
  cursor: default;
}
.task-card-face {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.task-card-back {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  font-size: 36px;
  z-index: 2;
  border: 2px solid rgba(255,255,255,0.3);
}
.task-card-back .card-question {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
}
.task-card-front {
  background: var(--light);
  border: 2px solid var(--primary);
  transform: rotateY(180deg);
  z-index: 1;
}
.task-card-front .card-emoji {
  font-size: 32px;
  margin-bottom: 8px;
}
.task-card-front .card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 6px;
}
.task-card-front .card-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}
.task-card-front .card-done-btn {
  margin-top: 10px;
  padding: 6px 16px;
  border: none;
  border-radius: 20px;
  background: var(--primary);
  color: white;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}
.task-card-front .card-done-btn:active { transform: scale(0.95); }
.task-card-front .card-done-btn:hover { opacity: 0.9; }
@media (max-width: 380px) {
  .task-grid { gap: 10px; }
  .task-card-face { padding: 10px; }
  .task-card-front .card-emoji { font-size: 24px; }
  .task-card-front .card-title { font-size: 14px; }
}
```

- [ ] **Step 4: 创建 sections/task-cards.js**

```javascript
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
```

- [ ] **Step 5: 在 index.html 中加载脚本**

```html
<script src="sections/task-cards.js"></script>
<!-- 放在 app.js 之后 -->
```

- [ ] **Step 6: 验证**

在浏览器中打开页面，确认：
1. 任务卡板块显示 9 张卡片（3×3 网格）
2. 点击卡片 → 3D 翻转动画
3. 点击「完成」按钮 → 卡片变灰
4. 全部完成 → 庆祝动画出现

---

### Task 4: 音乐回忆簿 🎵

**Files:**
- Create: `sections/music-memories.js`
- Modify: `index.html` (添加 #section-music-memories HTML + CSS)
- Modify: `config.js` (添加 musicMemories 默认数据)

- [ ] **Step 1: 在 config.js 中添加默认音乐数据**

```javascript
musicMemories: [
  {
    id: 1,
    title: '夜曲',
    artist: '周杰伦',
    src: '',
    coverEmoji: '🎵',
    memory: '记得有次晚上你靠在我肩膀听这首歌，说好想就这样一直听下去...',
    color: '#d4a574',
  },
  {
    id: 2,
    title: '告白气球',
    artist: '周杰伦',
    src: '',
    coverEmoji: '🎈',
    memory: '这首歌就像我们的故事，从相识到相爱，每一步都充满了甜蜜的惊喜。',
    color: '#e8c4a0',
  },
  // ... 更多歌曲
]
```

- [ ] **Step 2: 在 index.html 中添加板块 HTML**

```html
<section class="section" id="section-music-memories" data-section="musicMemories" style="background:var(--bg);">
  <h2 class="section-title">🎵 音乐回忆簿</h2>
  <p class="section-subtitle">每一首歌，都是我们的故事</p>
  <div class="record-player" id="recordPlayer">
    <div class="record-disc" id="recordDisc">
      <div class="record-label" id="recordLabel">🎵</div>
    </div>
    <div class="record-arm" id="recordArm"></div>
    <div class="record-info" id="recordInfo">
      <div class="record-title" id="recordTitle">我们的歌</div>
      <div class="record-artist" id="recordArtist">歌手名</div>
    </div>
    <div class="record-controls">
      <button class="record-btn" id="recordPrev">⏮</button>
      <button class="record-btn play-btn" id="recordPlay">▶</button>
      <button class="record-btn" id="recordNext">⏭</button>
    </div>
    <div class="record-memory" id="recordMemory">
      <!-- 回忆文字 -->
    </div>
  </div>
</section>
```

- [ ] **Step 3: 添加音乐板块 CSS**

```css
/* ========== Music Memories ========== */
.record-player {
  position: relative;
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}
.record-disc {
  width: 200px; height: 200px;
  border-radius: 50%;
  background: #1a1a1a;
  position: relative;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.record-disc.playing {
  animation: spin 2s linear infinite;
}
.record-label {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 80px; height: 80px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.1);
}
.record-arm {
  position: absolute;
  top: 20px; right: 20px;
  width: 60px; height: 6px;
  background: #888;
  border-radius: 3px;
  transform-origin: right center;
  transform: rotate(-15deg);
  transition: transform 0.5s ease;
}
.record-arm.playing { transform: rotate(-5deg); }
.record-arm::before {
  content: '';
  position: absolute;
  left: -6px; top: -4px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #666;
}
.record-info {
  text-align: center;
  margin-top: 20px;
}
.record-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--dark);
}
.record-artist {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
.record-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 16px;
}
.record-btn {
  width: 44px; height: 44px;
  border-radius: 50%;
  border: none;
  background: #f0f0f0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.record-btn:active { transform: scale(0.9); }
.play-btn {
  width: 56px; height: 56px;
  background: var(--primary);
  color: white;
  font-size: 20px;
}
.record-memory {
  margin-top: 16px;
  padding: 16px;
  background: #fdf6ee;
  border-radius: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  text-align: center;
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

- [ ] **Step 4: 创建 sections/music-memories.js**

```javascript
/**
 * 🎵 音乐回忆簿 — 板块模块
 */
(function() {
  'use strict';

  function initMusicMemories() {
    const container = document.getElementById('recordPlayer');
    if (!container) return;

    const songs = CONFIG.musicMemories || [];
    if (songs.length === 0) {
      container.innerHTML = '<p style="color:#999;padding:40px;">还没有添加歌曲哦~</p>';
      return;
    }

    let currentIndex = 0;
    let isPlaying = false;
    let audio = null;

    const disc = document.getElementById('recordDisc');
    const arm = document.getElementById('recordArm');
    const label = document.getElementById('recordLabel');
    const title = document.getElementById('recordTitle');
    const artist = document.getElementById('recordArtist');
    const memory = document.getElementById('recordMemory');
    const playBtn = document.getElementById('recordPlay');
    const prevBtn = document.getElementById('recordPrev');
    const nextBtn = document.getElementById('recordNext');

    function loadSong(index) {
      const song = songs[index];
      if (!song) return;
      
      // 停止当前播放
      stopPlayback();
      
      title.textContent = song.title;
      artist.textContent = song.artist;
      memory.textContent = song.memory || '🎵';
      label.textContent = song.coverEmoji || '🎵';
      
      // 更新唱片颜色
      label.style.background = song.color || 'var(--primary)';
      
      // 如果有音乐源，创建 audio
      if (song.src) {
        audio = new Audio(song.src);
        audio.loop = false;
        audio.addEventListener('ended', () => {
          nextSong();
        });
      } else {
        audio = null;
      }
    }

    function playSong() {
      if (audio) {
        audio.play().catch(() => {});
      }
      isPlaying = true;
      disc.classList.add('playing');
      arm.classList.add('playing');
      playBtn.textContent = '⏸';
    }

    function stopPlayback() {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      isPlaying = false;
      disc.classList.remove('playing');
      arm.classList.remove('playing');
      if (playBtn) playBtn.textContent = '▶';
    }

    function togglePlay() {
      if (isPlaying) {
        stopPlayback();
      } else {
        playSong();
      }
    }

    function nextSong() {
      currentIndex = (currentIndex + 1) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) playSong();
    }

    function prevSong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length;
      loadSong(currentIndex);
      if (isPlaying) playSong();
    }

    // 事件绑定
    disc.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // 加载第一首
    loadSong(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicMemories);
  } else {
    initMusicMemories();
  }
})();
```

- [ ] **Step 5: 在 index.html 中加载脚本**

```html
<script src="sections/music-memories.js"></script>
```

- [ ] **Step 6: 验证**

1. 唱片机显示第一首歌信息
2. 点击唱片 → 旋转播放（无音乐源时视觉播放）
3. 切歌按钮正常工作

---

### Task 5: 时光胶囊 📅

**Files:**
- Create: `sections/time-capsule.js`
- Modify: `index.html` (添加 #section-time-capsule HTML + CSS)
- Modify: `config.js` (添加 timeCapsule 默认数据)

- [ ] **Step 1: 在 config.js 中添加时光胶囊数据**

```javascript
timeCapsule: [
  {
    id: 1,
    date: '2026-07-23',
    title: '🎂 生日快乐！',
    content: '亲爱的，生日快乐！今天是你来到这个世界的第...',
    emoji: '💌',
    isSpecial: true,
  },
  {
    id: 2,
    date: '2026-08-15',
    title: '夏天的约定',
    content: '还记得我们说好夏天要一起去看海吗？...',
    emoji: '🌊',
    isSpecial: false,
  },
  // ... 更多
]
```

- [ ] **Step 2: 在 index.html 中添加板块 HTML + CSS**

```html
<section class="section" id="section-time-capsule" data-section="timeCapsule" style="background:var(--bg);">
  <h2 class="section-title">📅 时光胶囊</h2>
  <p class="section-subtitle">写给未来的情书，在特别的日子开启</p>
  <div class="capsule-container" id="capsuleContainer">
    <!-- JS 动态渲染 -->
  </div>
</section>
```

```css
.capsule-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  max-width: 400px;
  width: 100%;
}
.capsule-item {
  width: 160px;
  background: var(--light);
  border-radius: var(--radius);
  padding: 20px 16px;
  text-align: center;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.capsule-item.locked {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #eee;
}
.capsule-item.unlocked {
  border-color: var(--primary);
  cursor: pointer;
}
.capsule-item.unlocked:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.capsule-item.opened {
  border-color: var(--secondary);
  background: #fdf6ee;
}
.capsule-emoji { font-size: 32px; margin-bottom: 8px; }
.capsule-date { font-size: 12px; color: #999; margin-bottom: 6px; }
.capsule-title { font-size: 14px; font-weight: 600; color: var(--dark); }
.capsule-lock { font-size: 16px; margin-top: 8px; opacity: 0.5; }

/* 时光胶囊弹窗（复用心愿瓶弹窗样式） */
.capsule-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}
.capsule-modal {
  background: var(--light);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  margin: 20px;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.capsule-modal .cm-emoji { font-size: 48px; margin-bottom: 12px; }
.capsule-modal .cm-title { font-size: 20px; font-weight: 700; color: var(--dark); margin-bottom: 12px; }
.capsule-modal .cm-content { font-size: 15px; color: #555; line-height: 2; margin-bottom: 20px; }
.capsule-modal .cm-close {
  padding: 10px 30px;
  border-radius: 25px;
  border: 2px solid var(--primary);
  background: white;
  color: var(--primary);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
```

- [ ] **Step 3: 创建 sections/time-capsule.js**

```javascript
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
```

- [ ] **Step 4: 在 index.html 中加载脚本**

```html
<script src="sections/time-capsule.js"></script>
```

- [ ] **Step 5: 验证**

1. 未到日期的胶囊显示「🔒 N天后解锁」
2. 已到日期的胶囊可点击打开
3. 弹窗显示情书内容

---

### Task 6: 许愿星空 🌟

**Files:**
- Create: `sections/star-wishes.js`
- Modify: `index.html` (添加 #section-star-wishes HTML + CSS)
- Modify: `config.js` (添加 starWishes 默认数据)

- [ ] **Step 1: 在 config.js 中添加许愿星空数据**

```javascript
starWishes: [
  { id: 1, text: '愿你每天都开心快乐 ✨', from: '爱你的', emoji: '⭐', x: 0.2, y: 0.3, size: 'medium' },
  { id: 2, text: '愿所有美好都如约而至 🌟', from: '你的专属', emoji: '🌟', x: 0.5, y: 0.2, size: 'large' },
  { id: 3, text: '愿你的笑容永远灿烂 😊', from: '守护你的', emoji: '✨', x: 0.8, y: 0.4, size: 'small' },
  { id: 4, text: '愿我们能一直走下去 💕', from: '想未来的', emoji: '⭐', x: 0.3, y: 0.6, size: 'medium' },
  { id: 5, text: '愿你被世界温柔以待 🌸', from: '永远支持你的', emoji: '🌟', x: 0.7, y: 0.7, size: 'medium' },
  { id: 6, text: '生日快乐，我最爱的人 🎂', from: '你的爱人', emoji: '💫', x: 0.5, y: 0.8, size: 'large', isConstellation: true },
]
```

- [ ] **Step 2: 在 index.html 中添加板块 HTML + CSS**

```html
<section class="section" id="section-star-wishes" data-section="starWishes" style="background:#0a0a1a;color:white;position:relative;overflow:hidden;min-height:100vh;">
  <canvas id="starCanvas" style="position:absolute;inset:0;z-index:1;"></canvas>
  <div style="position:relative;z-index:2;text-align:center;">
    <h2 class="section-title" style="color:white;background:none;-webkit-text-fill-color:white;text-shadow:0 0 20px rgba(255,255,255,0.3);">🌟 许愿星空</h2>
    <p class="section-subtitle" style="color:rgba(255,255,255,0.6);">划过星星，许下心愿 ✨</p>
    <div id="starWishText" style="margin-top:20px;font-size:18px;min-height:80px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.5s ease;">
      <div>
        <div id="swText" style="font-size:18px;line-height:1.8;"></div>
        <div id="swFrom" style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:8px;"></div>
      </div>
    </div>
    <p style="margin-top:40px;font-size:13px;color:rgba(255,255,255,0.4);">✨ 用手划过星空，点击星星许愿 ✨</p>
  </div>
</section>
```

```css
/* ========== Star Wishes ========== */
#starCanvas {
  cursor: pointer;
  touch-action: none;
}
.star-wish-text-show {
  opacity: 1 !important;
}
```

- [ ] **Step 3: 创建 sections/star-wishes.js**

```javascript
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
        const alpha = i / trail.length * 0.6;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.shadowColor = 'rgba(255,200,150,0.3)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 1 + (i / trail.length) * 2, 0, Math.PI * 2);
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
      if (trail.length > 20) trail.shift();
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
```

- [ ] **Step 4: 在 index.html 中加载脚本**

```html
<script src="sections/star-wishes.js"></script>
```

- [ ] **Step 5: 验证**

1. 星空背景动态闪烁
2. 手指划过产生星轨
3. 点击星星 → 流星坠落 → 显示祝福文字
4. 星座星之间出现连线

---

### Task 7: Admin 后台升级

**Files:**
- Modify: `admin.html` (主题选择器 + 板块管理器 + 新板块编辑面板)

- [ ] **Step 1: 添加主题选择器到顶部**

在 header 中添加：
```html
<select id="themeSelector" class="btn btn-outline btn-sm" style="background:rgba(255,255,255,0.15);color:white;border:2px solid rgba(255,255,255,0.5);padding:6px 14px;border-radius:25px;font-size:12px;font-family:inherit;cursor:pointer;">
  <option value="anniversary">💕 一周年主题</option>
  <option value="birthday-vintage">🎂 生日·复古浪漫</option>
</select>
```

- [ ] **Step 2: 实现主题切换逻辑**

```javascript
// 在 admin.html 的 script 中
function switchTheme(themeName) {
  data.theme = themeName;
  // 如果是预设主题，自动填充配色
  if (themeName === 'birthday-vintage' && typeof BIRTHDAY_THEME !== 'undefined') {
    Object.entries(BIRTHDAY_THEME.css).forEach(([key, value]) => {
      const fieldKey = key.replace('--', '');
      if (data.theme[fieldKey] !== undefined) {
        data.theme[fieldKey] = value;
      }
    });
  }
  // 刷新主题编辑面板
  const activeTab = document.querySelector('.sidebar-nav li.active');
  if (activeTab && activeTab.dataset.section === 'sec-theme') {
    // 重新加载主题编辑面板
  }
  // 更新预览
  applyAndPreview();
}
```

- [ ] **Step 3: 添加板块管理器（侧边栏复选框）**

在侧边栏每个 tab 前添加复选框，并在 data 属性中记录启用状态：
```javascript
// 渲染侧边栏时
function renderSidebar() {
  const sections = [
    { id: 'sec-basic', emoji: '💑', label: '基本信息', key: 'basic' },
    { id: 'sec-theme', emoji: '🎨', label: '主题配色', key: 'theme' },
    // ... 所有板块，包括新增的
  ];
  
  const nav = document.querySelector('.sidebar-nav');
  nav.innerHTML = '';
  
  // 先渲染场合切换
  // 然后渲染所有板块
  sections.forEach(sec => {
    const li = document.createElement('li');
    li.dataset.section = sec.id;
    li.innerHTML = `
      <input type="checkbox" class="section-toggle" data-section="${sec.id}" checked>
      <span class="emoji">${sec.emoji}</span>
      ${sec.label}
    `;
    li.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') return;
      // 切换 tab
    });
    nav.appendChild(li);
  });
}
```

- [ ] **Step 4: 添加新板块的编辑面板**

在 `getSectionHTML` 中添加新板块的编辑表单渲染：
- `sec-taskcards`: 编辑任务卡列表（添加/删除/排序）
- `sec-musicmemories`: 编辑音乐列表（歌曲名/歌手/回忆文字）
- `sec-timecapsule`: 编辑时光胶囊列表（日期/标题/内容）
- `sec-starwishes`: 编辑愿望列表（文字/署名/位置）

- [ ] **Step 5: 更新导出功能**

确保 `downloadFullHTML()` 包含所有新板块的 JS 文件。

---

### Task 8: 整体联调 + 内容定制

**Files:**
- Modify: `config.js` (填充你对象的具体生日内容)
- Modify: `index.html` (最终的样式微调)

- [ ] **Step 1: 填充真实内容**

将 config.js 中的默认示例数据替换为你和对象的真实故事：
- 填写 `couple` 字段（名字、昵称、生日）
- 填写 `timeCapsule` 中的情书内容
- 填写 `musicMemories` 中的真实歌曲
- 填写 `taskCards` 中的个性化任务
- 填写 `starWishes` 中的祝福语

- [ ] **Step 2: 联调测试**

在本地服务器中打开，完整浏览所有板块：
1. 开场页 → 生日标题 + 倒计时
2. 时光胶囊 → 7月23日可打开
3. 时间线 → 所有时刻正常显示
4. 画廊 → 照片正常轮播
5. 音乐回忆簿 → 唱片旋转 + 切歌
6. 情书 → 点击展开
7. 任务卡 → 翻转 + 完成
8. 测验 → 答题交互
9. 心愿瓶 → 点击打开
10. 许愿星空 → 星轨 + 点击许愿
11. 结尾 → 烟花 + 彩蛋

- [ ] **Step 3: 导出单文件 + 部署**

使用 admin.html 导出完整 HTML，部署到线上服务。

- [ ] **Step 4: 微信分享测试**

发送链接到微信，确认：
1. 所有动画正常运行
2. 触控交互流畅
3. 页面加载速度可接受
