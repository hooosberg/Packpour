# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · **한국어** · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**로케일 팩 하나로 App Store Connect 모든 필드를 채웁니다.**

Packpour 는 로컬 우선 Chrome 사이드 패널 확장입니다. 다국어 TXT 또는 Markdown 메타데이터 팩을 읽어, 현재 App Store Connect 로케일 페이지의 해당 필드에 라벨이 붙은 값들을 부어 넣습니다. 저장과 제출은 항상 수동입니다.

- 🌐 **랜딩 페이지:** https://hooosberg.github.io/Packpour/
- 📦 **다운로드:** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **개인정보:** [site/privacy.html](./site/privacy.html)
- 📝 **이용 약관:** [site/terms.html](./site/terms.html)
- ✉️ **연락처:** zikedece@proton.me

## 기능

- **팩 하나, 모든 필드** — TXT/MD 하나만 불러오면 Packpour 가 라벨에 대응하는 값들을 App Store Connect 필드에 부어 넣습니다.
- **스마트 필드 매칭** — label, placeholder, aria-label, name, id 순으로 시도하고, 실패 시 포커스 필드 채우기로 폴백.
- **로컬 우선** — 팩은 Chrome 로컬 저장소에 남으며, 어떤 서버로도 전송되지 않습니다.
- **설계적 안전** — 비밀번호, 결제, 토큰성 필드는 항상 건너뜁니다. 저장 / 게시 / 심사 제출은 절대 누르지 않습니다.
- **10 개 UI 언어** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## 설치

### Chrome 웹 스토어에서 (권장)

1. [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en)를 엽니다.
2. **Chrome에 추가**를 클릭합니다.
3. Chrome 이 자동으로 설치하고 이후 업데이트도 스토어를 통해 받습니다.

### 소스에서

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → 개발자 모드 → 압축해제된 확장 프로그램 로드 → local/ 선택
```

## TXT 팩 포맷

```text
NAME
앱 이름

SUBTITLE
짧은 ASO 부제

PROMOTIONAL TEXT
출시 / 업데이트용 짧은 문구.

DESCRIPTION
App Store 긴 소개.

KEYWORDS
쉼표,로,구분된,키워드

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

확장 내 **도움말** 탭에는 하나의 앱 아이디어로 모든 App Store 로케일에 맞는 TXT 를 생성하는 AI 프롬프트가 들어 있습니다.

## 릴리스 생성

```bash
bash github/pack-release.sh
```

`local/manifest.json` 의 버전을 읽어 `github/releases/Packpour-v{version}.zip` 을 생성합니다. 이 zip 을 `v{version}` 태그의 GitHub Release 에 첨부하세요.

## 라이선스

[MIT](./LICENSE) — 개인과 팀 모두 무료. 풀 리퀘스트 환영.

## hooosberg 의 다른 프로젝트

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Apple 과 제휴하지 않았습니다. App Store Connect 및 Apple 상표는 Apple Inc. 소유입니다.
