// ==UserScript==
// @name         LFM 中文汉化
// @namespace    https://github.com/lfm-cn
// @version      2.0.0
// @description  Low Fuel Motorsport 页面中文汉化，仅替换界面文案，不修改网站功能。
// @author       lfm-cn
// @match        https://lowfuelmotorsport.com/*
// @match        https://www.lowfuelmotorsport.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    debounceMs: 80,
    debug: false,
  };

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'KBD', 'SAMP',
    'SVG', 'CANVAS', 'IFRAME', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION',
  ]);

  const SKIP_SELECTORS = [
    "[contenteditable='true']",
    '[data-lfm-cn-skip]',
    '.no-translate',
    '.notranslate',
    '.driver-name',
    '.team-name',
    '.username',
    '.user-id',
    '.steam-id',
    '.server-name',
    '.server-password',
    '.chat-msg',
    '.chat-message',
  ];

  const ATTRIBUTES = ['title', 'aria-label', 'placeholder', 'alt', 'value'];
  const STYLE_ID = 'lfm-cn-style';

  const exactGlobal = {
    'Causing a collision': '造成碰撞',
    'Using the ingame chat during race / qualification session': '在正赛/排位赛期间使用游戏内聊天',
    'Series/Events:': '系列赛/赛事：',
    'Reportdate:': '举报日期：',
    'Session ID:': '场次 ID：',
    'Report ID:': '举报 ID：',
    'STEWARD DECISION:': '赛事干事判罚：',
    // 菜单栏
    '主页': '主页',
    '常见问题': '常见问题',
    'LFM+': 'LFM+',
    'LFM APP': 'LFM APP',
    'RACING': '赛事',
    'RACE PLANNER': '比赛计划',
    'TEAMS': '车队',
    'SETUPS': '调校',
    'RACE ENGINEER': '赛车工程师',
    'EVENTS': '活动',
    'STATS': '数据统计',
    'SUPPORT LFM': '支持 LFM',
    "LFM OFFICIAL": "LFM 官方",
    "HOSTED": "主办赛事",
    "DRIVER RATING LEADERBOARD": "车手评分排行榜",
    "SAFETY RATING LEADERBOARD": "安全评分排行榜",
    "MOST ACTIVE DRIVERS": "最活跃车手",
    "DRIVER PERFORMANCE": "车手表现",
    "TRACK RECORDS": "赛道纪录",
    "LAPTIME BY ELO RANGE": "按 ELO 分段的圈速",
    "CAR STATISTICS": "赛车统计",
    "USER DEVELOPEMENT": "用户发展",
    "COMMUNITY SPREAD": "社区分布",
    "ELO DISTRIBUTION": "ELO 分布",
    "SR DISTRIBUTION": "SR 分布",

    // 顶部功能栏
    'LEGACY PAGE': '旧版页面',
    'EN': '英文',
    'Dark mode': '暗色模式',
    'Open notifications': '打开通知',
    'mark all as read': '全部标记为已读',
    'Open chat': '打开聊天',
    'Chat': '聊天',

    // 站内信
    'Your result for race #%d (%s) is ready. ELO %d / SR %f / Points %d': '您的比赛 #%d (%s) 结果已出。ELO %d / SR %f / 积分 %d',
    'The result for Race #%d was changed': '比赛 #%d 的结果已更改',
    'Congratulations! You achieved more than %d ELO in Assetto Corsa EVO!': '恭喜！您在 Assetto Corsa EVO 中获得了超过 %d ELO！',
    'Congratulations! You reached the %s license in Assetto Corsa EVO for the first time!': '恭喜！您首次在 Assetto Corsa EVO 中达到 %s 驾照！',
    'New schedule overview': '新赛程概览',
    '[ACC] 24H Spa | Sign up now!': '[ACC] 斯帕24小时 | 立即报名！',
    'News': '新闻',

    // 个人中心
    'profile': '个人资料',
    'my account': '我的账户',
    'my liveries': '我的涂装',
    'logout': '退出登录',

    // 车手等级页面
    'LFM License / Safety Rating / How To': 'LFM 驾照 / 安全评分 / 使用说明',
    'License': '驾照',
    'Safety Rating': '安全评分',
    'ROOKIE': '新秀',
    'You will stay in the ROOKIE license until you have 10 ranked races': '在完成 10 场排名赛之前，您将保持新秀驾照',
    'IRON': '铁级',
    'For the IRON license you need at least 10 ranked races': '铁级驾照需要至少 10 场排名赛',
    'IRON+': '铁级+',
    'For the IRON+ license you need an ELO of more or equal to 1000': '铁级+驾照需要 ELO 大于或等于 1000',
    'BRONZE': '铜级',
    'For the BRONZE license you need an ELO of more or equal to 1300': '铜级驾照需要 ELO 大于或等于 1300',
    'BRONZE+': '铜级+',
    'For the BRONZE+ license you need an ELO of more or equal to 1500': '铜级+驾照需要 ELO 大于或等于 1500',
    'SILVER': '银级',
    'For the SILVER license you need an ELO rating of at least 1700 and more or equal to 25 ranked races': '银级驾照需要 ELO 至少达到 1700 且完成 25 场或以上排名赛',
    'SILVER+': '银级+',
    'For the SILVER+ license you need an ELO rating of at least 2000 and more or equal to 25 ranked races': '银级+驾照需要 ELO 至少达到 2000 且完成 25 场或以上排名赛',
    'GOLD': '金级',
    'For the GOLD license you need an ELO rating of at least 2500 and more or equal to 50 ranked races': '金级驾照需要 ELO 至少达到 2500 且完成 50 场或以上排名赛',
    'GOLD+': '金级+',
    'For the GOLD+ license you need an ELO rating of at least 3200 and more or equal to 50 ranked races': '金级+驾照需要 ELO 至少达到 3200 且完成 50 场或以上排名赛',
    'PLATINUM': '铂金级',
    'For the PLATINUM license you need an ELO rating of at least 4000 and more or equal to 100 ranked races': '铂金级驾照需要 ELO 至少达到 4000 且完成 100 场或以上排名赛',
    'DIAMOND': '钻石级',
    'For the DIAMOND license you need an ELO rating of at least 5000 and more or equal to 100 ranked races': '钻石级驾照需要 ELO 至少达到 5000 且完成 100 场或以上排名赛',
    'LEGEND': '传奇级',
    'For the LEGEND license you need an ELO rating of at least 6000 and more or equal to 150 ranked races': '传奇级驾照需要 ELO 至少达到 6000 且完成 150 场或以上排名赛',
    'ALIEN': '外星人级',
    'For the ALIEN license you need an ELO rating of at least 8000 and more or equal to 200 ranked races': '外星人级驾照需要 ELO 至少达到 8000 且完成 200 场或以上排名赛',
    'HERO': '英雄级',
    'For the HERO license you need an ELO rating of at least 10000 and more or equal to 200 ranked races': '英雄级驾照需要 ELO 至少达到 10000 且完成 200 场或以上排名赛',

    // 车手安全分页面
    "LFM License / Safety Rating / How To": "LFM 驾照 / 安全评分 / 使用说明",
    "License": "驾照",
    "Safety Rating": "安全评分",
    "ROOKIE": "新秀",
    "You will stay in the ROOKIE license until you have 10 ranked races": "在完成 10 场排名赛之前，您将保持新秀驾照",
    "IRON": "铁级",
    "For the IRON license you need at least 10 ranked races": "铁级驾照需要至少 10 场排名赛",
    "IRON+": "铁级+",
    "For the IRON+ license you need an ELO of more or equal to 1000": "铁级+驾照需要 ELO 大于或等于 1000",
    "BRONZE": "铜级",
    "For the BRONZE license you need an ELO of more or equal to 1300": "铜级驾照需要 ELO 大于或等于 1300",
    "BRONZE+": "铜级+",
    "For the BRONZE+ license you need an ELO of more or equal to 1500": "铜级+驾照需要 ELO 大于或等于 1500",
    "SILVER": "银级",
    "For the SILVER license you need an ELO rating of at least 1700 and more or equal to 25 ranked races": "银级驾照需要 ELO 至少达到 1700 且完成 25 场或以上排名赛",
    "SILVER+": "银级+",
    "For the SILVER+ license you need an ELO rating of at least 2000 and more or equal to 25 ranked races": "银级+驾照需要 ELO 至少达到 2000 且完成 25 场或以上排名赛",
    "GOLD": "金级",
    "For the GOLD license you need an ELO rating of at least 2500 and more or equal to 50 ranked races": "金级驾照需要 ELO 至少达到 2500 且完成 50 场或以上排名赛",
    "GOLD+": "金级+",
    "For the GOLD+ license you need an ELO rating of at least 3200 and more or equal to 50 ranked races": "金级+驾照需要 ELO 至少达到 3200 且完成 50 场或以上排名赛",
    "PLATINUM": "铂金级",
    "For the PLATINUM license you need an ELO rating of at least 4000 and more or equal to 100 ranked races": "铂金级驾照需要 ELO 至少达到 4000 且完成 100 场或以上排名赛",
    "DIAMOND": "钻石级",
    "For the DIAMOND license you need an ELO rating of at least 5000 and more or equal to 100 ranked races": "钻石级驾照需要 ELO 至少达到 5000 且完成 100 场或以上排名赛",
    "LEGEND": "传奇级",
    "For the LEGEND license you need an ELO rating of at least 6000 and more or equal to 150 ranked races": "传奇级驾照需要 ELO 至少达到 6000 且完成 150 场或以上排名赛",
    "ALIEN": "外星人级",
    "For the ALIEN license you need an ELO rating of at least 8000 and more or equal to 200 ranked races": "外星人级驾照需要 ELO 至少达到 8000 且完成 200 场或以上排名赛",
    "HERO": "英雄级",
    "For the HERO license you need an ELO rating of at least 10000 and more or equal to 200 ranked races": "英雄级驾照需要 ELO 至少达到 10000 且完成 200 场或以上排名赛",
    "We implemented an own safety rating system which calculates your overall safety on track.": "我们实施了独立的安全评分系统，用于计算您在赛道上的整体安全性。",
    "The formula to calculate your rating is complicated, but it takes into account how many incidents per corner you have during the race.": "计算评分的公式较为复杂，但它会考虑您在比赛中每弯道的事故次数。",
    "So if you crash early and quit the race, you will for sure get minus, because your incident per corner ratio is high.": "因此，如果您过早撞车并退出比赛，您肯定会扣分，因为您的每弯道事故率很高。",
    "If you crash but finish your race you can reduce the inc per corner ratio and the chance to get plus or much less minus is high if you continue safely.": "如果您撞车但完赛，您可以降低每弯道事故率，并且如果您继续安全驾驶，获得加分或大幅减少扣分的机会就很高。",
    "The safety rating scale is from 1.00 (The lowest) to 9.99 (The highest).": "安全评分范围从 1.00（最低）到 9.99（最高）。",
    "Every driver starts at a minimum rating of 2.50.": "每位车手从最低评分 2.50 开始。",
    "You can gain a maximum of 0.3 per race plus a bonus which depends on your actual rating.": "每场比赛您最多可获得 0.3 分，外加根据您实际评分而定的奖励。",
    "If you finish with 0 incident points you get an additional 0.1 safety rating boost.": "如果您以 0 事故分完赛，您将额外获得 0.1 安全评分加成。",
    "If you are in a high range of safety rating your maximum gain for clean races will get less.": "如果您处于安全评分的高分段，您在干净比赛中的最大收益将减少。",
    "You can lose a maximum of 0.5 per race plus or minus a bonus depending on your actual rating.": "每场比赛您最多可能损失 0.5 分，外加根据您实际评分而定的奖励加减。",
    "If you are for example in a low range your max loss is less, if you are in a high range, your max loss is higher.": "例如，如果您处于低分段，您的最大损失较小；如果您处于高分段，您的最大损失较大。",
    "Incident points will be calculated like this:": "事故分计算方式如下：",
    "Everything that causes car damage will result in 4 incident points (Car contacts, wall contacts etc).": "任何导致车辆受损的行为将产生 4 个事故分（如车体接触、撞墙等）。",
    "Track cuts (depends on what ACC is logging, sometimes ACC doesn’t log a track cut) will give you 1 incident point.": "切弯（取决于 ACC 的记录情况，有时 ACC 不会记录切弯）将给您 1 个事故分。",
    "SR License": "安全评分驾照",
    "SR": "安全评分",
    "Ranked Races": "排名赛次数",

    // 赛事详情
    "Race Detail": "比赛详情",
    "COPY LINK": "复制链接",
    "Split": "分组",
    "information": "信息",
    "Qualifying Results": "排位赛结果",
    "Race Results": "正赛结果",
    "Entrylist": "参赛名单",
    "Additional Charts": "附加图表",
    "num.": "编号",
    "Origin": "国籍",
    "Name": "姓名",
    "Team": "车队",
    "ELO": "ELO",
    "LFM License": "LFM驾照",
    "Socials": "社交账号",
    "Livery": "涂装",
    "Car Class": "车辆组别",
    "All": "全部",

    "Servername:": "服务器名称：",
    "Safety Rating Req.:": "安全评分要求：",
    "Password:": "密码：",
    "Car Slots:": "车辆数量：",
    "Track Medals Req.:": "赛道奖牌要求：",
    "Pre Race Waiting Time:": "赛前等待时间：",
    "Racecraft Rating Req.:": "驾驶技术评分要求：",
    "Post Race Waiting Time:": "赛后等待时间：",
    "Short Formation Lap:": "短编队圈：",
    "Session Overtime:": "超时时间：",
    "Server Settings": "服务器设置",
    "pitstop": "进站",
    "Mandatory Pitstops:": "强制进站：",
    "Available Tyre Sets:": "可用轮胎套数：",
    "Pitwindow Length:": "进站窗口时长：",
    "Tyrechange Mandatory:": "强制换胎：",
    "Refuelling Required:": "需要加油：",
    "Fixed Refuelling Time (25 Sec.):": "固定加油时间（25秒）：",
    "Refuelling Allowed:": "允许加油：",
    "Driver Change Required:": "需要换人：",
    "Session": "环节",
    "Session Length": "时长",
    "Day of Raceweekend": "比赛周末中的天数",
    "Hour of Day": "一天中的小时",
    "Time Multiplier": "时间倍数",
    "Practice": "练习赛",
    "Qualifying": "排位赛",
    "Race": "正赛",
    "°C": "°C",
    "Clouds": "云量",
    "Rain": "降雨",
    "Randomness": "随机性",
    "Serverstart:": "服务器启动：",
    "Thursday, 02 July 2026 at 15:45 GMT+8": "2026年7月2日星期四 15:45 GMT+8",
    "lowfuelmotorsport.com | Season 22 | GO Setups GT3 Sprint Series | WEEK 12 | LFM": "lowfuelmotorsport.com | 第22赛季 | GO Setups GT3冲刺系列赛 | 第12周 | LFM",

    // 赛事报名
    "Sign Up": "报名",
    "Choose your livery": "选择您的涂装",
    "(optional)": "（可选）",
    "CODE OF CONDUCT - EN": "行为准则 - 英文",
    "*Car number will be assigned automatically by your driver rating!": "*车号将根据您的车手评分自动分配！",
    "I am fully accepting the 'Code of Conduct' of the LFM racing service.": "我完全接受 LFM 赛车服务的《行为准则》。",
    "I will not use the ingame chat and I am aware that I can be banned if I insult players.": "我不会使用游戏内聊天，并且我清楚如果侮辱其他玩家可能会被禁赛。",
    "I will report other players for incidents and not deliberately take self justice on track.": "我会举报其他玩家的事故行为，不会在赛道上故意自行执法。",
    "The free practice session is ONLY for JOINING!": "自由练习环节仅用于进入服务器！",
    "DO NOT GO OUT ON TRACK (only allowed in the ACC Driver endurance and Prime Series)!": "请不要驶上赛道（仅在 ACC 车手耐力赛和 Prime 系列赛中允许）！",
    "SIGN ME UP!": "我要报名！",
    "CANCEL": "取消",
    "I DRIVE": "I DRIVE",
    "TEAM": "车队",

    // 赛后举报
    'Report Incident': '报告事故',
    'Lap*': '第几圈*',
    'Turn*': '弯道*',
    'Report Opponent': '举报对象',
    'Reporting Category': '举报类别',
    'Reporting Reason': '举报原因',
    'Upload Report Video': '上传举报视频',
    'Enter Video Link': '输入视频链接',
    'Video link': '视频链接',
    'Message*': '消息*',
    'Reporting Guideline ACC:': 'ACC举报指南：',
    'ENGLISH PDF': '英文PDF',
    'DEUTSCHES PDF': '德文PDF',
    "*Upload a video to YouTube or another video platform as unlisted and paste the link here. ( streamable.com )": "请将视频上传至 YouTube 或其他视频平台（设为“不公开”），并将链接粘贴在此处。(streamable.com)",
    'I confirm that I have read the reporting guideline and my reporting video meets the requirements!*': '我确认我已阅读举报指南，并且我的举报视频符合要求！*',
    '* Required': '* 必填',
    'Report submitted successfully.': '报告提交成功。',
    'Report saved!': '报告已保存！',
    ' – you can close this window now!': ' – 您现在可以关闭此窗口！',
    'SUBMITTED': '已提交',
    'Send report': '提交报告',
    'Close': '关闭',
    'Reports left:': '剩余举报次数：',

    // 欢迎banner
    "WORLDS LEADING INDEPENDENT": "全球领先的独立",
    "COMPETITIVE SIMRACING PLATFORM": "竞技模拟赛车平台",
    "GO RACING!": "开始比赛！",
    "TODAY NEW USERS": "今日新增用户",
    "USERS": "用户",
    "CURRENTLY RACING": "当前在赛",
    "TOTAL LAPS DRIVEN": "总驾驶圈数",

    // 热门赛事
    "WHATS HOT": "热门赛事",
    "TODAY NEW USERS": "今日新增用户",
    "USERS": "用户",
    "CURRENTLY RACING": "当前在赛",
    "TOTAL LAPS DRIVEN": "总驾驶圈数",
    "GO RACING!": "开始比赛！",
    "REQUIREMENTS NOT MET": "不满足要求",
    "MIN. E2": "最低 E2",
    "MIN. F": "最低 F",
    "MIN. E3": "最低 E3",
    "MIN. D3": "最低 D3",
    "MIN. D2": "最低 D2",
    "LFM-GTC": "LFM-GTC",
    "TCR Cup": "TCR杯",
    "Open Wheel Championship": "开轮式锦标赛",
    "GO Setups GT3 Sprint Series": "GO Setups GT3冲刺系列赛",
    "GT3 Series": "GT3系列赛",
    "Formula Hybrid Series": "混合方程式系列赛",
    "Nordschleife Sprint Cup": "纽博格林北环冲刺杯",
    "Mazda Cup": "马自达杯",

    // 直播
    "BROADCASTS": "直播",
    "sim-verse.com LMU Pro Series": "sim-verse.com LMU职业系列赛",
    "TOSS": "速度殿堂系列赛",

    // 新闻
    'NEWS': '新闻',
    'LOAD MORE': '加载更多',

    // 支持LFM浮窗
    'Support LFM': '支持 LFM',
    'Help us reach the next goal': '帮助我们达成下一个目标',
    'LFM+ Members': 'LFM+ 会员',
    'Support LFM+ or make an extra donation.': '支持 LFM+ 或进行额外捐赠。',
    'INFO': '信息',
    'DONATE': '捐赠',

    // 全局页脚
    'HOME': '主页',
    'IMPRESSUM': '法律声明',
    'BECOME A LFM+ Member!': '成为 LFM+ 会员！',
    'CONTACT': '联系我们',
    'DATENSCHUTZ': '隐私政策',
    'LFM MERCH': 'LFM 周边',
    '© 2026 by 255 Systems UG (haftungsbeschränkt) | developed by Boris Schalk | "LFM Logo" design by 513 DESIGNS - Andreas Belic': '© 2026 由 255 Systems UG (责任有限) 所有 | 由 Boris Schalk 开发 | "LFM Logo" 由 513 DESIGNS - Andreas Belic 设计 | 由 Hwangzhun 汉化',

    'FAQ': '常见问题',
    'Notifications': '通知',
    'You have 0 new notifications.': '你有 0 条新通知。',
    'All fine! No notifications right now.': '一切正常！当前没有通知。',
    'Mark all as read': '全部标记为已读',
    'My Account': '我的账户',
    'Profile Page': '个人主页',
    'My Liveries': '我的涂装',
    'Messages': '消息',
    'Bright Mode': '亮色模式',
    'Dark Mode': '暗色模式',
    'Logout': '退出登录',

    // 统计数据
    'Joined:': '加入时间：',
    'STATISTICS': '统计数据',
    'SEASONS RACES': '赛季比赛',
    'TRACK STATS': '赛道统计',
    '赛车统计': '赛车统计',
    'ACHIEVEMENTS': '成就',
    'LIVERY SHOWROOM': '涂装展示厅',
    'PENALTIES': '处罚',
    'STARTS (RANKED)': '参赛次数（排名赛）',
    'WINS': '胜利',
    'PODIUM': '领奖台',
    'PODIUM RATE': '领奖台率',
    'TOP 5': '前五',
    'TOP 10': '前十',
    'POLES': '杆位',
    '未完赛': '未完赛',
    'CLEAN RACES': '干净比赛',
    'AVG IP.': '平均事故分',
    'AVG Q. POS': '平均排位赛名次',
    'AVG R. POS': '平均正赛名次',
    'RATINGS & LICENSES': '评分与驾照',
    'ELO RATING PROGRESSION': 'ELO 评分变化趋势',
    'SAFETY RATING PROGRESSION': '安全评分变化趋势',

    // 赛季比赛
    'SEASON RACES': '赛季比赛',
    'Race ID': '比赛 ID',
    'Date': '日期',
    'Series': '系列赛',
    'Car': '车辆',
    'Track': '赛道',
    'Start Pos': '发车位',
    'Fin. Pos': '完赛名次',
    'ELO': 'ELO',
    'Points': '积分',
    'SoF': '实力系数',
    'Search...': '搜索...',
    'Season / Series': '赛季 / 系列赛',

    // 赛道统计
    'TYPE': '类型',
    'Simulation': '模拟器',
    'CLASS': '组别',
    'BOP / Gameversion': '性能平衡 / 游戏版本',
    'Track Records': '赛道纪录',
    'Assetto Corsa Competizione': '神力科莎：竞速',
    '2024 (>= 1.9.6)': '2024 (>= 1.9.6)',
    'NO DATA FOUND': '未找到数据',
    'Assetto Corsa EVO': '神力科莎 EVO',
    'Assetto Corsa': '神力科莎',
    'Automobilista 2': '汽车运动 2',
    'RaceRoom Racing Experience': '竞速房赛车体验',
    'iRacing': 'iRacing',
    'Le Mans Ultimate': '勒芒终极',

    // 赛车统计
    'CAR MODEL': '车型',
    'LAPS': '圈数',
    'KILOMETERS': '里程（公里）',
    'Usage': '使用统计',
    'GT3': 'GT3',
    'BMW M4 GT3': '宝马 M4 GT3',
    'Porsche 992 GT3 R': '保时捷 992 GT3 R',
    'Lexus RC F GT3': '雷克萨斯 RC F GT3',

    



    // Extracted from the current LFM Nuxt language bundle, 2026-07.
    "Welcome": "欢迎",
    "no notification": "暂无通知",
    "Copy link to clipboard": "复制链接到剪贴板",
    "{url} copied to clipboard": "{url} 已复制到剪贴板",
    "Tutorial Videos": "教程视频",
    "ACC License Test Track Guide": "ACC 驾照测试赛道指南",
    "LFM Assetto Corsa Tutorial": "LFM Assetto Corsa 教程",
    "Assetto Corsa Tutorial": "Assetto Corsa 教程",
    "WARNING! ACC SERVERS ARE OFFLINE!": "警告！ACC 服务器离线！",
    "ACC Lobby servers are currently offline and you are signed up for an ACC race!": "ACC 大厅服务器当前离线，而你已报名一场 ACC 比赛！",
    "You need to use the ACC Connector to be able to compete!": "你需要使用 ACC Connector 才能参赛！",
    "We do not delete any race results because of offline Kunos Lobby Servers.": "我们不会因为 Kunos 大厅服务器离线而删除任何比赛结果。",
    "Just use the Connector, as shown here:": "请按这里所示使用 Connector：",
    "Setting it up takes less than 2 minutes!": "设置只需不到 2 分钟！",
    "ACC Race": "ACC 比赛",
    "OPEN ACC CONNECTOR": "打开 ACC CONNECTOR",
    "CLOSE": "关闭",
    "Installation & Setup": "安装与设置",
    "Click on": "点击",
    "Settings": "设置",
    "Install hook": "安装 Hook",
    "JOINING SERVER": "加入服务器",
    "Join": "加入",
    "OK": "确定",
    "LAN Server": "局域网服务器",
    "Username cannot be empty.": "用户名不能为空。",
    "First name cannot be empty.": "名字不能为空。",
    "Last name cannot be empty.": "姓氏不能为空。",
    "The 3-letter shortname cannot be empty.": "三字母缩写不能为空。",
    "The shortname must be exactly 3 characters long.": "缩写必须正好为 3 个字符。",
    "Origin cannot be empty.": "国家/地区不能为空。",
    "LINK": "关联",
    "UNLINK": "解除关联",
    "CLEAR": "清除",
    "LOOKUP…": "查找…",
    "GET ID": "获取 ID",
    "Active Patreon membership cannot be unlinked.": "有效的 Patreon 会员无法解除关联。",
    "LICENSE (ACC ONLY)": "驾照（仅 ACC）",
    "LFM TRACK PERMIT (ACC ONLY)": "LFM 赛道许可（仅 ACC）",
    "Status:": "状态：",
    "Valid ACC license": "有效 ACC 驾照",
    "No valid ACC license": "无有效 ACC 驾照",
    "Track:": "赛道：",
    "Target Time:": "目标时间：",
    "Laps:": "圈数：",
    "Details:": "详情：",
    "No permit data found.": "未找到许可数据。",
    "VALID": "有效",
    "NOT VALID": "无效",
    "Track Permit": "赛道许可",
    "Avg. Time": "平均时间",
    "CHAT": "聊天",
    "Conversations": "会话",
    "No messages yet.": "暂无消息。",
    "Type your message...": "输入消息...",
    "SEND": "发送",
    "Insert emoji": "插入表情",
    "Search emoji...": "搜索表情...",
    "No emojis found.": "未找到表情。",
    "Delete conversation": "删除会话",
    "Failed to load conversations.": "加载会话失败。",
    "Failed to load messages.": "加载消息失败。",
    "Sending failed.": "发送失败。",
    "Enter = Send": "Enter = 发送",
    "Shift+Enter = New line": "Shift+Enter = 换行",
    "sending…": "发送中…",
    "failed": "失败",
    "Yesterday": "昨天",
    "Recent": "最近",
    "People": "人物",
    "Food": "食物",
    "Objects": "物品",
    "Nature": "自然",
    "Activities": "活动",
    "Flags": "旗帜",
    "Complete your profile": "完善你的个人资料",
    "Username": "用户名",
    "First name": "名字",
    "Last name": "姓氏",
    "3-letter shortname": "三字母缩写",
    "SAVE PROFILE": "保存资料",
    "SAVING...": "保存中...",
    "Please fill in all required fields.": "请填写所有必填字段。",
    "Profile updated successfully.": "个人资料已更新。",
    "Attention!": "注意！",
    "SAVE NAME": "保存姓名",
    "CAR CLASS": "车辆组别",
    "CAR": "车辆",
    "MAJOR PATCH": "主要版本",
    "VERSION": "版本",
    "SOURCE": "来源",
    "VIEW": "视图",
    "LOAD": "加载",
    "LOADING...": "加载中...",
    "SETUP": "调校",
    "CAR NAME": "车辆名称",
    "LAP": "圈速",
    "GAP": "差距",
    "BALLAST": "配重",
    "RESTR.": "限流",
    "ACC - BALANCE OF PERFORMANCE": "ACC - 性能平衡",
    "ACC - Balance Of Performance": "ACC - 性能平衡",
    "Download BoP.json": "下载 BoP.json",
    "DOWNLOADING...": "下载中...",
    "User not available.": "用户不可用。",
    "Download failed.": "下载失败。",
    "Year": "年份",
    "Restrictor": "限流",
    "Ballast": "配重",
    "Change": "变化",
    "Contact": "联系",
    "Achievements": "成就",
    "Achievement": "成就",
    "Trophies": "奖杯",
    "Medals": "奖牌",
    "Gold": "金牌",
    "Silver": "银牌",
    "Bronze": "铜牌",
    "Reason": "原因",
    "Report details": "举报详情",
    "Lap": "圈",
    "Turn": "弯",

    // Extracted completion pass from current LFM language bundle, 2026-07.
    "We are using a tool called \"ACC Connector\" by": "我们正在使用一个名为 “ACC Connector” 的工具，作者是",
    "with which you can join our race servers, even if the Kunos Lobby servers are offline.": "通过它，即使 Kunos 大厅服务器离线，你也可以加入我们的比赛服务器。",
    "Once you downloaded the tool, install it and open it after that.": "下载工具后，请安装并打开它。",
    "Set your ACC install directory (the one in the Steam library).": "设置你的 ACC 安装目录（Steam 库中的那个目录）。",
    "like shown in the picture above.": "如上图所示。",
    "If you are registered for a race and the server is running, you will get this button at the session like in the picture below. Click the": "如果你已经报名比赛且服务器正在运行，你会在场次页面看到如下图所示的按钮。点击",
    "button.": "按钮。",
    "After you clicked the button, the following popup will appear:": "点击按钮后，会出现以下弹窗：",
    "If you are ready and installed everything as mentioned, click on": "如果你已准备好并按说明完成安装，请点击",
    "Your browser will then ask to open the ACC Connector tool.": "随后浏览器会询问是否打开 ACC Connector 工具。",
    "Click the button to open the ACC Connector!": "点击按钮打开 ACC Connector！",
    "If everything went fine, you will see the server added to the Connector server list:": "如果一切正常，你会看到服务器已添加到 Connector 服务器列表：",
    "Now you can join the server in ACC via the": "现在你可以在 ACC 的",
    "tab in the multiplayer area.": "多人游戏区域标签页中加入服务器。",
    "Once the race has finished, you should delete the server from the Connector list and remove the hook if you do not want to race any more LFM races after that.": "比赛结束后，如果之后不再参加 LFM 比赛，建议从 Connector 列表中删除该服务器并移除 Hook。",
    "ACC Connector start screen": "ACC Connector 起始界面",
    "ACC Connector settings button": "ACC Connector 设置按钮",
    "ACC install directory settings": "ACC 安装目录设置",
    "ACC Connector install hook": "ACC Connector 安装 Hook",
    "Join Server button on LFM session": "LFM 场次页面的加入服务器按钮",
    "ACC Connector browser popup": "ACC Connector 浏览器弹窗",
    "Browser confirmation for ACC Connector": "浏览器打开 ACC Connector 的确认提示",
    "Server added to ACC Connector list": "服务器已添加到 ACC Connector 列表",
    "ACC LAN Server tab": "ACC 局域网服务器标签页",
    "Remove server from ACC Connector list": "从 ACC Connector 列表移除服务器",
    "Only enter your channel name or handle, not the full URL": "只输入频道名称或账号，不要输入完整 URL",
    "Only enter your Twitch name, not twitch.tv/": "只输入 Twitch 名称，不要输入 twitch.tv/",
    "Only enter your Instagram name, not www.instagram.com/": "只输入 Instagram 名称，不要输入 www.instagram.com/",
    "Only enter your X/Twitter name, not x.com/": "只输入 X/Twitter 名称，不要输入 x.com/",
    "Click to view permit details": "点击查看许可详情",
    "Available permits": "可用许可",
    "To get your track permit for the \"{track}\", just head over to the server browser in ACC, and search for \"LFMTP\" to get the track permit servers. Password for the permit server is \"lfm\".": "要获得 “{track}” 的赛道许可，请前往 ACC 服务器浏览器，搜索 “LFMTP” 找到赛道许可服务器。许可服务器密码为 “lfm”。",
    "To be able to get your permit, you need to do {laps} consecutive valid laps, and the average laptime needs to be below {targetTime}.": "要获得许可，你需要连续完成 {laps} 个有效圈，并且平均圈速低于 {targetTime}。",
    "Once you finished your laps, you can leave the server. You will get a notification on the website once you passed your license.": "完成圈数后即可离开服务器。通过许可后，你会在网站上收到通知。",
    "Keep in mind, it takes some time after you leave the server, because the server first needs to write a logfile. This logfile is written when the session is over, or the server is empty.": "请注意，离开服务器后需要等待一段时间，因为服务器需要先写入日志文件。日志会在场次结束或服务器为空时写入。",
    "Your permit status for": "你的许可状态：",
    "Valid for Permit": "许可有效",
    "No stint data found.": "未找到 Stint 数据。",
    "Select a conversation to start chatting": "选择一个会话开始聊天",
    "Delete conversation with \"{name}\"?": "删除与 “{name}” 的会话？",
    "Deleting the conversation failed.": "删除会话失败。",
    "Invalid conversation.": "无效会话。",
    "Smileys": "笑脸",
    "Reactions": "回应",
    "Gestures": "手势",
    "Hearts": "爱心",
    "Racing": "赛事",
    "Animals": "动物",
    "LFM+ Support & Goals": "LFM+ 支持与目标",
    "Status": "状态",
    "Take me to the LFM+ sign up page": "前往 LFM+ 注册页面",
    "Donate now": "立即捐赠",
    "Before you can continue, please complete all required profile fields.": "继续之前，请先完善所有必填资料字段。",
    "Please select an origin from the dropdown list.": "请从下拉列表中选择国家/地区。",
    "The shortname must contain 1 to 3 letters or numbers.": "缩写必须包含 1 到 3 个字母或数字。",
    "Server error while updating your profile.": "更新个人资料时服务器出错。",
    "You are required to change your name!": "你需要修改姓名！",
    "Please follow the rules for names like stated in our CoC.": "请遵守行为准则中的姓名规则。",
    "Use a proper first and last name that can occur in the real world.": "请使用现实中可能出现的正常名字和姓氏。",
    "No trolling or gamer tag names": "不要使用恶搞或游戏昵称式姓名",
    "No advertisement for websites, shops or anything else": "不要包含网站、商店或其他广告信息",
    "When you change your name our support team will review the change and may request another change if your name does not comply to our rules.": "修改姓名后，我们的支持团队会审核；如果姓名不符合规则，可能会要求你再次修改。",
    "Name change submitted successfully.": "姓名修改已提交。",
    "Your name change was submitted, but another change is still required.": "姓名修改已提交，但仍需要再次修改。",
    "Server error while submitting your name change.": "提交姓名修改时服务器出错。",
    "S": "S",
    "A1": "A1",
    "A2": "A2",
    "A3": "A3",
    "B1": "B1",
    "B2": "B2",
    "B3": "B3",
    "C1": "C1",
    "C2": "C2",
    "C3": "C3",
    "D1": "D1",
    "D2": "D2",
    "D3": "D3",
    "E1": "E1",
    "E2": "E2",
    "E3": "E3",
    "F": "F",
    "How to join the Hotlap Server:": "如何加入 Hotlap 服务器：",
    "Search for <b>LFMHL</b> in the ACC Serverbrowser": "在 ACC 服务器浏览器中搜索 <b>LFMHL</b>",
    "The serverpassword is <b>lfmhl</b>": "服务器密码是 <b>lfmhl</b>",
    "<b>Important:</b> These servers are intended to be used to set hotlaps for our balance of performance. Please do NOT use this server for practice and do not hinder fast drivers from setting hotlaps.": "<b>重要：</b>这些服务器用于为性能平衡收集 Hotlap 数据。请不要将其用于练习，也不要妨碍快车手刷圈。",
    "Save your motec telemetry and replay files! We reserve the right to request your telemetry/replay files. If you cannot deliver these upon request, we will delete the respective lap. Any cheating or bug using will be punished. Our Code of Conduct must be followed.": "请保存你的 MoTeC 遥测和回放文件！我们保留要求提供遥测/回放文件的权利。如果无法按要求提供，我们将删除相应圈速。任何作弊或利用漏洞都会受到处罚，并必须遵守我们的行为准则。",
    "In the <b>KUNOS BOP</b> tab below you can find all hotlaps that were set without any additional ballast. The <b>LFM BOP</b> shows laps that were set with additional ballast.": "在下方 <b>KUNOS BOP</b> 标签页中，你可以查看未加额外配重完成的所有 Hotlap。<b>LFM BOP</b> 显示带额外配重完成的圈速。",
    "You can find an in-depth explanation of the LFM Balance of Performance here:": "你可以在这里查看 LFM 性能平衡的详细说明：",
    "LFM BALANCE OF PERFORMANCE": "LFM 性能平衡",
    "GoSetups Hotlaps": "GoSetups Hotlap",
    "No hotlaps found.": "未找到 Hotlap。",
    "⏱ Target time: {time}": "⏱ 目标时间：{time}",
    "BOP Target time: {time}": "BOP 目标时间：{time}",
    "All laptimes": "所有圈速",
    "Hotlaps by car": "按车辆查看 Hotlap",
    "Car times / BOP prediction": "车辆圈速 / BOP 预测",
    "All Laptimes": "所有圈速",
    "Hotlaps by car with latest ballast": "按车辆查看带最新配重的 Hotlap",
    "S1": "S1",
    "S2": "S2",
    "S3": "S3",
    "V": "V",
    "BOP LAP PRED.": "BOP 预测圈速",
    "GAP TO TARGET": "与目标差距",
    "BOP (POSSIBLE)": "BOP（可行）",
    "BOP (RAW)": "BOP（原始）",
    "Below you can find the current Balance of Performance. Our BoP is dynamic and will be updated once a week on monday morning before the first session of the season week takes place.": "下方是当前性能平衡。我们的 BoP 是动态的，会在每周一早上、赛季周首场比赛开始前更新一次。",
    "Our Balance of Performance is based on hotlap data and the ballast of each car is automatically calculated based on a target time and a track-dependent value for the ballast calculation. Visit our": "我们的性能平衡基于 Hotlap 数据，每辆车的配重会根据目标时间和赛道相关的配重计算值自动计算。请访问我们的",
    "ACC Hotlaps": "ACC Hotlap",
    "page to see the hotlap data of all cars and a BoP prediction for the next week.": "页面查看所有车辆的 Hotlap 数据和下周 BoP 预测。",
    "In case of game updates that affect the Balance of Performance we may remove certain tracks from our BoP until enough valuable data is available again.": "如果游戏更新影响性能平衡，我们可能会暂时从 BoP 中移除部分赛道，直到重新获得足够有效的数据。",
    "We would like to thank Haunted for his excellent work in supporting the LFM Balance of Performance and": "感谢 Haunted 在支持 LFM 性能平衡方面的出色工作，以及",
    "for providing us with their hotlap data in addition to our own.": "除我们自己的数据外，还向我们提供了他们的 Hotlap 数据。",
    "If you are an LFM Patreon supporter you can download our Balance of Performance below for use on your own servers.": "如果你是 LFM Patreon 支持者，可以在下方下载我们的性能平衡文件，用于自己的服务器。",
    "I confirm that I will mention LFM and the use of the LFM BoP in my league/event on all event specific communications.": "我确认会在我的联赛/赛事所有相关说明中提及 LFM 以及使用了 LFM BoP。",
    "DOWNLOAD SERVER READY BOP.JSON FILE": "下载服务器可用的 BOP.JSON 文件",
    "Downloading of this file is only available for Patreon members.": "该文件仅 Patreon 会员可下载。",
    "Class": "组别",
    "No BoP data available.": "暂无 BoP 数据。",
    "Track BoP Version": "赛道 BoP 版本",
    "Active since": "启用时间",
    "Join Discord": "加入 Discord",
    "No achievements found.": "未找到成就。",
    "Attention! Your action required!": "注意！需要你处理！",
    "You have pending reports against you that must be reviewed.": "你有待处理的针对你的举报需要查看。",
    "Code of Conduct (English)": "行为准则（英文）",
    "Reporting Guideline (English)": "举报指南（英文）",
    "Loading...": "加载中...",
    "Pending self acceptance reports": "待自行确认的举报",
    "No pending self acceptance reports.": "暂无待自行确认的举报。",
    "Lap/Turn": "圈数/弯角",
    "Are you sure with your Choice?": "确定你的选择吗？",
    "Yes": "是",
    "No": "否",
    "Expected penalty": "预计处罚",
    "If you accept:": "如果你接受：",
    "If a steward would judge against you:": "如果干事判定你有责：",
    "Evidence": "证据",
    "Answer": "答复",
    "Show": "显示",
    "Back": "返回",
    "Send": "发送",
    "Sending...": "发送中...",
    "Cancel": "取消",
    "Your point of view": "你的观点",
    "Describe your point of view...": "描述你的观点...",
    "I accept the report and the penalty": "我接受举报和处罚",
    "I am not guilty here": "我认为自己没有责任",
    "I am guilty, but the wrong penalty or reason was chosen / Report is not correct": "我有责任，但处罚或原因选择错误 / 举报内容不正确",
    "I was already punished for that incident": "我已经因该事故受到处罚",
    "UP NEXT": "即将开始",
    "Back to Series Overview": "返回系列概览",
    "LIST TYPE": "列表类型",
    "Horizontal Timeline": "横向时间线",
    "Vertical List": "纵向列表",
    "TEAM / DRIVER SWAP RACES": "车队 / 换人比赛",
    "ONLY ELIGIBLE RACES": "仅显示符合条件的比赛",
    "No upcoming races available right now.": "当前没有即将开始的比赛。",
    "Signup opens soon": "报名即将开放",
    "Sign up": "报名",
    "Not interested": "不感兴趣",
    "Interested": "感兴趣",
    "Signout closes soon": "退赛即将截止",
    "Sign out": "退赛",
    "CHANGE": "更改",
    "MY LIVERIES": "我的涂装",
    "Upload livery": "上传涂装",
    "To upload liveries you need a LFM+ subscription!": "上传涂装需要 LFM+ 订阅！",
    "Heads up:": "注意：",
    "Livery Upload": "涂装上传",
    "SIMULATION": "模拟器",
    "PLEASE USE OUR NEW LFM APP FOR UPLOADING ACC LIVERIES!": "请使用新的 LFM App 上传 ACC 涂装！",
    "GO TO LFM APP": "前往 LFM App",
    "LIVERY NAME": "涂装名称",
    "Loading cars…": "正在加载车辆…",
    "PERSONAL / TEAM LIVERY": "个人 / 车队涂装",
    "Team liveries will be available to use for all team members with an active patreon subscription.": "车队涂装可供所有拥有有效 Patreon 订阅的车队成员使用。",
    "SHOWROOM SCREENSHOT (PNG)": "展厅截图（PNG）",
    "SKIN.DDS": "SKIN.DDS",
    "UPLOAD": "上传",
    "No file selected": "未选择文件",
    "I declare that i have the rights to use this livery, and that it is free of any rights of third parties. Uploading a livery with false screenshots, showing of racist/insulting or harrassing symbols, texts or pictures will result in a permanent ban.": "我声明我拥有使用该涂装的权利，并且该涂装不侵犯任何第三方权利。上传带有虚假截图、种族歧视、侮辱或骚扰性符号、文字或图片的涂装将导致永久封禁。",
    "This simulation is not supported here.": "此模拟器在这里不受支持。",
    "Personal livery": "个人涂装",
    "Team livery →": "车队涂装 →",
    "Team livery": "车队涂装",
    "Default": "默认",
    "Livery name": "涂装名称",
    "Uploaded": "已上传",
    "No liveries found for current filter.": "当前筛选条件下未找到涂装。",
    "Default livery": "默认涂装",
    "Set as default": "设为默认",
    "Delete": "删除",
    "Are you sure?": "确定吗？",
    "apiBase is empty (config.public.apiBase).": "apiBase 为空（config.public.apiBase）。",
    "Not authorized. Please login.": "未授权，请登录。",
    "Failed to load liveries.": "加载涂装失败。",
    "Delete failed": "删除失败",
    "Set default failed": "设置默认失败",
    "Your screenshot file is bigger than 4096kb": "你的截图文件大于 4096kb",
    "Your skin.dds file is bigger than 25000kb": "你的 skin.dds 文件大于 25000kb",
    "Upload failed": "上传失败",
    "Upload successful. Your livery will appear after approval.": "上传成功。审核通过后你的涂装会显示出来。",
    "⏳ waiting for approvement": "⏳ 等待审核",
    "✔ approved": "✔ 已通过",
    "✖ declined!": "✖ 已拒绝！",
    "? unknown": "? 未知",
    "Open screenshot": "打开截图",
    "Select car…": "选择车辆…",
    "Privacy settings": "隐私设置",
    "We use optional cookies/tracking for analytics. You can reject, accept or choose individually.": "我们使用可选 Cookie/追踪进行分析。你可以拒绝、接受或单独选择。",
    "Analytics": "分析",
    "Helps us understand how the site is used.": "帮助我们了解网站的使用情况。",
    "REJECT": "拒绝",
    "ACCEPT": "接受",
    "Live Server Available": "实时服务器可用",
    "A server for one of your signed-up sessions is now live.": "你报名的某个场次服务器现已开放。",
    "Launch Options": "启动选项",
    "Choose how to launch AMS2.": "选择如何启动 AMS2。",
    "Desktop": "桌面模式",
    "SERVERNAME": "服务器名",
    "SPLIT": "分组",
    "PASSWORD": "密码",
    "Open LFM App to see the password": "打开 LFM App 查看密码",
    "Open LFM App to see the lobbycode": "打开 LFM App 查看大厅代码",
    "JOIN": "加入",
    "Available": "可用",
    "Not available": "不可用",
    "AMS2 requires launch selection (Desktop / VR).": "AMS2 需要选择启动方式（桌面 / VR）。",
    "RaceRoom requires a livery selection before joining.": "RaceRoom 加入前需要选择涂装。",
    "No usable join link was returned. You can still use the server info above.": "未返回可用的加入链接。你仍可使用上方服务器信息。",
    "members": "会员",
    "Driver Rating Leaderboard": "车手评分排行榜",
    "Safety Rating Leaderboard": "安全评分排行榜",
    "most active drivers": "最活跃车手",
    "Driver Performance": "车手表现",
    "Laptime Distribution": "圈速分布",
    "Car Statistics": "车辆统计",
    "Laptime by ELO Range": "按 ELO 分段的圈速",
    "User Developement": "用户发展",
    "Community Spread": "社区分布",
    "ELO Distribution": "ELO 分布",
    "Safety Rating Distribution": "安全评分分布",
    "bright mode": "亮色模式",
    "dark mode": "暗色模式",
    "seasons races": "赛季比赛",
    "favourite cars": "常用车辆",
    "Track Stats": "赛道统计",
    "Statistics": "统计",
    "official": "官方",
    "Standings": "积分榜",
    "prizes": "奖品",
    "upcoming sessions": "即将开始的场次",
    "practice sessions": "练习场次",
    "recent sessions": "最近场次",
    "standings": "积分榜",
    "my sessions": "我的场次",
    "schedule": "赛程",
    "pre-qualifying": "预排位",
    "search results": "搜索结果",
    "My Races": "我的比赛",
    "My Series": "我的系列赛",
    "Penalties & Reports": "处罚与举报",
    "Upcomings Races": "即将开始的比赛",
    "Past Races": "过往比赛",
    "My Penalties": "我的处罚",
    "Report Outcomes": "举报结果",
    "My Permits": "我的许可",
    "Penalties": "处罚",
    "Pending Reports": "待处理举报",
    "LFM Plus": "LFM Plus",
    "Exclude drop rounds": "不计入扣除轮次",
    "Hotlap-Based Split Assignment": "基于 Hotlap 的分组分配",
    "This series uses pre-qualifying times for split assignment for the entire season. Your split is determined by your best hotlap in the respective class, not by your rating.": "该系列赛使用预排位成绩为整个赛季分配分组。你的分组由对应组别的最佳 Hotlap 决定，而不是由评分决定。",
    "The splits are recalculated for every race based on the current pre-qualifying ranking and the drivers who actually sign up. Being in the top 20 for GT3s and top 18 for Hypercars keeps you safe for split 1, but drivers just outside can still move up if higher-ranked drivers do not register. Use the LFM App to set or improve your lap for the best possible placement.": "每场比赛都会根据当前预排位排名和实际报名车手重新计算分组。GT3 前 20 名和 Hypercar 前 18 名通常可以稳进 Split 1，但如果更高排名的车手未报名，排名稍后的车手仍可能递补。请使用 LFM App 刷新或提升圈速，以获得尽可能好的分组。",
    "The car you use for pre-qualifying does not have to be the same car you use during the regular season.": "预排位使用的车辆不必与常规赛季使用的车辆相同。",
    "GET LFM APP": "获取 LFM App",
    "{count} entries": "{count} 条记录",
    "CURRENT PRE-QUALI TRACK": "当前预排位赛道",
    "Track country": "赛道所在国家",
    "Safe zone for Split 1 ends here": "Split 1 安全区到此结束",
    "BEST LAP": "最佳圈速",
    "Unknown Driver": "未知车手",
    "No pre-qualifying times found.": "未找到预排位成绩。",
    "Unable to load the pre-qualifying leaderboard right now.": "当前无法加载预排位排行榜。",
    "Filter": "筛选",
    "QUICK GUIDE !!MANDATORY TO READ!!": "快速指南！！必须阅读！！",
    "How to race Assetto Corsa": "如何参加 Assetto Corsa 比赛",
    "Go Racing!": "去比赛！",
    "SIGN UP": "报名",
    "edit": "编辑",
    "Quick sign UP": "快速报名",
    "archive": "归档",
    "Load more": "加载更多",
    "Get Patreon": "获取 Patreon",
    "scroll to top": "滚动到顶部",
    "scroll to me": "滚动到我",
    "next": "下一页",
    "previous": "上一页",
    "Show only Series with upcoming races": "仅显示有即将开始比赛的系列赛",
    "Coming soon": "即将推出",
    "join": "加入",
    "LFM 2.0 Feedback": "LFM 2.0 反馈",
    "#SaveACC!": "#SaveACC！",
    "Download LFM App": "下载 LFM App",
    "I have it installed, start the LFM App!": "我已安装，启动 LFM App！",
    "interested": "感兴趣",
    "not interested": "不感兴趣",
    "legacy page": "旧版页面",
    "Join in VR": "以 VR 加入",
    "REMOVE": "移除",
    "MAKE ADMIN": "设为管理员",
    "REMOVE ADMIN": "移除管理员",
    "50% off for your first month with code:": "使用此代码首月享 5 折：",
    "via Patreon and Stripe! Get your perks now!": "适用于 Patreon 和 Stripe！立即获取权益！",
    "Login required": "需要登录",
    "Become an LFM Plus Member": "成为 LFM Plus 会员",
    "Manage membership": "管理会员资格",
    "Already subscribed": "已订阅",
    "You are already subscribed.": "你已经订阅。",
    "You already have active LFM Plus perks via another source.": "你已通过其他来源拥有有效的 LFM Plus 权益。",
    "LFM App overview": "LFM App 概览",
    "AC Sync history": "AC 同步历史",
    "LFM Voice channel": "LFM 语音频道",
    "car class": "车辆组别",
    "track": "赛道",
    "Ø IP.": "平均事故分",
    "name": "姓名",
    "avatar": "头像",
    "leaderoard": "排行榜",
    "your position": "你的位置",
    "Drivers": "车手",
    "leader": "领先者",
    "origin": "国家/地区",
    "license": "驾照",
    "races": "比赛",
    "rating": "评分",
    "sr races": "安全评分比赛",
    "safety rating": "安全评分",
    "Ø rating change": "平均评分变化",
    "Ø incs.": "平均事故数",
    "laps": "圈数",
    "km.": "公里",
    "Type": "类型",
    "percent": "百分比",
    "user": "用户",
    "No Data": "无数据",
    "car model": "车型",
    "class": "组别",
    "kilometers": "公里数",
    "quali time": "排位时间",
    "race time": "正赛时间",
    "track year": "赛道年份",
    "year": "年份",
    "weeks": "周数",
    "points": "积分",
    "my season": "我的赛季",
    "penalty points": "处罚积分",
    "All Cars": "所有车辆",
    "Create Team": "创建车队",
    "Edit Team": "编辑车队",
    "Join Password": "加入密码",
    "Country": "国家/地区",
    "Founding Date (DD.MM.YYYY)": "成立日期（DD.MM.YYYY）",
    "Description": "描述",
    "Joined": "加入时间",
    "Supporter Since": "支持者起始时间",
    "Banned until": "封禁至",
    "RECEIVE ACCESS TO THE": "获得访问权限：",
    "LFM 2.0 WEBSITE SOFT LAUNCH": "LFM 2.0 网站软启动",
    "BEFORE ANYONE ELSE!": "抢先体验！",
    "With the start of Season 20 on October 6, you will have the opportunity to test the new LFM website and provide us with your honest feedback.": "随着第 20 赛季于 10 月 6 日开始，你将有机会测试新的 LFM 网站，并向我们提供真实反馈。",
    "Worlds Leading Independent": "全球领先的独立",
    "Competitive Simracing Platform": "竞技模拟赛车平台",
    "Today New Users": "今日新用户",
    "Users": "用户",
    "Currently Racing": "当前正在比赛",
    "Total Laps Driven": "总驾驶圈数",
    "Whats Hot": "热门内容",
    "Broadcasts": "直播",
    "GET MORE FROM LOW FUEL MOTORSPORT": "从 Low Fuel Motorsport 获得更多",
    "SIGN UP FOR PATREON": "注册 Patreon",
    "Official Events": "官方赛事",
    "Community Events": "社区赛事",
    "ACC Lobby Servers are online": "ACC 大厅服务器在线",
    "ACC Lobby Servers are offline": "ACC 大厅服务器离线",
    "week": "周",
    "daily": "每日",
    "weekly": "每周",
    "special events": "特别赛事",
    "next race": "下一场比赛",
    "Instruction": "说明",
    "Rolling start!": "滚动发车！",
    "This event uses the rolling start feature of \"Real Penalty\"!": "本赛事使用 “Real Penalty” 的滚动发车功能！",
    "Here is a small information on how that rolling start is functioning within our AC servers:": "以下是我们的 AC 服务器中滚动发车流程的简要说明：",
    "Click to read the rolling start procedure": "点击阅读滚动发车流程",
    "The normal AC starting lights will appear. Just wait until the lights are off. Once the lights are off, the leader can go up to 120 km/h. Once the yellow sign of the SC widget appears, slow down until the 80 km/h speed limit is on. The SC widget of \"Real Penalty\" will be shown as in the picture.": "正常的 AC 发车灯会出现。请等待灯熄灭。灯熄灭后，头车可以加速至 120 km/h。当 SC 小组件出现黄色标志时，请减速，直到显示 80 km/h 限速。“Real Penalty” 的 SC 小组件会如图所示。",
    "Important: KEEP THE DOUBLE FILE AND YOUR POSITION, AND ONLY START MOVING IF THE CAR IN FRONT OF YOU MOVES!": "重要：保持双列队形和你的位置，只有当前车开始移动时才开始移动！",
    "ATTENTION: There is NO GHOSTING of cars during that procedure, so do NOT touch other cars.": "注意：该流程中车辆不会幽灵化，请不要碰到其他车辆。",
    "Once you start moving, at a certain point the lights of the safety car will go to red and the speed limit will be shown. Do not drive faster than the speed limit.": "开始移动后，在某个时刻安全车灯会变红，并显示限速。请不要超过限速行驶。",
    "Ideally, the class leaders should leave a small gap to the cars in front.": "理想情况下，各组别头车应与前方车辆留出小间距。",
    "Finally, the lights will go green and the race starts. Have fun!": "最后，绿灯亮起，比赛开始。祝你玩得开心！",
    "WARNING:": "警告：",
    "The \"Real Penalty\" sounds are extremely loud. If you do not want to risk them being too loud, set the RP sound to 0. Open the \"Real Penalty\" settings app in game, switch to the \"penalty\" page and set \"Sound\" to 0.": "“Real Penalty” 的声音非常大。如果不想冒声音过大的风险，请将 RP sound 设为 0。在游戏中打开 “Real Penalty” 设置应用，切换到 “penalty” 页面，并将 “Sound” 设为 0。",
    "GOT IT! I WILL FOLLOW THE PROCEDURE!": "明白！我会遵守流程！",
    "Password": "密码",
    "Track Medals Req.": "赛道奖牌要求",
    "Racecraft Rating Req.": "驾驶技术评分要求",
    "Safety Rating Req.": "安全评分要求",
    "Car Slots": "车辆名额",
    "Pre Race Waiting Time": "赛前等待时间",
    "Post Race Waiting Time": "赛后等待时间",
    "Session Overtime": "场次超时时间",
    "Mandatory Pitstops": "强制进站",
    "Pitwindow Length": "进站窗口长度",
    "Refuelling Required": "需要加油",
    "Refuelling Allowed": "允许加油",
    "Available Tyre Sets": "可用轮胎套数",
    "Tyrechange Mandatory": "强制换胎",
    "Fixed Refuelling Time (25 Sec.)": "固定加油时间（25 秒）",
    "Driver Change Required": "需要换人",
    "registered": "已报名",
    "Signed up for": "已报名",
    "Server Start": "服务器启动",
    "Sign Out": "退赛",
    "How do you want to start Automovilista 2": "你想如何启动 Automobilista 2",
    "Weather Setting": "天气设置",
    "LFM App not detected!": "未检测到 LFM App！",
    "In order to be able to sign up and race this series, please install the LFM App and let it running.": "要报名并参加该系列赛，请安装 LFM App 并保持其运行。",
    "LFM App has to be running!": "LFM App 必须保持运行！",
    "FROM MY TEAM": "来自我的车队",
    "GUEST DRIVER": "客座车手",
    "ADD DRIVER": "添加车手",
    "Search driver...": "搜索车手...",
    "No drivers found": "未找到车手",
    "Searching drivers…": "正在搜索车手…",
    "Loading lineup rules…": "正在加载阵容规则…",
    "Lineup: {count} / {required}": "阵容：{count} / {required}",
    "Lineup: {count} / {min}–{max}": "阵容：{count} / {min}–{max}",
    "Remove driver": "移除车手",
    "You must be part of the lineup": "你必须在阵容中",
    "Signup failed ({status}). Details in the console.": "报名失败（{status}）。详情见控制台。",
    "Driver is already in the lineup.": "该车手已在阵容中。",
    "Reports left": "剩余举报次数",
    "used": "已使用",
    "Upload a video directly to our storage (Patreon only, max. 3 minutes).": "直接上传视频到我们的存储空间（仅 Patreon，最长 3 分钟）。",
    "Upload file": "上传文件",
    "Patreon only": "仅 Patreon",
    "Video duration": "视频时长",
    "Video duration too long! The maximum video length is 3 minutes!": "视频时长过长！最大视频长度为 3 分钟！",
    "Video format not supported!": "不支持该视频格式！",
    "Upload a video to YouTube or another video platform as unlisted and paste the link here.": "将视频以未公开视频上传到 YouTube 或其他视频平台，并在此粘贴链接。",
    "Please enter a valid URL.": "请输入有效 URL。",
    "Message": "消息",
    "Describe what happened...": "描述发生了什么...",
    "Reporting Guideline {sim}:": "举报指南 {sim}：",
    "I confirm that I have read the reporting guideline and my reporting video meets the requirements!": "我确认已阅读举报指南，且我的举报视频符合要求！",
    "Only available for Patreons!": "仅 Patreon 可用！",
    "Error while sending report. Please try again.": "发送举报时出错，请重试。",
    "requirements": "要求",
    "min. license": "最低驾照",
    "fixed car": "固定车辆",
    "elo multiplier": "ELO 倍率",
    "serverpassword": "服务器密码",
    "dlc content": "DLC 内容",
    "briefing": "车手会议",
    "LFM App for Assetto Corsa": "Assetto Corsa 的 LFM App",
    "The LFM App automatically downloads, installs, and keeps the required AC mods up to date so you're always ready to race.": "LFM App 会自动下载、安装并保持所需 AC 模组为最新状态，让你随时准备参赛。",

    // Final exact coverage fixes for current LFM language bundle.
    "Please fill in your first name, last name and 3-letter shortname.": "请填写名字、姓氏和三字母缩写。",
    "The shortname must contain exactly three letters.": "缩写必须正好包含三个字母。",
    "Allowed: A-Z, a-z, ä, ö, ü and -": "允许：A-Z、a-z、ä、ö、ü 和 -",
    "Allowed: 3 uppercase letters": "允许：3 个大写字母",
    "Kunos BOP": "Kunos BOP",
    "LFM BOP": "LFM BOP",
        
  };

  const exactByRoute = {
    '/impressum': {
      "Angaben gemäß § 5 TMG": "根据德国《电信媒体法》（TMG）第5条提供的信息",
      "Low Fuel Motorsport is a division of": "Low Fuel Motorsport 是以下公司的部门",
      "255 Systems UG (haftungsbeschränkt)": "255 Systems UG（责任有限公司）",
      "Waibstadter Str. 11": "Waibstadter Str. 11",
      "74921 Helmstadt-Bargen": "74921 Helmstadt-Bargen",
      "Germany": "德国",
      "Geschäftsführer: Boris Schalk": "执行董事：鲍里斯·沙尔克 Boris Schalk",
      "Amtsgericht Mannheim HRB747781": "曼海姆地方法院 HRB747781",
      "VAT ID: DE 361865690 | Finanzamt Sinsheim 44081/07052": "增值税号：DE 361865690 | 辛斯海姆税务局 44081/07052",
      "Kontakt": "联系方式",
      "Telefon: auf Anfrage": "电话：请咨询",
      "E-Mail: contact@lowfuelmotorsport.com": "电子邮件：contact@lowfuelmotorsport.com",
      "Haftung für Inhalte": "内容责任",
      "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.": "作为服务提供商，根据《德国远程媒体法》（TMG）第7条第1款的规定，我们对这些页面上的自有内容承担一般法律责任。然而，根据《德国远程媒体法》第8至10条的规定，作为服务提供商，我们没有义务监控传输或存储的第三方信息，也没有义务调查表明存在违法活动的情况。",
      "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.": "根据一般法律删除或阻止使用信息的义务不受此影响。然而，只有在知晓具体侵权时，才可能承担相应责任。如果我们得知任何此类侵权，我们将立即删除这些内容。",
      "Haftung für Links": "链接责任",
      "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.": "我们的服务包含指向第三方外部网站的链接，我们对其内容没有影响力。因此，我们无法对这些外部内容提供任何保证。链接页面的内容始终由相应页面的提供者或运营者负责。链接时已检查链接页面是否存在可能的违法行为。链接时未识别到非法内容。",
      "Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.": "但是，在没有具体侵权迹象的情况下，永久监控链接页面内容是不合理的。一旦发现侵权，我们将立即删除此类链接。",
      "Urheberrecht": "版权",
      "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.": "由页面运营者创建的内容和作品受德国版权法保护。在版权法范围之外的复制、编辑、分发以及任何形式的利用，均需获得相应作者或创作者的书面同意。允许下载和复制此页面仅用于私人、非商业用途。",
      "Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.": "如果本页面上的内容并非由运营者创建，则尊重第三方的版权。特别是，第三方内容会相应标明。如果您仍然注意到版权侵权，请告知我们。一旦发现侵权，我们将立即删除此类内容。",
      "Quelle:": "来源：",
      "e-recht24.de": "e-recht24.de",
    },

    '/lfmplus': {
      "LFM Plus Benefits": "LFM Plus 特权",
      "Support LFM and unlock perks with an affordable subscription.": "支持LFM并以实惠的订阅解锁额外福利。",
      "Support for the further development of LFM!": "支持LFM的进一步开发！",
      "Supporter badge on the website in entrylists and profile page": "在网站的参赛名单和个人资料页面上获得支持者徽章",
      "Custom livery upload for ACC and AC races!": "为ACC和AC比赛上传自定义涂装！",
      "Exclusive community LFM Plus liveries for use in all ACC LFM races!": "独家社区LFM Plus涂装，可用于所有ACC LFM比赛！",
      "One additional report for every season race": "每场赛季比赛额外获得一次举报机会",
      "Direct upload of report videos (no more upload to YouTube or another platform necessary)": "直接上传举报视频（无需再上传到YouTube或其他平台）",
      "Additional charts and information on race result pages (position chart, consistency list)": "比赛结果页面上的额外图表和信息（位置图、一致性列表）",
      "New profile page with more detailed statistics": "具有更详细统计信息的新个人资料页面",
      "Earlier sign up for special events and season races": "更早报名特殊活动和赛季比赛",
      "Special Discord role with exclusive area (please link your Discord on Patreon too to get the role)": "专属Discord角色及专属区域（请在Patreon上关联您的Discord以获取该角色）",
      "Your Twitch stream will be posted on Discord when you go live!": "您开播时，您的Twitch直播将在Discord上发布！",
      "No idle timeout on the webpage": "网页无空闲超时",
      "No external ads on the page (only our own ads and the series sponsors will show)": "页面上无外部广告（仅显示我们自己的广告和系列赞助商）",
      "Comfortable quick signup page for season races": "舒适的赛季比赛快速报名页面",
      "Pay via Patreon": "通过Patreon支付",
      "Classic membership via Patreon for only 4,99€ + VAT per month.": "通过Patreon的经典会员，每月仅需4.99欧元+增值税。",
      "Link Patreon account": "关联Patreon账号",
      "Gift a membership": "赠送会员",
      "Pay via Stripe": "通过Stripe支付",
      "Get Patreon benefits with Stripe for 5.49€ incl. VAT. Payment methods: Credit Card, Google Pay, Apple Pay (soon), PayPal (soon).": "通过Stripe获得Patreon福利，含增值税5.49欧元。支付方式：信用卡、Google Pay、Apple Pay（即将推出）、PayPal（即将推出）。",
      "Checkout with Stripe": "使用Stripe结账",
      "Pay via Popometer": "通过Popometer支付",
      "Alternative subscription via Popometer with LFM Plus perks.": "通过Popometer的替代订阅，享有LFM Plus特权。",
      "Go to Popometer membership": "前往Popometer会员",
    },

    '/contact': {
      "Address": "地址",
      "Low Fuel Motorsport is a division of": "Low Fuel Motorsport 是以下公司的部门",
      "255 Systems UG (haftungsbeschränkt)": "255 Systems UG（责任有限公司）",
      "Waibstadter Str. 11": "Waibstadter Str. 11",
      "74921 Helmstadt-Bargen": "74921 Helmstadt-Bargen",
      "Germany": "德国",
      "Support contact": "支持联系方式",
      "Please use the ticket system on the Discord server for any sort of support / stewarding topics.": "请使用 Discord 服务器上的工单系统处理任何支持/管理问题。",
      "JOIN DISCORD": "加入 Discord",
      "Email contacts": "邮箱联系方式",
      "Sponsoring / Marketing": "赞助/市场营销",
      "sponsoring@lowfuelmotorsport.com": "sponsoring@lowfuelmotorsport.com",
    },

    '/faq': {
      "Frequently Asked Questions": "常见问题",
      "General": "常规",
      "What's LFM?": "什么是 LFM？",
      "The abbreviation \"LFM\" stands for \"Low Fuel Motorsport\", a sim racing team and community. Since the team's exact founding date, sometime in late summer 2020, is no longer traceable, the official date used is 26.09.2020, when the team participated in an endurance event for the first time under the name \"Low Fuel Motorsport\".": "缩写 \"LFM\" 代表 \"Low Fuel Motorsport\"，一个模拟赛车团队和社区。由于团队的确切成立日期（大约在2020年夏末）已无法追溯，官方采用的日期为2020年9月26日，即该团队首次以 \"Low Fuel Motorsport\" 名义参加耐力赛的日期。",
      "Rules": "规则",
      "The regulations of Low Fuel Motorsport form the foundation for fair, respectful, and exciting racing within the community. They not only ensure the smooth operation of seasons and events, but also protect all participants and uphold sporting integrity. Through clear rules on behavior, driving standards, and procedures, the regulations create transparency and equal opportunities, contributing significantly to a professional and friendly competitive environment.": "Low Fuel Motorsport 的规章制度是社区内公平、尊重和激动人心的赛车比赛的基础。它们不仅确保赛季和赛事的顺利进行，还保护所有参与者并维护体育诚信。通过关于行为、驾驶标准和程序的明确规则，规章制度创造了透明度和平等机会，极大地促进了专业和友好的竞争环境。",
      "Code of Conduct and Penalties": "行为准则与处罚",
      "Does participating cost anything?": "参与需要任何费用吗？",
      "Our complete range of Seasons, Cups, and Endurance races is available completely free of charge. LFM is a project made by the community, for the community.": "我们所有的赛季、杯赛和耐力赛系列完全免费提供。LFM 是一个由社区为社区打造的项目。",
      "How is LFM funded?": "LFM 如何获得资金？",
      "LFM is a pure community project into which we put a lot of heart and soul. It is run and continuously developed entirely on a voluntary basis. The running costs of our constantly growing number of game, web, and database servers, as well as other expenses such as licences, are mainly covered by voluntary donations from the community via Patreon and Streamelements, for which we are very grateful.": "LFM 是一个纯粹的社区项目，我们投入了大量的心血。它完全在自愿的基础上运行和持续开发。我们不断增长的游戏、网页和数据库服务器的运行成本，以及其他费用如许可证，主要由社区通过 Patreon 和 Streamelements 的自愿捐款承担，对此我们非常感激。",
      "Are consoles also supported?": "是否也支持主机？",
      "No. To participate in LFM races, you need the PC version of the respective sim. We are not planning to implement a PlayStation or Xbox version.": "不支持。要参加 LFM 比赛，您需要相应模拟器的 PC 版本。我们不打算推出 PlayStation 或 Xbox 版本。",
      "User profile": "用户资料",
      "What do I have to keep in mind for my LFM user profile?": "对于我的 LFM 用户资料，需要注意什么？",
      "Like everywhere else on our platform, the general social norms and values must be respected for all information provided in the user profile as well as for the profile picture. Specifically, discriminatory, racist, violence-glorifying, political, religious, or sexist content is strictly prohibited and will lead to the immediate and irrevocable deletion of the user account.": "与我们平台上的其他地方一样，用户资料中提供的所有信息以及个人资料图片都必须遵守普遍的社会规范和价值观。具体来说，歧视性、种族主义、美化暴力、政治、宗教或性别歧视内容是被严格禁止的，将导致用户账户被立即且不可撤销地删除。",
      "Regular names must be used. This means that a normal-sounding first and last name is required. This can be your real name, but it does not have to be. Typical online nicknames, troll names etc. are expressly forbidden. Special characters or numbers are also not allowed. Furthermore, the correct capitalisation of the name must be ensured.": "必须使用常规名称。这意味着需要一个听起来正常的名字和姓氏。这可以是您的真名，但不一定非得是。典型的在线昵称、钓鱼名称等是明确禁止的。也不允许使用特殊字符或数字。此外，必须确保名称的大小写正确。",
      "If desired, a so-called \"team tag\" may be included in the last name. This tag may be up to four characters long and should be separated by a vertical line at the end of the last name.": "如果需要，可以在姓氏中包含所谓的 \"team tag\"。该标签最多可包含四个字符，并应在姓氏末尾用竖线分隔。",
      "It is not necessary to select the nationality stated on your identity document. However, in order to maintain the seriousness of our platform, we would appreciate it if you select the country with which you identify most closely.": "不一定要选择身份证件上注明的国籍。但是，为了维护我们平台的严肃性，如果您选择与您最认同的国家/地区，我们将不胜感激。",
      "What data from my Steam account does LFM use?": "LFM 使用我的 Steam 账户中的哪些数据？",
      "Your personal Steam login information will not be shared.": "您的个人 Steam 登录信息不会被共享。",
      "A unique identification number is shared with LFM. This number allows LFM to identify your Steam profile and access your account information according to your individual Steam privacy settings.": "一个唯一的识别号会与 LFM 共享。此号码允许 LFM 根据您的个人 Steam 隐私设置识别您的 Steam 个人资料并访问您的账户信息。",
      "LFM can only access publicly viewable information from your Steam profile. The following information will be used: Steam ID, username, user picture.": "LFM 只能访问您 Steam 个人资料中公开可见的信息。将使用以下信息：Steam ID、用户名、用户头像。",
      "Your Steam ID is shared with LFM. It is used for the automatically generated entry lists for LFM races, so that only the drivers who are registered for a race can connect to the server.": "您的 Steam ID 会与 LFM 共享。它用于自动生成的 LFM 比赛参赛名单，以便只有注册了比赛的驾驶员才能连接到服务器。",
      "How can I delete my LFM user account?": "如何删除我的 LFM 用户账户？",
      "To delete your account, please open a support ticket in our support system found at the bottom right of the page.": "要删除您的账户，请在页面右下角的支持系统中提交工单。",
      "If you wish to delete your account, all personal data will be anonymised and the account permanently deactivated.": "如果您希望删除账户，所有个人数据将被匿名化，账户将被永久停用。",
      "All statistical data obtained with the account will be retained so that no session information (e.g. race results) is falsified afterwards.": "通过该账户获得的所有统计数据将被保留，以便不会在之后伪造任何比赛信息（例如比赛结果）。",
      "Please note that once the account has been deleted, it is no longer possible to register or log in again with the same Steam account.": "请注意，一旦账户被删除，将无法再使用相同的 Steam 账户注册或登录。",
      "Deactivated accounts cannot be reactivated. It is not possible to participate in LFM again with the same Steam account!": "已停用的账户无法重新激活。无法使用相同的 Steam 账户再次参与 LFM！",
      "赛季": "赛季",
      "What's LFM Seasons?": "什么是 LFM 赛季？",
      "With LFM Seasons, we give daily racing a competitive and structured character. Any number of races can be run throughout the day. In addition to extensive statistics, our own Elo and safety rating, you can collect season points every week.": "通过 LFM 赛季，我们为日常比赛赋予了竞争性和结构化的特点。全天可以进行任意数量的比赛。除了广泛的统计数据、我们自己的 Elo 和安全评分之外，您每周还可以收集赛季积分。",
      "Furthermore, we offer the drivers the possibility to report possible incidents during the race, which will then be reviewed by the LFM Stewards and punished according to our rules. This ensures that the races are much cleaner than on normal public servers. In addition, we can temporarily or permanently exclude certain drivers from our platform, depending on the type and severity of the offence.": "此外，我们为驾驶员提供报告比赛中可能发生的事故的可能性，这些事故将由 LFM 管理人员审核，并根据我们的规则进行处罚。这确保了比赛比普通的公共服务器上更加干净。此外，根据违规的类型和严重程度，我们可以暂时或永久地将某些驾驶员排除在我们的平台之外。",
      "I have registered for a Seasons race. How do I get onto the server?": "我已经注册了一场赛季比赛。如何进入服务器？",
      "Once you have registered for a race, you should check in time that everything is working. In case of any problems (e.g. hardware defects, Windows update, Steam update, Kunos server down, etc.) it is the responsibility of each driver to log out of the respective session within the logout period (up to 5 minutes before the start of the session).": "一旦您注册了比赛，您应及时检查一切是否正常工作。如果出现任何问题（例如硬件故障、Windows 更新、Steam 更新、Kunos 服务器宕机等），每位驾驶员有责任在注销期内（最晚在比赛开始前 5 分钟）退出相应的比赛。",
      "Wait until the session starts and then check which split you are in. Furthermore, on our website the Session ID can be copied to the clipboard by clicking on it, which makes it easier to find the right server in ACC. Attention: The servers will not be started until the message \"SESSION LIVE\" is displayed on the website. It may then take up to 5 minutes until they can be found in the ACC server list. So please be patient if they do not appear immediately! Please note: Race servers will only start if at least 2 drivers are registered.": "等待比赛开始，然后检查您在哪个分组。此外，在我们的网站上，可以通过点击 Session ID 将其复制到剪贴板，这使得在 ACC 中更容易找到正确的服务器。注意：服务器只有在网站上显示 \"SESSION LIVE\" 消息后才会启动。然后可能需要长达 5 分钟才能在 ACC 服务器列表中找到它们。因此，如果它们没有立即出现，请耐心等待！请注意：比赛服务器只有在至少 2 名驾驶员注册后才会启动。",
      "Go to the multiplayer section of ACC, open the server list and make the following settings:": "前往 ACC 的多人游戏部分，打开服务器列表并进行以下设置：",
      "Select: Server Type \"ALL\"": "选择：服务器类型 \"全部\"",
      "Disable: Show only \"ACCESSIBLE\"": "禁用：仅显示 \"可访问\"",
      "Set: Ping Limit \"OFF\"": "设置：Ping 限制 \"关闭\"",
      "Search for the LFM Session ID (e.g. \"12345\") or \"lowfuel\" in the search bar.": "在搜索栏中搜索 LFM 会话 ID（例如 \"12345\"）或 \"lowfuel\"。",
      "Select the correct server in the list (pay attention to choose the correct split!).": "在列表中选择正确的服务器（注意选择正确的分组！）。",
      "Set the right car with which you have registered for the session.": "设置您为比赛注册的正确车辆。",
      "Connect to the server. The server-password for LFM Seasons races is always \"lfm\" (lower case!).": "连接到服务器。LFM 赛季比赛的服务器密码始终是 \"lfm\"（小写！）。",
      "How are the Seasons points calculated?": "赛季积分是如何计算的？",
      "Rated races:": "评级比赛：",
      "Only the best race per week counts for the season ranking. Any number of races can be driven per week. The 9 best weekly results count for the overall ranking at the end of the season. The three worst weekly results will be cancelled at the end.": "只有每周最好的比赛才会计入赛季排名。每周可以参加任意数量的比赛。赛季结束时，9 个最好的周成绩会计入总排名。三个最差的周成绩将在赛季末被取消。",
      "Season points:": "赛季积分：",
      "The possible points per race are based on the number of participants and the Strength of Field (SOF) of the respective split. The bigger the field of participants and the SOF, the more points will be awarded.": "每场比赛可能获得的积分基于参赛者数量和相应分组的 Strength of Field (SOF)。参赛者阵容和 SOF 越大，奖励的积分就越多。",
      "Calculation in detail:": "详细计算：",
      "The last placed driver (in larger fields this is the 25th placed driver) will receive two points. Subsequently, the lower third of the field will receive 4 additional points per finishing position. The middle third will receive 6 additional points per placement and the top third of the field will receive 8 additional points per placement. The drivers on the podium will again receive extra points (P1 = 3 points, P2 = 2 points, P3 = 1 point). In addition to the general calculation of the points system, the average driver rating (Strength of Field, SOF) of the respective split is also taken into account. If the SOF is between 1450 and 1550 Elo points, the points will be awarded as shown above. If the SOF is higher, more points will be awarded. If it is lower, fewer points are awarded. For example, in a field of drivers with an SOF of 2100 Elo points, twice as many points are awarded; if the SOF is 1100 Elo points, only half as many points are awarded.": "最后一名驾驶员（在较大阵容中为第 25 名）将获得 2 分。然后，后三分之一的车手将根据完赛名次额外获得 4 分。中间三分之一的车手每个名次额外获得 6 分，前三分之一的车手每个名次额外获得 8 分。登上领奖台的车手将再次获得额外积分（第 1 名 = 3 分，第 2 名 = 2 分，第 3 名 = 1 分）。除了积分系统的一般计算外，还会考虑相应分组的平均驾驶员评级 (Strength of Field, SOF)。如果 SOF 在 1450 到 1550 Elo 积分之间，则如上所示授予积分。如果 SOF 更高，将授予更多积分。如果更低，授予更少积分。例如，在 SOF 为 2100 Elo 积分的驾驶员阵容中，授予的积分为两倍；如果 SOF 为 1100 Elo 积分，则只授予一半的积分。",
      "Team standings:": "车队排名：",
      "Only teams consisting of at least two drivers will be considered in the ranking. In order to score points, at least two drivers must have driven a race per week and class (e.g. GT3, LMP2, etc.). For the team points, the average of the best 2-3 individual results per week will be taken into account. All 12 Weeks will count for the team standings, there are no drop rounds.": "排名中仅考虑由至少两名驾驶员组成的车队。为了获得积分，每周每个组别（例如 GT3、LMP2 等）必须至少有两名驾驶员参加了一场比赛。对于车队积分，将考虑每周最好的 2-3 个个人结果的平均值。所有 12 周都将计入车队排名，没有淘汰周。",
      "LFM PRO Series:": "LFM 职业系列赛：",
      "Season points are awarded using a fixed points system and are therefore not dependent on the strength of field (SOF) of the respective split. The allocation of season points can be viewed in detail here:": "赛季积分使用固定积分系统授予，因此不依赖于相应分组的 Strength of Field (SOF)。赛季积分的分配详情可在此处查看：",
      "PRO-Series Seasonpoints": "职业系列赛赛季积分",
      "What are divisions?": "什么是分组？",
      "The complete field of participants of LFM-Seasons will be divided into \"divisions\". The allocation of the drivers is based on their Elo rating:": "LFM 赛季的完整参赛者阵容将被划分为 \"分组\"。驾驶员的分配基于他们的 Elo 评级：",
      "Div 1 > 3200": "第 1 组 > 3200",
      "Div 2 > 2500": "第 2 组 > 2500",
      "Div 3 > 1700": "第 3 组 > 1700",
      "Div 4 > 1300": "第 4 组 > 1300",
      "Div 5 > 1000": "第 5 组 > 1000",
      "Div 6 < 1000": "第 6 组 < 1000",
      "Moving up or down between the divisions will be done automatically after 6 weeks in the season. Season points earned in lower or higher divisions are always carried over. The divisions mainly function as a subdivision of the field of participants according to their strength. In this way, drivers with a lower Elo rating can also compete for the top places in their respective division.": "在赛季进行 6 周后，将在分组之间自动进行升降级。在较低或较高分组中获得的赛季积分始终会结转。分组主要用作根据参赛者实力划分的子分组。通过这种方式，Elo 评级较低的驾驶员也可以在他们各自的分组中争夺前列位置。",
      "How do splits work?": "分组是如何工作的？",
      "If there are enough registered participants per session, the field of drivers will be divided into several \"splits\" based on their Elo rating. This ensures that the majority of the drivers per split have similar race pace, which brings the field closer together and guarantees exciting races.": "如果每场比赛有足够的注册参赛者，驾驶员阵容将根据他们的 Elo 评级分为几个 \"分组\"。这确保了每个分组中的大多数驾驶员具有相似的比赛节奏，从而使阵容更加接近并保证比赛更加激动人心。",
      "In our GT3 Rookie series, the SR is additionally used for matchmaking, as safe driving should be the main focus in these series in particular.": "在我们的 GT3 新秀系列赛中，SR 也用于匹配，因为安全驾驶在这些系列赛中尤其应该是主要关注点。",
      "It is recommended to check again which split you are in as soon as the session has gone \"live\", as changes can still occur in the last seconds before the end of the registration period.": "建议在比赛变为 \"live\" 后立即再次检查您在哪个分组，因为在注册期结束前的最后几秒仍可能发生变化。",
      "How many races per week are allowed?": "每周允许多少场比赛？",
      "You can take part in as many races as you like. Since only the best result per week counts for the overall ranking, no one who races a lot can gain a unfair advantage.": "您可以参加任意数量的比赛。由于只有每周最好的结果会计入总排名，因此参加多次比赛的人不会获得不公平的优势。",
      "Is it bad if I don't drive every week?": "如果我不每周都驾驶，会有坏处吗？",
      "It is not necessary to participate in at least one race every week during a season. Since only the 9 best results of the 12 race weeks are counted in the season standings, it's not a big disadvantage in the overall standings if you don't have time for a race for one or two weeks.": "在赛季中，不必每周至少参加一场比赛。由于赛季排名中只计算 12 个比赛周中的 9 个最好成绩，因此如果您有一两周没有时间参加比赛，在总排名中不会有太大的劣势。",
      "How does the teamstandings work?": "车队排名是如何运作的？",
      "To get points for the team ranking in a single driver series in a season week the following is important:": "要在赛季周的单人驾驶员系列赛中获得车队排名积分，以下几点很重要：",
      "- You must be in a team": "- 您必须在一个车队中",
      "- The team must consist of at least 2 drivers": "- 车队必须至少由 2 名驾驶员组成",
      "- At least 2 drivers of a team must have collected points in a week": "- 车队中至少有 2 名驾驶员在一周内获得了积分",
      "The team weekly points are calculated as follows:": "车队每周积分计算如下：",
      "At least 2, and maximum 3 drivers must have collected points in the week. The best result of each rider is scored and a weekly average is calculated. That means, the sum of the points of the drivers will be divided by the number of drivers who drove this week. This means 2 or 3, which are the team points for one week. Important: There are no drop weeks in the team ranking.": "一周内至少有 2 名，最多 3 名驾驶员必须获得积分。对每位驾驶员的最佳成绩进行评分，并计算周平均值。这意味着将驾驶员积分之和除以本周参赛的驾驶员人数，即 2 或 3，这就是一周的车队积分。重要提示：车队排名中没有淘汰周。",
      "For team series like the ACC Drive Endurance Championship the points of the best car of a team per week count for the team ranking. There are no drop weeks.": "对于像 ACC Drive Endurance Championship 这样的车队系列赛，每周车队中最好的赛车的积分会计入车队排名。没有淘汰周。",
      "Which driving assistances are allowed?": "允许使用哪些驾驶辅助？",
      "In all LFM races, the permitted driving assistances are restricted on the server side as follows:": "在所有 LFM 比赛中，允许的驾驶辅助在服务器端受到如下限制：",
      "ACC:": "ACC：",
      "Stability Control: disabled": "稳定控制：禁用",
      "Steering Assistance: disabled": "转向辅助：禁用",
      "Automatic Headlights: allowed": "自动大灯：允许",
      "Automatic Wipers: allowed": "自动雨刷：允许",
      "Automatic Engine Start: allowed": "自动引擎启动：允许",
      "Automatic Pit Limiter: allowed": "自动限速器：允许",
      "Automatic Gear Shift: allowed": "自动换挡：允许",
      "Automatic Clutch: allowed": "自动离合器：允许",
      "Ideal Line: disabled": "理想路线：禁用",
      "AC:": "AC：",
      "Stability control: disabled": "稳定控制：禁用",
      "Traction control: Car-specific": "牵引力控制：因车而异",
      "Anti-lock brakes: Car-specific": "防抱死制动：因车而异",
      "Auto clutch: allowed": "自动离合器：允许",
      "Auto blip: allowed": "自动补油：允许",
      "How is the weather set and what is \"Real Weather\"?": "天气是如何设置的，什么是 \"Real Weather\"？",
      "The weather settings (average temperature, cloud level, rain level and variability) are shown for each session. An exception are the sessions where our \"Real Weather\" function is active.": "每场比赛都会显示天气设置（平均温度、云量、降雨量和可变性）。我们的 \"Real Weather\" 功能激活的比赛除外。",
      "The temperature indicated corresponds to the average temperature over the whole day. Depending on the time of day (night, morning, midday, evening), the actual temperature is accordingly higher or lower. In addition, the degree of cloud cover significantly determines the track temperature. The rain level determines the amount of rain, provided that the cloud level is sufficiently high that rain actually falls. Variability provides a random change in weather conditions throughout the race weekend. The higher the variability, the more unpredictable and changeable the weather. The variability also ensures that the weather can be different in the same race session in the individual splits.": "所示的温度对应于全天的平均温度。根据一天中的时间（夜间、早晨、中午、傍晚），实际温度相应更高或更低。此外，云量程度显著决定了赛道温度。降雨量决定了降雨量，前提是云量足够高以至于实际会下雨。可变性提供了整个比赛周末天气条件的随机变化。可变性越高，天气就越不可预测和变化无常。可变性还确保了同一场比赛在不同分组中的天气可能不同。",
      "Real Weather:": "Real Weather：",
      "In some sessions, instead of randomly selected weather settings, the actual real weather data from the respective track is used to simulate an even more realistic racing experience. The average day temperature, the current degree of cloud cover and the intensity of the rain are used. However, the in-game time is not synchronised with the real time so that not all sessions take place in the late evening in the dark.": "在某些比赛中，不使用随机选择的天气设置，而是使用来自相应赛道的实际实时天气数据来模拟更真实的赛车体验。使用当天的平均温度、当前的云量程度和降雨强度。但是，游戏内时间不与现实时间同步，因此并非所有比赛都在深夜黑暗中举行。",
      "What is the meaning of the driver numbers and the plate colours?": "车号和号牌颜色代表什么含义？",
      "The car numbers are assigned according to the driver or average team rating (Elo). The driver or team with the highest rating in the respective split will get the number 1.": "赛车的编号根据驾驶员或平均车队评级（Elo）分配。在相应分组中评级最高的驾驶员或车队将获得 1 号。",
      "The background colours of the number plate indicate the Safety Rating (SR) of the corresponding driver/team. If the SR is at least 6.5, the colour of the number plate will be white (PRO). Silver (SILVER) is assigned for a SR between 6.5 and 5.0. If the SR is below 5.0, the driver or team will receive a red (AM) number plate.": "号牌的背景颜色表示相应驾驶员/车队的安全评分（SR）。如果 SR 至少为 6.5，号牌颜色将为白色（PRO）。SR 介于 6.5 和 5.0 之间时，分配银色（SILVER）。如果 SR 低于 5.0，驾驶员或车队将获得红色（AM）号牌。",
      "Independent of this, patreons who use a custom livery in the race will always receive a black background colour.": "与此无关，在比赛中使用自定义涂装的 Patreon 支持者将始终获得黑色背景。",
      "What is particularly important in team races?": "在车队比赛中，特别重要的是什么？",
      "For team races, i.e. races with more than one driver per vehicle, please be sure to follow our respective instructions! This is crucial to ensure that your race runs smoothly.": "对于车队比赛，即每辆车有超过一名驾驶员的比赛，请务必遵循我们各自的说明！这对于确保您的比赛顺利进行至关重要。",
      "ACC Teamracing Guide": "ACC 车队比赛指南",
      "Elo-Rating": "Elo 评级",
      "What is the Elo rating?": "什么是 Elo 评级？",
      "The Elo rating reflects the strength of the respective driver. Every new driver who registers on LFM starts with a rating of 1500. After every race on our platform in which the Elo calculation is active, a corresponding adjustment takes place depending on the final position. Over time, the Elo rating is adjusted to a value that corresponds to the real race pace of the driver. Furthermore, the Elo rating is used to divide the field into groups of approximately equal strength (so-called splits) if there are enough registered drivers, in order to ensure the most interesting racing experience possible.": "Elo 评级反映了相应驾驶员的实力。在 LFM 注册的每位新驾驶员都以 1500 的评级开始。在我们平台上每场激活 Elo 计算的比赛后，根据最终名次进行相应的调整。随着时间的推移，Elo 评级将调整到与驾驶员真实比赛节奏相对应的值。此外，如果有足够的注册驾驶员，Elo 评级用于将阵容分为实力大致相等的组（所谓的分组），以确保尽可能有趣的赛车体验。",
      "How does the Elo rating work exactly?": "Elo 评级具体是如何运作的？",
      "Elo rating originated in chess (see Wikipedia), but has since been adapted for other sports, including LFM.": "Elo 评级起源于国际象棋（参见 Wikipedia），但后来已被改编用于其他运动，包括 LFM。",
      "The system calculates an expected ranking for each driver, taking into account their own Elo in relation to the Elo of all the other drivers. If a driver is able to finish the race with a better position than expected, they win Elo; if they finish with a worse position, they lose Elo. The expected ranking already takes into account that in racing (unlike in chess) the average ranking actually achieved by a driver can be influenced positively or negatively by many variables (e.g. racing accidents, driving errors, weather, strategy, retirements). Therefore, for example, the expected ranking of the driver with the highest Elo in the field is not first place. Likewise, the expected ranking of the driver with the lowest Elo is not the last place. The expected ranking has nothing to do with the starting number.": "该系统根据每个驾驶员自身的 Elo 相对于所有其他驾驶员的 Elo，为他们计算一个预期排名。如果驾驶员能够以比预期更好的位置完成比赛，他们将赢得 Elo；如果以更差的位置完成，他们将失去 Elo。预期排名已经考虑到，在赛车中（与国际象棋不同），驾驶员实际获得的平均排名可能会受到许多变量的积极或消极影响（例如赛车事故、驾驶失误、天气、策略、退赛）。因此，例如，阵容中 Elo 最高的驾驶员的预期排名不是第一名。同样，Elo 最低的驾驶员的预期排名也不是最后一名。预期排名与起跑编号无关。",
      "The allocation of Elo points among the drivers participating in the race is always a redistribution. Drivers who perform better than expected by the system receive Elo points from those who perform worse than expected.": "参与比赛的驾驶员之间的 Elo 积分分配始终是再分配。表现优于系统预期的驾驶员从表现低于预期的驾驶员那里获得 Elo 积分。",
      "DNS / DNF:": "DNS / DNF：",
      "Those who are registered for a race but do not take part in it (DNS) or finish a race before the end (DNF) will still be counted and lose a corresponding number of Elo points. It is therefore advisable to withdraw from the race in good time or, in the event of an incident, to finish the race in order to possibly make up one or two positions and thus keep the loss of points to a minimum.": "注册了比赛但没有参加（DNS）或在结束前完赛（DNF）的驾驶员仍将被计算在内，并会损失相应数量的 Elo 积分。因此，建议及时退出比赛，或者在发生事故时完成比赛，以便可能追回一两个位置，从而将积分损失降至最低。",
      "K-factor:": "K 系数：",
      "The so-called \"K-factor\" indicates the weighting in the Elo calculation. This is set depending on the race length. This means that the 45-minute races are weighted the highest and the 20-minute races the lowest. For example, you receive relatively little Elo for a good race result in the GT3 Rookie Series compared to the other series.": "所谓的 \"K 系数\" 表示 Elo 计算中的权重。这是根据比赛长度设置的。这意味着 45 分钟的比赛权重最高，20 分钟的比赛权重最低。例如，与其他系列赛相比，在 GT3 新秀系列赛中获得好的比赛结果所获得的 Elo 相对较少。",
      "Where is the Elo calculation active?": "Elo 计算在哪些比赛中激活？",
      "In the LFM Seasons races, the Elo calculation is active with 6 or more participating drivers. In our Cup and League races, it is indicated at the respective event whether an Elo calculation takes place. Only races with an active Elo calculation are so-called \"ranked races\" and count, for example, for achieving the individual driver licences.": "在 LFM 赛季比赛中，当有 6 名或更多驾驶员参与时，Elo 计算激活。在我们的杯赛和联赛中，相应赛事会标明是否进行 Elo 计算。只有激活 Elo 计算的比赛才是所谓的 \"排名赛\"，并计入例如获得个人驾驶员驾照的资格。",
      "In ranked multiclass races where a class has less than 6 players, the ELO multiplier is reduced for this class. In such a case, the actual ELO multiplier for this class results from the formula:": "在排名赛的多组别比赛中，如果某个组别少于 6 名玩家，则该组别的 ELO 乘数会降低。在这种情况下，该组别的实际 ELO 乘数由以下公式计算得出：",
      "[ELO multiplier of the series] * [number of drivers] / 6": "[系列赛的 ELO 乘数] * [驾驶员人数] / 6",
      "Why did I lose Elo points?": "为什么我失去了 Elo 积分？",
      "This question is not so easy to answer because the calculation is very complex and each race would have to be considered individually. First of all, it is important to understand that Elo points are only re-distributed between drivers after a race. So in order to gain points, other drivers have to lose some.": "这个问题不容易回答，因为计算非常复杂，每场比赛都必须单独考虑。首先，重要的是要理解 Elo 积分只是在比赛后在驾驶员之间重新分配。因此，为了获得积分，其他驾驶员必须失去一些。",
      "The system calculates a target position expected by the driver in the race based on their own Elo in relation to the Elo of all other drivers. If the driver achieves a better target position, they will gain Elo points, if not, the driver will lose Elo points.": "系统根据驾驶员自身的 Elo 相对于所有其他驾驶员的 Elo，计算他们在比赛中的预期目标位置。如果驾驶员达到了更好的目标位置，他们将获得 Elo 积分，否则将失去 Elo 积分。",
      "If a driver's Elo is relatively high or low compared to all other drivers, it is expected that they will have a correspondingly better or worse target position.": "如果驾驶员的 Elo 相对于所有其他驾驶员相对较高或较低，则预期他们将有相应更好或更差的目标位置。",
      "In very balanced splits (e.g. Elo differences < 250), you have to finish the race in the upper half to gain Elo. Drivers who finish the race in the lower half will lose Elo.": "在非常均衡的分组中（例如 Elo 差异 < 250），您必须以前半部分完赛才能获得 Elo。以后半部分完赛的驾驶员将失去 Elo。",
      "With increasing Elo differences within a split, the expected target positions of the individual drivers also vary more, which means that such a general statement can no longer be made.": "随着分组内 Elo 差异的增加，各个驾驶员的预期目标位置也变化更大，这意味着不能再做出这样的一般性陈述。",
      "Furthermore, it is important to know that only the finishing position of the race is taken into account for the calculation of the Elo points. The places won or lost in the race in relation to the starting position is not relevant.": "此外，重要的是要知道，Elo 积分的计算仅考虑比赛的完赛名次。比赛中相对于起跑位置赢得的或失去的名次不相关。",
      "Is there a possibility for an Elo refund?": "有没有可能退还 Elo 积分？",
      "No, there is usually no refund of Elo points. This also applies if, for example, you were unable to finish a race due to technical problems or were involved in an accident through no fault of your own. In the latter case, our reporting function can be used so that the person responsible is punished accordingly. If, on the other hand, a session does not take place as planned due to technical problems that affect all drivers equally, no Elo points will be deducted or refunded afterwards.": "不，通常不会退还 Elo 积分。这也适用于例如您因技术问题无法完成比赛或并非因自身过错卷入事故的情况。在后一种情况下，可以使用我们的举报功能，以便责任人受到相应处罚。另一方面，如果由于影响所有驾驶员的技术问题导致比赛未能按计划进行，则之后不会扣除或退还 Elo 积分。",
      "Safety-Rating": "安全评分",
      "How does the LFM Safety Rating (SR) work?": "LFM 安全评分（SR）是如何运作的？",
      "We have implemented our own Safety Rating (SR), which is independent of the Kunos Safety Rating (SA) and only takes into account the races run on our platform and is a good indicator of how safe the respective driver is on the track. For this purpose, the race incidents per corner are evaluated after each race. To gain SR, the ratio \"incidents per corner\" should be as low as possible. If, for example, you are involved in a start accident and then finish your race directly, this ratio is very high and you will lose a lot of SR. If, on the other hand, you continue your race after the incident and finish the race cleanly, you will gain SR.": "我们实施了独立的安全评分（SR），它独立于 Kunos 安全评分（SA），仅考虑在我们平台上进行的比赛，是衡量相应驾驶员在赛道上安全程度的一个良好指标。为此，每场比赛后都会评估每弯道的事故次数。要获得 SR，\"每弯道事故次数\" 的比例应尽可能低。例如，如果您卷入起跑事故然后直接结束比赛，这个比例会非常高，您将失去大量 SR。反之，如果您在事故后继续比赛并干净地完成比赛，您将获得 SR。",
      "The safety rating scale goes from 1.00 (lowest) to 9.99 (highest).": "安全评分范围从 1.00（最低）到 9.99（最高）。",
      "Each driver starts at 2.50 SR by obtaining the LFM driver's licence. If you complete the driver's licence on the SA95 licence server, you get an SR boost of 1.00, so that you can start the first LFM race with 3.50 SR.": "每位驾驶员在获得 LFM 驾照后以 2.50 SR 开始。如果您在 SA95 驾照服务器上完成驾照考试，您将获得 1.00 的 SR 加成，这样您就可以以 3.50 SR 开始您的第一场 LFM 比赛。",
      "A maximum of 0.30 SR and a bonus depending on the current safety rating can be gained per race. If a race is finished with 3 or fewer incident points, an additional bonus of 0.10 SR is awarded. With increasing SR, the maximum additional safety rating per clean race becomes less and less.": "每场比赛最多可获得 0.30 SR 以及根据当前安全评分而定的奖励。如果一场比赛以 3 个或更少的事故分完成，将额外奖励 0.10 SR。随着 SR 的提高，每场干净比赛的最大额外安全评分将越来越少。",
      "The maximum SR loss per race is 0.50 and a \"bonus\" depending on the current safety rating. Therefore, if a driver has a low safety rating, the loss will be lower than for a driver with a high safety rating for the same number of incidents and corners.": "每场比赛的最大 SR 损失为 0.50，以及根据当前安全评分而定的 \"奖励\"。因此，如果驾驶员的安全评分较低，在相同事故次数和弯道数的情况下，损失将低于安全评分较高的驾驶员。",
      "Incident points are calculated as follows:": "事故分的计算方式如下：",
      "- Each contact (with other cars, walls, etc.) that causes damage to the car will result in 4 incident points.": "- 每次导致车辆受损的接触（与其他车辆、墙壁等）将导致 4 个事故分。",
      "- Leaving the track (only the \"off-tracks\" logged by the server count, regardless of the messages displayed in ACC) gives 1 Incident point.": "- 离开赛道（仅计算服务器记录的 \"偏离赛道\"，无论 ACC 中显示的消息如何）会给予 1 个事故分。",
      "Cooldown:": "冷却时间：",
      "For each incident that earns Incident points, a 10 second cooldown timer will be activated where no further Incident points will be counted. For example, if there are multiple touches within a short period of time as a result of an accident, you will still only receive 4 Incident points for it.": "对于每次获得事故分的事件，将激活一个 10 秒的冷却计时器，在此期间不会计算进一步的事故分。例如，如果事故导致短时间内发生多次接触，您仍然只会因此收到 4 个事故分。",
      "SR Boost:": "SR 加成：",
      "Every time the SR exceeds the value of 5.00, there is a \"boost\" of additional 0.25 SR. This is to prevent drivers from losing SR after only one accident. This is to prevent drivers from immediately losing their driving licence for the series and events with the corresponding minimum SR of 5.00 after only one possibly bad race with SR loss.": "每次 SR 超过 5.00 时，都会有额外的 0.25 SR 加成。这是为了防止驾驶员在仅仅一次事故后就失去 SR。这是为了防止驾驶员在仅仅一场可能很糟糕的导致 SR 损失的比赛后，就立即失去参加相应最低 SR 为 5.00 的系列赛和赛事的驾照。",
      "Where is the Safety Rating calculation active?": "安全评分计算在哪些比赛中激活？",
      "LFM Seasons:": "LFM 赛季：",
      "At all LFM Seasons races the safety rating is always active regardless of the number of participants.": "在所有 LFM 赛季比赛中，无论参赛人数多少，安全评分始终激活。",
      "LFM Cup / Events:": "LFM 杯赛 / 赛事：",
      "Please check at the respective event whether safety rating is activated.": "请检查相应赛事是否激活了安全评分。",
      "The safety rating calculation is active during the entire race session. In the race, the formation lap as well as the run-out lap after crossing the finish line also count. So, especially during the latter, avoid collecting unnecessary incident points due to easily avoidable touches! No incident points can be collected during the practice and qualifying sessions.": "安全评分计算在整个比赛过程中都处于激活状态。在比赛中，编队圈以及越过终点线后的回场圈也计算在内。因此，尤其是在回场圈期间，避免因本可避免的接触而收集不必要的事故分！在练习赛和排位赛期间不会收集事故分。",
      "Will Safety Rating be deducted if I was innocently involved in an accident?": "如果我是无辜卷入事故，安全评分会被扣除吗？",
      "No, there is no safety rating deducted if you were involved in one (1) accident (= 4 incident points) and finish the remaining race clean! For a safety rating to be deducted, more must happen. However, since it is impossible to automatically determine who caused an incident, both drivers will of course always be credited with incident points in the event of accidents or contact. If you actually lose your safety rating in a race due to several unfortunate situations, this is not a big deal because the SR value shows a tendency over many races and is therefore a very good indicator of how safe or how clean the respective driver is in the race.": "不，如果您卷入一次（1）事故（= 4 个事故分）并以干净的方式完成剩余比赛，则不会扣除安全评分！要扣除安全评分，必须发生更多情况。然而，由于无法自动确定谁导致了事故，在发生事故或接触时，双方驾驶员当然总是会被计入事故分。如果您确实因为几个不幸的情况而在一场比赛中失去了安全评分，这并不严重，因为 SR 值显示了多场比赛的趋势，因此是衡量相应驾驶员在比赛中安全或干净程度的非常好的指标。",
      "If, on the other hand, the SR continuously decreases, you have to be honest enough to ask yourself where you can still improve or what the other drivers with a higher safety rating (see Safety Rating Leaderboard) are doing better. Self-reflection is very important here!": "反之，如果 SR 持续下降，您必须诚实地问自己，您还可以在哪里改进，或者安全评分更高的其他驾驶员（请参阅安全评分排行榜）在哪些方面做得更好。自我反思在这里非常重要！",
      "Reports": "举报",
      "How can I report an incident?": "如何举报事故？",
      "Incidents in our Seasons races can only be reported using the report function on our website. The report form can be found under My Account > Past Races or Seasons > My Sessions. There is short cool down period (4 hours from session-end) before a report can be submitted. The report window is open until 48 hours (LFM-Patrons: 72 hours) after the session-start.": "我们赛季比赛中的事故只能使用我们网站上的举报功能进行举报。举报表单可以在 我的账户 > 过往比赛 或 赛季 > 我的比赛 下找到。提交举报前有一个短暂的冷却期（比赛结束后 4 小时）。举报窗口在比赛开始后开放 48 小时（LFM Patreon 支持者：72 小时）。",
      "What incidents can and/or should be reported?": "哪些事故可以和/或应该被举报？",
      "In general, all incidents in which you were directly involved and thus had a significant disadvantage through no fault of your own can be reported. Minor incidents that have no major consequences do not have to be reported, as they are not penalised anyways. In the case of more serious incidents, it is up to the participants to decide whether they want to report them, so that the person who caused the incident is punished according to the rules in force. However, dialogue between drivers is also important for us. That's why we have an integrated chat function on our website where you can discuss race incidents in a respectful and objective manner. Please remember that every driver makes mistakes from time to time and that these are part of racing.": "一般来说，所有您直接卷入且因此并非因自身过错而受到重大不利影响的事故都可以举报。没有重大后果的轻微事故不必举报，因为它们无论如何都不会受到处罚。对于更严重的事故，由参赛者决定是否要举报，以便根据现行规则对事故责任人进行处罚。然而，驾驶员之间的对话对我们也很重要。这就是为什么我们在网站上集成了聊天功能，您可以在其中以尊重和客观的方式讨论比赛事故。请记住，每位驾驶员都会时不时地犯错，并且这些是赛车的一部分。",
      "What should always be reported?": "哪些情况应该始终被举报？",
      "In order to keep our races as clean as possible, we rely on the help of our community. Therefore, the following incidents should always be reported:": "为了尽可能保持我们比赛的清洁，我们依靠社区的帮助。因此，以下事故应始终被举报：",
      "Intentionally caused incidents": "故意引发的事故",
      "Unsportsmanlike conduct (e.g. overtaking off-track, deliberately running over signs, taking shortcuts)": "违反体育道德的行为（例如赛道外超车、故意碾过标志、抄近道）",
      "Unnecessary accidents (e.g. Unsafe Rejoin, driving too aggressively, accidents caused by gross negligence)": "不必要的事故（例如不安全返回赛道、驾驶过于激进、因严重疏忽造成的事故）",
      "Insults on the website chat and ingame chat": "网站聊天和游戏内聊天中的侮辱性言论",
      "How do I report insults in the website chat?": "如何举报网站聊天中的侮辱性言论？",
      "If both drivers have participated in the same race, it should first be checked whether a report can still be submitted for this race.": "如果两位驾驶员都参加了同一场比赛，应首先检查是否仍可以为该场比赛提交举报。",
      "If this is the case, the insult can be reported that way. In the report window, select Lap 0, Turn 0 and the report reason \"Offending others in chat/ Insulting\". Instead of a report video, a screenshot of the chat must be uploaded (e.g. here: https://imgbb.com/) and linked. If the insult is in a language other than English or German, the corresponding text must also be copied into the report message.": "如果是这种情况，可以这样举报侮辱行为。在举报窗口中，选择圈数 0、弯道 0 和举报原因 \"在聊天中冒犯他人/侮辱\"。必须上传聊天截图（例如在此处：https://imgbb.com/）并链接，而不是上传举报视频。如果侮辱性言论使用的语言不是英语或德语，则还必须将相应的文本复制到举报消息中。",
      "If it is no longer possible to create a report, the insult can be reported to us via a support ticket on our discord server.": "如果无法创建举报，您可以通过我们 Discord 服务器上的支持工单将侮辱行为报告给我们。",
      "What must be taken into account for a valid report?": "有效的举报需要考虑哪些因素？",
      "An elementary component of a report is a video with evidence of the respective situation. This must be created specifically for the report, uploaded to a video platform (e.g. YouTube) and correctly linked in the report form. In order to enable the LFM stewards to process the report as efficiently and fairly as possible, all points specified in our reporting guidelines must be observed. Please understand that due to the volume of reports submitted daily, we will unfortunately have to reject those that do not comply with the guidelines.": "举报的基本组成部分是包含相应情况证据的视频。该视频必须专门为举报制作，上传到视频平台（例如 YouTube）并在举报表单中正确链接。为了使 LFM 管理人员能够尽可能高效和公平地处理举报，必须遵守我们举报指南中规定的所有要点。请理解，由于每天提交的举报数量庞大，我们将不得不拒绝那些不符合指南的举报。",
      "AC Reporting-Guideline": "AC 举报指南",
      "ACC Reporting-Guideline": "ACC 举报指南",
      "AMS2 Reporting-Guideline": "AMS2 举报指南",
      "RaceRoom Reporting-Guideline": "RaceRoom 举报指南",
      "LeMans Ultimate Reporting-Guideline": "LeMans Ultimate 举报指南",
      "Which consequences can incorrectly submitted reports have?": "错误提交的举报可能产生哪些后果？",
      "Reports that do not comply with our Reporting-Guideline, where the report video is not available or cannot be judged for other reasons, must and will be consistently rejected. Such reports unfortunately cost our stewards unnecessary and valuable time": "不符合我们举报指南、无法提供举报视频或因其他原因无法判断的举报，必须且将被持续拒绝。不幸的是，此类举报浪费了我们管理人员不必要且宝贵的时间。",
      "The system checks whether two reports have been rejected for one of the above reasons within the past 14 days. As long as this is the case, the reporting feature remains disabled.": "系统会检查在过去 14 天内是否有两份举报因上述原因之一被拒绝。只要存在这种情况，举报功能将保持禁用。",
      "Once one of the two rejected reports is older than 14 days, the restriction is lifted automatically. On average, this takes about 10 days but may vary depending on the timing of the rejected reports.": "一旦两份被拒绝的举报中有一份超过 14 天，限制将自动解除。平均而言，这需要大约 10 天，但可能因被拒绝举报的时间而异。",
      "What can be the reasons for not being able to create a new report?": "无法创建新举报的原因可能是什么？",
      "If you cannot create new reports for a particular race under My Account > Past Races or Seasons > My Sessions, this may be due to the following reasons:": "如果您无法在 我的账户 > 过往比赛 或 赛季 > 我的比赛 下为某场比赛创建新举报，可能是由于以下原因：",
      "- the report window is not yet open (opens 4 hours after the end of the session) or is already closed again (closes 48 hours or 72 hours for LFM patrons after the start of the session).": "- 举报窗口尚未开放（比赛结束后 4 小时开放）或已经关闭（在比赛开始后 48 小时或 LFM Patreon 支持者 72 小时后关闭）。",
      "- the limit of two reports per race has already been reached": "- 已达到每场比赛两份举报的上限",
      "- the reporting function is temporarily blocked due to incorrectly submitted reports (two incorrectly submitted reports within 14 days can cause a report block).": "- 由于错误提交的举报，举报功能被暂时阻止（14 天内两次错误提交的举报可能会导致举报阻止）。",
      "- for certain races/events (e.g. during the off-season) or for races with live-stewarding the reporting function is disabled": "- 对于某些比赛/赛事（例如在休赛期间）或具有实时管理的比赛，举报功能被禁用",
      "What happens, if a report is filed against me?": "如果有人对我提交了举报，会发生什么？",
      "Unless the report is filed for an offence that would lead to a ban, the reported driver can view the report for 48 hours. The next time the driver visits the website, they can check the report on their own via a pop-up and have the option of accepting the penalty themselves. If the reported driver does not agree with the penalty or if the report was created incorrectly, they can reject the report and describe their own view. The report will then be assessed by an LFM steward.": "除非举报涉及的违规行为会导致禁赛，否则被举报的驾驶员可以在 48 小时内查看举报。驾驶员下次访问网站时，可以通过弹出窗口自行查看举报，并可以选择自行接受处罚。如果被举报的驾驶员不同意处罚或举报创建不正确，他们可以拒绝举报并描述自己的观点。然后，举报将由 LFM 管理人员评估。",
      "If a report is not accepted or rejected by the reported driver within 48 hours, it will automatically be forwarded to the LFM Stewards.": "如果被举报的驾驶员在 48 小时内未接受或拒绝举报，它将自动转发给 LFM 管理人员。",
      "Does the penalty change if I accept the report myself?": "如果我自行接受举报，处罚会改变吗？",
      "Yes, the SR penalty will be reduced by 25%.": "是的，SR 处罚将减少 25%。",
      "What happens if I do not accept the report?": "如果我不接受举报，会发生什么？",
      "If the report is correct and justified, the penalty will be issued in full.": "如果举报正确且合理，将全额执行处罚。",
      "If the reported driver admits guilt for the incident, but there is an error on the part of the reporter (e.g. wrong report reason selected), this can be selected when rejecting the report. In such a case, the steward will then issue the correct penalty including a 25% reduction.": "如果被举报的驾驶员承认对事件负有责任，但举报人方面存在错误（例如选择了错误的举报原因），可以在拒绝举报时选择此项。在这种情况下，管理人员将发出包括 25% 减免在内的正确处罚。",
      "How are time penalties applied?": "时间处罚如何应用？",
      "Time penalties are automatically added to the race result after a report has been processed. The recalculation of the result will be done at night (CET). For this reason, ELO changes and season points of the respective race may still change slightly until all reports have been processed.": "举报处理后，时间处罚会自动添加到比赛结果中。结果的重新计算将在夜间（欧洲中部时间）进行。因此，在直到所有举报处理完毕之前，相应比赛的 ELO 变化和赛季积分可能仍会略有变化。",
      "Which reports are eligible for reimbursement?": "哪些举报有资格获得退款？",
      "All report reasons associated with a collision.": "所有与碰撞相关的举报原因。",
      "How many incident points will be deleted?": "将删除多少事故分？",
      "2 incident points will be deleted if a penalty is imposed, with the exception of intentional collisions where all 4 incident points get removed. It is irrelevant whether the report is assessed by a steward or accepted by the driver himself.": "如果实施处罚，将删除 2 个事故分，但故意碰撞除外，所有 4 个事故分都将被移除。无论举报是由管理人员评估还是由驾驶员本人接受，都不影响。",
      "处罚": "处罚",
      "What are the penalties?": "处罚有哪些？",
      "The penalties will be issued in accordance with our Code of Conduct, which every driver must accept when registering for a race. Please note that especially those violations which, according to the rules, lead to a permanent ban, will be handled consistently and without exception. For example, insults (whether via in-game chat, Discord or the private chat function on our website) and deliberately caused accidents will always result in a ban and are not negotiable!": "处罚将根据我们的 行为准则 执行，每位驾驶员在注册比赛时都必须接受该准则。请注意，特别是那些根据规则会导致永久禁赛的违规行为，将始终如一且无一例外地处理。例如，侮辱（无论是通过游戏内聊天、Discord 还是我们网站上的私聊功能）和故意引发的事故将始终导致禁赛，且没有商量余地！",
      "I do not agree with a penalty, can I make a protest against it?": "我不同意处罚，我可以提出抗议吗？",
      "Steward decisions are to be accepted and will not be discussed! Everyone will receive a brief explanation of how the LFM Stewards assessed the incident. Please understand that due to the number of reports to be processed every day, we cannot discuss every decision afterwards. Of course, there can be mistakes in the steward decisions (e.g. confusion of a driver, double punishment in mass crashes). In this case, please open a support ticket in Discord so that we can correct the mistake.": "管理人员的决定必须被接受，且不会被讨论！每个人都会收到关于 LFM 管理人员如何评估事件的简要解释。请理解，由于每天要处理的举报数量众多，我们无法在之后讨论每一个决定。当然，管理人员的决定中可能存在错误（例如混淆驾驶员、大规模碰撞中的双重处罚）。在这种情况下，请在 Discord 中提交支持工单，以便我们更正错误。",
      "I have been banned for a certain number of days. When exactly does the ban end?": "我被禁赛了若干天。禁赛具体何时结束？",
      "The ban becomes active immediately after the report has been processed by a steward and lasts for at least the respective number of days (complete days, plus the remaining day on which the ban became active). The ban will then be automatically lifted (that means without prior consultation with the Race Commission) at 0:00 GMT/UTC. The specific expiry date of an active ban is shown on the profile page of the particular driver or under My Account.": "禁赛在管理人员处理完举报后立即生效，并至少持续相应的天数（完整的天数，加上禁赛生效当天的剩余时间）。届时，禁赛将在 GMT/UTC 时间 0:00 自动解除（这意味着无需事先与竞赛委员会协商）。活跃禁赛的具体到期日期显示在相应驾驶员的个人资料页面或 我的账户 下。",
      "Is it possible to have a permanent ban removed again?": "永久禁赛有可能被撤销吗？",
      "Permanent ban for repeatedly insulting or intentionally causing a collision": "因反复侮辱或故意引发碰撞而被永久禁赛",
      "Drivers who have been permanently banned before Season 10 for repeatedly insulting or intentionally causing a collision have the option to apply for an unban in our Discord if the permanent ban has been in place for at least 3 months.": "在第 10 赛季之前因反复侮辱或故意引发碰撞而被永久禁赛的驾驶员，如果永久禁赛已持续至少 3 个月，可以选择在我们的 Discord 中申请解禁。",
      "From Season 10 onwards, permanent bans will only be given in very serious cases and are then no longer revisable.": "从第 10 赛季开始，永久禁赛将仅适用于非常严重的情况，并且之后不再可撤销。",
      "Permanent ban for Banevasion": "因逃避禁赛而被永久禁赛",
      "Drivers who have been banned for banevasion have the possibility to apply for an unban in our Discord if the permanent ban has been in place for at least 6 months. This only applies to Drivers who have not been banned for banevasion more than once.": "因逃避禁赛而被禁赛的驾驶员，如果永久禁赛已持续至少 6 个月，可以选择在我们的 Discord 中申请解禁。这仅适用于未被多次因逃避禁赛而被禁赛的驾驶员。",
      "The decision whether or not to accept an unban request is always up to LFM and depends on the severity of the offence.": "是否接受解禁请求的决定始终由 LFM 做出，并取决于违规的严重程度。",
      "Assetto Corsa Special Topics": "Assetto Corsa 特别主题",
      "How to serve Penalties in Game": "如何在游戏中执行处罚",
      "If you get a drive through, just drive through the pits. Be sure to have the correct speed of 80 km/h BEFORE the pit entry line. Otherwise you will recieve another speeding penalty.": "如果您收到 drive through 处罚，只需驾驶通过维修区。确保在进入维修区线之前速度正确为 80 km/h。否则您将再次收到超速处罚。",
      "If you get a stop-and-go penalty. Just go into the pit lane, and stop somewhere. Do NOT stop on your marked pit box! Just stop anywhere in the pit lane for the needed seconds. After that you can go out of the pits again.": "如果您收到 stop-and-go 处罚。只需进入维修区通道，并在某个地方停车。不要停在您标记的维修区车位上！只需在维修区通道的任何地方停靠所需的秒数。之后您可以再次驶出维修区。",
      "Are there any special track limits?": "是否有特殊的赛道限制？",
      "Yes, in Assetto Corsa at LFM there are special track limits for different tracks. This is necessary due to technical limitations on various tracks.": "是的，在 LFM 的 Assetto Corsa 中，不同赛道有特殊的赛道限制。由于各种赛道的技术限制，这是必要的。",
      "Exceptions and specific details can be found here:": "例外情况和具体细节可在此处找到：",
      "Assetto Corsa Track Limits": "Assetto Corsa 赛道限制",
    },

    '/lfmapp': {
      "LFM APP": "LFM APP",
      "All your LFM essentials, in one desktop app.": "所有 LFM 必备功能，集成于一个桌面应用。",
      "Free essentials for every driver. LFM Plus unlocks advanced racing tools and livery workflows.": "为每位车手提供的免费基础功能。LFM Plus 解锁高级赛车工具和涂装工作流。",
      "Free essentials included": "包含免费基础功能",
      "LFM Plus adds pro features": "LFM Plus 添加专业功能",
      "Browse LMU races and upcoming sessions without a LFM Plus subscription.": "无需 LFM Plus 订阅即可浏览 LMU 比赛和即将开始的场次。",
      "Keep Assetto Corsa mods synced and ready to race.": "保持 Assetto Corsa 模组同步并随时可赛。",
      "Join race voice channels with optional in-game overlay.": "加入比赛语音频道，可选的游戏内叠加显示。",
      "Antivirus notice": "杀毒软件提示",
      "Some antivirus tools have not whitelisted LFM App yet. If you see alerts during download or install, add the installer to your allow list.": "部分杀毒软件尚未将 LFM App 加入白名单。如果在下载或安装过程中看到警报，请将安装程序添加到您的允许列表。",
      "The app does not contain malicious code.": "该应用不包含恶意代码。",
      "Latest build": "最新版本",
      "Windows desktop app": "Windows 桌面应用",
      "Free download": "免费下载",
      "DOWNLOAD NOW": "立即下载",
      "Version": "版本",
      "Release date": "发布日期",
      "Filename": "文件名",
      "Install in minutes and sign in with Steam to get started.": "几分钟内完成安装，使用 Steam 登录即可开始。",
      "FREE FOR EVERYONE": "面向所有人免费",
      "LFM App is valuable even without LFM Plus. These essentials are available to every driver.": "即使没有 LFM Plus，LFM App 也很有价值。这些基础功能对所有车手开放。",
      "Race Hub (LMU)": "比赛中心 (LMU)",
      "Free": "免费",
      "Browse LMU daily, weekly, and special events.": "浏览 LMU 每日、每周和特别赛事。",
      "See upcoming sessions, track info, and requirements.": "查看即将开始的场次、赛道信息和要求。",
      "Join LMU races even without LFM Plus.": "即使没有 LFM Plus 也能加入 LMU 比赛。",
      "AC Sync": "AC 同步",
      "Install required Assetto Corsa mods with one click.": "一键安装所需的 Assetto Corsa 模组。",
      "Keep selected series content updated automatically.": "自动更新所选系列赛的内容。",
      "View sync history so you know what changed.": "查看同步历史，了解更改内容。",
      "LFM Voice (Race Sessions)": "LFM 语音 (比赛场次)",
      "Auto-join the correct race voice channel.": "自动加入正确的比赛语音频道。",
      "Control volume per driver and use quick mute.": "按车手调节音量，并使用快速静音。",
      "Enable an optional in-game overlay.": "启用可选的游戏内叠加显示。",
      "Inbox, Updates, Settings": "收件箱、更新、设置",
      "News and stream updates in one place.": "新闻和直播更新集中在一处。",
      "Update prompts and changelog after releases.": "发布后提供更新提示和更新日志。",
      "Quick access to general, AC Sync, LMU, and voice settings.": "快速访问常规、AC 同步、LMU 和语音设置。",
      "Home hub with quick access to the tools you need.": "主页中心，快速访问您需要的工具。",
      "AC Sync keeps mods installed, updated, and ready.": "AC 同步保持模组已安装、更新并准备就绪。",
      "Voice chat follows your race session automatically.": "语音聊天自动跟随您的比赛场次。",
      "LFM Plus POWER-UPS": "LFM Plus 增强功能",
      "LFM Plus members unlock advanced race management, livery workflows, and practice tools.": "LFM Plus 会员解锁高级比赛管理、涂装工作流和练习工具。",
      "In-App Race Signup": "应用内比赛报名",
      "Sign up and manage entries for most sims from the app.": "通过应用报名并管理大多数模拟器的参赛。",
      "Quick access to upcoming races and signup status.": "快速查看即将到来的比赛和报名状态。",
      "Choose car and livery during signup when supported.": "报名时可选择赛车和涂装（如果支持）。",
      "Liverytool Upload & Management": "涂装工具上传与管理",
      "Upload personal and team liveries from the desktop app.": "从桌面应用上传个人和车队涂装。",
      "Manage your livery library and keep local ACC liveries in sync.": "管理您的涂装库，并保持本地 ACC 涂装同步。",
      "Event liveries can be free when the event allows it.": "赛事涂装在允许的情况下可免费使用。",
      "Practice Tools": "练习工具",
      "One-click joins for supported practice servers.": "一键加入支持的练习服务器。",
      "Practice voice chat and auto-join options.": "练习语音聊天和自动加入选项。",
      "Race and stream notifications in the Inbox.": "收件箱中的比赛和直播通知。",
      "Race Day Shortcuts": "比赛日快捷操作",
      "Upcoming races drawer and next race widget.": "即将到来的比赛抽屉和下一场比赛小部件。",
      "Quick joins for live races when supported.": "支持的赛事可快速加入实时比赛。",
      "Race notifications toggles in settings.": "设置中的比赛通知开关。",
      "LMU access stays free: race browsing and live join for LMU are available even without LFM Plus.": "LMU 访问保持免费：即使没有 LFM Plus，也可浏览和实时加入 LMU 比赛。",
      "INSTALLATION & SETUP": "安装与设置",
      "Download the installer": "下载安装程序",
      "Grab the latest file and keep it handy for setup.": "获取最新文件并备好用于安装。",
      "Run the setup": "运行安装程序",
      "Open the installer and follow the prompts.": "打开安装程序并按照提示操作。",
      "Sign in and race": "登录并参赛",
      "Launch LFM App, sign in with Steam, and you are ready.": "启动 LFM App，使用 Steam 登录，一切就绪。",
      "常见问题": "常见问题",
      "Do I need to keep the app running?": "我需要保持应用运行吗？",
      "Yes. It handles mod sync, race data, and voice features in the background. Use minimize to tray if you want it out of the way.": "是的。它会在后台处理模组同步、比赛数据和语音功能。如果您想让它不碍事，可最小化到系统托盘。",
      "Is LFM App useful without LFM Plus?": "没有 LFM Plus，LFM App 还有用吗？",
      "Absolutely. LMU race browsing, AC Sync, race voice chat, and updates are all available for free.": "当然。LMU 比赛浏览、AC 同步、比赛语音聊天和更新全都免费提供。",
      "First start feels slow. Is that normal?": "首次启动感觉较慢，正常吗？",
      "Yes. The first run builds caches and previews. After that, starts are usually fast.": "正常。首次运行会构建缓存和预览。之后启动通常会很快。",
    },

    '/teams/teamslist': {
      "CREATE NEW TEAM": "创建新队伍",
      "ID": "ID",
      "Logo": "标志",
      "Teamname": "队伍名称",
      "DRIVERS": "车手",
      "ELO": "ELO",
      "ACC": "ACC",
      "rF2": "rF2",
      "AC": "AC",
      "AMS2": "AMS2",
      "R3E": "R3E",
      "SR": "安全评分",
      "LEADER": "队长",
      "PREVIOUS «": "上一页 «",
      "» NEXT": "» 下一页",
    },

    '/teams/create': {
      "CREATE TEAM": "创建车队",
      "Teamname*": "车队名称*",
      "Join Password*": "加入密码*",
      "Teamlogo": "车队标志",
      "Choose File": "选择文件",
      "No File selected": "未选择文件",
      "Country*": "国家/地区*",
      "Search...": "搜索...",
      "Founding Date (DD.MM.YYYY)*": "成立日期（日.月.年）*",
      "Description*": "描述*",
      "Website": "网站",
      "Discord": "Discord",
      "Teamspeak": "Teamspeak",
      "Twitch": "Twitch",
      "Youtube": "YouTube",
      "Facebook": "Facebook",
      "Twitter": "Twitter",
      "Instagram": "Instagram",
      "SAVE": "保存",
    },

    '/setups': {
      "LFM SETUP MARKET": "LFM 调校市场",
      "Discover the LFM Setup Market – your ultimate platform for perfect race results!": "探索 LFM 调校市场 – 您获得完美比赛成绩的终极平台！",
      "Whether you're racing in iRacing, ACC, or other LFM-supported simulations, here you'll find the setup that boosts your performance and gives you the confidence you need on the track.": "无论您是在 iRacing、ACC 或其他 LFM 支持的模拟器中比赛，在这里您都能找到提升表现、让您在赛道上充满信心的调校。",
      "Subscription": "订阅",
      "Packs": "套装",
      "Single Setups": "单次调校",
      "Telemetry": "遥测",
      "App": "应用",
      "ACC": "ACC",
      "AC": "AC",
      "iRacing": "iRacing",
      "AMS2": "AMS2",
      "LMU": "LMU",
      "Go Setups": "Go Setups",
      "Popometer": "Popometer",
      "BeAlien": "BeAlien",
      "SimRacingSetup(s)": "SimRacingSetup(s)",
      "TrackTitan": "TrackTitan",
      "Coach Dave Academy": "Coach Dave Academy",
      "Grid & Go": "Grid & Go",
      "Rennwelten": "Rennwelten",
    },

    '/statistics/ratingleaderboard': {
      "Simulation": "模拟器",
      "COUNTRY": "国家/地区",
      "FILTER": "筛选",
      "YOUR POSITION:": "您的排名：",
      "POS": "排名",
      "AVATAR": "头像",
      "ORIGIN": "国籍",
      "NAME": "姓名",
      "RACES": "参赛场次",
      "RATING": "评分",
      "LICENSE": "驾照",
      "PREVIOUS «": "上一页 «",
      "» NEXT": "» 下一页",
      "Assetto Corsa Competizione": "神力科莎：竞速",
      "Search...": "搜索...",
      'Assetto Corsa Competizione': '神力科莎：竞速',
      'Assetto Corsa Evo': '神力科莎 EVO',
      'Assetto Corsa': '神力科莎',
      'Automobilista 2': '汽车运动 2',
      'RaceRoom Racing Experience': '竞速房赛车体验',
      'Le Mans Ultimate': '勒芒终极版',
      'rFactor 2': 'rFactor 2',
      'IRacing': 'iRacing',
    },

    '/statistics/srleaderboard': {
      'YOUR POSITION:': '您的排名：',
      'POS.': '排名',
      'AVATAR': '头像',
      'ORIGIN': '国籍',
      'NAME': '姓名',
      'TOTAL RACES': '总参赛场次',
      'SR RACES': 'SR 场次',
      'SAFETY RATING': '安全评分',
      'Ø RATING CHANGE': '平均评分变化',
      'Ø INCS.': '平均事故分',
      'PREVIOUS «': '上一页 «',
      '» NEXT': '» 下一页'
    },

    '/statistics/driverperformance': {
      'sort': '排序',
      'country': '国家/地区',
      'FILTER': '筛选',
      'YOUR POSITION:': '您的排名：',
      'POS.': '排名',
      'AVATAR': '头像',
      'ORIGIN': '国籍',
      'NAME': '姓名',
      'total races': '总场次',
      'wins': '胜利',
      'podiums': '领奖台',
      'top 5': '前五',
      'top 10': '前十',
      'dnf': '未完成',
      'poles': '杆位',
      'Ø IP': '平均事故分',
      'clean races': '干净比赛',
      'PREVIOUS «': '上一页 «',
      '» NEXT': '» 下一页',
      "Wins": "胜利次数",
      "Winrate": "胜率",
      "Podiums": "领奖台次数",
      "Podiumrate": "领奖台率",
      "Top 5": "前五次数",
      "Top 5 Rate": "前五率",
      "Top 10": "前十次数",
      "Top 10 Rate": "前十率",
      "DNF": "未完赛",
      "Poles": "杆位次数",
      "Polesrate": "杆位率",
      "Clean Races": "干净比赛次数",
      "Clean Races Rate": "干净比赛率",
      "Average Incident Points": "平均事故分",
    },

    '/statistics/trackrecords': {
      "Simulation": "模拟器",
      "BOP / Gameversion": "性能平衡 / 游戏版本",
      "Car Class": "车辆组别",
      "QUALIFYING": "排位赛",
      "RACE": "正赛",
      "Assetto Corsa Competizione": "神力科莎：竞速",
      "Search...": "搜索...",
      'Assetto Corsa Competizione': '神力科莎：竞速',
      'Assetto Corsa Evo': '神力科莎 EVO',
      'Assetto Corsa': '神力科莎',
      'Automobilista 2': '汽车运动 2',
      'RaceRoom Racing Experience': '竞速房赛车体验',
      'Le Mans Ultimate': '勒芒终极版',
      'rFactor 2': 'rFactor 2',
      'IRacing': 'iRacing',
    },

    '/statistics/mostactivedriver': {
      'YOUR POSITION:': '您的排名：',
      'POS': '排名',
      'AVATAR': '头像',
      'ORIGIN': '国籍',
      'NAME': '姓名',
      'RACES': '参赛场次',
      'LAPS': '圈数',
      'KM.': '里程 (公里)',
      'PREVIOUS «': '上一页 «',
      '» NEXT': '» 下一页'
    },

    '/supportlfm': {
      "LFM is by racers, for racers. To operate the platform at no cost, we need at least 2,500 supporters. Once we sustain this milestone, we will give back with exclusive features like on-demand hosting, more LFM App features, and eventually even a mobile app.": "LFM 是一项由赛车手为赛车手打造的服务。为了免费运营该平台，我们需要至少 2,500 名支持者。一旦达到这一里程碑，我们将提供专属功能作为回馈，例如按需托管服务、更丰富的 LFM App 功能，以及最终推出的移动端应用程序。",
      "LFM+ SUPPORT & GOALS": "LFM+ 支持与目标",
      "Your support. Your features. Your LFM.": "您的支持。您的功能。您的 LFM。",
      "Members": "会员数",
      "Goal / Incentive": "目标 / 激励",
      "状态": "状态",
      "Running the platform on zero sum & on-demand ranked hosting": "以零和及按需排名托管运营平台",
      "Core Goal": "核心目标",
      "Your LFM customized / Achievement badges": "您的 LFM 定制 / 成就徽章",
      "running": "进行中",
      "Race summaries / XP system": "比赛摘要 / 经验值系统",
      "Team manager feature (LFM App)": "车队管理功能 (LFM App)",
      "Mobile app": "移动应用",
      "Ultimate Goal": "终极目标",
      "TAKE ME TO THE LFM+ SIGN UP PAGE": "带我去 LFM+ 注册页面",
      "Additional voluntary support": "额外自愿支持",
      "If you want to support LFM even more, you can also leave a direct voluntary donation. This is completely optional and independent from an LFM+ membership.": "如果您想进一步支持 LFM，您也可以直接进行自愿捐款。这完全是可选的，与 LFM+ 会员资格无关。",
      "DONATE NOW": "立即捐赠"
    },

    '/racing/official': {
      "ACC LOBBY SERVERS ARE ONLINE": "ACC 大厅服务器在线",
      "ACC CONNECTOR": "ACC 连接器",
      "ACC HOTLAPS": "ACC 最快圈速",
      "ACC BOP": "ACC 性能平衡",
      "SEASON 22 | WEEK 12": "第22赛季 | 第12周",
      "Tileview": "卡片视图",
      "Tableview": "表格视图",
      "Quick Signup": "快速报名",
      "DAILY": "每日",
      "WEEKLY": "每周",
      "SPECIAL EVENTS": "特别赛事",
      "Syncmesh GT3 Series": "Syncmesh GT3系列赛",
      "Touring Cup": "房车杯",
      "ACC DRIVE Endurance Series": "ACC DRIVE 耐力系列赛",
      "MIN": "分钟",
      "GT3+GT4/M2/PCUP / 45 MIN.": "GT3+GT4/M2/PCUP / 45分钟",
      "GT3 WE:MONZA FR:SPA": "GT3 周末:蒙扎 周五:斯帕",
      "GT3 TEAM-ENDURANCE": "GT3 车队耐力赛",
    },

    '/users': {
      'LFM+/Patreon Membership Status': 'LFM+/Patreon 会员状态',
      'No Membership!': '暂无会员！',
      'Be a LFM+ Supporter!': '成为 LFM+ 支持者！',
      'Redeem Code': '兑换代码',
      'Gift a Membership via Patreon!': '通过 Patreon 赠送会员！',
      'LFM Driver License Status (ACC only)': 'LFM 驾照状态（仅 ACC）',
      'License Status:': '驾照状态：',
      'License Hot Stints:': '驾照有效 Hot Stint：',
      'Valid Stint': '有效 Stint',
      'Valid for Lic.': '驾照有效',
      'LFM Track Permit Status (ACC only)': 'LFM 赛道许可状态（仅 ACC）',
      'LFM Driver License Streaming Widgets': 'LFM 驾照直播组件',
      'Big Card': '大卡片',
      'Small Card': '小卡片',
      'My Team(s)': '我的车队',
      'Create New Team': '创建新车队',
      'Find a Team': '寻找车队',
      'User Statistics': '用户统计',
      'Link Patreon Account': '关联 Patreon 账户',
      'Link Discord Account': '关联 Discord 账户',
    },

    '/seasons': {
      '#Save ACC! We need your signature!': '#拯救 ACC！我们需要你的签名！',
      'Help to save ACC!': '帮助拯救 ACC！',
      'Next': '下一场',
      'min.': '分钟',
      'Join ACC practice servers via ACC Connector': '通过 ACC Connector 加入 ACC 练习服务器',
      'ACC Connector tutorial': 'ACC Connector 教程',
      'P Dry 1': '练习服 干地 1',
      'P Dry 2': '练习服 干地 2',
      'P Dry 1 Next Week': '练习服 干地 1 下周',
      'DLC/Mod Content in use for this week:': '本周使用的 DLC/模组内容：',
      'Cars:': '车辆：',
    },
    '/events': {
      'Qualifying': '排位赛',
      'Race': '正赛',
      'Position': '排名',
      'Interval': '间隔',
    },
  };

  const partialGlobal = {
    'Nürburgring GT (noDRS)': '纽博格林赛道（NO DRS）',
    'Circuit de Spa Francorchamps': '斯帕赛道',
    'Brands Hatch Circuit': '布兰兹哈奇赛道',
    'Nürburgring Nordschleife 24h': '纽博格林北环赛道',
    'Nürburgring': '纽博格林赛道',
    'Silverstone': '银石赛道',
    'Mount Panorama Circuit': '巴瑟斯特全景山赛道',
    'Autodromo Enzo e Dino Ferrari': '伊莫拉赛道',
    'Spielberg - Red Bull Ring': '红牛环赛道',
    'Autodromo Nazionale di Monza': '蒙扎赛道',
    'Circuit de Paul Ricard': '保罗里卡德赛达',
    'Kyalami': '卡亚米拉赛道',
    'Suzuka Circuit': '铃鹿赛道',
    'Zolder': '佐尔德赛道',
    'Misano': '米萨诺赛道',
    'Barcelona': '巴塞罗那赛道',
    'Hungaroring': '亨格罗宁赛道',
    'Watkins Glen': '沃特金斯峡谷赛道',
    'Indianapolis': '印第安纳波利斯赛道',
    'Circuit Of The Americas': '美洲赛道赛道',
    'Donington Park': '多宁顿公园赛道',
    'Circuit Ricardo Tormo': '瓦伦西亚赛道',
    'Oulton Park': '奥顿公园赛道',
    'Circuit de Catalunya': '加泰罗尼亚赛道',

    'Snetterton': '斯内特赛道',
    'Zandvoort': '赞德沃特赛道',
    'Imola': '伊莫拉赛道',
    'Fuji short (noDRS)': '富士赛道 短（NO DRS）',
    'Laguna Seca': '唐古拉那塞卡赛道',
    'Circuit Bugatti (Rolling)': '布加迪赛道（动态起步）',

  };

    const MONTHS = {
    jan: '1',
    january: '1',
    feb: '2',
    february: '2',
    mar: '3',
    march: '3',
    apr: '4',
    april: '4',
    may: '5',
    jun: '6',
    june: '6',
    jul: '7',
    july: '7',
    aug: '8',
    august: '8',
    sep: '9',
    sept: '9',
    september: '9',
    oct: '10',
    october: '10',
    nov: '11',
    november: '11',
    dec: '12',
    december: '12',
  };

  const regexRules = [
    [/^Incident in Turn (\d+) on Lap (\d+)$/i, '第 $2 圈第 $1 弯事故'],
    [/^The result for Race #(\d+) was changed$/i, '比赛 #$1 的结果已更新'],
    [/^Your result for race #(\d+) \((.+)\) is ready\. ELO ([+-]?\d+) \/ SR ([+-]?\d+(?:\.\d+)?) \/ Points (\d+)$/i, '你的比赛 #$1（$2）结果已出炉：ELO $3 / SR $4 / 积分 $5'],
    [/^Congratulations! You achieved more than (\d+) ELO in (.+)!$/i, '恭喜！你在 $2 中达到了超过 $1 ELO！'],
    [/^Congratulations! You reached the ([A-Z+]+) license in (.+) for the first time!$/i, '恭喜！你首次在 $2 中获得 $1 驾照！'],
    [/^Race #(\d+)$/i, '比赛 #$1'],
    [/^(\d+)h ago$/i, '$1 小时前'],
    [/^(\d+)d ago$/i, '$1 天前'],
    [/^(\d+)m ago$/i, '$1 分钟前'],
    [/^just now$/i, '刚刚'],
    [/^Season\s+(\d+)$/i, '第 $1 赛季'],
    [/^Session\s+#\s*(\d+)$/i, '比赛场次 #$1'],
    [/^User Data\s*\|\s*your LFM ID:\s*(\d+)$/i, '用户数据 | 你的 LFM ID：$1'],
    [/^(\d+)\s*min\.\s*Races?$/i, '$1 分钟比赛'],
    [/^(\d+)\s*min\.\s*Races?\s*\/\s*Pitstop$/i, '$1 分钟比赛 / 强制进站'],
    [/^Porsche Cup\s*\/\s*(\d+)\s*min$/i, '保时捷杯 / $1 分钟'],
    [/^GT3\s*\+\s*GT4\s*Multiclass\s*\/\s*(\d+)\s*min\.?$/i, 'GT3 + GT4 多组别 / $1 分钟'],
    [/^GT3\s*\/\s*2 Driver Teams\s*\/\s*(\d+)\s*min\.?$/i, 'GT3 / 双人车队 / $1 分钟'],
    [/^Week\s+(\d+)\s*\|\s*(.+)$/i, '第 $1 周 | $2'],
  ];

  let exactActive = {};
  let scheduled = false;
  const pendingRoots = new Set();


  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .locale-menu {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
  }

  function leadingWhitespace(value) {
    const match = value.match(/^\s*/);
    return match ? match[0] : '';
  }

  function trailingWhitespace(value) {
    const match = value.match(/\s*$/);
    return match ? match[0] : '';
  }

  function refreshActiveDictionary() {
    exactActive = { ...exactGlobal };
    const path = window.location.pathname;

    Object.entries(exactByRoute).forEach(([route, dict]) => {
      if (path.startsWith(route)) {
        Object.assign(exactActive, dict);
      }
    });
  }

  function shouldSkipElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    if (SKIP_TAGS.has(element.tagName)) {
      return true;
    }

    return SKIP_SELECTORS.some((selector) => element.closest(selector));
  }



  function translateEnglishDate(value) {
    const match = value.match(/^(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,)?\s+(\d{4})$/i);
    if (!match) {
      return null;
    }

    const month = MONTHS[match[1].toLowerCase()];
    const day = String(Number(match[2]));
    return `${match[3]}年${month}月${day}日`;
  }
  function applyPartialTranslations(value) {
    let translated = value;
    Object.entries(partialGlobal).forEach(([source, target]) => {
      translated = translated.split(source).join(target);
    });
    return translated;
  }

  function formatSignedPenalty(value) {
    return value.startsWith('-') || value.startsWith('+') ? value : `-${value}`;
  }

  function translatePenaltyPart(part) {
    const text = part.trim();
    let match = text.match(/^Safety Rating:\s*([+-]?\d+(?:\.\d+)?)$/i);
    if (match) {
      return `安全评分 ${formatSignedPenalty(match[1])}`;
    }

    match = text.match(/^Time Penalty:\s*(\d+)\s*seconds?$/i);
    if (match) {
      return `时间罚时 ${match[1]} 秒`;
    }

    match = text.match(/^Stop(?:-|\s*)and(?:-|\s*)Go(?: Penalty)?(?::?\s*(\d+)\s*seconds?)?$/i);
    if (match) {
      return match[1] ? `停走处罚 ${match[1]} 秒` : '停走处罚';
    }

    if (/^Drive Through(?: Penalty)?$/i.test(text)) {
      return '通过维修区处罚';
    }

    if (/^Disqualification$/i.test(text)) {
      return '取消资格';
    }

    if (/^Warning$/i.test(text)) {
      return '警告';
    }

    if (/^No Further Action$/i.test(text)) {
      return '不进一步处罚';
    }

    return applyPartialTranslations(text);
  }

  function translatePenaltyDecision(value) {
    let match = value.match(/^Penalty for (.+?)\.\s*Driver\s+(.+?)\s+will get a ([+-]?\d+(?:\.\d+)?) safety rating penalty!$/i);
    if (match) {
      return `对 ${match[1]} 的处罚：车手 ${match[2]} 将被扣除 ${match[3]} 安全评分！`;
    }

    match = value.match(/^Penalty for (.+?):\s*(.+)$/i);
    if (match) {
      const parts = match[2]
        .split(/\s+(?:\/|\+)\s+/)
        .map(translatePenaltyPart)
        .filter(Boolean);
      return `对 ${match[1]} 的处罚：${parts.join(' / ')}`;
    }

    match = value.match(/^Penalty for (.+)$/i);
    if (match) {
      return `对 ${match[1]} 的处罚`;
    }

    return null;
  }
  function translateString(rawText, allowPartial) {
    if (!rawText || !rawText.trim()) {
      return rawText;
    }

    const normalized = normalizeText(rawText);
    const prefix = leadingWhitespace(rawText);
    const suffix = trailingWhitespace(rawText);
    const dateTranslation = translateEnglishDate(normalized);
    if (dateTranslation) {
      return prefix + dateTranslation + suffix;
    }

    const penaltyTranslation = translatePenaltyDecision(normalized);
    if (penaltyTranslation) {
      return prefix + applyPartialTranslations(penaltyTranslation) + suffix;
    }

    for (const [pattern, replacement] of regexRules) {
      if (pattern.test(normalized)) {
        return prefix + applyPartialTranslations(normalized.replace(pattern, replacement)) + suffix;
      }
    }

    if (Object.prototype.hasOwnProperty.call(exactActive, normalized)) {
      return prefix + exactActive[normalized] + suffix;
    }

    if (!allowPartial) {
      return rawText;
    }

    return applyPartialTranslations(rawText);
  }

  function translateTextNode(textNode) {
    const parent = textNode.parentElement;
    if (!parent || shouldSkipElement(parent)) {
      return;
    }

    const nextText = translateString(textNode.nodeValue, true);
    if (nextText !== textNode.nodeValue) {
      textNode.nodeValue = nextText;
    }
  }

  function translateAttributes(element) {
    if (shouldSkipElement(element)) {
      return;
    }

    ATTRIBUTES.forEach((name) => {
      if (!element.hasAttribute(name)) {
        return;
      }

      const current = element.getAttribute(name);
      const translated = translateString(current, false);
      if (translated !== current) {
        element.setAttribute(name, translated);
      }
    });
  }


  function applyDatenschutzPageTranslation() {
    if (!window.location.pathname.startsWith('/datenschutz')) {
      return;
    }

    const content = document.querySelector('.privacy-content');
    if (!content || content.dataset.lfmCnTranslated === 'datenschutz') {
      return;
    }

    content.dataset.lfmCnTranslated = 'datenschutz';
    content.innerHTML = `
      <h1>隐私政策</h1>
      <p><strong>说明：</strong>以下为 Low Fuel Motorsport 隐私政策的中文参考译文，便于中文用户阅读。法律效力以网站原始德文文本为准。</p>

      <h2>1. 数据保护概览</h2>
      <h3>一般说明</h3>
      <p>以下内容概述了您访问本网站时，您的个人数据会发生什么。个人数据是指任何可以用于识别您个人身份的数据。关于数据保护的详细信息，请参阅本隐私政策的后续章节。</p>

      <h3>本网站的数据收集</h3>
      <h4>谁负责本网站的数据收集？</h4>
      <p>本网站的数据处理由网站运营者负责。联系方式可在本隐私政策“责任方说明”章节中找到。</p>
      <h4>我们如何收集您的数据？</h4>
      <p>一部分数据由您主动提供，例如您在联系表单中输入的信息。其他数据会在您访问网站时，由我们的 IT 系统自动收集，或在您同意后收集。这主要包括技术数据，例如浏览器、操作系统或页面访问时间。</p>
      <h4>我们将您的数据用于什么目的？</h4>
      <p>部分数据用于确保网站正常无误地提供服务。其他数据可能用于分析用户行为。</p>
      <h4>您对自己的数据有哪些权利？</h4>
      <p>您有权免费获知我们保存的个人数据的来源、接收方和处理目的。您也有权要求更正或删除这些数据。如果您已同意数据处理，可以随时撤回该同意，撤回对未来有效。在特定情况下，您还可以要求限制处理您的个人数据，并有权向主管监管机构投诉。</p>

      <h3>分析工具和第三方工具</h3>
      <p>访问本网站时，您的浏览行为可能会被统计分析，这主要通过分析程序完成。详细信息请参阅下文。</p>

      <h2>2. 托管和内容分发网络（CDN）</h2>
      <h3>外部托管</h3>
      <p>本网站由外部服务提供商托管。通过本网站收集的个人数据会存储在该托管服务商的服务器上，可能包括 IP 地址、联系请求、元数据和通信数据、合同数据、联系信息、姓名、网站访问记录以及通过网站产生的其他数据。</p>
      <p>使用托管服务是为了履行与潜在客户和现有客户之间的合同义务，并基于我们通过专业服务商安全、快速、高效提供在线服务的合法利益。</p>
      <p>托管服务商仅会在履行其服务义务所必需的范围内处理您的数据，并遵守我们关于这些数据的指示。</p>
      <p>我们使用以下托管服务商：</p>
      <p>1&amp;1 Telecommunication SE<br>Elgendorfer Str. 57<br>56410 Montabaur</p>

      <h2>3. 一般说明和强制性信息</h2>
      <h3>数据保护</h3>
      <p>本网站运营者非常重视保护您的个人数据。我们会按照法定数据保护规定和本隐私政策，对您的个人数据进行保密处理。</p>
      <p>当您使用本网站时，会收集各种个人数据。本隐私政策说明我们收集哪些数据、用途是什么，以及如何和为何进行处理。</p>
      <p>请注意，互联网数据传输（例如电子邮件通信）可能存在安全漏洞，无法完全防止第三方访问。</p>

      <h3>责任方说明</h3>
      <p>本网站数据处理的责任方为：</p>
      <p>Boris Schalk<br>Humboldtstr. 20<br>74915 Waibstadt</p>
      <p>电子邮件：<a href="mailto:contact@lowfuelmotorsport.de">contact@lowfuelmotorsport.de</a></p>
      <p>责任方是指单独或与他人共同决定个人数据处理目的和方式的自然人或法人。</p>

      <h3>存储期限</h3>
      <p>除非本隐私政策中另有更具体说明，您的个人数据会保存至数据处理目的不再适用为止。如果您提出合法删除请求，或撤回数据处理同意，我们会删除您的数据，除非存在其他合法保存理由，例如税务或商业法规定的保存期限。</p>

      <h3>向美国传输数据的说明</h3>
      <p>本网站可能集成位于美国的企业提供的工具。当这些工具启用时，您的个人数据可能会传输至相关企业在美国的服务器。我们提示您，美国并非欧盟数据保护法意义上的安全第三国。美国企业可能被要求向安全机构交出个人数据，且您作为数据主体可能无法对此提起法律救济。</p>

      <h3>撤回数据处理同意</h3>
      <p>许多数据处理操作只有在您明确同意后才可进行。您可以随时撤回已经给予的同意。撤回不影响撤回前已经完成的数据处理的合法性。</p>

      <h3>反对特定情况下的数据收集以及反对直接营销的权利（GDPR 第 21 条）</h3>
      <p class="uppercase-text">如果数据处理基于 GDPR 第 6 条第 1 款 e 项或 f 项，您有权基于自身特殊情况随时反对处理您的个人数据；这也适用于基于这些规定进行的画像分析。如果您提出反对，我们将不再处理相关个人数据，除非我们能够证明存在优先于您利益、权利和自由的强制性合法理由，或处理是为了主张、行使或抗辩法律请求。</p>
      <p class="uppercase-text">如果您的个人数据被用于直接营销，您有权随时反对为此目的处理与您有关的个人数据；这也适用于与直接营销相关的画像分析。提出反对后，您的个人数据将不再用于直接营销。</p>

      <h3>向主管监管机构投诉的权利</h3>
      <p>如发生违反 GDPR 的情况，数据主体有权向监管机构投诉，尤其是其通常居住地、工作地点或涉嫌违规发生地所在成员国的监管机构。</p>

      <h3>数据可携权</h3>
      <p>您有权要求将我们基于您的同意或合同履行而自动处理的数据，以常用、机器可读的格式交给您或第三方。若您要求直接传输给另一责任方，仅在技术可行范围内进行。</p>

      <h3>SSL/TLS 加密</h3>
      <p>出于安全原因以及保护您传输给我们的机密内容，本网站使用 SSL/TLS 加密。启用加密后，您传输给我们的数据不会被第三方读取。</p>

      <h3>查询、删除和更正</h3>
      <p>在适用法律范围内，您有权随时免费查询我们保存的您的个人数据、其来源、接收方和处理目的，并在适用情况下要求更正或删除这些数据。</p>

      <h3>限制处理的权利</h3>
      <p>您有权要求限制处理您的个人数据。您可以随时就此联系我们。在以下情况下可要求限制处理：您质疑数据准确性；处理违法但您不希望删除；我们不再需要数据但您仍需用于法律请求；或您已根据 GDPR 第 21 条第 1 款提出反对且利益权衡尚未完成。</p>
      <p>如果处理受到限制，除存储外，这些数据仅可在您同意、用于法律请求、保护他人权利，或基于欧盟或成员国重要公共利益时处理。</p>

      <h2>4. 本网站的数据收集</h2>
      <h3>Cookies</h3>
      <p>本网站使用 Cookies。Cookies 是小型文本文件，不会损害您的设备。它们可能是会话 Cookies，也可能是永久 Cookies。会话 Cookies 会在访问结束后自动删除，永久 Cookies 会保留在您的设备上，直到您自行删除或浏览器自动删除。</p>
      <p>部分第三方 Cookies 也可能在您访问本网站时存储在您的设备上，用于提供特定第三方服务。</p>
      <p>Cookies 具有不同功能。许多 Cookies 是技术上必需的；其他 Cookies 用于分析用户行为或显示广告。您可以设置浏览器，让其通知您 Cookies 的设置、仅在个别情况下允许 Cookies、排除特定或全部 Cookies，或在关闭浏览器时自动删除 Cookies。禁用 Cookies 可能会限制本网站功能。</p>

      <h3>通过电子邮件、电话或传真联系</h3>
      <p>如果您通过电子邮件、电话或传真联系我们，您的请求以及由此产生的所有个人数据会被我们保存和处理，用于处理您的事项。未经您的同意，我们不会转发这些数据。</p>
      <p>这些数据会保存至您要求删除、撤回保存同意，或数据保存目的不再适用为止。强制性法律规定，尤其是法定保存期限，不受影响。</p>

      <h2>5. 插件和工具</h2>
      <h3>增强隐私模式下的 YouTube</h3>
      <p>本网站嵌入 YouTube 视频。运营方为 Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland。</p>
      <p>我们使用 YouTube 的增强隐私模式。据 YouTube 称，在您观看视频前，该模式不会保存本网站访客的信息。但这并不必然排除向 YouTube 合作伙伴传输数据。无论您是否观看视频，YouTube 都可能与 Google DoubleClick 网络建立连接。</p>
      <p>当您启动 YouTube 视频时，会连接到 YouTube 服务器，并告知 YouTube 您访问过我们的哪些页面。如果您已登录 YouTube 账户，YouTube 可以将您的浏览行为直接关联到您的个人资料。您可以通过退出 YouTube 账户来避免这一点。</p>
      <p>启动视频后，YouTube 可能在您的设备上保存 Cookies 或使用类似识别技术。这些信息可能用于视频统计、提升用户体验以及防止欺诈。</p>
      <p>使用 YouTube 是为了以更吸引人的方式展示我们的在线内容，这构成 GDPR 第 6 条第 1 款 f 项意义上的合法利益。如已请求相应同意，则处理仅基于您的同意进行，且同意可随时撤回。</p>
      <p>更多关于 YouTube 数据保护的信息，请参阅：<a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy?hl=de</a></p>
      <p class="top-spacing">来源：<a href="https://www.e-recht24.de" target="_blank" rel="noopener noreferrer">e-recht24.de</a></p>
    `;
  }

  function applyRoutePageTranslations() {
    applyDatenschutzPageTranslation();
  }
  function translateElement(root) {
    if (!root) {
      return;
    }

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE || shouldSkipElement(root)) {
      return;
    }

    translateAttributes(root);

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            return shouldSkipElement(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }

          return node.parentElement && shouldSkipElement(node.parentElement)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    let node = walker.currentNode;
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        translateTextNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        translateAttributes(node);
      }
      node = walker.nextNode();
    }
  }

  function scheduleTranslate(root = document.body) {
    if (root) {
      pendingRoots.add(root);
    }

    if (scheduled) {
      return;
    }

    scheduled = true;
    window.setTimeout(() => {
      const roots = Array.from(pendingRoots);
      pendingRoots.clear();
      scheduled = false;
      injectStyle();
      refreshActiveDictionary();
      applyRoutePageTranslations();
      roots.forEach((node) => translateElement(node.isConnected === false ? document.body : node));
    }, CONFIG.debounceMs);
  }

  function hookHistoryMethod(name) {
    const original = history[name];
    history[name] = function (...args) {
      const result = original.apply(this, args);
      window.dispatchEvent(new Event('lfm-cn:route-change'));
      return result;
    };
  }

  function observePage() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
            scheduleTranslate(node);
          }
        });

        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          scheduleTranslate(mutation.target);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ATTRIBUTES,
    });
  }


  function translateI18nResult(value) {
    if (typeof value !== 'string') {
      return value;
    }

    return translateString(value, true);
  }

  function wrapNuxtI18nTranslator(owner, name) {
    if (!owner || typeof owner[name] !== 'function' || owner[name].__lfmCnPatched) {
      return false;
    }

    const original = owner[name];
    const wrapped = function (...args) {
      return translateI18nResult(original.apply(this, args));
    };

    wrapped.__lfmCnPatched = true;
    wrapped.__lfmCnOriginal = original;

    try {
      owner[name] = wrapped;
      return true;
    } catch (error) {
      if (CONFIG.debug) {
        console.debug('[LFM-CN] failed to patch i18n translator', name, error);
      }
      return false;
    }
  }

  function patchNuxtI18nObject(i18n) {
    if (!i18n || typeof i18n !== 'object') {
      return false;
    }

    let patched = false;
    patched = wrapNuxtI18nTranslator(i18n, 't') || patched;
    patched = wrapNuxtI18nTranslator(i18n, '$t') || patched;
    patched = wrapNuxtI18nTranslator(i18n.global, 't') || patched;
    patched = wrapNuxtI18nTranslator(i18n.global, '$t') || patched;
    return patched;
  }

  function patchNuxtI18nTranslator() {
    let patched = false;
    const root = document.getElementById('__nuxt');
    const app = root && root.__vue_app__;
    const globalProperties = app && app.config && app.config.globalProperties;

    if (globalProperties) {
      patched = wrapNuxtI18nTranslator(globalProperties, '$t') || patched;
      patched = patchNuxtI18nObject(globalProperties.$i18n) || patched;
    }

    const nuxtApp = window.__NUXT__ || window.$nuxt;
    patched = patchNuxtI18nObject(nuxtApp && nuxtApp.$i18n) || patched;
    return patched;
  }

  function installNuxtI18nPatch(attempt = 0) {
    if (patchNuxtI18nTranslator()) {
      if (document.body) {
        scheduleTranslate(document.body);
      }
      if (CONFIG.debug) {
        console.debug('[LFM-CN] Nuxt i18n translator patched');
      }
      return;
    }

    if (attempt < 100) {
      window.setTimeout(() => installNuxtI18nPatch(attempt + 1), 50);
    }
  }

  function init() {
    if (!document.body) {
      window.setTimeout(init, 50);
      return;
    }

    injectStyle();
    refreshActiveDictionary();
    installNuxtI18nPatch();
    applyRoutePageTranslations();
    translateElement(document.body);
    observePage();

    hookHistoryMethod('pushState');
    hookHistoryMethod('replaceState');
    window.addEventListener('popstate', () => scheduleTranslate(document.body));
    window.addEventListener('lfm-cn:route-change', () => scheduleTranslate(document.body));

    if (CONFIG.debug) {
      console.debug('[LFM-CN] initialized');
    }
  }

  init();
})();