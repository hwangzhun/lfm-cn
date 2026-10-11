(function () {
  "use strict";
  const toggle = document.getElementById("enabled");
  const status = document.getElementById("status");
  const hint = document.getElementById("refresh-hint");
  const refresh = document.getElementById("refresh");
  let activeTab;
  const isLfm = url => /^https:\/\/(www\.)?lowfuelmotorsport\.com(?:\/|$)/.test(url || "");
  async function updateStatus(setEnabled = false) {
    hint.hidden = true;
    refresh.hidden = true;
    if (!activeTab || !isLfm(activeTab.url)) {
      status.textContent = "设置已保存，打开 LFM 网站后生效。";
      return;
    }
    try {
      const state = await chrome.tabs.sendMessage(activeTab.id, setEnabled ? { type: "lfm-cn:set-enabled", enabled: toggle.checked } : { type: "lfm-cn:status" });
      status.textContent = state.enabled ? "当前页面已启用汉化。" : "当前页面已恢复原文。";
      hint.hidden = !state.refreshRequired;
      refresh.hidden = !state.refreshRequired;
    } catch (_) {
      status.textContent = "请刷新当前页面以加载扩展。";
      refresh.hidden = false;
    }
  }
  async function init() {
    try {
      const settings = await chrome.storage.local.get({ enabled: true });
      toggle.checked = settings.enabled !== false;
      [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      toggle.disabled = false;
      await updateStatus();
    } catch (_) { status.textContent = "无法读取设置，请重新打开扩展。"; }
  }
  toggle.addEventListener("change", async () => {
    toggle.disabled = true;
    try {
      await chrome.storage.local.set({ enabled: toggle.checked });
      await updateStatus(true);
    } catch (_) {
      toggle.checked = !toggle.checked;
      status.textContent = "设置保存失败，请重试。";
    } finally { toggle.disabled = false; }
  });
  refresh.addEventListener("click", async () => {
    if (activeTab && isLfm(activeTab.url)) {
      try { await chrome.tabs.reload(activeTab.id); window.close(); }
      catch (_) { status.textContent = "刷新失败，请手动刷新页面。"; }
    }
  });
  init();
})();
