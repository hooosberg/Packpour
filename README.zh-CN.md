# Packpour

> [English](README.md) · **简体中文** · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**一份本地化文本包，倒进 App Store Connect 每一个字段。**

Packpour 是一个本地优先的 Chrome 侧边栏插件，读入多语言 TXT / Markdown 元数据包，然后把每个标签对应的值倒进当前 App Store Connect 本地化页面的字段里。保存和提交始终由你决定。

- 🌐 **落地页：** https://hooosberg.github.io/Packpour/
- 📦 **下载：** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **隐私：** [site/privacy.html](./site/privacy.html)
- 📝 **条款：** [site/terms.html](./site/terms.html)
- ✉️ **联系：** zikedece@proton.me

## 功能

- **一个包，填遍字段** — 导入一份 TXT/MD，Packpour 会把每个标签对应的值倒进匹配的 App Store Connect 字段。
- **智能字段匹配** — 依次尝试 label、placeholder、aria-label、name、id；失败时回退到聚焦字段填充。
- **本地优先** — 文本包只在 Chrome 本地存储里，绝不发到任何服务器。
- **默认安全** — 密码、支付、令牌类字段一律跳过；绝不点保存 / 发布 / 提审。
- **10 种 UI 语言** — English、简/繁中文、日本語、한국어、Français、Deutsch、Español、Português、Italiano。

## 安装

### 从 Chrome Web Store（推荐）

1. 打开 [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en)。
2. 点击 **添加至 Chrome**。
3. Chrome 会自动安装，并通过商店接收后续更新。

### 从源码

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → 开发者模式 → 加载已解压 → 选 local/
```

## 文本包格式

每个 locale 文件使用稳定的字段标签，每个字段一块：

```text
NAME
应用名称

SUBTITLE
ASO 短副标题

PROMOTIONAL TEXT
发布或更新短文案。

DESCRIPTION
长版 App Store 介绍。

KEYWORDS
逗号,分隔,关键词

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

插件内的 **帮助** 标签页里有一个 AI prompt，可以根据一个 App 想法，为每个 App Store locale 生成这种格式。

## 仓库结构

```
local/           Chrome 扩展源码（「加载已解压」指向这里）
github/          README、落地页、打包脚本、发布 zip
  README.md / README.*.md  ← 10 种语言 README
  LICENSE                   ← MIT
  pack-release.sh           ← 打包脚本
  releases/                 ← 本地 zip 暂存（已忽略）
  site/                     ← GitHub Pages 落地页
  .github/workflows/        ← 自动部署 Pages
```

## 打包发布

项目根目录运行：

```bash
bash github/pack-release.sh
```

会从 `local/manifest.json` 读版本号，生成 `github/releases/Packpour-v{version}.zip`。把这个 zip 作为附件上传到新的 GitHub Release，tag 为 `v{version}`。

## 许可证

[MIT](./LICENSE) — 个人和团队免费使用。欢迎通过 Pull Request 贡献。

## 作者 hooosberg 的其他项目

- [BeRaw](https://github.com/hooosberg/BeRaw) — Behance 原图抓取
- [AgentLimb](https://github.com/hooosberg/AgentLimb) — 让 AI 控制浏览器
- [WitNote](https://github.com/hooosberg/WitNote) — 本地优先 AI 写作助手
- [GlotShot](https://github.com/hooosberg/GlotShot) — App Store 预览图生成
- [TrekReel](https://github.com/hooosberg/TrekReel) — 户外轨迹剪成电影
- [DOMPrompter](https://github.com/hooosberg/DOMPrompter) — 给 AI 可视化 DOM
- [UIXskills](https://github.com/hooosberg/UIXskills) — AI → JSON → 白板 → UI

与 Apple 无关联。App Store Connect 及 Apple 所有商标归 Apple Inc. 所有。
