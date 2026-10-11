(function () {
  "use strict";

  const exact = new Map(Object.entries({
    "HOME": "首页",
    "FAQ": "常见问题",
    "LFM APP": "LFM 应用",
    "RACING": "比赛",
    "RACE PLANNER": "比赛计划",
    "TEAMS": "车队",
    "SETUPS": "调校",
    "RACE ENGINEER": "赛事工程师",
    "EVENTS": "活动",
    "LFM OFFICIAL": "LFM 官方",
    "HOSTED": "托管活动",
    "STATS": "数据统计",
    "SUPPORT LFM": "支持 LFM",
    "Welcome": "欢迎",
    "mark all as read": "全部标为已读",
    "no notification": "没有通知",
    "Login": "登录",
    "Logout": "退出登录",
    "Register": "注册",
    "Legacy": "旧版",
    "Search": "搜索",
    "Loading...": "加载中...",
    "Close": "关闭",
    "CLOSE": "关闭",
    "Save": "保存",
    "SAVE": "保存",
    "Cancel": "取消",
    "Back": "返回",
    "Send": "发送",
    "Sending...": "发送中...",
    "Date": "日期",
    "Series": "系列赛",
    "Reason": "原因",
    "Details": "详情",
    "Status": "状态",
    "Position": "名次",
    "Name": "姓名",
    "NAME": "姓名",
    "Car": "车辆",
    "CAR": "车辆",
    "Track": "赛道",
    "TRACK": "赛道",
    "Class": "组别",
    "Lap": "圈",
    "LAP": "圈速",
    "Gap": "差距",
    "GAP": "差距",
    "Origin": "地区",
    "ORIGIN": "地区",
    "Version": "版本",
    "DATE": "日期",
    "BALLAST": "配重",
    "SOURCE": "来源",
    "LICENSE": "驾照",
    "VALID": "有效",
    "NOT VALID": "无效",
    "MY PERMITS": "我的准入许可",
    "LICENSE (ACC ONLY)": "驾照（仅 ACC）",
    "LFM TRACK PERMIT (ACC ONLY)": "LFM 赛道许可（仅 ACC）",
    "Valid ACC license": "ACC 驾照有效",
    "No valid ACC license": "没有有效 ACC 驾照",
    "Target Time:": "目标时间：",
    "Laps:": "圈数：",
    "Click to view permit details": "点击查看许可详情",
    "No permit data found.": "未找到许可数据。",
    "Available permits": "可用许可",
    "Track Permit": "赛道许可",
    "Your permit status for": "你的许可状态：",
    "No stint data found.": "未找到连续圈数据。",
    "CHAT": "聊天",
    "Conversations": "会话",
    "Select a conversation to start chatting": "选择一个会话开始聊天",
    "No messages yet.": "还没有消息。",
    "Type your message...": "输入消息...",
    "SEND": "发送",
    "Insert emoji": "插入表情",
    "Search emoji...": "搜索表情...",
    "No emojis found.": "没有找到表情。",
    "Delete conversation": "删除会话",
    "Deleting the conversation failed.": "删除会话失败。",
    "Invalid conversation.": "无效会话。",
    "Failed to load conversations.": "加载会话失败。",
    "Failed to load messages.": "加载消息失败。",
    "Sending failed.": "发送失败。",
    "Yesterday": "昨天",
    "Complete your profile": "完善你的资料",
    "Before you can continue, please complete all required profile fields.": "继续之前，请先填写所有必填资料。",
    "Username": "用户名",
    "First name": "名",
    "Last name": "姓",
    "3-letter shortname": "3 位缩写",
    "SAVE PROFILE": "保存资料",
    "SAVING...": "保存中...",
    "Please fill in all required fields.": "请填写所有必填字段。",
    "Please select an origin from the dropdown list.": "请从下拉列表选择地区。",
    "Profile updated successfully.": "资料已更新。",
    "Server error while updating your profile.": "更新资料时服务器出错。",
    "Attention!": "注意！",
    "You are required to change your name!": "你需要修改姓名！",
    "Please follow the rules for names like stated in our CoC.": "请按行为准则中的姓名规则填写。",
    "Use a proper first and last name that can occur in the real world.": "使用现实中可能出现的真实姓名。",
    "No trolling or gamer tag names": "不要使用恶搞名或游戏 ID",
    "No advertisement for websites, shops or anything else": "不要包含网站、商店或其他广告",
    "SAVE NAME": "保存姓名",
    "Name change submitted successfully.": "姓名修改已提交。",
    "Server error while submitting your name change.": "提交姓名修改时服务器出错。",
    "LFM License / Safety Rating / How To": "LFM 驾照 / 安全分 / 说明",
    "License": "驾照",
    "Safety Rating": "安全分",
    "ACC HOTLAPS": "ACC 热圈",
    "How to join the Hotlap Server:": "如何加入热圈服务器：",
    "CAR CLASS": "车辆组别",
    "VERSION": "版本",
    "VIEW": "视图",
    "LOAD": "加载",
    "LOADING...": "加载中...",
    "No hotlaps found.": "没有找到热圈记录。",
    "Kunos BOP": "Kunos BOP",
    "LFM BOP": "LFM BOP",
    "All laptimes": "全部圈速",
    "Hotlaps by car": "按车辆查看热圈",
    "Car times / BOP prediction": "车辆圈速 / BOP 预测",
    "ACC - BALANCE OF PERFORMANCE": "ACC 性能平衡",
    "ACC - Balance Of Performance": "ACC 性能平衡",
    "Download BoP.json": "下载 BoP.json",
    "DOWNLOAD SERVER READY BOP.JSON FILE": "下载服务器可用的 BOP.JSON 文件",
    "DOWNLOADING...": "下载中...",
    "Download failed.": "下载失败。",
    "No BoP data available.": "暂无 BoP 数据。",
    "Contact": "联系我们",
    "Address": "地址",
    "Support contact": "支持联系方式",
    "Join Discord": "加入 Discord",
    "Email contacts": "邮箱联系方式",
    "Sponsoring / Marketing": "赞助 / 市场合作",
    "Achievements": "成就",
    "No achievements found.": "没有找到成就。",
    "Trophies": "奖杯",
    "Medals": "奖牌",
    "Attention! Your action required!": "注意！需要你处理！",
    "You have pending reports against you that must be reviewed.": "你有待处理的申诉/报告需要查看。",
    "Pending self acceptance reports": "待自认处理的报告",
    "No pending self acceptance reports.": "没有待处理报告。",
    "Report details": "报告详情",
    "Are you sure with your Choice?": "确认这个选择吗？",
    "Yes": "是",
    "No": "否",
    "Expected penalty": "预计处罚",
    "Evidence": "证据",
    "Answer": "回答",
    "Show": "显示",
    "Your point of view": "你的视角说明",
    "Describe your point of view...": "描述你的视角...",
    "UP NEXT": "即将开始",
    "Quick Signup": "快速报名",
    "Back to Series Overview": "返回系列赛概览",
    "LIST TYPE": "列表类型",
    "Horizontal Timeline": "横向时间线",
    "Vertical List": "纵向列表",
    "TEAM / DRIVER SWAP RACES": "车队 / 换人赛事",
    "ONLY ELIGIBLE RACES": "仅显示可参加比赛",
    "No upcoming races available right now.": "当前没有即将开始的比赛。",
    "CHANGE": "更改",
    "MY LIVERIES": "我的涂装",
    "Upload livery": "上传涂装",
    "To upload liveries you need a LFM+ subscription!": "上传涂装需要 LFM+ 订阅！",
    "SIMULATION": "模拟器",
    "PERSONAL / TEAM LIVERY": "个人 / 车队涂装",
    "Driver Rating Leaderboard": "车手评分排行榜",
    "Safety Rating Leaderboard": "安全分排行榜",
    "Most Active Driver": "最活跃车手",
    "Driver Performance": "车手表现",
    "Track Records": "赛道纪录",
    "Car Statistics": "车辆统计",
    "Community Spread": "社区分布",
    "ELO DISTRIBUTION": "ELO 分布",
    "SR DISTRIBUTION": "安全分分布",
    "GT3 Open Series": "GT3公开系列赛",
  }));

  const patterns = [
    [/^Delete conversation with "(.+)"\?$/, "删除与“$1”的会话？"],
    [/^Target time: (.+)$/, "目标时间：$1"],
    [/^BOP Target time: (.+)$/, "BOP 目标时间：$1"],
    [/^(\S+) copied to clipboard$/, "$1 已复制到剪贴板"],
    [/^You will stay in the ROOKIE license until you have (.+) ranked races$/, "在完成 $1 场排位赛前，你会保持 ROOKIE 驾照。"],
    [/^For the (.+) license you need (.+)$/, "获得 $1 驾照需要 $2。"]
  ];

  const externalTranslations = window.LFM_CN_TRANSLATIONS || {};
  if (externalTranslations.exact) {
    for (const [source, target] of Object.entries(externalTranslations.exact)) {
      exact.set(source, target);
    }
  }
  if (Array.isArray(externalTranslations.patterns)) {
    patterns.push(...externalTranslations.patterns);
  }

  const scopedTranslations = Array.isArray(externalTranslations.scoped) ? externalTranslations.scoped : [];
  const selectorScopedTranslations = Array.isArray(externalTranslations.selectorScoped) ? externalTranslations.selectorScoped : [];
  const baseExact = exact;
  const basePatterns = patterns.slice();
  const basePartial = new Map(Object.entries(externalTranslations.partial || {}));

  let activeRouteKey = "";
  let activeExact = baseExact;
  let activePatterns = basePatterns;
  let activePartial = basePartial;
  let activeExactIgnoreCase = new Map();

  function buildIgnoreCaseMap(sourceMap) {
    const result = new Map();
    for (const [source, target] of sourceMap) {
      result.set(source.toLocaleLowerCase(), target);
    }
    return result;
  }

  function getRouteKey() {
    return `${location.pathname}${location.search}${location.hash}`;
  }

  function routeMatches(route, routeKey) {
    if (Array.isArray(route)) return route.some((item) => routeMatches(item, routeKey));
    if (typeof route === "string") {
      return routeKey === route || routeKey.startsWith(route.endsWith("/") ? route : `${route}/`) || routeKey.startsWith(`${route}?`) || routeKey.startsWith(`${route}#`);
    }
    if (route instanceof RegExp) {
      route.lastIndex = 0;
      return route.test(routeKey);
    }
    if (typeof route === "function") {
      try {
        return Boolean(route(routeKey, location));
      } catch (_) {
        return false;
      }
    }
    return false;
  }

  function refreshRouteTranslations() {
    const routeKey = getRouteKey();
    if (routeKey === activeRouteKey) return;

    activeRouteKey = routeKey;
    activeExact = new Map(baseExact);
    const scopedPatterns = [];
    activePartial = new Map(basePartial);

    for (const scope of scopedTranslations) {
      const routes = scope.routes || scope.route;
      if (!routeMatches(routes, routeKey)) continue;

      if (scope.exact) {
        for (const [source, target] of Object.entries(scope.exact)) {
          activeExact.set(source, target);
        }
      }
      if (scope.partial) {
        for (const [source, target] of Object.entries(scope.partial)) {
          activePartial.set(source, target);
        }
      }
      if (Array.isArray(scope.patterns)) {
        scopedPatterns.push(...scope.patterns);
      }
    }

    activePatterns = scopedPatterns.concat(basePatterns);
    activeExactIgnoreCase = buildIgnoreCaseMap(activeExact);
  }

  refreshRouteTranslations();

  const attrNames = [
    "title",
    "aria-label",
    "placeholder",
    "alt",
    "value"
  ];

  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "KBD", "SAMP", "SVG", "CANVAS", "IFRAME", "TEXTAREA", "SELECT", "OPTION"]);
  const skipSelectors = [
    "[data-lfm-cn-skip]",
    "[translate='no']",
    ".lfm-cn-skip",
    ".notranslate",
    ".no-translate",
    ...(Array.isArray(window.LFM_CN_SKIP_SELECTORS) ? window.LFM_CN_SKIP_SELECTORS : [])
  ];

  function selectorMatches(element, selector) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    try {
      return element.matches(selector) || Boolean(element.closest(selector));
    } catch (_) {
      return false;
    }
  }

  function shouldSkipElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    if (skipTags.has(element.tagName)) return true;
    for (const selector of skipSelectors) {
      if (selectorMatches(element, selector)) return true;
    }
    return false;
  }

  function applyPatternTranslation(value, patternPair) {
    const [pattern, replacement] = patternPair;
    const match = value.match(pattern);
    if (!match) return "";
    if (typeof replacement === "function") {
      return value.replace(pattern, (...args) => replacement(...args));
    }
    return value.replace(pattern, replacement);
  }

  function translateScopedValue(value, element) {
    if (!element || !value || !/[A-Za-z]/.test(value)) return value;
    const compact = value.replace(/\s+/g, " ").trim();
    if (!compact) return value;

    for (const scope of selectorScopedTranslations) {
      const selectors = Array.isArray(scope.selectors) ? scope.selectors : [scope.selector];
      if (!selectors.some((selector) => selector && selectorMatches(element, selector))) continue;

      if (scope.exact) {
        const exactMap = new Map(Object.entries(scope.exact));
        const exactIgnoreCaseMap = buildIgnoreCaseMap(exactMap);
        const translated = exactMap.get(compact) || exactIgnoreCaseMap.get(compact.toLocaleLowerCase());
        if (translated && translated !== compact) return value.replace(compact, translated);
      }
      if (Array.isArray(scope.patterns)) {
        const translated = scope.patterns.reduce((acc, pair) => {
          if (acc) return acc;
          return applyPatternTranslation(compact, pair);
        }, "");
        if (translated && translated !== compact) return value.replace(compact, translated);
      }
      if (scope.partial) {
        for (const [source, target] of Object.entries(scope.partial)) {
          if (value.includes(source)) return value.replaceAll(source, target);
        }
      }
    }

    return value;
  }

  function translateValue(value, element) {
    if (!value || !/[A-Za-z]/.test(value)) return value;
    const compact = value.replace(/\s+/g, " ").trim();
    if (!compact) return value;
    const scopedValue = translateScopedValue(value, element);
    if (scopedValue !== value) return scopedValue;
    refreshRouteTranslations();
    const translated = activeExact.get(compact) || activeExactIgnoreCase.get(compact.toLocaleLowerCase()) || activePatterns.reduce((acc, pair) => {
      if (acc) return acc;
      return applyPatternTranslation(compact, pair);
    }, "");
    if (translated && translated !== compact) return value.replace(compact, translated);
    for (const [source, target] of activePartial) {
      if (value.includes(source)) return value.replaceAll(source, target);
    }
    return value;
  }

  function translateTextNode(node) {
    if (shouldSkipElement(node.parentElement)) return;
    const next = translateValue(node.nodeValue, node.parentElement);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  function translateElement(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    if (shouldSkipElement(element)) return;

    for (const attr of attrNames) {
      if (!element.hasAttribute(attr)) continue;
      const current = element.getAttribute(attr);
      const next = translateValue(current, element);
      if (next !== current) element.setAttribute(attr, next);
    }

    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

    const start = root.nodeType === Node.ELEMENT_NODE ? root : document.body;
    if (!start || shouldSkipElement(start)) return;
    translateElement(start);
    const walker = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateElement(node);
      node = walker.nextNode();
    }
  }

  function start() {
    document.documentElement.lang = "zh-CN";

    try {
      if (localStorage.getItem("locale") !== "en") {
        localStorage.setItem("locale", "en");
      }
    } catch (_) {}

    walk(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target);
          continue;
        }
        if (mutation.type === "attributes") {
          translateElement(mutation.target);
          continue;
        }
        for (const node of mutation.addedNodes) walk(node);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: attrNames
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
