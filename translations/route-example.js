(function () {
  "use strict";

  window.LFM_CN_TRANSLATIONS = window.LFM_CN_TRANSLATIONS || {
    exact: {},
    partial: {},
    patterns: [],
    scoped: []
  };
  window.LFM_CN_TRANSLATIONS.scoped = window.LFM_CN_TRANSLATIONS.scoped || [];

  window.LFM_CN_TRANSLATIONS.scoped.push({
    routes: ["/racing/official"],
    exact: {
      "Quick Signup": "快速报名"
    },
    partial: {
      "Circuit de Spa Francorchamps": "斯帕赛道"
    },
    patterns: [
      [/\bSEASON\s*(\d+)\s*\|\s*WEEK\s*(\d+)\b/i, "第$1赛季 | 第$2周"]
    ]
  });
})();