# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · **Español** · [Português](README.pt.md) · [Italiano](README.it.md)

**Un pack de locale, cada campo de App Store Connect lleno.**

Packpour es una extensión Chrome local-first de panel lateral. Lee un pack multilingüe (TXT o Markdown) y vierte cada valor etiquetado en el campo correspondiente de la página de locale activa de App Store Connect. Guardar y Enviar siguen siendo manuales.

- 🌐 **Sitio:** https://hooosberg.github.io/Packpour/
- 📦 **Descarga:** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **Privacidad:** [site/privacy.html](./site/privacy.html)
- 📝 **Términos:** [site/terms.html](./site/terms.html)
- ✉️ **Contacto:** zikedece@proton.me

## Funciones

- **Un pack, todos los campos** — importa un TXT/MD; Packpour vierte cada valor etiquetado en el campo correspondiente de App Store Connect.
- **Emparejamiento inteligente** — prueba label, placeholder, aria-label, name e id; si falla, hace fallback al campo enfocado.
- **Local-first** — los packs viven en el almacenamiento local de Chrome; no se envía nada a ningún servidor.
- **Seguro por diseño** — los campos de contraseña, pago, token y similares siempre se omiten. Nunca hace clic en Guardar / Publicar / Enviar.
- **10 idiomas de UI** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Instalar

### Desde Chrome Web Store (recomendado)

1. Abre [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en).
2. Haz clic en **Añadir a Chrome**.
3. Chrome instalará la extensión automáticamente y recibirá futuras actualizaciones desde la tienda.

### Desde el código fuente

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → modo desarrollador → Cargar descomprimida → elegir local/
```

## Formato del pack TXT

```text
NAME
Nombre de la app

SUBTITLE
Subtítulo ASO breve

PROMOTIONAL TEXT
Texto corto de lanzamiento o actualización.

DESCRIPTION
Descripción larga para App Store.

KEYWORDS
palabras,clave,separadas,comas

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

La pestaña **Ayuda** de la extensión trae un prompt de IA que genera este formato para cada locale de App Store a partir de una idea de app.

## Crear una release

```bash
bash github/pack-release.sh
```

Lee la versión de `local/manifest.json` y escribe `github/releases/Packpour-v{version}.zip`. Adjunta ese zip a una GitHub Release etiquetada `v{version}`.

## Licencia

[MIT](./LICENSE) — gratis para uso personal y en equipo. Pull requests bienvenidos.

## Otros proyectos de hooosberg

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Sin afiliación con Apple. App Store Connect y todas las marcas de Apple pertenecen a Apple Inc.
