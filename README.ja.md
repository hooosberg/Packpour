# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · **日本語** · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**ロケールパック 1 つで、App Store Connect のすべての欄へ。**

Packpour はローカルファーストの Chrome サイドパネル拡張機能です。多言語の TXT または Markdown メタデータパックを読み込み、現在の App Store Connect ロケールページの対応する欄にラベル付きの値を注ぎ込みます。保存と申請は常に手動のままです。

- 🌐 **ランディングページ：** https://hooosberg.github.io/Packpour/
- 📦 **ダウンロード：** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **プライバシー：** [site/privacy.html](./site/privacy.html)
- 📝 **利用規約：** [site/terms.html](./site/terms.html)
- ✉️ **連絡先：** zikedece@proton.me

## 機能

- **1 パックで全欄入力** — TXT/MD を 1 つ取り込み、Packpour がラベル付きの値を対応する App Store Connect の欄に注ぎ込みます。
- **スマートな項目マッチング** — label、placeholder、aria-label、name、id の順に試し、失敗時はフォーカス済み項目入力にフォールバック。
- **ローカルファースト** — パックは Chrome のローカルストレージに残ります。サーバーには送信しません。
- **設計で安全** — パスワード・決済・トークン系は常にスキップ。保存 / 公開 / 審査申請は自動化されません。
- **10 言語 UI** — English、簡/繁中文、日本語、한국어、Français、Deutsch、Español、Português、Italiano。

## インストール

### Chrome Web Store から（推奨）

1. [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en) を開きます。
2. **Chrome に追加** をクリックします。
3. Chrome が自動でインストールし、以後の更新もストア経由で届きます。

### ソースから

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → デベロッパーモード → 読み込み → local/ を選択
```

## TXT パック形式

```text
NAME
アプリ名

SUBTITLE
短い ASO サブタイトル

PROMOTIONAL TEXT
リリース・アップデート用の短文。

DESCRIPTION
長文の App Store 説明。

KEYWORDS
カンマ,区切り,キーワード

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

拡張機能の **ヘルプ** タブに、1 つのアプリアイデアから各 App Store ロケール向けの TXT を生成する AI プロンプトが同梱されています。

## リリース作成

```bash
bash github/pack-release.sh
```

`local/manifest.json` からバージョンを読み、`github/releases/Packpour-v{version}.zip` を出力します。その zip を `v{version}` タグの GitHub Release にアタッチしてください。

## ライセンス

[MIT](./LICENSE) — 個人・チーム共に無料。プルリクエスト歓迎。

## hooosberg の他のプロジェクト

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Apple とは無関係です。App Store Connect および Apple の各商標は Apple Inc. に帰属します。
