# LFM 中文汉化插件

这是一个 Chrome Manifest V3 已解压扩展，用于汉化 `lowfuelmotorsport.com`。

## 安装

1. 打开 Chrome：`chrome://extensions/`
2. 开启右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择本文件夹：`lfm-chinese-extension`
5. 打开或刷新 `https://lowfuelmotorsport.com/`

## 说明

- 站点语言包位于 `/_nuxt/DWX8L_Sb.js`，当前是 Nuxt 插件 chunk，内含 `en/de/es` 三套消息。
- 这个版本使用内容脚本做前端文本替换，并把站点基础语言设为 `en`，这样汉化词典能稳定命中英文源文案。
- 当前词典优先覆盖导航、账号资料、许可、安全分、热圈、BOP、报告和报名等常用区域。
- 若 LFM 更新页面文案，只需要继续补充 `content.js` 里的 `exact` 映射。

## 已抓到的语言包

原始语言包入口：

```text
https://lowfuelmotorsport.com/_nuxt/DWX8L_Sb.js
```

抓取日期：2026-07-06

## 添加翻译词典

词典可以分文件保存。`manifest.json` 会先加载 `translations/common.js`，再加载 `content.js`，所以你可以在 `translations/common.js` 里追加翻译，也可以新建更多文件并放到 `content_scripts[0].js` 的 `content.js` 前面。

支持三类翻译：

```js
Object.assign(window.LFM_CN_TRANSLATIONS.exact, {
  "Race Detail": "比赛详情"
});

Object.assign(window.LFM_CN_TRANSLATIONS.partial, {
  "Circuit de Spa Francorchamps": "斯帕赛道"
});

window.LFM_CN_TRANSLATIONS.patterns.push(
  [/^Race #(\d+)$/, "比赛 #$1"]
);
```

从 `lfm-cn-dom.js` 迁移时，可以把 `exactGlobal` 放进 `exact`，把 `partialGlobal` 放进 `partial`，把 `regexRules` 放进 `patterns`。