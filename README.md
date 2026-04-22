# Packpour

> **English** · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**Pour one locale pack into every App Store Connect field.**

Packpour is a local-first Chrome side panel that reads a multilingual TXT or Markdown metadata pack and fills the matching fields on the current App Store Connect locale page. Save and Submit stay manual.

- 🌐 **Landing page:** https://hooosberg.github.io/Packpour/
- 📦 **Download:** https://github.com/hooosberg/Packpour/releases/latest
- 🔒 **Privacy:** [site/privacy.html](./site/privacy.html)
- 📝 **Terms:** [site/terms.html](./site/terms.html)
- ✉️ **Contact:** zikedece@proton.me

## Features

- **One pack, every field** — import a TXT or MD, Packpour pours each labeled value into the matching App Store Connect field.
- **Smart field matching** — tries label, placeholder, aria-label, name, and id; falls back to focused-field fill.
- **Local-first** — packs live in Chrome local storage. Nothing is sent to any server.
- **Safe by design** — password, payment, token, and secret-looking fields are always skipped. Never clicks Save / Publish / Submit for Review.
- **Ten UI languages** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Install

### From GitHub Releases (recommended)

1. Download the latest `.zip` from [Releases](https://github.com/hooosberg/Packpour/releases/latest).
2. Unzip to a stable folder (do not delete it after install).
3. Open `chrome://extensions` and toggle **Developer mode**.
4. Click **Load unpacked** and pick the unzipped folder.

### From source

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → Developer mode → Load unpacked → pick local/
```

## TXT pack format

Each locale file uses stable field labels, one block per field:

```text
NAME
My App Name

SUBTITLE
Short ASO subtitle

PROMOTIONAL TEXT
Short launch or update copy.

DESCRIPTION
Long App Store description.

KEYWORDS
comma,separated,keywords

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

The in-extension **Help** tab has an AI prompt that generates this format from one app idea, across every App Store locale.

## Repository layout

```
local/           Chrome extension source (point "Load unpacked" here)
  manifest.json
  popup.{html,js,css}
  content.js
  background.js
  _locales/      Chrome i18n (appName, appDescription per locale)
  icons/         16 / 32 / 48 / 128 PNG icons

github/
  README.md              ← this file
  README.*.md            ← nine translations
  LICENSE                ← MIT
  pack-release.sh        ← build script (reads local/manifest.json)
  releases/              ← local zip staging (gitignored)
  site/                  ← GitHub Pages landing page
    index.html
    privacy.html · terms.html · support.html
    styles.css · i18n.js
    assets/
    .nojekyll
  .github/workflows/pages.yml   ← auto-deploys site/ on push
```

## Build a release

From the project root:

```bash
bash github/pack-release.sh
```

This reads the version from `local/manifest.json` and writes `github/releases/Packpour-v{version}.zip`. Upload that zip as an asset on a new GitHub release tagged `v{version}`.

## License

[MIT](./LICENSE) — free for personal and team use. Contributions welcome via pull request.

## Built by hooosberg

Sibling projects:

- [BeRaw](https://github.com/hooosberg/BeRaw) — Behance raw-image grabber
- [AgentLimb](https://github.com/hooosberg/AgentLimb) — teach AI to control your browser
- [WitNote](https://github.com/hooosberg/WitNote) — local-first AI writing companion
- [GlotShot](https://github.com/hooosberg/GlotShot) — App Store preview images
- [TrekReel](https://github.com/hooosberg/TrekReel) — outdoor trails, cinematic reels
- [DOMPrompter](https://github.com/hooosberg/DOMPrompter) — visualize the DOM for AI code
- [UIXskills](https://github.com/hooosberg/UIXskills) — AI → JSON → whiteboard → UI

Not affiliated with Apple. App Store Connect and all Apple trademarks belong to Apple Inc.
