# 🎂 惊喜页面生成系统 — 设计方案

## 概述

将现有的一周年纪念惊喜页面升级为通用的「惊喜页面生成系统」，支持多主题一键切换、板块插件化自由组合、可视化后台管理。首发版本为**生日主题（复古浪漫风）**，目标日期：2026年7月23日。

## 架构设计

### 目录结构

```
one_year/
├── index.html              # 主页面（配置驱动渲染）
├── admin.html              # 惊喜工坊（升级后的制作工具）
├── config.js               # 主配置文件
├── themes/                 # 主题预设库
│   ├── anniversary.js      # 一周年主题
│   └── birthday.js         # 生日主题（复古浪漫风）
├── sections/               # 独立板块模块
│   ├── opening.js          # 开场页
│   ├── timeline.js         # 时间线
│   ├── gallery.js          # 照片画廊
│   ├── letter.js           # 情书
│   ├── quiz.js             # 测验
│   ├── wishes.js           # 心愿瓶
│   ├── ending.js           # 结尾惊喜（烟花）
│   ├── task-cards.js       # 甜蜜任务卡 🆕
│   ├── music-memories.js   # 音乐回忆簿 🆕
│   ├── time-capsule.js     # 时光胶囊 🆕
│   └── star-wishes.js      # 许愿星空 🆕
└── assets/
    ├── photos/
    └── music/
```

### 核心设计原则

1. **配置驱动** - 所有内容、主题、板块配置统一由 `config.js` 管理
2. **板块独立** - 每个 section 是独立模块，可单独启用/禁用/排序
3. **主题系统** - 通过 CSS 变量 + 预设主题配置一键切换
4. **渐进增强** - 在现有代码基础上增量改造，不重写

## 主题系统

### 主题预设：生日·复古浪漫

```css
:root {
  --primary:     #d4a574;  /* 暖金棕 */
  --secondary:   #e8c4a0;  /* 奶油杏仁 */
  --accent:      #c97b5d;  /* 陶土红 */
  --bg:          #fdf6ee;  /* 旧纸米色 */
  --dark:        #4a3728;  /* 深棕 */
  --light:       #fffcf7;  /* 暖白 */
  --gradient1:   linear-gradient(135deg, #d4a574 0%, #e8c4a0 50%, #c97b5d 100%);
  --gradient2:   linear-gradient(135deg, #e8c4a0 0%, #f5d6c6 100%);
  --gradient3:   linear-gradient(135deg, #c97b5d 0%, #d4a574 100%);
}
```

### 视觉元素
- 🎞️ 胶片边框装饰、复古报花边角
- 📜 羊皮纸纹理背景（CSS 生成）
- 🕯️ 烛光柔和光晕效果
- ✦ 手绘风格图标
- 老照片暖色滤镜

### 主题切换机制
- 每个主题文件导出 `themeConfig` 对象（含 CSS 变量 + 配套字体/装饰类名）
- 切换时通过 JS 批量更新 `document.documentElement.style` 上的 CSS 变量
- 支持「预设主题」和「自定义覆盖」两种模式（admin 中可单独覆盖任意颜色）

## 板块系统

### 板块注册接口

```javascript
// 每个板块模块导出的标准接口
const SectionModule = {
  name: 'taskCards',           // 唯一标识
  label: '甜蜜任务卡',         // 显示名称
  icon: '🎴',                  // 图标
  defaultEnabled: true,        // 默认启用
  render(container, config) {}, // 渲染函数
  init(config) {},             // 初始化（事件绑定等）
  getDefaultConfig() {},       // 默认配置
  getAdminHTML(index, data) {}, // Admin 编辑面板
  syncAdminData(index, data) {}, // 同步 Admin 表单数据
};
```

### 板块列表（生日版）

| # | 板块 | 标识 | 说明 | 优先级 |
|---|------|------|------|--------|
| 1 | 开场页 | opening | 生日标题 + 倒计时 + 在一起天数 | 核心 |
| 2 | 时光胶囊 | timeCapsule | 按日期封印的情书，7月23日解锁 🆕 | 高 |
| 3 | 时间线 | timeline | 爱情重要时刻回顾 | 核心 |
| 4 | 照片画廊 | gallery | 左右滑动浏览照片 | 核心 |
| 5 | 音乐回忆簿 | musicMemories | 黑胶唱片歌单 + 回忆文字 🆕 | 高 |
| 6 | 情书 | letter | 点击信封展开 | 核心 |
| 7 | 甜蜜任务卡 | taskCards | 翻牌显示甜蜜任务 🆕 | 高 |
| 8 | 心有灵犀 | quiz | 趣味问答测试 | 核心 |
| 9 | 心愿瓶 | wishes | 彩色瓶子留言 | 核心 |
| 10 | 许愿星空 | starWishes | 点击星星许愿 🆕 | 中 |
| 11 | 结尾惊喜 | ending | 烟花动画 + 告白 + 彩蛋 | 核心 |

## 新板块详细设计

### 1. 甜蜜任务卡 🎴

**交互流程：**
1. 页面展示 9 张复古风格卡片（3×3 网格，背面朝上）
2. 点击卡片 → 3D 翻转动画（Y轴旋转）→ 显示任务内容
3. 完成任务后点击「✅ 完成了」→ 卡片变为灰色已解锁状态
4. 全部解锁后触发庆祝动画 🎉

**卡片数据：**
```javascript
{
  id: 1,
  emoji: '🤗',
  title: '给我一个拥抱',
  desc: '现在！立刻！马上！要抱抱~',
  type: 'action', // action | sweet | challenge
  color: '#d4a574',
  isSpecial: false, // true 时为彩蛋卡
}
```

**视觉效果：**
- 卡片背面：复古花纹 + 问号/礼物图案
- 卡片正面：暖金边框 + 手写体文字
- 翻转动画：`transform: perspective(600px) rotateY(180deg)`
- 全部完成：彩带/纸屑庆祝效果

---

### 2. 音乐回忆簿 🎵

**交互流程：**
1. 展示老式唱片机视觉（圆形黑胶 + 唱臂）
2. 点击唱片 → 开始旋转播放（实际触发 Audio）
3. 唱片旋转同时显示音乐波形动画（Canvas 绘制）
4. 右侧/下方滚动显示对应歌词/回忆文字
5. 点击下一首 → 切换歌曲（唱片淡出→更换→淡入）

**音乐数据：**
```javascript
{
  id: 1,
  title: '我们的歌',
  artist: '歌手名',
  src: 'assets/music/song1.mp3',
  coverEmoji: '🎵',
  memory: '这是我们第一次一起听...',  // 回忆文字
  lyrics: '歌词段落...',             // 可选歌词
  color: '#d4a574',
}
```

**视觉效果：**
- 黑胶唱片 SVG/CSS 绘制（黑色圆盘 + 彩色标签）
- 播放时匀速旋转动画（`animation: spin 3s linear infinite`）
- 音频波形：Canvas 实时绘制频率条
- 复古唱片机整体造型

---

### 3. 时光胶囊 📅

**交互流程：**
1. 显示一排复古信封，每个标注日期
2. 信封分为：已解锁（可打开）和 未解锁（显示"🔒 x天后可开启"）
3. 生日版特殊规则：7月23日当天所有信封解锁
4. 点击已解锁信封 → 展开显示情书/小秘密
5. 打开时有蜡封碎裂动画

**时光胶囊数据：**
```javascript
{
  id: 1,
  date: '2026-07-23',
  title: '生日当天的悄悄话',
  content: '亲爱的，生日快乐...',
  emoji: '💌',
  isUnlocked: false,  // 自动计算
  isSpecial: true,    // 生日当天特别内容
}
```

**解锁逻辑：**
- 根据当前日期自动计算是否解锁
- 生日当天所有胶囊自动解锁
- 已读胶囊有特殊标记（已开启的封印）

**视觉效果：**
- 信封：米色底 + 红色蜡封印章 + 缎带
- 蜡封印章用 CSS 圆形 + 文字/图案
- 打开动画：蜡封碎裂（`@keyframes` 碎片飞散）→ 信纸展开

---

### 4. 许愿星空 🌟

**交互流程：**
1. 深蓝夜空画布上散布闪烁的星星
2. 每颗星星代表一个祝福/承诺
3. 手指/鼠标划过 → 经过的星星亮起 + 留下星轨
4. 点击星星 → 流星坠落动画 → 显示祝福文字
5. 划过特定区域（心形/数字）→ 触发隐藏彩蛋

**星空数据：**
```javascript
{
  id: 1,
  text: '愿你每一天都开心快乐 ✨',
  from: '爱你的',
  emoji: '⭐',
  x: 0.3,  // 相对位置 0-1
  y: 0.4,
  size: 'medium', // small | medium | large
  isConstellation: false, // 是否星座彩蛋星
}
```

**视觉效果：**
- Canvas 绘制星空背景
- 星星闪烁动画（呼吸式透明度变化）
- 流星坠落：尾迹粒子效果
- 划过星轨：发光线条跟随触摸路径
- 彩蛋：划过特定形状（❤️ / 🎂 / 723）触发烟花

## Admin 后台升级设计

### 变更列表

1. **顶部新增「主题选择器」**
   - 下拉菜单切换预设主题
   - 旁边显示当前主题名称 + 色块预览

2. **侧边栏新增「板块管理器」**
   - 每个板块前加复选框（启用/禁用）
   - 拖拽手柄调整顺序（上移/下移按钮）

3. **新增编辑面板**
   - 甜蜜任务卡编辑
   - 音乐回忆簿编辑
   - 时光胶囊编辑
   - 许愿星空编辑

4. **预览面板更新**
   - 主题切换后实时更新预览

5. **导出功能升级**
   - 导出时包含所有板块配置

## Config 结构

```javascript
const CONFIG = {
  // === 场合信息 ===
  occasion: {
    type: 'birthday',
    title: '🎂 生日快乐！',
    subtitle: '给最特别的你',
    date: '2026-07-23',
  },

  // === 情侣信息 ===
  couple: {
    name1: '小明',
    name2: '小红',
    nickname1: '🐻 小熊',
    nickname2: '🐰 小兔',
    anniversary: '2025-06-28',
    birthday: '2026-07-23',   // 新增：对方的生日
    description: '从相遇的那天起，每一天都变得有意义 ✨',
  },

  // === 主题 ===
  theme: 'birthday-vintage',
  themeCustom: {},

  // === 板块控制 ===
  sections: {
    enabled: ['opening','timeCapsule','timeline','gallery','musicMemories','letter','taskCards','quiz','wishes','starWishes','ending'],
    order: ['opening','timeCapsule','timeline','gallery','musicMemories','letter','taskCards','quiz','wishes','starWishes','ending'],
  },

  // === 原板块配置（升级） ===
  countdown: { targetDate: '2026-07-23', ... },
  timeline: [...],
  gallery: [...],
  loveLetter: {...},
  quiz: {...},
  wishes: [...],
  music: {...},
  ending: {...},

  // === 新板块配置 ===
  taskCards: [...],
  musicMemories: [...],
  timeCapsule: [...],
  starWishes: [...],
}
```

## 实现优先级（生日版）

| 优先级 | 任务 | 预估 |
|--------|------|------|
| P0 | 主题系统（CSS 变量切换 + 复古浪漫主题预设） | 2h |
| P0 | Index 页面主题适配（配色/字体/装饰元素） | 2h |
| P0 | 开场页改造（生日标题 + 倒计时到7月23） | 1h |
| P0 | 甜蜜任务卡 🎴 完整开发 | 3h |
| P0 | 音乐回忆簿 🎵 完整开发 | 4h |
| P1 | 时光胶囊 📅 完整开发 | 3h |
| P1 | 许愿星空 🌟 完整开发 | 3h |
| P1 | 板块开关/排序系统 | 2h |
| P2 | Admin 后台升级 | 4h |
| P2 | Config 结构重构 | 1h |
| P2 | 整体联调+测试 | 2h |

## 技术要点

1. **渐进式改造** - 不破坏现有功能，增量添加
2. **微信兼容** - 所有新板块在微信浏览器中测试
3. **移动优先** - 触控交互优化（特别是星空拖尾和卡片翻转）
4. **性能** - Canvas 粒子/星空使用 requestAnimationFrame，注意性能
5. **字体** - 引入 `ZCOOL XiaoWei` 或 `LXGW WenKai` 复古手写体
