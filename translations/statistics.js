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
    'Joined:': '加入时间：',
    'STATISTICS': '统计数据',
    'Season / Series': '赛季/系列',
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

  });

  Object.assign(window.LFM_CN_TRANSLATIONS.partial, {

  });

  window.LFM_CN_TRANSLATIONS.selectorScoped = window.LFM_CN_TRANSLATIONS.selectorScoped || [];

  window.LFM_CN_TRANSLATIONS.selectorScoped.push({
    selectors: ["#"],
    exact: {

    },
    partial: {

    },
    patterns: [

    ]
  });

  window.LFM_CN_TRANSLATIONS.patterns.push([
    /^(MON|TUE|WED|THU|FRI|SAT|SUN),\s*(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+(\d{4}),\s*(\d{1,2}:\d{2})$/i,
    function (_, day, date, month, year, time) {
      const days = {
        MON: "周一",
        TUE: "周二",
        WED: "周三",
        THU: "周四",
        FRI: "周五",
        SAT: "周六",
        SUN: "周日"
      };

      const months = {
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
        DEC: "12月"
      };

      return `${year}年${months[month.toUpperCase()]}${Number(date)}日 ${days[day.toUpperCase()]} ${time}`;
    }
  ]);
})();