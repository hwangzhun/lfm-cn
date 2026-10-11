(function () {
  "use strict";

  window.LFM_CN_TRANSLATIONS = window.LFM_CN_TRANSLATIONS || {
    exact: {},
    partial: {},
    patterns: []
  };

  const translations = window.LFM_CN_TRANSLATIONS;

  Object.assign(translations.exact, {
    // Put exact full-string translations here:
    // "HOME": "首页",
  });

  Object.assign(translations.partial, {
    // Put substring replacements here:
    // "Circuit de Spa Francorchamps": "斯帕赛道",
  });

  translations.patterns.push(
    // Put regex translations here:
    // [/^Race #(\d+)$/, "比赛 #$1"],
  );
})();