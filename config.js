/**
 * ============================================
 *  💕 纪念日/生日 — 配置文件
 *  支持多场合配置
 * ============================================
 */

const CONFIG = {
  // ========== 场合配置 ==========
  occasion: {
    type: 'birthday',
    title: '🎂 生日快乐！',
    subtitle: '给最特别的你',
    date: '2026-07-23',
  },

  // ========== 情侣信息 ==========
  couple: {
    name1: '朱罗纪',
    name2: '孙逊',
    nickname1: '🦕 小狗龙',
    nickname2: '💪 爸爸',
    anniversary: '2025-06-28',
    birthday: '2026-07-23',
    description: '从相遇的那天起，每一天都变得有意义 ✨',
  },

  // ========== 主题系统 ==========
  theme: 'birthday-vintage',
  themeCustom: {},

  // ========== 板块控制 ==========
  sections: {
    enabled: ['opening', 'timeCapsule', 'timeline', 'gallery', 'musicMemories', 'letter', 'taskCards', 'quiz', 'wishes', 'starWishes', 'ending'],
    order: ['opening', 'timeCapsule', 'timeline', 'gallery', 'musicMemories', 'letter', 'taskCards', 'quiz', 'wishes', 'starWishes', 'ending'],
  },

  // ========== 新板块占位 ==========
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
  ],
  musicMemories: [
    {
      id: 1,
      title: '海屿你',
      artist: '马也',
      src: '',
      coverEmoji: '🎵',
      memory: '你说，这首歌很像我们俩的感情，虽然路途坎坷，但对彼此都情有独钟，我们的感情早已卷入漩涡，深陷在这一年中的点点滴滴中...',
      color: '#d4a574',
    },
    {
      id: 2,
      title: '巴拉莱卡',
      artist: '门尼',
      src: '',
      coverEmoji: '🎈',
      memory: '这首歌就像我们的故事，从相识到相爱，每一步都充满了甜蜜的惊喜。',
      color: '#e8c4a0',
    },
    {
      id: 3,
      title: '无人之岛',
      artist: '任然',
      src: '',
      coverEmoji: '🌿',
      memory: '雨下整夜，我的爱溢出就像雨水。每次听到这首歌就想起那个下雨的夜晚。',
      color: '#a8d8a8',
    },
    {
      id: 4,
      title: '跳楼机',
      artist: '队长',
      src: '',
      coverEmoji: '💑',
      memory: '我想就这样牵着你的手不放开。爱其实可以很简单，就像我们这样。',
      color: '#ffb3ba',
    },
    {
      id: 5,
      title: '晴天',
      artist: '周杰伦',
      src: '',
      coverEmoji: '☀️',
      memory: '好不容易又能再多爱一天。和你在一起的每一天都是晴天。',
      color: '#ffd700',
    },
  ],
  timeCapsule: [
    {
      id: 1,
      date: '2026-07-23',
      title: '🎂 生日快乐！',
      content: '宝宝，生日快乐呀！我真的好想好想你呀！等你出野回来，我们就能有自己的家啦！',
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
    {
      id: 3,
      date: '2026-09-01',
      title: '🍁 秋天的第一杯奶茶',
      content: '天凉了，想和你一起喝秋天的第一杯奶茶，暖暖手也暖暖心。',
      emoji: '🧋',
      isSpecial: false,
    },
    {
      id: 4,
      date: '2026-12-25',
      title: '🎄 一起过的圣诞节',
      content: '想和你一起装饰圣诞树，在暖黄的灯光下交换礼物，度过最温暖的圣诞夜。',
      emoji: '🎄',
      isSpecial: false,
    },
    {
      id: 5,
      date: '2027-02-14',
      title: '🌹 又一个情人节',
      content: '每一个情人节都想和你一起过，因为你就是我最好的情人。',
      emoji: '🌹',
      isSpecial: true,
    },
  ],
  starWishes: [
    { id: 1, text: '愿你每天都开心快乐 ✨', from: '爱你的', emoji: '⭐', x: 0.2, y: 0.3, size: 'medium' },
    { id: 2, text: '愿所有美好都如约而至 🌟', from: '你的专属', emoji: '🌟', x: 0.5, y: 0.2, size: 'large' },
    { id: 3, text: '愿你的笑容永远灿烂 😊', from: '守护你的', emoji: '✨', x: 0.8, y: 0.4, size: 'small' },
    { id: 4, text: '愿我们能一直走下去 💕', from: '想未来的', emoji: '⭐', x: 0.3, y: 0.6, size: 'medium' },
    { id: 5, text: '愿你被世界温柔以待 🌸', from: '永远支持你的', emoji: '🌟', x: 0.7, y: 0.7, size: 'medium' },
    { id: 6, text: '生日快乐，我最爱的人 🎂', from: '你的爱人', emoji: '💫', x: 0.5, y: 0.8, size: 'large', isConstellation: true },
  ],

  // ========== 音乐配置 ==========
  music: {
    src: '',
    title: '💗 专属BGM',
    autoplay: false,
  },

  // ========== 倒计时配置 ==========
  countdown: {
    targetDate: '2026-07-23',
    title: '距离你的生日',
    message: '今天是属于你的特别日子 🎂',
    daysText: '天',
    hoursText: '时',
    minutesText: '分',
    secondsText: '秒',
  },

  // ========== 时间线 ==========
  timeline: [
    {
      date: '2025-06-28',
      title: '💘 在一起的第一天',
      desc: '还记得吗？那天你穿着白色连衣裙，阳光正好，我们牵起了彼此的手。世界突然变得更亮了。',
      emoji: '💕',
    },
    {
      date: '2025-07-15',
      title: '🎬 第一次一起看电影',
      desc: '我们一起看了第一部电影，黑暗中你靠在我肩膀上的那一刻，我觉得自己是世界上最幸福的人。',
      emoji: '🎬',
    },
    {
      date: '2025-09-10',
      title: '🍳 第一次为你做饭',
      desc: '虽然鸡蛋煎糊了、汤太咸了，但你笑着说"好吃"的样子，让我想一辈子做饭给你吃。',
      emoji: '🍳',
    },
    {
      date: '2025-11-20',
      title: '🌧️ 雨中共伞',
      desc: '那天突然下起大雨，我们挤在一把伞下，衣服都淋湿了，但心却暖得不行。',
      emoji: '☔',
    },
    {
      date: '2026-02-14',
      title: '🌹 第一个情人节',
      desc: '准备了很久很久，只为看到你惊喜的笑容。你的笑容，就是我最好的情人节礼物。',
      emoji: '🌹',
    },
    {
      date: '2026-06-06',
      title: '🎉 一周年快乐！',
      desc: '365天，8760小时，525600分钟——每一分钟都因为有你而变得珍贵。我爱你，比昨天多一点，比明天少一点。',
      emoji: '🎉',
    },
  ],

  // ========== 照片画廊 ==========
  gallery: [
    {
      src: 'assets/photos/photo1.svg',
      caption: '我们的第一张合照 📸',
      desc: '那天阳光正好，你在我身边',
    },
    {
      src: 'assets/photos/photo2.svg',
      caption: '最爱的笑容 😊',
      desc: '你的笑容是我每天的充电宝',
    },
    {
      src: 'assets/photos/photo3.svg',
      caption: '一起走过的路 🛤️',
      desc: '每一步都值得被记住',
    },
    {
      src: 'assets/photos/photo4.svg',
      caption: '最好的时光 ✨',
      desc: '和你在一起的每一刻都是最好的时光',
    },
    {
      src: 'assets/photos/photo5.svg',
      caption: '吃货二人组 🍜',
      desc: '和你一起吃什么都特别香',
    },
    {
      src: 'assets/photos/photo6.svg',
      caption: '我们的故事未完待续... 💕',
      desc: '这只是开始，还有一辈子要走',
    },
  ],

  // ========== 情书 ==========
  loveLetter: {
    title: '💌 写给你的一封信',
    greeting: '亲爱的：',
    paragraphs: [
      '一年了，整整一年了。回头看这一年，每一个片段都有你的身影，每一个笑容都和你有关。',
      '记得我们刚开始的时候吗？我紧张得手心冒汗，话都说不利索。你笑了，那个笑容让我瞬间忘记了所有的紧张——我只想记住那个笑容，永远。',
      '这一年里，我们一起经历了很多。开心的、难过的、平淡的、疯狂的——每一刻都因为有你而变得不一样。你让我的世界从黑白变成了彩色。',
      '有人说，爱情会随着时间变淡。但我觉得，每一天我都比前一天更喜欢你。不是因为习惯，而是因为每一天我都在你身上发现新的可爱之处。',
      '谢谢你包容我的小脾气，谢谢你在我低落时给我拥抱，谢谢你选择和我一起走这条路。',
      '一年只是一个开始。我期待着和你一起度过下一个一年、十年、五十年。',
      '我爱你。不是因为你完美，而是因为和你在一起，一切都刚刚好。',
    ],
    closing: '永远爱你的',
    signature: '小明',
    date: '2026年6月6日',
  },

  // ========== 心有灵犀小测验 ==========
  quiz: {
    title: '🎯 心有灵犀',
    subtitle: '看看你有多了解TA？',
    questions: [
      {
        question: '我们第一次见面是在哪里？',
        options: ['咖啡馆 ☕', '图书馆 📚', '朋友的聚会 🎉', '公司/学校 🏫'],
        answer: 2,
      },
      {
        question: 'TA最喜欢吃什么？',
        options: ['火锅 🍲', '日料 🍣', '甜品 🍰', '烤肉 🥩'],
        answer: 0,
      },
      {
        question: 'TA生气的时候会怎样？',
        options: ['不理人 😤', '狂吃东西 🍔', '闷闷不乐 😔', '疯狂吐槽 💬'],
        answer: 2,
      },
      {
        question: 'TA最常对我说的话是？',
        options: ['我爱你 💕', '你好烦 🙄', '想你了 🥺', '早点睡 😴'],
        answer: 1,
      },
      {
        question: '我们的第一次旅行去了哪里？',
        options: ['海边 🌊', '山里 ⛰️', '古镇 🏘️', '还没去过 😅'],
        answer: 3,
      },
    ],
    results: [
      {
        min: 0, max: 1,
        emoji: '😅',
        text: '看来你需要多复习一下恋爱功课哦！不过没关系，每一天都是重新认识彼此的机会~',
      },
      {
        min: 2, max: 3,
        emoji: '😊',
        text: '还不错嘛！你对TA有一定的了解，但还有进步空间哦！多关注TA的小细节吧~',
      },
      {
        min: 4, max: 4,
        emoji: '🥰',
        text: '你们真的很默契！几乎完全了解TA的喜好和习惯，这就是真爱吧！',
      },
      {
        min: 5, max: 5,
        emoji: '💯',
        text: '满分！你就是TA肚子里的蛔虫吧！这种默契不是谁都有的，好好珍惜彼此！',
      },
    ],
    shareText: '我在"心有灵犀"测试中得了{score}分！你也来试试？',
  },

  // ========== 心愿瓶 ==========
  wishes: [
    {
      id: 1,
      text: '希望以后每一个周年纪念日，都能牵着你的手一起过。👫',
      from: '爱你的小熊',
      color: '#ff6b81',
    },
    {
      id: 2,
      text: '想和你一起去看一场日出和日落，从清晨到日暮，从年轻到白头。🌅',
      from: '你的专属',
      color: '#feca57',
    },
    {
      id: 3,
      text: '攒够了思念，就见一面吧。想和你去旅行，去哪里都好，只要是和你。✈️',
      from: '想你的每一天',
      color: '#ff9ff3',
    },
    {
      id: 4,
      text: '谢谢你来到我的生命中。遇到你之前，我不知道自己可以这么喜欢一个人。💗',
      from: '幸运的我',
      color: '#a29bfe',
    },
    {
      id: 5,
      text: '新的一年，我们要一起变得更好。一起健身、一起做饭、一起看书、一起发呆。🏃‍♂️',
      from: '你的搭档',
      color: '#fd79a8',
    },
    {
      id: 6,
      text: '说好了，下辈子还要在一起。不过下辈子太远，先把这辈子过好。😘',
      from: '预约来生的',
      color: '#00b894',
    },
  ],

  // ========== 结尾 ==========
  ending: {
    title: '🎆 一周年快乐',
    message: '从0到1，从1到∞\n我们的故事才刚刚开始\n谢谢你出现在我的生命里\n让一切变得如此美好',
    signatureLine: '— 永远爱你的 小明 —',
    date: '2026.06.06',
    easterEgg: '嘘~偷偷告诉你一个秘密：遇见你，花光了我所有的好运气。但我一点都不后悔 💕',
    fireworkColors: ['#ff6b81', '#feca57', '#ff9ff3', '#a29bfe', '#fd79a8', '#00b894', '#ffeaa7'],
  },
};
