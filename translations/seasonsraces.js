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
    // SEASON RACES 赛季比赛
    'SEASON RACES': '赛季比赛',
    'Race ID': '比赛 ID',
    'Start Pos': '发车排名',
    'Fin. Pos': '完赛排名',

    // Race Detail 比赛详情
    "Race Detail": "比赛详情",
    "COPY LINK": "复制链接",
    "Split": "分组",
    "information": "信息",
    "Qualifying Results": "排位赛结果",
    "Race Results": "正赛结果",
    "Entrylist": "参赛名单",
    "Additional Charts": "附加图表",
    "OVERALL": "总排名",
    "Pos.": "名次",
    "Origin": "国籍",
    "Team": "车队",
    "Num.": "编号",
    "Car": "车辆",
    "Laps": "圈数",
    "Time": "总时间",
    "Best": "最快单圈",
    "Gap": "差距",
    "Inc.": "事故分",
    "Points": "积分",
    "Δ Pos.": "名次变化",
    "OVERALL": "全部",

    // 信息
    "Split": "分组",
    "Server Settings": "服务器设置",
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
    "Hour of Day": "开始时间",
    "Time Multiplier": "时间倍数",
    "Practice": "练习赛",
    "Qualifying": "排位赛",
    "Race": "正赛",
    "°C": "°C",
    "Clouds": "云量",
    "Rain": "降雨",
    "Randomness": "随机性",
    "COPY LINK": "复制链接",
    "Serverstart:": "服务器启动：",
    "Saturday, 04 July 2026 at 17:00 GMT+8": "2026年7月4日星期六 17:00 GMT+8",

    // 参赛名单
    "Car ELO": "车辆 ELO",
        "Livery": "涂装",
        "Drivers": "车搜",


  });

  Object.assign(window.LFM_CN_TRANSLATIONS.partial, {

  });

  window.LFM_CN_TRANSLATIONS.selectorScoped = window.LFM_CN_TRANSLATIONS.selectorScoped || [];

  window.LFM_CN_TRANSLATIONS.selectorScoped.push({
    selectors: [".track-overlay"],
    exact: {

    },
    partial: {
      "Serverstart: ": "服务器启动："
    },
    patterns: [

    ]
  });

  const dayNames = {
    MON: "周一",
    TUE: "周二",
    WED: "周三",
    THU: "周四",
    FRI: "周五",
    SAT: "周六",
    SUN: "周日",
    MONDAY: "周一",
    TUESDAY: "周二",
    WEDNESDAY: "周三",
    THURSDAY: "周四",
    FRIDAY: "周五",
    SATURDAY: "周六",
    SUNDAY: "周日"
  };

  const monthNames = {
    JAN: "1月",
    FEB: "2月",
    MAR: "3月",
    APR: "4月",
    MAY: "5月",
    JUN: "6月",
    JUL: "7月",
    AUG: "8月",
    SEP: "9月",
    OCT: "10月",
    NOV: "11月",
    DEC: "12月",
    JANUARY: "1月",
    FEBRUARY: "2月",
    MARCH: "3月",
    APRIL: "4月",
    JUNE: "6月",
    JULY: "7月",
    AUGUST: "8月",
    SEPTEMBER: "9月",
    OCTOBER: "10月",
    NOVEMBER: "11月",
    DECEMBER: "12月"
  };

  window.LFM_CN_TRANSLATIONS.patterns.push(
    [
      /^(MON|TUE|WED|THU|FRI|SAT|SUN),\s*(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{4}),\s*(\d{1,2}:\d{2})$/i,
      function (_, day, date, month, year, time) {
        return `${year}年${monthNames[month.toUpperCase()]}${Number(date)}日 ${dayNames[day.toUpperCase()]} ${time}`;
      }
    ],
    [
      /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\s+at\s+(\d{1,2}:\d{2})\s+(GMT[+-]\d{1,2})$/i,
      function (_, day, date, month, year, time, timezone) {
        return `${year}年${monthNames[month.toUpperCase()]}${Number(date)}日 ${dayNames[day.toUpperCase()]} ${time} ${timezone}`;
      }
    ]
  );
})();