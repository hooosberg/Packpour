# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · **Deutsch** · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**Ein Locale-Pack — jedes App-Store-Connect-Feld befüllt.**

Packpour ist eine local-first Chrome-Seitenleistenerweiterung. Sie liest ein mehrsprachiges TXT- oder Markdown-Pack und gießt jeden beschrifteten Wert in das passende Feld der aktuellen App-Store-Connect-Sprachseite. Speichern und Einreichen bleiben manuell.

- 🌐 **Website:** https://hooosberg.github.io/Packpour/
- 📦 **Download:** https://github.com/hooosberg/Packpour/releases/latest
- 🔒 **Datenschutz:** [site/privacy.html](./site/privacy.html)
- 📝 **Nutzungsbedingungen:** [site/terms.html](./site/terms.html)
- ✉️ **Kontakt:** zikedece@proton.me

## Funktionen

- **Ein Pack, alle Felder** — TXT/MD importieren; Packpour gießt jeden beschrifteten Wert in das passende App-Store-Connect-Feld.
- **Intelligente Feldzuordnung** — versucht label, placeholder, aria-label, name und id; fällt bei Fehlschlag auf Fokus-Feld-Befüllung zurück.
- **Lokal zuerst** — Packs bleiben im Chrome-Local-Storage, nichts wird an einen Server gesendet.
- **Sicher per Design** — Passwort-, Zahlungs-, Token- und geheimnisartige Felder werden immer übersprungen. Niemals Klicks auf Speichern / Veröffentlichen / Einreichen.
- **10 UI-Sprachen** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Installation

### Aus GitHub Releases (empfohlen)

1. Neueste `.zip` von [Releases](https://github.com/hooosberg/Packpour/releases/latest) herunterladen.
2. An einem stabilen Ort entpacken (Ordner nach Installation nicht löschen).
3. `chrome://extensions` öffnen und **Entwicklermodus** aktivieren.
4. **Entpackte Erweiterung laden** klicken und den Ordner wählen.

### Aus dem Quellcode

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → Entwicklermodus → Entpackt laden → local/ wählen
```

## TXT-Pack-Format

```text
NAME
App-Name

SUBTITLE
Kurzer ASO-Untertitel

PROMOTIONAL TEXT
Kurzer Launch- oder Update-Text.

DESCRIPTION
Lange App-Store-Beschreibung.

KEYWORDS
komma,getrennte,keywords

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

Der **Hilfe**-Tab der Erweiterung enthält einen KI-Prompt, der dieses Format aus einer App-Idee für jede App-Store-Locale erzeugt.

## Release erstellen

```bash
bash github/pack-release.sh
```

Liest die Version aus `local/manifest.json` und schreibt `github/releases/Packpour-v{version}.zip`. Hängen Sie diese zip an ein mit `v{version}` getaggtes GitHub Release an.

## Lizenz

[MIT](./LICENSE) — kostenlos für Einzelpersonen und Teams. Pull Requests willkommen.

## Weitere Projekte von hooosberg

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Nicht mit Apple verbunden. App Store Connect und alle Apple-Marken gehören Apple Inc.
