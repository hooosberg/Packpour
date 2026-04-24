# Packpour

> [English](README.md) · [简体中文](README.zh-CN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Español](README.es.md) · **Português** · [Italiano](README.it.md)

**Um pack de locale, cada campo do App Store Connect preenchido.**

O Packpour é uma extensão Chrome local-first em painel lateral. Lê um pack multilíngue (TXT ou Markdown) e despeja cada valor rotulado no campo correspondente da página de locale ativa do App Store Connect. Salvar e Enviar permanecem manuais.

- 🌐 **Site:** https://hooosberg.github.io/Packpour/
- 📦 **Download:** https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en
- 🔒 **Privacidade:** [site/privacy.html](./site/privacy.html)
- 📝 **Termos:** [site/terms.html](./site/terms.html)
- ✉️ **Contato:** zikedece@proton.me

## Funcionalidades

- **Um pack, todos os campos** — importe um TXT/MD; o Packpour despeja cada valor rotulado no campo correspondente do App Store Connect.
- **Correspondência inteligente** — tenta label, placeholder, aria-label, name e id; se falhar, faz fallback para o campo em foco.
- **Local-first** — os packs ficam no armazenamento local do Chrome; nada é enviado a servidores.
- **Seguro por design** — campos de senha, pagamento, token e similares sempre são pulados. Nunca clica em Salvar / Publicar / Enviar.
- **10 idiomas de UI** — English, 简/繁中文, 日本語, 한국어, Français, Deutsch, Español, Português, Italiano.

## Instalar

### Da Chrome Web Store (recomendado)

1. Abra a [Chrome Web Store](https://chromewebstore.google.com/detail/packpour/phpeiikoiifehamfkjmknhmfbichcdjj?authuser=0&hl=en).
2. Clique em **Adicionar ao Chrome**.
3. O Chrome instala automaticamente e recebe futuras atualizações pela loja.

### Do código fonte

```bash
git clone https://github.com/hooosberg/Packpour.git
# chrome://extensions → modo desenvolvedor → Carregar sem compactação → escolher local/
```

## Formato do pack TXT

```text
NAME
Nome do app

SUBTITLE
Subtítulo ASO curto

PROMOTIONAL TEXT
Texto curto de lançamento ou atualização.

DESCRIPTION
Descrição longa da App Store.

KEYWORDS
palavras,chave,separadas,vírgulas

SUPPORT URL
https://example.com/support

MARKETING URL
https://example.com

PRIVACY POLICY URL
https://example.com/privacy
```

A aba **Ajuda** da extensão traz um prompt de IA que gera este formato por locale da App Store, a partir de uma ideia de app.

## Criar uma release

```bash
bash github/pack-release.sh
```

Lê a versão de `local/manifest.json` e gera `github/releases/Packpour-v{version}.zip`. Anexe esse zip a uma GitHub Release com tag `v{version}`.

## Licença

[MIT](./LICENSE) — grátis para uso pessoal e em equipe. Pull requests bem-vindas.

## Outros projetos do hooosberg

[BeRaw](https://github.com/hooosberg/BeRaw) · [AgentLimb](https://github.com/hooosberg/AgentLimb) · [WitNote](https://github.com/hooosberg/WitNote) · [GlotShot](https://github.com/hooosberg/GlotShot) · [TrekReel](https://github.com/hooosberg/TrekReel) · [DOMPrompter](https://github.com/hooosberg/DOMPrompter) · [UIXskills](https://github.com/hooosberg/UIXskills)

Sem afiliação com a Apple. App Store Connect e todas as marcas Apple pertencem à Apple Inc.
