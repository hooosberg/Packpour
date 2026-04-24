# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Français** · [Deutsch](README.de.md) · [Español](README.es.md) · [Português](README.pt.md) · [Italiano](README.it.md)

**Un pack de locale, chaque champ d'App Store Connect rempli.**

Packpour est une extension Chrome local-first en panneau latéral. Elle lit un pack multilingue (TXT ou Markdown) et déverse chaque valeur étiquetée dans le champ correspondant de la page de locale active d'App Store Connect. Enregistrer et Soumettre restent manuels.

- 🌐 **Site :** https://hooosberg.github.io/Packpour/
- 📦 **Téléchargement :** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **Confidentialité :** [site/privacy.html](./site/privacy.html)
- 📝 **Conditions :** [site/terms.html](./site/terms.html)
- ✉️ **Contact :** zikedece@proton.me

## Fonctions

- **Un pack, tous les champs** — importez un TXT/MD ; Packpour déverse chaque valeur étiquetée dans le champ App Store Connect correspondant.
- **Correspondance intelligente** — essaie label, placeholder, aria-label, name puis id ; bascule sur le remplissage du champ focalisé en cas d'échec.
- **Local d'abord** — les packs restent dans le stockage Chrome local, rien n'est envoyé à un serveur.
- **Sûr par conception** — les champs mot de passe, paiement, jetons et secrets sont toujours ignorés. Jamais de clic sur Enregistrer / Publier / Soumettre.
- **10 langues d'UI** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Installer

### Depuis le Chrome Web Store (recommandé)

1. Ouvrez le [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en).
2. Cliquez sur **Ajouter à Chrome**.
3. Chrome installe l'extension automatiquement et recevra les mises à jour via le Store.

### Depuis les sources

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → mode développeur → Charger non empaquetée → choisir local/
```

## Format du pack TXT

```text
NAME
Nom de l'app

SUBTITLE
Sous-titre ASO court

PROMOTIONAL TEXT
Texte court de lancement ou de mise à jour.

DESCRIPTION
Description longue sur l'App Store.

KEYWORDS
mots,clés,séparés,virgules

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

L'onglet **Aide** de l'extension contient un prompt IA qui génère ce format pour chaque locale App Store à partir d'une idée d'app.

## Créer une release

```bash
bash github/pack-release.sh
```

Lit la version dans `local/manifest.json` et écrit `github/releases/Packpour-v{version}.zip`. Attachez ce zip à une GitHub Release tagguée `v{version}`.

## Licence

[MIT](./LICENSE) — gratuit pour usage personnel et en équipe. Contributions bienvenues.

## Autres projets de hooosberg

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Non affilié à Apple. App Store Connect et toutes les marques Apple appartiennent à Apple Inc.
