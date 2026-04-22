# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · **Italiano**

**Un pack di locale, ogni campo di App Store Connect compilato.**

Packpour è un'estensione Chrome local-first con pannello laterale. Legge un pack multilingue (TXT o Markdown) e versa ogni valore etichettato nel campo corrispondente della pagina di locale attiva di App Store Connect. Salva e Invia restano manuali.

- 🌐 **Sito:** https://hooosberg.github.io/Packpour/
- 📦 **Download:** https://github.com/hooosberg/Packpour/releases/latest
- 🔒 **Privacy:** [site/privacy.html](./site/privacy.html)
- 📝 **Termini:** [site/terms.html](./site/terms.html)
- ✉️ **Contatto:** zikedece@proton.me

## Funzionalità

- **Un pack, tutti i campi** — importa un TXT/MD; Packpour versa ogni valore etichettato nel campo App Store Connect corrispondente.
- **Matching intelligente** — prova label, placeholder, aria-label, name e id; se fallisce ripiega sul campo in focus.
- **Local-first** — i pack restano nello storage locale di Chrome, niente viene inviato a server.
- **Sicuro per design** — i campi password, pagamenti, token e simili vengono sempre saltati. Mai click su Salva / Pubblica / Invia.
- **10 lingue di UI** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Installazione

### Da GitHub Releases (consigliato)

1. Scarica l'ultima `.zip` da [Releases](https://github.com/hooosberg/Packpour/releases/latest).
2. Estrai in un percorso stabile (non cancellare la cartella dopo).
3. Apri `chrome://extensions` e attiva la **modalità sviluppatore**.
4. Clicca **Carica estensione non pacchettizzata** e seleziona la cartella.

### Dal codice sorgente

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → modalità sviluppatore → Carica non pacchettizzata → scegli local/
```

## Formato del pack TXT

```text
NAME
Nome dell'app

SUBTITLE
Sottotitolo ASO breve

PROMOTIONAL TEXT
Testo breve di lancio o aggiornamento.

DESCRIPTION
Descrizione lunga per App Store.

KEYWORDS
parole,chiave,separate,virgole

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

La scheda **Aiuto** dell'estensione include un prompt AI che genera questo formato per ogni locale App Store a partire da un'idea di app.

## Creare una release

```bash
bash github/pack-release.sh
```

Legge la versione da `local/manifest.json` e scrive `github/releases/Packpour-v{version}.zip`. Allega questa zip a una GitHub Release taggata `v{version}`.

## Licenza

[MIT](./LICENSE) — gratis per uso personale e in team. Pull request benvenute.

## Altri progetti di hooosberg

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Non affiliato ad Apple. App Store Connect e tutti i marchi Apple appartengono ad Apple Inc.
