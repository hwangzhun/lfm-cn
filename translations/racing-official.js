(function () {
  "use strict";

  window.LFM_CN_TRANSLATIONS = window.LFM_CN_TRANSLATIONS || {
    exact: {},
    partial: {},
    patterns: [],
    scoped: [],
    selectorScoped: []
  };

  Object.assign(window.LFM_CN_TRANSLATIONS.exact, {
    "ACC LOBBY SERVERS ARE ONLINE": "ACC 大厅服务器在线",
    "ACC CONNECTOR": "ACC 连接器",
    "ACC HOTLAPS": "ACC 最快圈速",
    "ACC BOP": "ACC 性能平衡",
    "Show only Series with upcoming races": "仅显示即将举行的赛事系列。",
    "Tileview": "卡片视图",
    "Tableview": "表格视图",
    "Quick Signup": "快速报名",
    "DAILY": "每日",
    "WEEKLY": "每周",
    "SPECIAL EVENTS": "特别赛事",
    "MIN": "分钟",
    "GT3+GT4/M2/PCUP / 45 MIN.": "GT3+GT4/M2/PCUP / 45分钟",
    "GT3 WE:MONZA FR:SPA": "GT3 周末:蒙扎 周五:斯帕",
    "GT3 TEAM-ENDURANCE": "GT3 车队耐力赛",
    "UPCOMING SESSIONS": "即将开始的比赛",
    "PRACTICE SESSIONS": "练习赛",
    "MY SESSIONS": "我的比赛",
    "RECENT SESSIONS": "最近结束的比赛",
    "STANDINGS": "积分榜",
    "SCHEDULE": "赛程",
    "Week": "周",

    // ACC DRIVE 耐力系列赛
    "ACC DRIVE ENDURANCE SERIES": "ACC DRIVE 耐力系列赛",
    "Endurance, teamwork, and strategy are what define success in the ACC Drive Endurance Series. Compete as a team with multiple drivers or take on the challenge solo, plan your pit stops wisely, and fight for every position in long endurance races.": "耐力、团队合作和策略是 ACC Drive 耐力系列赛中取得胜利的关键。与多名车手组队参赛，或独自迎接挑战，明智地规划进站策略，在漫长的耐力赛中为每一个位置而战。",

    // CASEKING PRIME 系列
    "CASEKING PRIME SERIES": "CASEKING PRIME 系列赛",
    "In the Caseking Prime Series, speed, composure, and clean wheel-to-wheel racing are what matter most. Take on the competition, choose your car, and fight for every position in intense races – made for those who want racing at the highest level.": "在 Caseking Prime 系列赛中，速度、沉着冷静和干净的轮对轮较量最为重要。迎接挑战，选择您的赛车，在激烈的比赛中为每一个位置而战——专为渴望顶级赛事的车手而设。",
    PRIZES: "奖品",
    "1X NITRO CONCEPTS R300 SCHALENSITZ + SEAT SLIDER": "1套 NITRO CONCEPTS R300 桶式座椅 + 座椅滑轨",
    "1X NITRO CONCEPTS X-1000 GAMING CHAIR": "1套 NITRO CONCEPTS X-1000 游戏座椅",
    "1X NITRO CONCEPTS IMMERSION WIND BUNDLE INKL. UH1 HUB": "1套 NITRO CONCEPTS IMMERSION 风感套装 含 UH1 集线器",

    // GO Setups GT3冲刺系列赛
    "Little time but huge passion for racing? In the GO Setups GT3 Sprint Series you’ll get non-stop action. Intense 20-minute races keep you on the edge and demand your full focus and concentration.": "时间不多但对赛车充满热情？在 GO Setups GT3 冲刺系列赛中，你将体验不间断的激烈对抗。20 分钟的紧张比赛让你全程紧绷，需要你全神贯注。",
    "1X 3 MONTHS SUBSCRIPTION": "1X 3个月订阅",
    "5X 1 MONTH SUBSCRIPTION": "5X 1个月订阅",
    "Top 50.": "前50名。",
    "*will be raffled": "*将进行抽奖",

    // GT3 + GT4 多组别
    "GT3 + GT4 MULTICLASS": "GT3 + GT4 多组别",
    "Do you thrive in traffic, strategy, and clean multiclass racing? Then this GT3 + GT4 Multiclass is made for you. Choose your class, master traffic management and race strategy in thrilling 60-minute races, and prove yourself in the battle between two worlds on the same track.": "你是否在交通流、策略和干净的多组别比赛中游刃有余？那么这款 GT3 + GT4 多组别赛事正是为你而设。选择你的组别，在激动人心的 60 分钟比赛中掌握交通管理和比赛策略，在同一条赛道上于两个世界的较量中证明自己。",

    // GT3 + GT4 多组别 - 官网赛季
    "GT3 + GT4 MULTICLASS": "GT3 + GT4 多组别",
    "Do you thrive in traffic, strategy, and clean multiclass racing? Then this GT3 + GT4 Multiclass is made for you. Choose your class, master traffic management and race strategy in thrilling 60-minute races, and prove yourself in the battle between two worlds on the same track.": "你是否在交通流、策略和干净的多组别比赛中游刃有余？那么这款 GT3 + GT4 多组别赛事正是为你而设。选择你的组别，在激动人心的 60 分钟比赛中掌握交通管理和比赛策略，在同一条赛道上于两个世界的较量中证明自己。",

    // LFM 双人杯
    "LFM DUO CUP": "LFM 双人杯",
    "Are teamwork, timing, and trust your greatest strengths? Then the LFM Duo Cup is your perfect stage. Compete exclusively as a two-driver team, nail your driver swap during the pit stop, and fight together for every position in thrilling races.": "团队合作、时机把握和信任是你的最大优势吗？那么 LFM 双人杯就是你的完美舞台。以双人车队的形式参赛，在进站中完美完成车手交换，在激动人心的比赛中为每一个位置并肩作战。",
    "ACC TEAM EVENT GUIDE !!MANDATORY TO READ!!": "ACC 车队赛事指南！！必须阅读！！",

    // LMF-GTC
    "With the all new LFM GTC, you can experience five unique GT3 endurance races across the globe. Face legendary tracks, manage strategy and consistency over the distance, and battle your rivals in a true test of endurance racing.": "通过全新的 LFM GTC，您可以体验全球五场独特的 GT3 耐力赛。挑战传奇赛道，管理长距离比赛中的策略与稳定性，在真正的耐力赛考验中与对手一较高下。",

    // 纽博格林北环冲刺
    "Nordschleife Sprint Cup": "纽博格林北环冲刺杯",
    "With the all new LFM GTC, you can experience five unique GT3 endurance races across the globe. Face legendary tracks, manage strategy and consistency over the distance, and battle your rivals in a true test of endurance racing.": "通过全新的 LFM GTC，您可以体验全球五场独特的 GT3 耐力赛。挑战传奇赛道，管理长距离比赛中的策略与稳定性，在真正的耐力赛考验中与对手一较高下。",

    //  Syncmesh GT3系列赛
    "Consistency, racecraft, and strategy are your strengths? Then prove it anytime in the Syncmesh GT3 Series! Choose your favorite GT3 car and chase down your rivals in thrilling 40-minute races – available at peak times.": "一致性、驾驶技术和策略是你的强项？那么在 Syncmesh GT3 系列赛中来证明自己吧！选择你最喜欢的 GT3 赛车，在激动人心的 40 分钟比赛中追逐你的对手——高峰时段开放。",
    "1X GRIP M-PRO LFM EDITION": "1X GRIP M-PRO LFM 版",
    "1X GRIP M2X": "1X GRIP M2X",
    "1X GRIP N7R1": "1X GRIP N7R1",

    // 速度殿堂系列赛
    "The Temple of Speed Series delivers pure speed and uncompromising action on Spa and Monza. Master the fastest sections, survive the close racing, and prove that you can stay in control when things get truly chaotic on track.": "速度殿堂系列赛在斯帕和蒙扎带来纯粹的速度和不妥协的激烈竞争。掌控最快的赛段，在近距离缠斗中生存，并证明当赛道变得真正混乱时你仍能保持控制。",
    "1X 3 MONTH ULTRA SUBSCRIPTION": "1X 3个月超级订阅",

    // 房车杯
    "Less power and aero than a GT3, but just as much racing fun – that’s what the GT4, M2 Cup, and Porsche Cup delivers. For 25 minutes, without pit stops, you can prove your precision and control by mastering these smaller machines around the track.": "比 GT3 更低的动力和空气动力学，但同样充满赛车乐趣——这就是 GT4、M2 Cup 和 Porsche Cup 带来的体验。在 25 分钟无进站的比赛中，你可以通过驾驭这些小型赛车在赛道上证明你的精准度和操控力。",

    // 比赛卡片
    "Sessions": "比赛",

    "Sign Up": "报名",
    "TEAM": "车队",
    "CODE OF CONDUCT - EN": "行为准则 - 英文",
    "VERHALTENSREGELN UND STRAFENKATALOG - DE": "行为准则 - 德文",
    "I am fully accepting the 'Code of Conduct' of the LFM racing service.": "我完全接受 LFM 赛车服务的《行为准则》。",
    "I will not use the ingame chat and I am aware that I can be banned if I insult players.": "我不会使用游戏内聊天，并且我清楚如果侮辱其他玩家可能会被禁赛。",
    "I will report other players for incidents and not deliberately take self justice on track.": "我会举报其他玩家的事故行为，不会在赛道上故意自行执法。",
    "The free practice session is ONLY for JOINING!": "自由练习环节仅用于进入服务器！",
    "DO NOT GO OUT ON TRACK (only allowed in the ACC Driver endurance and Prime Series)!": "请不要驶上赛道（仅在 ACC 车手耐力赛和 Prime 系列赛中允许）！",
    "SIGN ME UP!": "我要报名！",
    "Car number will be assigned automatically by your driver rating!": "车号将根据您的车手评分自动分配！"
  });

  Object.assign(window.LFM_CN_TRANSLATIONS.partial, {
    "OFF SEASON": "官方赛季",

  });

  window.LFM_CN_TRANSLATIONS.selectorScoped = window.LFM_CN_TRANSLATIONS.selectorScoped || [];

  window.LFM_CN_TRANSLATIONS.selectorScoped.push({
    selectors: [".weather-pill"],
    exact: {

    },
    partial: {
      "P": "练习",
      "Q": "排位",
      "R": "正赛",
      "min.": "分钟",
      "Start Times": "时间",
    },
    patterns: [
      [/^(\d+)\s*MIN\.?$/i, "$1 分钟"],
      [/^(\d+)\s*LAPS?$/i, "$1 圈"]
    ]
  });

  const dateDays = {
    MON: "周一",
    MONDAY: "周一",
    TUE: "周二",
    TUESDAY: "周二",
    WED: "周三",
    WEDNESDAY: "周三",
    THU: "周四",
    THURSDAY: "周四",
    FRI: "周五",
    FRIDAY: "周五",
    SAT: "周六",
    SATURDAY: "周六",
    SUN: "周日",
    SUNDAY: "周日"
  };

  const dateMonths = {
    JAN: "1月",
    JANUARY: "1月",
    FEB: "2月",
    FEBRUARY: "2月",
    MAR: "3月",
    MARCH: "3月",
    APR: "4月",
    APRIL: "4月",
    MAY: "5月",
    JUN: "6月",
    JUNE: "6月",
    JUL: "7月",
    JULY: "7月",
    AUG: "8月",
    AUGUST: "8月",
    SEP: "9月",
    SEPTEMBER: "9月",
    OCT: "10月",
    OCTOBER: "10月",
    NOV: "11月",
    NOVEMBER: "11月",
    DEC: "12月",
    DECEMBER: "12月"
  };

  window.LFM_CN_TRANSLATIONS.patterns.push(
    [
      /^(MON|TUE|WED|THU|FRI|SAT|SUN)\s+(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC),\s+(\d{1,2}:\d{2})$/i,
      function (_, day, date, month, time) {
        return `${dateMonths[month.toUpperCase()]}${Number(date)}日 ${dateDays[day.toUpperCase()]} ${time}`;
      }
    ],
    [
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\s+at\s+(\d{1,2}:\d{2})\s+(GMT[+-]\d+)$/i,
      function (_, day, date, month, year, time, timezone) {
        return `${year}年${dateMonths[month.toUpperCase()]}${Number(date)}日 ${dateDays[day.toUpperCase()]} ${time} ${timezone}`;
      }
    ]
  );
})();