(function () {
  "use strict";

  const dictionaries = window.LFM_CN_TRANSLATIONS || {};
  const attrs = ["title", "aria-label", "placeholder", "alt"];
  const skipSelector = [
    "script", "style", "noscript", "code", "pre", "kbd", "samp", "svg", "canvas", "iframe",
    "textarea", "[contenteditable]:not([contenteditable='false'])", "[translate='no']",
    "[data-lfm-cn-skip]", ".lfm-cn-skip", ".notranslate", ".no-translate",
    ".driver-name", ".team-name", ".username", ".user-id", ".steam-id",
    ".server-name", ".server-password", ".chat-msg", ".chat-message",
    ...(window.LFM_CN_SKIP_SELECTORS || [])
  ].filter(validSelector).join(",");
  const records = new Map();
  const optionValues = new Map();
  const pending = new Set();
  const localeBackupKey = "lfm-cn:locale-backup";
  let enabled = false;
  let timer = null;
  let routeKey = "";
  let routeScopes = [];
  let previousLang = null;
  let refreshRequired = false;
  let localeBackup = null;
  let settingsRevision = 0;
  let tableHeaders = new WeakMap();

  function validSelector(selector) {
    try { document.querySelector(selector); return typeof selector === "string" && !!selector; }
    catch (_) { return false; }
  }
  const normalize = value => value.replace(/\s+/g, " ").trim();
  function compile(scope) {
    const exact = new Map();
    const folded = new Map();
    for (const [source, target] of Object.entries(scope.exact || {})) {
      exact.set(normalize(source), target);
      folded.set(normalize(source).toLowerCase(), target);
    }
    return {
      ...scope, exact, folded,
      patterns: (scope.patterns || []).map(([regex, replacement]) => [new RegExp(regex.source, regex.flags), replacement]),
      partial: Object.entries(scope.partial || {}).filter(([source]) => source).sort((a, b) => b[0].length - a[0].length),
      selectors: (scope.selectors || [scope.selector]).filter(validSelector)
    };
  }
  const globalScope = compile(dictionaries);
  const routes = (dictionaries.scoped || []).map(compile);
  const selectors = (dictionaries.selectorScoped || []).map(compile);
  function routeMatches(route, key) {
    if (Array.isArray(route)) return route.some(item => routeMatches(item, key));
    if (typeof route === "string") {
      const path = location.pathname;
      return key === route || path === route || path.startsWith(route.endsWith("/") ? route : `${route}/`) || key.startsWith(`${route}?`) || key.startsWith(`${route}#`);
    }
    if (route instanceof RegExp) { route.lastIndex = 0; return route.test(key); }
    if (typeof route === "function") { try { return !!route(key, location); } catch (_) { return false; } }
    return false;
  }
  function refreshRoute() {
    const key = location.pathname + location.search + location.hash;
    if (key === routeKey) return false;
    routeKey = key;
    routeScopes = routes.filter(scope => routeMatches(scope.routes || scope.route, key)).reverse();
    return true;
  }
  function applyScope(value, scope) {
    const target = scope.exact.get(value) ?? scope.folded.get(value.toLowerCase());
    if (target !== undefined) return target;
    for (const [regex, replacement] of scope.patterns) {
      regex.lastIndex = 0;
      if (regex.test(value)) { regex.lastIndex = 0; return value.replace(regex, replacement); }
    }
    let next = value;
    for (const [source, replacement] of scope.partial) next = next.replaceAll(source, replacement);
    return next !== value ? next : null;
  }
  function translate(value, element) {
    const compact = normalize(value);
    if (!compact) return value;
    const scopes = selectors.filter(scope => scope.selectors.some(selector => element?.closest(selector)));
    for (const scope of [...scopes.reverse(), ...routeScopes, globalScope]) {
      const next = applyScope(compact, scope);
      if (next !== null) return value.match(/^\s*/)[0] + next + value.match(/\s*$/)[0];
    }
    return value;
  }
  function sourceLabel(element) {
    if (!element) return "";
    return normalize([...element.childNodes].map(node => {
      const record = records.get(node)?.get(null);
      return record && node.nodeValue === record.last ? record.original : node.textContent;
    }).join("")).toUpperCase();
  }
  function protectedValue(element) {
    // The live site renders account values without username/driver-name classes.
    const account = element?.closest(".field-row > .input-wrapper");
    if (account) {
      const label = sourceLabel(account.parentElement.querySelector(":scope > .field-label"));
      if (["USERNAME:", "FIRST NAME:", "LAST NAME:", "3-LETTER SHORTNAME:"].includes(label)) return true;
    }
    // Series credentials have a generic wrapper; protect their value, not their heading.
    const series = element?.closest(".series-requirements-wrapper > div > div");
    if (series) {
      const label = sourceLabel(series.parentElement.querySelector(":scope > h2"));
      if (["SERVERPASSWORD", "SERVERNAME", "SERVER PASSWORD", "SERVER NAME"].includes(label)) return true;
    }
    const cell = element?.closest("td");
    const table = cell?.closest("table.responsive-table");
    if (table) {
      let headers = tableHeaders.get(table);
      if (!headers) {
        headers = [...table.querySelectorAll("thead tr:first-child > th")].map(sourceLabel);
        tableHeaders.set(table, headers);
      }
      if ((headers.includes("ORIGIN") || headers.includes("AVATAR")) &&
          ["NAME", "DRIVER", "USERNAME", "TEAM"].includes(headers[cell.cellIndex])) return true;
    }
    return false;
  }
  function skip(element) { return !!element?.closest(skipSelector); }
  function read(node, attr) { return attr ? node.getAttribute(attr) : node.nodeValue; }
  function write(node, attr, value) {
    if (!attr) node.nodeValue = value;
    else if (value === null) node.removeAttribute(attr);
    else node.setAttribute(attr, value);
  }
  function update(node, attr, element) {
    const current = read(node, attr);
    if (current === null) return;
    let slots = records.get(node);
    let record = slots?.get(attr);
    if (record && current !== record.last) record = null;
    const original = record ? record.original : current;
    const next = translate(original, element);
    if (next !== current) write(node, attr, next);
    if (next !== original) {
      if (!slots) { slots = new Map(); records.set(node, slots); }
      slots.set(attr, { original, last: next });
    } else if (slots) {
      slots.delete(attr);
      if (!slots.size) records.delete(node);
    }
  }
  function restoreNode(node) {
    for (const [attr, record] of records.get(node) || []) {
      if (read(node, attr) === record.last) write(node, attr, record.original);
    }
    records.delete(node);
  }
  function prepareOption(element) {
    if (element.tagName !== "OPTION") return;
    const pinned = optionValues.get(element);
    if (pinned && element.getAttribute("value") !== pinned.last) {
      optionValues.delete(element); return;
    }
    if (!pinned && element.hasAttribute("value")) return;
    const source = [...element.childNodes].map(child => {
      const record = records.get(child)?.get(null);
      return record && child.nodeValue === record.last ? record.original : child.textContent;
    }).join("");
    if (!pinned && translate(source, element) === source) return;
    element.setAttribute("value", source);
    optionValues.set(element, { last: source });
  }
  function visit(node) {
    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    const protectedContent = protectedValue(element) &&
      (node.nodeType === Node.TEXT_NODE || !["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName));
    if (skip(element) || protectedContent) {
      restoreNode(node); return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      if (element?.tagName === "OPTION") prepareOption(element);
      update(node, null, element);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      prepareOption(node);
      for (const attr of attrs) update(node, attr, node);
    }
  }
  function walk(root) {
    if (root.nodeType === Node.TEXT_NODE) { visit(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    visit(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) visit(node);
  }
  function observe() {
    observer.observe(document.documentElement, {
      subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: [...attrs, "class", "contenteditable", "translate", "data-lfm-cn-skip"]
    });
  }
  function collect(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === "childList") for (const node of mutation.addedNodes) pending.add(node);
      else pending.add(mutation.target);
    }
  }
  function flush() {
    timer = null;
    if (!enabled) return;
    collect(observer.takeRecords());
    observer.disconnect();
    tableHeaders = new WeakMap();
    if (refreshRoute()) { pending.clear(); pending.add(document.body); }
    const roots = [...pending].filter(node => node?.isConnected);
    pending.clear();
    const rootSet = new Set(roots);
    for (const root of roots) {
      let ancestor = root.parentNode;
      while (ancestor && !rootSet.has(ancestor)) ancestor = ancestor.parentNode;
      if (!ancestor) walk(root);
    }
    for (const node of records.keys()) if (!node.isConnected) records.delete(node);
    for (const [node, record] of optionValues) {
      if (!node.isConnected) optionValues.delete(node);
      else if (skip(node)) {
        if (node.getAttribute("value") === record.last) node.removeAttribute("value");
        optionValues.delete(node);
      }
    }
    observe();
  }
  function schedule(root) {
    if (!enabled) return;
    if (root) pending.add(root);
    if (timer === null) timer = setTimeout(flush, 40);
  }
  const observer = new MutationObserver(mutations => { collect(mutations); schedule(); });
  function parseLocaleBackup(saved) {
    try {
      const parsed = JSON.parse(saved);
      return parsed && (parsed.value === null || typeof parsed.value === "string") ? parsed : null;
    } catch (_) { return null; }
  }
  function applyLocale() {
    previousLang = document.documentElement.getAttribute("lang");
    document.documentElement.lang = "zh-CN";
    try {
      const saved = localStorage.getItem(localeBackupKey);
      localeBackup = parseLocaleBackup(saved) || { value: localStorage.getItem("locale") };
      localStorage.setItem(localeBackupKey, JSON.stringify(localeBackup));
      refreshRequired = localStorage.getItem("locale") !== "en";
      localStorage.setItem("locale", "en");
    } catch (_) { refreshRequired = false; }
  }
  function restoreLocale() {
    if (document.documentElement.lang === "zh-CN") {
      if (previousLang === null) document.documentElement.removeAttribute("lang");
      else document.documentElement.setAttribute("lang", previousLang);
    }
    try {
      if (!localeBackup) {
        const saved = localStorage.getItem(localeBackupKey);
        localeBackup = parseLocaleBackup(saved);
      }
      if (localeBackup && localStorage.getItem("locale") === "en") {
        refreshRequired = localeBackup.value !== "en";
        if (localeBackup.value === null) localStorage.removeItem("locale");
        else localStorage.setItem("locale", localeBackup.value);
      }
      localStorage.removeItem(localeBackupKey);
      localeBackup = null;
    } catch (_) {}
  }
  function setEnabled(value) {
    if (enabled === value) return;
    enabled = value;
    if (enabled) {
      applyLocale(); refreshRoute(); observe(); schedule(document.body);
    } else {
      observer.disconnect(); clearTimeout(timer); timer = null; pending.clear();
      for (const node of records.keys()) restoreNode(node);
      for (const [option, record] of optionValues) {
        if (option.getAttribute("value") === record.last) option.removeAttribute("value");
      }
      optionValues.clear(); restoreLocale();
    }
  }
  function start() {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes.enabled) {
        settingsRevision++;
        setEnabled(changes.enabled.newValue !== false);
      }
    });
    chrome.runtime.onMessage.addListener((message, _sender, respond) => {
      if (message.type === "lfm-cn:set-enabled") {
        settingsRevision++;
        setEnabled(message.enabled !== false);
      }
      if (message.type === "lfm-cn:status" || message.type === "lfm-cn:set-enabled") respond({ enabled, refreshRequired });
    });
    const initialRevision = settingsRevision;
    chrome.storage.local.get({ enabled: true }, settings => {
      if (settingsRevision !== initialRevision) return;
      if (settings.enabled === false) {
        // Recover a language preference saved before a page reload.
        previousLang = document.documentElement.getAttribute("lang");
        restoreLocale();
      } else setEnabled(true);
    });
    // Content scripts run in an isolated world; polling also sees page-owned pushState.
    setInterval(() => { if (enabled && refreshRoute()) schedule(document.body); }, 250);
    window.addEventListener("popstate", () => schedule(document.body));
    window.addEventListener("hashchange", () => schedule(document.body));
  }
  if (document.documentElement) {
    start();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => schedule(document.body), { once: true });
  } else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
