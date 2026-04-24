# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · **繁體中文** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**一份本地化文字包，倒進 App Store Connect 每一個欄位。**

Packpour 是一個本機優先的 Chrome 側邊欄擴充功能，讀入多語言 TXT / Markdown 中繼資料包，然後把每個標籤對應的值倒進當前 App Store Connect 本地化頁面的欄位。儲存與送審始終由你決定。

- 🌐 **官網：** https://hooosberg.github.io/Packpour/
- 📦 **下載：** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **隱私：** [site/privacy.html](./site/privacy.html)
- 📝 **條款：** [site/terms.html](./site/terms.html)
- ✉️ **聯絡：** zikedece@proton.me

## 功能

- **一份包，填遍欄位** — 匯入一份 TXT/MD，Packpour 會把每個標籤對應的值倒進匹配的 App Store Connect 欄位。
- **智慧欄位匹配** — 依序嘗試 label、placeholder、aria-label、name、id；失敗時回退到聚焦欄位填充。
- **本機優先** — 文字包只在 Chrome 本機儲存中，絕不傳到任何伺服器。
- **預設安全** — 密碼、付款、權杖類欄位一律跳過；絕不點儲存 / 發布 / 送審。
- **10 種 UI 語言** — English、簡/繁中文、日本語、한국어、Français、Deutsch、Español、Português、Italiano。

## 安裝

### 從 Chrome Web Store（推薦）

1. 打開 [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en)。
2. 點擊 **加到 Chrome**。
3. Chrome 會自動安裝，並透過商店接收後續更新。

### 從原始碼

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → 開發人員模式 → 載入未封裝項目 → 選 local/
```

## 文字包格式

```text
NAME
應用名稱

SUBTITLE
ASO 副標題

PROMOTIONAL TEXT
短版發布或更新文案。

DESCRIPTION
長版 App Store 介紹。

KEYWORDS
關鍵字,以逗號,分隔

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

擴充功能內的 **說明** 標籤有內建 AI prompt，可依一個 App 想法為每個 App Store locale 生成此格式。

## 打包發布

```bash
bash github/pack-release.sh
```

讀取 `local/manifest.json` 的版本號，輸出 `github/releases/Packpour-v{version}.zip`。將 zip 作為附件上傳至 tag 為 `v{version}` 的 GitHub Release。

## 授權

[MIT](./LICENSE) — 個人與團隊免費使用。歡迎 Pull Request。

## 作者 hooosberg 的其他專案

- [BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

與 Apple 無關聯。App Store Connect 及 Apple 所有商標歸 Apple Inc. 所有。
