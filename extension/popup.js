const STORAGE_LIBRARY_KEY = "launchPasteLibrary";
const STORAGE_SELECTED_PACK_KEY = "launchPasteSelectedPack";
const STORAGE_UI_LANGUAGE_KEY = "launchPasteUiLanguage";
const MAX_IMPORT_FILES = 80;
const MAX_IMPORT_FILE_BYTES = 256 * 1024;
const MAX_IMPORT_TOTAL_BYTES = 2 * 1024 * 1024;
const MAX_DIRECTORY_ENTRIES_SCANNED = 500;
const APP_STORE_CONNECT_URL = "https://appstoreconnect.apple.com/apps";
const PROJECT_REPO_URL = "https://github.com/hooosberg/Packpour";
const PROJECT_SITE_URL = "https://hooosberg.com/apps/packpour/";
const PROJECT_SUPPORT_URL = `${PROJECT_SITE_URL}support.html`;
const PROJECT_PRIVACY_URL = `${PROJECT_SITE_URL}privacy.html`;
const PROJECT_TERMS_URL = `${PROJECT_SITE_URL}terms.html`;
const UPDATE_API = "https://api.github.com/repos/hooosberg/Packpour/releases/latest";

const AI_PROMPT_TEXT = `You are an App Store Connect ASO metadata strategist and localization editor.

Goal:
Create Apple-safe, ASO-optimized metadata text packs for one app. The output must be ready to save as .txt files and import into the "Packpour" Chrome extension.

Before writing, ask me for any missing product facts you need:
- App name
- Platform: iOS, iPadOS, macOS, watchOS, tvOS, visionOS
- Primary category
- Target users
- Main features
- Differentiation
- Privacy/data handling
- Pricing model, but do not put concrete prices in App Store metadata
- Support URL
- Marketing URL
- Privacy Policy URL if needed
- What's new in this version, or say "new app"
- Locale list, for example: en-US, en-GB, zh-Hans, zh-Hant, ja, ko, fr-FR, de-DE, es-ES, es-MX, pt-BR, it, nl-NL, ar, he

Apple safety rules:
- Do not use competitor app names, company names, protected trademarks, celebrity names, unrelated hot keywords, ranking claims, fake awards, download numbers, or price/discount claims.
- Do not promise features the current build does not have.
- Do not keyword-stuff Description. Write for humans first.
- Do not repeat words already strongly covered by Name or Subtitle inside Keywords unless necessary.
- Promotional Text is for conversion/update copy; do not treat it as a search keyword field.
- Keywords must be comma-separated, with no spaces after commas.
- Keep Keywords under 95 UTF-8 bytes when possible to leave safety margin for App Store Connect's 100-byte limit.

ASO/localization strategy:
- Do not simply translate one English text.
- For each locale, choose 1-2 local search intents and adapt wording to local user behavior.
- Name and Subtitle should be clear, searchable, and natural.
- Description first paragraph should quickly say who the app is for, what problem it solves, and why it is trustworthy.
- For privacy-focused apps, emphasize privacy more in locales where that matters, such as German/French markets.
- For Japanese/Korean/Chinese locales, use natural local product language, not literal translation.
- For Arabic/Hebrew, respect RTL readability and keep punctuation clean.

Required output format:
For each locale, output one separate block with this exact filename line:
FILE: <locale>.txt

Then output this exact field structure. Use the field labels in this exact case (Title Case, matching the actual App Store Connect form labels). Each label sits alone on its own line, immediately followed by the field value on the next line(s). Do not use ALL CAPS, do not use markdown headings, do not surround labels with brackets, quotes, asterisks, or colons.

Name
<2-30 characters>

Subtitle
<= 30 characters

Promotional Text
<= 170 characters

Description
<= 4000 characters

What's New in This Version
<= 4000 characters. If this is a new app, write a concise launch note.

Keywords
comma,separated,keywords,under,95,utf8,bytes

Support URL
<support url>

Marketing URL
<marketing url>

Privacy Policy URL
<privacy policy url or leave blank if not applicable>

After all locale blocks, include a short QA checklist:
- fields likely over limit
- risky claims to review
- keywords that may exceed byte budget
- locales that need native speaker review

Hard rules to follow:
- Field labels must match the exact spelling and case shown above. The Packpour extension matches them against the App Store Connect form, which uses Title Case labels (Name, Subtitle, Promotional Text, Description, What's New in This Version, Keywords, Support URL, Marketing URL, Privacy Policy URL).
- Do not write the label inline with its value (e.g. avoid "Subtitle: ..." on a single line). Label and value must be on separate lines.
- Do not insert any extra prefix, marker, or punctuation before a label line.
- Translate the body content into the locale's native language, but keep the field LABELS themselves in English (Title Case) — the labels are structural markers, not content.
- Do not output tables. Do not output Markdown headings (# / ##) inside the TXT blocks.
- The TXT blocks must be copy-ready for App Store Connect filling.`;

const KNOWN_FIELD_ORDER = [
  "NAME",
  "TITLE",
  "APP NAME",
  "SUBTITLE",
  "TAGLINE",
  "SHORT DESCRIPTION",
  "PROMOTIONAL TEXT",
  "DESCRIPTION",
  "WHAT'S NEW IN THIS VERSION",
  "RELEASE NOTES",
  "KEYWORDS",
  "SUPPORT URL",
  "MARKETING URL",
  "PRIVACY POLICY URL",
  "WEBSITE",
  "PRODUCT URL",
];

const FIELD_LIMITS = {
  NAME: { mode: "chars", limit: 30 },
  "APP NAME": { mode: "chars", limit: 30 },
  SUBTITLE: { mode: "chars", limit: 30 },
  "PROMOTIONAL TEXT": { mode: "chars", limit: 170 },
  DESCRIPTION: { mode: "chars", limit: 4000 },
  "WHAT'S NEW IN THIS VERSION": { mode: "chars", limit: 4000 },
  KEYWORDS: { mode: "bytes", limit: 100 },
};

const FIELD_CANONICAL = {
  name: "NAME",
  title: "TITLE",
  "app name": "APP NAME",
  subtitle: "SUBTITLE",
  tagline: "TAGLINE",
  "short description": "SHORT DESCRIPTION",
  "promotional text": "PROMOTIONAL TEXT",
  description: "DESCRIPTION",
  "whats new": "WHAT'S NEW IN THIS VERSION",
  "what's new": "WHAT'S NEW IN THIS VERSION",
  "what is new": "WHAT'S NEW IN THIS VERSION",
  "whats new in this version": "WHAT'S NEW IN THIS VERSION",
  "what's new in this version": "WHAT'S NEW IN THIS VERSION",
  "release notes": "RELEASE NOTES",
  keywords: "KEYWORDS",
  keyword: "KEYWORDS",
  "support url": "SUPPORT URL",
  "marketing url": "MARKETING URL",
  "privacy policy url": "PRIVACY POLICY URL",
  website: "WEBSITE",
  "product url": "PRODUCT URL",
};

const UI_LANGUAGE_OPTIONS = [
  ["auto", "Auto"],
  ["en", "English"],
  ["zh-Hans", "简体中文"],
  ["zh-Hant", "繁體中文"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["pt", "Português"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["ar", "العربية"],
  ["he", "עברית"],
];

const TRANSLATIONS = {
  en: {
    appName: "Packpour",
    tagline: "Import locale packs and fill App Store Connect metadata.",
    heroEyebrow: "Local-first side panel",
    heroTagFormat: "TXT / Markdown",
    heroTagLocale: "Locale packs",
    heroTagReview: "Manual review",
    help: "Help",
    back: "Back",
    productIntroTitle: "ASO copy in. App Store fields filled.",
    productIntro: "Import TXT or Markdown packs for new apps, version updates, or localizations, then fill App Store Connect metadata.",
    mockCta: "Fill current locale",
    mockNote: "Visible editable fields only. Save stays manual.",
    settings: "Settings",
    settingsEyebrow: "Workspace",
    settingsIntro: "Keep the extension local, transparent, and easy to audit.",
    interfaceLanguage: "Interface language",
    helpEyebrow: "Prompt",
    formatTitle: "Text format",
    formatIntro: "Use one field title, then its content. Markdown headings and colon lines also work.",
    importTitle: "Import Packs",
    importIntro: "Bring in multilingual metadata packs and choose which locale to apply right now.",
    chooseFiles: "Choose TXT/MD files",
    importFolder: "Import text folder",
    currentPack: "Current text pack",
    noneSelected: "None selected",
    restorePrevious: "Restore previous",
    clearLibrary: "Clear",
    pastePlaceholder: "Paste one structured text pack here.",
    parseSave: "Parse and save",
    fillCurrentPage: "Fill App Store Connect page",
    emptyStatus: "No text pack loaded yet.",
    helpIntro: "Copy the prompt, give it one app, and ask AI to generate ready-to-import locale TXT files.",
    aboutTitle: "About",
    aboutBody: "A local-first helper for importing multilingual metadata packs into App Store Connect.",
    versionLabel: "Version",
    homepageLabel: "Homepage",
    githubLabel: "GitHub",
    supportLabel: "Support",
    privacyLabel: "Privacy",
    aiPromptTitle: "AI ASO prompt",
    aiPromptIntro: "Paste this into your AI tool. It asks for Apple-safe ASO metadata and outputs one TXT block per locale, ready for this extension.",
    copyPrompt: "Copy AI prompt",
    promptCopied: "AI prompt copied.",
    promptCopyFailed: "Could not copy prompt",
    fields: "Fields",
    fieldsHint: "If automatic matching misses a field, click an input on the page, then fill it from here.",
    fieldsEmpty: "Parsed fields will appear here.",
    safetyTitle: "Safety",
    safetyOne: "This extension fills visible App Store Connect editable fields only after you click the button.",
    safetyTwo: "It does not click Save, Publish, or Submit for Review.",
    safetyThree: "Password, payment, token, and secret-looking fields are skipped.",
    fillFocused: "Fill focused",
    copy: "Copy",
    termsLabel: "Terms",
    checkForUpdates: "Check for updates",
  },
  "zh-Hans": {
    appName: "Packpour",
    tagline: "导入多语种文本包，填写 App Store Connect 语言元数据。",
    heroEyebrow: "本地优先侧边栏",
    heroTagFormat: "TXT / Markdown",
    heroTagLocale: "语言包",
    heroTagReview: "人工复核",
    help: "帮助",
    back: "返回",
    productIntroTitle: "ASO 文案进来，苹果字段填好。",
    productIntro: "为新 App、版本更新或多语种本地化导入 TXT/Markdown 文本包，然后填写 App Store Connect 元数据。",
    mockCta: "填写当前语言",
    mockNote: "只填当前可见可编辑字段，保存仍然手动完成。",
    settings: "设置",
    settingsEyebrow: "工作区",
    settingsIntro: "保持本地运行、透明、容易审计。",
    interfaceLanguage: "界面语言",
    helpEyebrow: "提示词",
    formatTitle: "文本格式",
    formatIntro: "一行字段标题，下面写内容。也支持 Markdown 标题和冒号格式。",
    importTitle: "导入文本包",
    importIntro: "导入多语种元数据文本包，然后选择当前要应用的语言文件。",
    chooseFiles: "选择 TXT/MD 文件",
    importFolder: "导入文本文件夹",
    currentPack: "当前文本包",
    noneSelected: "未选择",
    restorePrevious: "恢复上次内容",
    clearLibrary: "清空",
    pastePlaceholder: "也可以直接粘贴一份结构化文本。",
    parseSave: "解析并保存",
    fillCurrentPage: "填写苹果后台页面",
    emptyStatus: "还没有加载文本包。",
    helpIntro: "复制提示词，给 AI 一个产品，让它生成可直接导入的多语种 TXT 文案包。",
    aboutTitle: "关于",
    aboutBody: "一个本地优先的 App Store Connect 多语种元数据导入与填写助手。",
    versionLabel: "版本",
    homepageLabel: "主页",
    githubLabel: "GitHub",
    supportLabel: "支持",
    privacyLabel: "隐私",
    aiPromptTitle: "AI ASO 提示词",
    aiPromptIntro: "把这段提示词粘给 AI。它会按 Apple 安全规则和 ASO 逻辑输出每个语种的 TXT 文案块，可直接导入本扩展。",
    copyPrompt: "复制 AI 提示词",
    promptCopied: "AI 提示词已复制。",
    promptCopyFailed: "复制提示词失败",
    fields: "字段",
    fieldsHint: "自动匹配失败时，先点击页面里的输入框，再从这里填入。",
    fieldsEmpty: "解析后会在这里显示字段。",
    safetyTitle: "安全边界",
    safetyOne: "这个扩展只在你点击按钮后填写 App Store Connect 里可见可编辑的字段。",
    safetyTwo: "它不会自动点击 Save、Publish 或 Submit for Review。",
    safetyThree: "密码、支付、token、secret 等敏感字段会跳过。",
    fillFocused: "填到聚焦框",
    copy: "复制",
    termsLabel: "服务条款",
    checkForUpdates: "检查更新",
  },
  "zh-Hant": {
    appName: "Packpour",
    tagline: "生成並填寫 App Store Connect 多語種 ASO 元資料。",
    help: "幫助",
    back: "返回",
    productIntroTitle: "ASO 文案進來，Apple 欄位填好。",
    productIntro: "為新 App、版本更新或多語種本地化匯入 TXT/Markdown 文字包，然後填寫 App Store Connect 元資料。",
    settings: "設定",
    settingsIntro: "保持本地執行、透明、容易審計。",
    interfaceLanguage: "介面語言",
    formatTitle: "文字格式",
    formatIntro: "一行欄位標題，下面寫內容。也支援 Markdown 標題和冒號格式。",
    chooseFiles: "選擇 TXT/MD 檔案",
    importFolder: "匯入文字資料夾",
    currentPack: "目前文字包",
    noneSelected: "未選擇",
    restorePrevious: "恢復上次內容",
    clearLibrary: "清空",
    pastePlaceholder: "也可以直接貼上一份結構化文字。",
    parseSave: "解析並儲存",
    fillCurrentPage: "填寫 Apple 後台頁面",
    emptyStatus: "尚未載入文字包。",
    helpIntro: "複製提示詞，給 AI 一個產品，讓它生成可直接匯入的多語種 TXT 文案包。",
    aboutTitle: "關於",
    aboutBody: "一個本地優先的 App Store Connect ASO 元資料生成與填寫助手。",
    versionLabel: "版本",
    aiPromptTitle: "AI ASO 提示詞",
    aiPromptIntro: "把這段提示詞貼給 AI。它會依照 Apple 安全規則和 ASO 邏輯輸出每個語種的 TXT 文案區塊，可直接匯入本擴充功能。",
    copyPrompt: "複製 AI 提示詞",
    promptCopied: "AI 提示詞已複製。",
    promptCopyFailed: "複製提示詞失敗",
    fields: "欄位",
    fieldsHint: "自動匹配失敗時，先點頁面裡的輸入框，再從這裡填入。",
    fieldsEmpty: "解析後會在這裡顯示欄位。",
    safetyTitle: "安全邊界",
    safetyOne: "這個擴充功能只在你點擊按鈕後填寫 App Store Connect 裡可見可編輯的欄位。",
    safetyTwo: "它不會自動點擊 Save、Publish 或 Submit for Review。",
    safetyThree: "密碼、支付、token、secret 等敏感欄位會跳過。",
    fillFocused: "填入焦點欄位",
    copy: "複製",
    termsLabel: "服務條款",
    checkForUpdates: "檢查更新",
  },
  ja: {
    appName: "Packpour",
    tagline: "App Store Connect の ASO メタデータを生成して入力します。",
    help: "ヘルプ",
    back: "戻る",
    productIntroTitle: "ASO テキストを入れて、App Store の項目を入力。",
    productIntro: "新規 App、バージョン更新、多言語ローカライズ用の TXT/Markdown パックを読み込み、App Store Connect メタデータを入力します。",
    settings: "設定",
    settingsIntro: "ローカルで透明性が高く、確認しやすい拡張機能です。",
    interfaceLanguage: "表示言語",
    formatTitle: "テキスト形式",
    formatIntro: "フィールド名を書き、その下に内容を書きます。Markdown 見出しとコロン形式にも対応します。",
    chooseFiles: "TXT/MD を選択",
    importFolder: "フォルダを読み込む",
    currentPack: "現在のテキストパック",
    noneSelected: "未選択",
    restorePrevious: "前回を復元",
    clearLibrary: "消去",
    pastePlaceholder: "構造化テキストをここに貼り付けます。",
    parseSave: "解析して保存",
    fillCurrentPage: "App Store Connect ページに入力",
    emptyStatus: "テキストパックはまだありません。",
    helpIntro: "プロンプトをコピーし、1つの製品情報を AI に渡して、インポート可能な多言語 TXT ファイルを生成します。",
    aboutTitle: "概要",
    aboutBody: "App Store Connect ASO メタデータをローカル優先で生成・入力するヘルパーです。",
    versionLabel: "バージョン",
    aiPromptTitle: "AI ASO プロンプト",
    aiPromptIntro: "このプロンプトを AI ツールに貼り付けてください。Apple の安全ルールと ASO に沿った、ロケール別 TXT ブロックを出力します。",
    copyPrompt: "AI プロンプトをコピー",
    promptCopied: "AI プロンプトをコピーしました。",
    promptCopyFailed: "プロンプトをコピーできませんでした",
    fields: "フィールド",
    fieldsHint: "自動一致しない場合は、ページ上の入力欄をクリックしてからここで入力します。",
    fieldsEmpty: "解析されたフィールドがここに表示されます。",
    safetyTitle: "安全性",
    safetyOne: "Packpour はボタンを押した後だけ、App Store Connect の編集可能な欄に入力します。",
    safetyTwo: "Save、Publish、Submit for Review はクリックしません。",
    safetyThree: "パスワード、決済、token、secret のような欄はスキップします。",
    fillFocused: "フォーカス欄へ入力",
    copy: "コピー",
    termsLabel: "利用規約",
    checkForUpdates: "アップデートを確認",
  },
  ko: {
    appName: "Packpour",
    tagline: "App Store Connect ASO 메타데이터를 생성하고 채웁니다.",
    help: "도움말",
    back: "뒤로",
    productIntroTitle: "ASO 문구를 넣으면 App Store 필드가 채워집니다.",
    productIntro: "새 앱, 버전 업데이트, 다국어 현지화를 위한 TXT/Markdown 팩을 가져와 App Store Connect 메타데이터를 채웁니다.",
    settings: "설정",
    settingsIntro: "로컬에서 실행되고 투명하게 확인할 수 있습니다.",
    interfaceLanguage: "인터페이스 언어",
    formatTitle: "텍스트 형식",
    formatIntro: "필드 제목을 쓰고 아래에 내용을 적으세요. Markdown 제목과 콜론 형식도 지원합니다.",
    chooseFiles: "TXT/MD 파일 선택",
    importFolder: "폴더 가져오기",
    currentPack: "현재 텍스트 팩",
    noneSelected: "선택 안 됨",
    restorePrevious: "이전 내용 복원",
    clearLibrary: "비우기",
    pastePlaceholder: "구조화된 텍스트를 여기에 붙여넣으세요.",
    parseSave: "파싱하고 저장",
    fillCurrentPage: "App Store Connect 페이지 채우기",
    emptyStatus: "아직 텍스트 팩이 없습니다.",
    helpIntro: "프롬프트를 복사하고 제품 하나를 AI에 전달해 바로 가져올 수 있는 다국어 TXT 파일을 생성하세요.",
    aboutTitle: "정보",
    aboutBody: "App Store Connect ASO 메타데이터를 로컬 우선으로 생성하고 채우는 도구입니다.",
    versionLabel: "버전",
    aiPromptTitle: "AI ASO 프롬프트",
    aiPromptIntro: "이 프롬프트를 AI 도구에 붙여넣으세요. Apple 안전 규칙과 ASO 논리에 맞는 로케일별 TXT 블록을 출력합니다.",
    copyPrompt: "AI 프롬프트 복사",
    promptCopied: "AI 프롬프트를 복사했습니다.",
    promptCopyFailed: "프롬프트를 복사하지 못했습니다",
    fields: "필드",
    fieldsHint: "자동 매칭이 실패하면 페이지 입력칸을 클릭한 뒤 여기에서 채우세요.",
    fieldsEmpty: "파싱된 필드가 여기에 표시됩니다.",
    safetyTitle: "안전",
    safetyOne: "Packpour 는 버튼을 누른 뒤 App Store Connect 의 편집 가능한 필드만 채웁니다.",
    safetyTwo: "Save, Publish, Submit for Review 는 클릭하지 않습니다.",
    safetyThree: "비밀번호, 결제, token, secret 처럼 보이는 필드는 건너뜁니다.",
    fillFocused: "포커스 필드 채우기",
    copy: "복사",
    termsLabel: "이용약관",
    checkForUpdates: "업데이트 확인",
  },
  fr: {
    appName: "Packpour",
    tagline: "Générez et remplissez les métadonnées ASO App Store Connect.",
    help: "Aide",
    back: "Retour",
    productIntroTitle: "Texte ASO importé. Champs App Store remplis.",
    productIntro: "Importez des packs TXT ou Markdown pour les nouveaux apps, les mises à jour ou les localisations, puis remplissez les métadonnées App Store Connect.",
    settings: "Reglages",
    settingsIntro: "Une extension locale, transparente et facile a verifier.",
    interfaceLanguage: "Langue de l'interface",
    formatTitle: "Format du texte",
    formatIntro: "Ecrivez un titre de champ, puis son contenu. Les titres Markdown et les lignes avec deux-points fonctionnent aussi.",
    chooseFiles: "Choisir des fichiers TXT/MD",
    importFolder: "Importer un dossier",
    currentPack: "Pack de texte actuel",
    noneSelected: "Aucun",
    restorePrevious: "Restaurer",
    clearLibrary: "Effacer",
    pastePlaceholder: "Collez ici un pack de texte structure.",
    parseSave: "Analyser et enregistrer",
    fillCurrentPage: "Remplir la page App Store Connect",
    emptyStatus: "Aucun pack charge.",
    helpIntro: "Copiez le prompt, donnez un produit à l'IA, puis générez des fichiers TXT multilingues prêts à importer.",
    aboutTitle: "À propos",
    aboutBody: "Un assistant local pour générer et remplir les métadonnées ASO App Store Connect.",
    versionLabel: "Version",
    aiPromptTitle: "Prompt IA ASO",
    aiPromptIntro: "Collez ce prompt dans votre outil IA. Il demande des métadonnées ASO sûres pour Apple et produit un bloc TXT par locale.",
    copyPrompt: "Copier le prompt IA",
    promptCopied: "Prompt IA copié.",
    promptCopyFailed: "Impossible de copier le prompt",
    fields: "Champs",
    fieldsHint: "Si la correspondance echoue, cliquez un champ sur la page puis remplissez-le ici.",
    fieldsEmpty: "Les champs analyses apparaitront ici.",
    safetyTitle: "Securite",
    safetyOne: "Packpour remplit seulement les champs App Store Connect visibles apres votre clic.",
    safetyTwo: "Il ne clique pas sur Save, Publish ou Submit for Review.",
    safetyThree: "Les champs de mot de passe, paiement, token ou secret sont ignores.",
    fillFocused: "Remplir le champ actif",
    copy: "Copier",
    termsLabel: "Conditions",
    checkForUpdates: "Rechercher des mises a jour",
  },
  de: {
    appName: "Packpour",
    tagline: "App Store Connect ASO-Metadaten erzeugen und ausfuellen.",
    help: "Hilfe",
    back: "Zurueck",
    productIntroTitle: "ASO-Text hinein. App Store Felder gefuellt.",
    productIntro: "TXT- oder Markdown-Pakete fuer neue Apps, Updates oder Lokalisierungen importieren und App Store Connect Metadaten ausfuellen.",
    settings: "Einstellungen",
    settingsIntro: "Lokal, transparent und leicht zu pruefen.",
    interfaceLanguage: "Oberflaechensprache",
    formatTitle: "Textformat",
    formatIntro: "Ein Feldtitel, dann der Inhalt. Markdown-Ueberschriften und Doppelpunkte funktionieren auch.",
    chooseFiles: "TXT/MD-Dateien waehlen",
    importFolder: "Ordner importieren",
    currentPack: "Aktuelles Textpaket",
    noneSelected: "Nicht ausgewaehlt",
    restorePrevious: "Wiederherstellen",
    clearLibrary: "Leeren",
    pastePlaceholder: "Strukturiertes Textpaket hier einfuegen.",
    parseSave: "Analysieren und speichern",
    fillCurrentPage: "App Store Connect Seite ausfuellen",
    emptyStatus: "Noch kein Textpaket geladen.",
    helpIntro: "Kopieren Sie den Prompt, geben Sie der KI ein Produkt und erzeugen Sie importfertige mehrsprachige TXT-Dateien.",
    aboutTitle: "Info",
    aboutBody: "Ein lokaler Helfer zum Erzeugen und Ausfuellen von App Store Connect ASO-Metadaten.",
    versionLabel: "Version",
    aiPromptTitle: "KI-ASO-Prompt",
    aiPromptIntro: "Fuegen Sie diesen Prompt in Ihr KI-Tool ein. Er erzeugt Apple-sichere ASO-Metadaten als TXT-Bloecke pro Locale.",
    copyPrompt: "KI-Prompt kopieren",
    promptCopied: "KI-Prompt kopiert.",
    promptCopyFailed: "Prompt konnte nicht kopiert werden",
    fields: "Felder",
    fieldsHint: "Wenn die automatische Zuordnung fehlschlaegt, klicken Sie ein Eingabefeld und fuellen es hier.",
    fieldsEmpty: "Analysierte Felder erscheinen hier.",
    safetyTitle: "Sicherheit",
    safetyOne: "Packpour fuellt sichtbare App Store Connect Felder erst nach Ihrem Klick.",
    safetyTwo: "Es klickt nicht auf Save, Publish oder Submit for Review.",
    safetyThree: "Passwort-, Zahlungs-, Token- und Secret-Felder werden uebersprungen.",
    fillFocused: "Fokussiertes Feld fuellen",
    copy: "Kopieren",
    termsLabel: "Nutzungsbedingungen",
    checkForUpdates: "Auf Updates pruefen",
  },
  es: {
    appName: "Packpour",
    tagline: "Genera y rellena metadatos ASO de App Store Connect.",
    help: "Ayuda",
    back: "Volver",
    productIntroTitle: "Texto ASO importado. Campos App Store listos.",
    productIntro: "Importa paquetes TXT o Markdown para apps nuevas, actualizaciones o localizaciones, y rellena metadatos de App Store Connect.",
    settings: "Ajustes",
    settingsIntro: "Extension local, transparente y facil de revisar.",
    interfaceLanguage: "Idioma de la interfaz",
    formatTitle: "Formato de texto",
    formatIntro: "Usa un titulo de campo y luego su contenido. Tambien funcionan encabezados Markdown y lineas con dos puntos.",
    chooseFiles: "Elegir TXT/MD",
    importFolder: "Importar carpeta",
    currentPack: "Paquete de texto actual",
    noneSelected: "Sin seleccionar",
    restorePrevious: "Restaurar",
    clearLibrary: "Borrar",
    pastePlaceholder: "Pega aqui un paquete de texto estructurado.",
    parseSave: "Analizar y guardar",
    fillCurrentPage: "Rellenar App Store Connect",
    emptyStatus: "No hay paquete cargado.",
    helpIntro: "Copia el prompt, dale un producto a la IA y genera archivos TXT multilingues listos para importar.",
    aboutTitle: "Acerca de",
    aboutBody: "Un asistente local para generar y rellenar metadatos ASO de App Store Connect.",
    versionLabel: "Version",
    aiPromptTitle: "Prompt ASO para IA",
    aiPromptIntro: "Pega este prompt en tu herramienta de IA. Pide metadatos ASO seguros para Apple y produce un bloque TXT por idioma.",
    copyPrompt: "Copiar prompt IA",
    promptCopied: "Prompt IA copiado.",
    promptCopyFailed: "No se pudo copiar el prompt",
    fields: "Campos",
    fieldsHint: "Si no coincide, haz clic en un campo de la pagina y rellenalo desde aqui.",
    fieldsEmpty: "Los campos analizados apareceran aqui.",
    safetyTitle: "Seguridad",
    safetyOne: "Packpour solo rellena campos visibles de App Store Connect despues de tu clic.",
    safetyTwo: "No hace clic en Save, Publish ni Submit for Review.",
    safetyThree: "Omite campos de contrasena, pago, token o secretos.",
    fillFocused: "Rellenar enfocado",
    copy: "Copiar",
    termsLabel: "Terminos",
    checkForUpdates: "Buscar actualizaciones",
  },
  pt: {
    appName: "Packpour",
    tagline: "Gere e preencha metadados ASO do App Store Connect.",
    help: "Ajuda",
    back: "Voltar",
    productIntroTitle: "Texto ASO importado. Campos da App Store preenchidos.",
    productIntro: "Importe pacotes TXT ou Markdown para novos apps, atualizacoes ou localizacoes e preencha metadados do App Store Connect.",
    settings: "Configuracoes",
    settingsIntro: "Extensao local, transparente e facil de auditar.",
    interfaceLanguage: "Idioma da interface",
    formatTitle: "Formato do texto",
    formatIntro: "Use um titulo de campo e depois o conteudo. Cabecalhos Markdown e linhas com dois-pontos tambem funcionam.",
    chooseFiles: "Escolher TXT/MD",
    importFolder: "Importar pasta",
    currentPack: "Pacote de texto atual",
    noneSelected: "Nao selecionado",
    restorePrevious: "Restaurar",
    clearLibrary: "Limpar",
    pastePlaceholder: "Cole aqui um pacote de texto estruturado.",
    parseSave: "Analisar e salvar",
    fillCurrentPage: "Preencher App Store Connect",
    emptyStatus: "Nenhum pacote carregado.",
    helpIntro: "Copie o prompt, entregue um produto para a IA e gere arquivos TXT multilingues prontos para importar.",
    aboutTitle: "Sobre",
    aboutBody: "Um assistente local para gerar e preencher metadados ASO do App Store Connect.",
    versionLabel: "Versao",
    aiPromptTitle: "Prompt ASO para IA",
    aiPromptIntro: "Cole este prompt na sua ferramenta de IA. Ele pede metadados ASO seguros para Apple e gera um bloco TXT por locale.",
    copyPrompt: "Copiar prompt de IA",
    promptCopied: "Prompt de IA copiado.",
    promptCopyFailed: "Nao foi possivel copiar o prompt",
    fields: "Campos",
    fieldsHint: "Se a correspondencia falhar, clique em um campo da pagina e preencha daqui.",
    fieldsEmpty: "Os campos analisados aparecerao aqui.",
    safetyTitle: "Seguranca",
    safetyOne: "Packpour preenche campos visiveis do App Store Connect apenas apos seu clique.",
    safetyTwo: "Nao clica em Save, Publish ou Submit for Review.",
    safetyThree: "Campos de senha, pagamento, token e segredo sao ignorados.",
    fillFocused: "Preencher focado",
    copy: "Copiar",
    termsLabel: "Termos",
    checkForUpdates: "Verificar atualizacoes",
  },
  it: {
    appName: "Packpour",
    tagline: "Genera e compila metadati ASO di App Store Connect.",
    help: "Aiuto",
    back: "Indietro",
    productIntroTitle: "Testo ASO dentro. Campi App Store compilati.",
    productIntro: "Importa pacchetti TXT o Markdown per nuove app, aggiornamenti o localizzazioni e compila i metadati di App Store Connect.",
    settings: "Impostazioni",
    settingsIntro: "Estensione locale, trasparente e facile da verificare.",
    interfaceLanguage: "Lingua interfaccia",
    formatTitle: "Formato testo",
    formatIntro: "Scrivi il titolo del campo e poi il contenuto. Funzionano anche titoli Markdown e righe con due punti.",
    chooseFiles: "Scegli TXT/MD",
    importFolder: "Importa cartella",
    currentPack: "Pacchetto testo attuale",
    noneSelected: "Nessuna selezione",
    restorePrevious: "Ripristina",
    clearLibrary: "Cancella",
    pastePlaceholder: "Incolla qui un pacchetto di testo strutturato.",
    parseSave: "Analizza e salva",
    fillCurrentPage: "Compila App Store Connect",
    emptyStatus: "Nessun pacchetto caricato.",
    helpIntro: "Copia il prompt, dai alla IA un prodotto e genera file TXT multilingue pronti da importare.",
    aboutTitle: "Informazioni",
    aboutBody: "Un assistente locale per generare e compilare metadati ASO di App Store Connect.",
    versionLabel: "Versione",
    aiPromptTitle: "Prompt ASO IA",
    aiPromptIntro: "Incolla questo prompt nel tuo strumento IA. Richiede metadati ASO sicuri per Apple e produce un blocco TXT per lingua.",
    copyPrompt: "Copia prompt IA",
    promptCopied: "Prompt IA copiato.",
    promptCopyFailed: "Impossibile copiare il prompt",
    fields: "Campi",
    fieldsHint: "Se manca una corrispondenza, fai clic su un campo nella pagina e compilalo da qui.",
    fieldsEmpty: "I campi analizzati appariranno qui.",
    safetyTitle: "Sicurezza",
    safetyOne: "Packpour compila solo campi visibili di App Store Connect dopo il tuo clic.",
    safetyTwo: "Non fa clic su Save, Publish o Submit for Review.",
    safetyThree: "Campi password, pagamento, token o secret vengono saltati.",
    fillFocused: "Compila campo attivo",
    copy: "Copia",
    termsLabel: "Termini",
    checkForUpdates: "Controlla aggiornamenti",
  },
  nl: {
    appName: "Packpour",
    tagline: "Maak en vul App Store Connect ASO-metadata.",
    help: "Help",
    back: "Terug",
    productIntroTitle: "ASO-tekst erin. App Store velden gevuld.",
    productIntro: "Importeer TXT- of Markdown-pakketten voor nieuwe apps, updates of lokalisaties en vul App Store Connect metadata.",
    settings: "Instellingen",
    settingsIntro: "Lokaal, transparant en eenvoudig te controleren.",
    interfaceLanguage: "Interfacetaal",
    formatTitle: "Tekstformaat",
    formatIntro: "Gebruik een veldtitel en daarna de inhoud. Markdown-koppen en dubbelepuntregels werken ook.",
    chooseFiles: "TXT/MD kiezen",
    importFolder: "Map importeren",
    currentPack: "Huidig tekstpakket",
    noneSelected: "Niet geselecteerd",
    restorePrevious: "Herstellen",
    clearLibrary: "Wissen",
    pastePlaceholder: "Plak hier een gestructureerd tekstpakket.",
    parseSave: "Lezen en opslaan",
    fillCurrentPage: "App Store Connect invullen",
    emptyStatus: "Nog geen tekstpakket geladen.",
    helpIntro: "Kopieer de prompt, geef AI een product en maak meertalige TXT-bestanden die klaar zijn om te importeren.",
    aboutTitle: "Over",
    aboutBody: "Een lokale helper voor het maken en invullen van App Store Connect ASO-metadata.",
    versionLabel: "Versie",
    aiPromptTitle: "AI ASO prompt",
    aiPromptIntro: "Plak deze prompt in je AI-tool. Hij vraagt Apple-veilige ASO-metadata en maakt per locale een TXT-blok.",
    copyPrompt: "AI-prompt kopieren",
    promptCopied: "AI-prompt gekopieerd.",
    promptCopyFailed: "Prompt kon niet worden gekopieerd",
    fields: "Velden",
    fieldsHint: "Als automatisch matchen mist, klik een invoerveld op de pagina en vul het hier.",
    fieldsEmpty: "Gelezen velden verschijnen hier.",
    safetyTitle: "Veiligheid",
    safetyOne: "Packpour vult alleen zichtbare App Store Connect-velden na je klik.",
    safetyTwo: "Het klikt niet op Save, Publish of Submit for Review.",
    safetyThree: "Wachtwoord-, betaal-, token- en secret-velden worden overgeslagen.",
    fillFocused: "Actief veld vullen",
    copy: "Kopieren",
    termsLabel: "Voorwaarden",
    checkForUpdates: "Controleer op updates",
  },
  ar: {
    appName: "Packpour",
    tagline: "إنشاء وتعبئة بيانات ASO في App Store Connect.",
    help: "مساعدة",
    back: "رجوع",
    productIntroTitle: "أدخل نص ASO، واملأ حقول App Store.",
    productIntro: "استورد حزم TXT أو Markdown للتطبيقات الجديدة أو التحديثات أو التوطين، ثم املأ بيانات App Store Connect.",
    settings: "الإعدادات",
    settingsIntro: "إضافة محلية وشفافة وسهلة المراجعة.",
    interfaceLanguage: "لغة الواجهة",
    formatTitle: "تنسيق النص",
    formatIntro: "اكتب عنوان الحقل ثم المحتوى. تعمل عناوين Markdown والأسطر التي تحتوي على نقطتين أيضا.",
    chooseFiles: "اختر ملفات TXT/MD",
    importFolder: "استيراد مجلد",
    currentPack: "حزمة النص الحالية",
    noneSelected: "غير محدد",
    restorePrevious: "استعادة السابق",
    clearLibrary: "مسح",
    pastePlaceholder: "الصق حزمة نص منظمة هنا.",
    parseSave: "تحليل وحفظ",
    fillCurrentPage: "ملء صفحة App Store Connect",
    emptyStatus: "لم يتم تحميل أي حزمة نص.",
    helpIntro: "انسخ الموجه، وقدّم منتجا واحدا للذكاء الاصطناعي، ثم أنشئ ملفات TXT متعددة اللغات جاهزة للاستيراد.",
    aboutTitle: "حول",
    aboutBody: "مساعد محلي لإنشاء وتعبئة بيانات ASO في App Store Connect.",
    versionLabel: "الإصدار",
    aiPromptTitle: "موجه ASO للذكاء الاصطناعي",
    aiPromptIntro: "الصق هذا الموجه في أداة الذكاء الاصطناعي. سيطلب بيانات ASO آمنة وفق قواعد Apple ويخرج كتلة TXT لكل لغة.",
    copyPrompt: "نسخ موجه الذكاء الاصطناعي",
    promptCopied: "تم نسخ موجه الذكاء الاصطناعي.",
    promptCopyFailed: "تعذر نسخ الموجه",
    fields: "الحقول",
    fieldsHint: "إذا فشل التطابق، انقر حقل إدخال في الصفحة ثم املأه من هنا.",
    fieldsEmpty: "ستظهر الحقول المحللة هنا.",
    safetyTitle: "الأمان",
    safetyOne: "يملأ Packpour حقول App Store Connect المرئية فقط بعد النقر.",
    safetyTwo: "لا ينقر Save أو Publish أو Submit for Review.",
    safetyThree: "يتم تخطي حقول كلمات المرور والدفع والرموز والأسرار.",
    fillFocused: "ملء الحقل المحدد",
    copy: "نسخ",
    termsLabel: "الشروط",
    checkForUpdates: "البحث عن تحديثات",
  },
  he: {
    appName: "Packpour",
    tagline: "יצירה ומילוי של מטא-דאטה ASO ב-App Store Connect.",
    help: "עזרה",
    back: "חזרה",
    productIntroTitle: "טקסט ASO נכנס. שדות App Store מתמלאים.",
    productIntro: "ייבאו חבילות TXT או Markdown לאפליקציות חדשות, עדכונים או לוקליזציה, ומלאו מטא-דאטה ב-App Store Connect.",
    settings: "הגדרות",
    settingsIntro: "תוסף מקומי, שקוף וקל לבדיקה.",
    interfaceLanguage: "שפת ממשק",
    formatTitle: "פורמט טקסט",
    formatIntro: "כתבו כותרת שדה ואז את התוכן. גם כותרות Markdown ושורות עם נקודתיים נתמכות.",
    chooseFiles: "בחר TXT/MD",
    importFolder: "ייבוא תיקייה",
    currentPack: "חבילת הטקסט הנוכחית",
    noneSelected: "לא נבחר",
    restorePrevious: "שחזור קודם",
    clearLibrary: "ניקוי",
    pastePlaceholder: "הדביקו כאן חבילת טקסט מובנית.",
    parseSave: "פענוח ושמירה",
    fillCurrentPage: "מילוי App Store Connect",
    emptyStatus: "לא נטענה חבילת טקסט.",
    helpIntro: "העתיקו את הפרומפט, תנו ל-AI מוצר אחד, וצרו קובצי TXT רב-לשוניים מוכנים לייבוא.",
    aboutTitle: "אודות",
    aboutBody: "כלי מקומי ליצירה ומילוי של מטא-דאטה ASO ב-App Store Connect.",
    versionLabel: "גרסה",
    aiPromptTitle: "פרומפט AI ל-ASO",
    aiPromptIntro: "הדביקו את הפרומפט בכלי ה-AI שלכם. הוא מבקש מטא-דאטה ASO בטוח ל-Apple ומפיק בלוק TXT לכל שפה.",
    copyPrompt: "העתקת פרומפט AI",
    promptCopied: "פרומפט AI הועתק.",
    promptCopyFailed: "לא ניתן היה להעתיק את הפרומפט",
    fields: "שדות",
    fieldsHint: "אם ההתאמה נכשלה, לחצו על שדה בעמוד ואז מלאו מכאן.",
    fieldsEmpty: "השדות שזוהו יופיעו כאן.",
    safetyTitle: "בטיחות",
    safetyOne: "Packpour ממלא רק שדות גלויים של App Store Connect לאחר לחיצה.",
    safetyTwo: "הוא לא לוחץ Save, Publish או Submit for Review.",
    safetyThree: "שדות סיסמה, תשלום, token ו-secret ידולגו.",
    fillFocused: "מילוי השדה הפעיל",
    copy: "העתקה",
    termsLabel: "תנאים",
    checkForUpdates: "בדיקת עדכונים",
  },
};

const RUNTIME_TRANSLATIONS = {
  en: {
    countChars: "chars",
    countBytes: "bytes",
    noFilesSelected: "No files selected.",
    folderImportUnsupported: "Safe folder import is not available in this Chrome. Use Choose TXT/MD files instead.",
    noTopLevelTextFiles: "No top-level TXT or Markdown files were found in that folder.",
    folderImportCancelled: "Folder import cancelled.",
    folderImportFailed: "Folder import failed: {message}",
    importMetadataFirst: "Import an App Store metadata text pack first.",
    noActiveTab: "No active tab found.",
    openAscFirst: "Open App Store Connect first: appstoreconnect.apple.com/apps",
    pageDidNotRespond: "The page did not respond. Reload it or open the extension from that tab.",
    fillSummaryFilled: "filled {count}: {names}",
    fillSummaryMissed: "missed {count}: {names}",
    fillSummarySkipped: "skipped {count} sensitive field(s)",
    noMatchingEditableFields: "No matching editable fields found.",
    fillFailed: "Fill failed: {message}",
    fieldHasNoValue: "{field} has no value.",
    noFocusedEditableField: "No focused editable field was found.",
    focusedFieldFilled: "{field} filled into the focused field.",
    focusedFillFailed: "Focused fill failed: {message}",
    fieldCopied: "{field} copied.",
    copyFailed: "Copy failed: {message}",
    noValidFilesImported: "No valid TXT or Markdown files were imported.",
    noValidTextPacksImported: "No valid text packs were imported.",
    importSummary: "Imported {count} text pack(s).",
    importSkippedPrefix: "Skipped {count}: {reasons}.",
    importSkippedNonText: "{count} non-text",
    importSkippedLarge: "{count} too large",
    importSkippedFileLimit: "{count} over file limit",
    importSkippedTotalSize: "{count} over total size",
    importSkippedNested: "{count} nested folder(s)",
    pastedTextLabel: "Pasted text",
    restoredTextPacks: "Restored {count} text pack(s).",
    libraryCleared: "Library cleared.",
    clickVisibleEditableFieldFirst: "Click a visible editable field first.",
    skippedSensitiveField: "Packpour skipped this field because it looks sensitive.",
    checkingUpdate: "Checking for updates…",
    alreadyLatest: "Already up to date (v{version}).",
    updateAvailable: "Update available: v{version}. See the GitHub link above.",
    updateRateLimited: "Too many requests. Please try again later.",
    updateCheckFailed: "Update check failed: {message}",
  },
  "zh-Hans": {
    countChars: "字符",
    countBytes: "字节",
    noFilesSelected: "未选择文件。",
    folderImportUnsupported: "当前 Chrome 不支持安全文件夹导入，请改用“选择 TXT/MD 文件”。",
    noTopLevelTextFiles: "这个文件夹的顶层没有找到 TXT 或 Markdown 文件。",
    folderImportCancelled: "已取消文件夹导入。",
    folderImportFailed: "文件夹导入失败：{message}",
    importMetadataFirst: "请先导入一份 App Store 元数据文本包。",
    noActiveTab: "没有找到当前活动标签页。",
    openAscFirst: "请先打开 App Store Connect：appstoreconnect.apple.com/apps",
    pageDidNotRespond: "页面没有响应。请刷新页面，或从当前标签页重新打开扩展。",
    fillSummaryFilled: "已填写 {count} 项：{names}",
    fillSummaryMissed: "未匹配 {count} 项：{names}",
    fillSummarySkipped: "已跳过 {count} 个敏感字段",
    noMatchingEditableFields: "没有找到可匹配的可编辑字段。",
    fillFailed: "填写失败：{message}",
    fieldHasNoValue: "{field} 没有可填写的值。",
    noFocusedEditableField: "没有找到当前聚焦的可编辑字段。",
    focusedFieldFilled: "{field} 已填入当前聚焦字段。",
    focusedFillFailed: "聚焦字段填写失败：{message}",
    fieldCopied: "{field} 已复制。",
    copyFailed: "复制失败：{message}",
    noValidFilesImported: "没有导入有效的 TXT 或 Markdown 文件。",
    noValidTextPacksImported: "没有导入有效的文本包。",
    importSummary: "已导入 {count} 个文本包。",
    importSkippedPrefix: "已跳过 {count} 个：{reasons}。",
    importSkippedNonText: "{count} 个非文本文件",
    importSkippedLarge: "{count} 个文件过大",
    importSkippedFileLimit: "{count} 个超出文件数量限制",
    importSkippedTotalSize: "{count} 个超出总大小限制",
    importSkippedNested: "{count} 个嵌套文件夹",
    pastedTextLabel: "粘贴的文本",
    restoredTextPacks: "已恢复 {count} 个文本包。",
    libraryCleared: "文本库已清空。",
    clickVisibleEditableFieldFirst: "请先点击页面中一个可见的可编辑字段。",
    skippedSensitiveField: "这个字段看起来像敏感字段，Packpour 已跳过。",
    checkingUpdate: "正在检查更新…",
    alreadyLatest: "已是最新版本（v{version}）。",
    updateAvailable: "发现新版本：v{version}，请前往 GitHub 下载。",
    updateRateLimited: "请求过于频繁，请稍后再试。",
    updateCheckFailed: "检查更新失败：{message}",
  },
  "zh-Hant": {
    countChars: "字元",
    countBytes: "位元組",
    noFilesSelected: "尚未選擇檔案。",
    folderImportUnsupported: "目前的 Chrome 不支援安全資料夾匯入，請改用「選擇 TXT/MD 檔案」。",
    noTopLevelTextFiles: "這個資料夾頂層沒有找到 TXT 或 Markdown 檔案。",
    folderImportCancelled: "已取消資料夾匯入。",
    folderImportFailed: "資料夾匯入失敗：{message}",
    importMetadataFirst: "請先匯入一份 App Store 中介資料文字包。",
    noActiveTab: "找不到目前作用中的分頁。",
    openAscFirst: "請先打開 App Store Connect：appstoreconnect.apple.com/apps",
    pageDidNotRespond: "頁面沒有回應。請重新整理頁面，或從目前分頁重新開啟擴充功能。",
    fillSummaryFilled: "已填寫 {count} 項：{names}",
    fillSummaryMissed: "未匹配 {count} 項：{names}",
    fillSummarySkipped: "已跳過 {count} 個敏感欄位",
    noMatchingEditableFields: "沒有找到可匹配的可編輯欄位。",
    fillFailed: "填寫失敗：{message}",
    fieldHasNoValue: "{field} 沒有可填寫的值。",
    noFocusedEditableField: "沒有找到目前聚焦的可編輯欄位。",
    focusedFieldFilled: "{field} 已填入目前聚焦欄位。",
    focusedFillFailed: "聚焦欄位填寫失敗：{message}",
    fieldCopied: "{field} 已複製。",
    copyFailed: "複製失敗：{message}",
    noValidFilesImported: "沒有匯入有效的 TXT 或 Markdown 檔案。",
    noValidTextPacksImported: "沒有匯入有效的文字包。",
    importSummary: "已匯入 {count} 個文字包。",
    importSkippedPrefix: "已跳過 {count} 個：{reasons}。",
    importSkippedNonText: "{count} 個非文字檔",
    importSkippedLarge: "{count} 個檔案過大",
    importSkippedFileLimit: "{count} 個超出檔案數量限制",
    importSkippedTotalSize: "{count} 個超出總大小限制",
    importSkippedNested: "{count} 個巢狀資料夾",
    pastedTextLabel: "貼上的文字",
    restoredTextPacks: "已恢復 {count} 個文字包。",
    libraryCleared: "文字庫已清空。",
    clickVisibleEditableFieldFirst: "請先點擊頁面中一個可見的可編輯欄位。",
    skippedSensitiveField: "這個欄位看起來像敏感欄位，Packpour 已跳過。",
    checkingUpdate: "正在檢查更新…",
    alreadyLatest: "已是最新版本（v{version}）。",
    updateAvailable: "發現新版本：v{version}，請前往 GitHub 下載。",
    updateRateLimited: "請求過於頻繁，請稍後再試。",
    updateCheckFailed: "檢查更新失敗：{message}",
  },
};

const fileInput = document.querySelector("#fileInput");
const folderButton = document.querySelector("#folderButton");
const packSelect = document.querySelector("#packSelect");
const uiLanguageSelect = document.querySelector("#uiLanguageSelect");
const autofillButton = document.querySelector("#autofillButton");
const restoreButton = document.querySelector("#restoreButton");
const clearButton = document.querySelector("#clearButton");
const settingsButton = document.querySelector("#settingsButton");
const helpButton = document.querySelector("#helpButton");
const copyPromptButton = document.querySelector("#copyPromptButton");
const aiPromptText = document.querySelector("#aiPromptText");
const mainView = document.querySelector("#mainView");
const settingsView = document.querySelector("#settingsView");
const helpView = document.querySelector("#helpView");
const versionText = document.querySelector("#versionText");
const settingsVersionText = document.querySelector("#settingsVersionText");
const homepageLink = document.querySelector("#homepageLink");
const githubLink = document.querySelector("#githubLink");
const supportLink = document.querySelector("#supportLink");
const privacyLink = document.querySelector("#privacyLink");
const termsLink = document.querySelector("#termsLink");
const checkUpdateButton = document.querySelector("#checkUpdateButton");
const statusText = document.querySelector("#statusText");
const fieldsList = document.querySelector("#fieldsList");
const fieldRowTemplate = document.querySelector("#fieldRowTemplate");

let library = {};
let currentPackKey = "";
let currentFields = {};
let currentFieldOrder = [];
let uiLanguage = "en";

init();

async function init() {
  renderUiLanguageOptions();
  renderVersion();
  renderExternalLinks();
  renderAiPrompt();
  fileInput.addEventListener("change", onFilesSelected);
  folderButton.addEventListener("click", onFolderImportClicked);
  packSelect.addEventListener("change", onPackChanged);
  uiLanguageSelect.addEventListener("change", onUiLanguageChanged);
  autofillButton.addEventListener("click", onAutofillClicked);
  restoreButton.addEventListener("click", restoreSavedLibrary);
  clearButton.addEventListener("click", clearLibrary);
  settingsButton.addEventListener("click", () => showView("settings"));
  helpButton.addEventListener("click", () => showView("help"));
  copyPromptButton.addEventListener("click", copyAiPrompt);
  checkUpdateButton.addEventListener("click", checkForUpdates);
  for (const button of document.querySelectorAll("[data-view-back]")) {
    button.addEventListener("click", () => showView("main"));
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (!settingsView.hidden || !helpView.hidden)) {
      showView("main");
    }
  });
  await restoreUiLanguage();
  await restoreSavedLibrary();
}

function showView(name) {
  mainView.hidden = name !== "main";
  settingsView.hidden = name !== "settings";
  helpView.hidden = name !== "help";
}

function renderVersion() {
  const version = chrome.runtime.getManifest().version;
  versionText.textContent = `v${version}`;
  settingsVersionText.textContent = version;
}

function renderAiPrompt() {
  aiPromptText.textContent = AI_PROMPT_TEXT;
}

function renderExternalLinks() {
  setExternalLink(homepageLink, PROJECT_SITE_URL, "hooosberg.com/apps/packpour/");
  setExternalLink(githubLink, PROJECT_REPO_URL, "hooosberg/Packpour");
  setExternalLink(supportLink, PROJECT_SUPPORT_URL, "support.html");
  setExternalLink(privacyLink, PROJECT_PRIVACY_URL, "privacy.html");
  setExternalLink(termsLink, PROJECT_TERMS_URL, "terms.html");
}

function setExternalLink(node, href, label) {
  if (!node) {
    return;
  }
  node.href = href;
  node.textContent = label;
}

async function copyAiPrompt() {
  try {
    await navigator.clipboard.writeText(AI_PROMPT_TEXT);
    copyPromptButton.textContent = translate("promptCopied");
    window.setTimeout(() => {
      copyPromptButton.textContent = translate("copyPrompt");
    }, 1600);
    setStatus(translate("promptCopied"), "ok");
  } catch (error) {
    setStatus(`${translate("promptCopyFailed")}: ${error.message}`, "error");
  }
}

async function onUiLanguageChanged(event) {
  const selected = event.target.value || "auto";
  await chrome.storage.local.set({ [STORAGE_UI_LANGUAGE_KEY]: selected });
  uiLanguage = resolveUiLanguage(selected);
  applyTranslations();
}

async function restoreUiLanguage() {
  const saved = await chrome.storage.local.get([STORAGE_UI_LANGUAGE_KEY]);
  const selected = saved[STORAGE_UI_LANGUAGE_KEY] || "auto";
  uiLanguageSelect.value = selected;
  uiLanguage = resolveUiLanguage(selected);
  applyTranslations();
}

function resolveUiLanguage(selected) {
  if (selected && selected !== "auto") {
    return TRANSLATIONS[selected] ? selected : "en";
  }

  const browserLanguage = (navigator.language || "en").toLowerCase();
  if (browserLanguage.startsWith("zh-tw") || browserLanguage.startsWith("zh-hk")) {
    return "zh-Hant";
  }
  if (browserLanguage.startsWith("zh")) {
    return "zh-Hans";
  }
  const shortCode = browserLanguage.split("-")[0];
  return TRANSLATIONS[shortCode] ? shortCode : "en";
}

function translate(key, replacements = {}) {
  const template =
    TRANSLATIONS[uiLanguage]?.[key] ||
    RUNTIME_TRANSLATIONS[uiLanguage]?.[key] ||
    TRANSLATIONS.en[key] ||
    RUNTIME_TRANSLATIONS.en[key] ||
    key;

  return String(template).replace(/\{(\w+)\}/g, (_match, name) =>
    Object.prototype.hasOwnProperty.call(replacements, name) ? replacements[name] : `{${name}}`,
  );
}

function applyTranslations() {
  document.documentElement.lang = uiLanguage === "zh-Hans" ? "zh-CN" : uiLanguage;
  document.documentElement.dir = ["ar", "he"].includes(uiLanguage) ? "rtl" : "ltr";
  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = translate(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    node.setAttribute("placeholder", translate(node.dataset.i18nPlaceholder));
  }
  for (const node of document.querySelectorAll("[data-i18n-title]")) {
    node.setAttribute("title", translate(node.dataset.i18nTitle));
  }
  renderFields();
}

function renderUiLanguageOptions() {
  uiLanguageSelect.innerHTML = "";
  for (const [value, label] of UI_LANGUAGE_OPTIONS) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    uiLanguageSelect.appendChild(option);
  }
}

async function onFilesSelected(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = "";

  if (!files.length) {
    setStatus(translate("noFilesSelected"), "warn");
    return;
  }

  await importFiles(files);
}

async function onFolderImportClicked() {
  if (!window.showDirectoryPicker) {
    setStatus(translate("folderImportUnsupported"), "warn");
    return;
  }

  try {
    const directory = await window.showDirectoryPicker({ mode: "read" });
    const files = [];
    let skippedNested = 0;
    let scannedEntries = 0;

    for await (const entry of directory.values()) {
      scannedEntries += 1;
      if (entry.kind === "file") {
        if (!/\.(txt|md)$/i.test(entry.name)) {
          continue;
        }
        const file = await entry.getFile();
        files.push(file);
      } else {
        skippedNested += 1;
      }

      if (files.length >= MAX_IMPORT_FILES || scannedEntries >= MAX_DIRECTORY_ENTRIES_SCANNED) {
        break;
      }
    }

    if (!files.length) {
      setStatus(translate("noTopLevelTextFiles"), "warn");
      return;
    }

    await importFiles(files, {
      source: "folder",
      extraSkipped: skippedNested,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      setStatus(translate("folderImportCancelled"), "warn");
      return;
    }
    setStatus(translate("folderImportFailed", { message: error.message }), "error");
  }
}

function onPackChanged(event) {
  setCurrentPack(event.target.value, { persist: true });
}

async function onAutofillClicked() {
  if (!currentPackKey || !Object.keys(currentFields).length) {
    setStatus(translate("importMetadataFirst"), "warn");
    return;
  }

  setBusy(true);
  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      setStatus(translate("noActiveTab"), "error");
      return;
    }

    if (!isFillableTab(tab)) {
      setStatus(translate("openAscFirst"), "warn");
      return;
    }

    const response = await sendMessageToTabWithRetry(tab.id, {
      type: "LAUNCHPASTE_FILL_VISIBLE_FIELDS",
      payload: currentFields,
    });

    if (!response) {
      setStatus(translate("pageDidNotRespond"), "error");
      return;
    }

    setStatus(buildFillStatus(response), response.filled?.length ? "ok" : "warn");
  } catch (error) {
    setStatus(translate("fillFailed", { message: error.message }), "error");
  } finally {
    setBusy(false);
  }
}

function setBusy(busy) {
  autofillButton.disabled = busy;
  folderButton.disabled = busy;
  fileInput.disabled = busy;
}

async function fillFocusedField(fieldName) {
  const value = currentFields[fieldName];
  if (!value) {
    setStatus(translate("fieldHasNoValue", { field: fieldName }), "warn");
    return;
  }

  const tab = await getActiveTab();
  if (!tab?.id || !isFillableTab(tab)) {
    setStatus(translate("openAscFirst"), "warn");
    return;
  }

  try {
    const response = await sendMessageToTabWithRetry(tab.id, {
      type: "LAUNCHPASTE_FILL_FOCUSED_FIELD",
      fieldName,
      value,
    });

    if (!response?.ok) {
      setStatus(translateResponseMessage(response, "noFocusedEditableField"), "warn");
      return;
    }

    setStatus(translate("focusedFieldFilled", { field: fieldName }), "ok");
  } catch (error) {
    setStatus(translate("focusedFillFailed", { message: error.message }), "error");
  }
}

async function copyFieldValue(fieldName) {
  const value = currentFields[fieldName];
  if (!value) {
    setStatus(translate("fieldHasNoValue", { field: fieldName }), "warn");
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    setStatus(translate("fieldCopied", { field: fieldName }), "ok");
  } catch (error) {
    setStatus(translate("copyFailed", { message: error.message }), "error");
  }
}

async function importFiles(files, options = {}) {
  setBusy(true);
  try {
    const prepared = prepareImportFiles(files, options);
    if (!prepared.files.length) {
      setStatus(translate("noValidFilesImported"), "warn");
      return;
    }

    const nextLibrary = { ...library };
    const importedKeys = [];

    for (const file of prepared.files) {
      const text = (await file.text()).trim();
      if (!text) {
        continue;
      }

      const entry = buildEntryFromText(text, file.name);
      nextLibrary[entry.packKey] = entry;
      importedKeys.push(entry.packKey);
    }

    if (!importedKeys.length) {
      setStatus(translate("noValidTextPacksImported"), "warn");
      return;
    }

    library = nextLibrary;
    const preferredKey =
      (currentPackKey && importedKeys.includes(currentPackKey) ? currentPackKey : "") ||
      importedKeys[0];

    await persistLibrary(preferredKey);
    renderPackOptions(preferredKey);
    setCurrentPack(preferredKey, { persist: false });
    setStatus(buildImportStatus(importedKeys.length, prepared), "ok");
  } finally {
    setBusy(false);
  }
}

function prepareImportFiles(files, options = {}) {
  const accepted = [];
  const stats = {
    skippedType: 0,
    skippedLarge: 0,
    skippedLimit: 0,
    skippedTotal: 0,
    skippedNested: options.extraSkipped || 0,
    totalBytes: 0,
  };

  for (const file of files) {
    if (!isTextPackFile(file)) {
      stats.skippedType += 1;
      continue;
    }

    if (file.size > MAX_IMPORT_FILE_BYTES) {
      stats.skippedLarge += 1;
      continue;
    }

    if (accepted.length >= MAX_IMPORT_FILES) {
      stats.skippedLimit += 1;
      continue;
    }

    if (stats.totalBytes + file.size > MAX_IMPORT_TOTAL_BYTES) {
      stats.skippedTotal += 1;
      continue;
    }

    accepted.push(file);
    stats.totalBytes += file.size;
  }

  return { files: accepted, stats };
}

function isTextPackFile(file) {
  return /\.(txt|md)$/i.test(file.name) || /^(text\/plain|text\/markdown)$/i.test(file.type || "");
}

function buildImportStatus(importedCount, prepared) {
  const parts = [translate("importSummary", { count: importedCount })];
  const { stats } = prepared;
  const skipped =
    stats.skippedType +
    stats.skippedLarge +
    stats.skippedLimit +
    stats.skippedTotal +
    stats.skippedNested;

  if (skipped) {
    const reasons = [];
    if (stats.skippedType) {
      reasons.push(translate("importSkippedNonText", { count: stats.skippedType }));
    }
    if (stats.skippedLarge) {
      reasons.push(translate("importSkippedLarge", { count: stats.skippedLarge }));
    }
    if (stats.skippedLimit) {
      reasons.push(translate("importSkippedFileLimit", { count: stats.skippedLimit }));
    }
    if (stats.skippedTotal) {
      reasons.push(translate("importSkippedTotalSize", { count: stats.skippedTotal }));
    }
    if (stats.skippedNested) {
      reasons.push(translate("importSkippedNested", { count: stats.skippedNested }));
    }
    parts.push(translate("importSkippedPrefix", { count: skipped, reasons: reasons.join(", ") }));
  }

  return parts.join(" ");
}

function buildEntryFromText(text, fileName = "") {
  const trimmed = text.trim();
  const parsed = parseStructuredText(trimmed);
  const packLabel = fileName || translate("pastedTextLabel");
  const packKey = fileName ? `file:${fileName}` : `manual:${Date.now()}`;

  return {
    packKey,
    packLabel,
    fileName,
    rawText: trimmed,
    fields: parsed.fields,
    fieldOrder: parsed.fieldOrder,
  };
}

function parseStructuredText(content) {
  const lines = content.split(/\r?\n/);
  const fields = {};
  const fieldOrder = [];
  const meta = {};
  let currentField = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) {
      continue;
    }

    const metaMatch = /^locale\s*:\s*(.+)$/i.exec(trimmed);
    if (metaMatch) {
      meta.locale = metaMatch[1].trim();
      continue;
    }

    const fileMatch = /^file\s*:\s*(.+)$/i.exec(trimmed);
    if (fileMatch) {
      meta.file = fileMatch[1].trim();
      continue;
    }

    const declaration = parseFieldDeclaration(trimmed);
    if (declaration) {
      currentField = declaration.fieldName;
      if (!fields[currentField]) {
        fields[currentField] = [];
        fieldOrder.push(currentField);
      }
      if (declaration.initialValue) {
        fields[currentField].push(declaration.initialValue);
      }
      continue;
    }

    if (currentField) {
      fields[currentField].push(line);
    }
  }

  const normalizedFields = {};
  for (const fieldName of fieldOrder) {
    const value = (fields[fieldName] || []).join("\n").trim();
    if (value) {
      normalizedFields[fieldName] = value;
    }
  }

  return {
    meta,
    fields: normalizedFields,
    fieldOrder: fieldOrder.filter((fieldName) => normalizedFields[fieldName]),
  };
}

function parseFieldDeclaration(trimmed) {
  if (!trimmed) {
    return null;
  }

  // URLs and protocol-like values must NEVER be parsed as `key:value` field
  // declarations. A bare line like `https://example.com` would otherwise be
  // split into key="https", value="//example.com", spawning a phantom
  // "HTTPS" field that swallows the real Support URL / Marketing URL /
  // Privacy Policy URL values that follow.
  if (looksLikeUrlOrProtocol(trimmed)) {
    return null;
  }

  const heading = /^#{1,4}\s+(.+?)\s*$/.exec(trimmed);
  if (heading && looksLikeFieldName(heading[1], { allowLoose: true })) {
    return { fieldName: canonicalFieldName(heading[1]), initialValue: "" };
  }

  const colon = /^(.{2,80}?)\s*:\s*(.*)$/.exec(trimmed);
  if (colon && looksLikeFieldName(colon[1], { allowLoose: true }) && !looksLikeUrlOrProtocol(colon[2])) {
    return {
      fieldName: canonicalFieldName(colon[1]),
      initialValue: colon[2].trim(),
    };
  }

  if (looksLikeStandaloneFieldName(trimmed)) {
    return { fieldName: canonicalFieldName(trimmed), initialValue: "" };
  }

  return null;
}

// Detects URL-shaped lines (http:, https:, ftp:, mailto:, file:, tel:, etc.)
// and bare scheme-relative URLs (//example.com). Used to short-circuit the
// `key:value` field-declaration parsing so URL bodies like
// `https://hooosberg.github.io/Rushi/privacy.html` don't get misread as a
// field named "HTTPS" with value "//hooosberg.github.io/...".
function looksLikeUrlOrProtocol(value) {
  const cleaned = String(value || "").trim();
  if (!cleaned) return false;
  if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(cleaned)) return true;
  if (/^(?:mailto|tel|sms|file|data):/i.test(cleaned)) return true;
  if (cleaned.startsWith("//")) return true;
  return false;
}

function looksLikeStandaloneFieldName(value) {
  const cleaned = String(value || "").trim();
  const normalized = normalizeFieldLookup(cleaned);
  return Boolean(FIELD_CANONICAL[normalized]) || (
    cleaned.length <= 80 &&
    /^[A-Z0-9][A-Z0-9\s'’&/().-]{1,79}$/.test(cleaned) &&
    /[A-Z]/.test(cleaned)
  );
}

function looksLikeFieldName(value, options = {}) {
  const cleaned = String(value || "").trim();
  if (!cleaned || cleaned.length > 80) {
    return false;
  }

  const normalized = normalizeFieldLookup(cleaned);
  if (FIELD_CANONICAL[normalized]) {
    return true;
  }

  if (/^[A-Z0-9][A-Z0-9\s'’&/().-]{1,79}$/.test(cleaned) && /[A-Z]/.test(cleaned)) {
    return true;
  }

  if (!options.allowLoose) {
    return false;
  }

  const words = cleaned.split(/\s+/);
  return words.length <= 5 && /^[\p{L}0-9][\p{L}0-9\s'’&/().-]+$/u.test(cleaned);
}

function canonicalFieldName(value) {
  const cleaned = String(value || "").replace(/^#+\s*/, "").trim();
  return FIELD_CANONICAL[normalizeFieldLookup(cleaned)] || cleaned.toUpperCase();
}

function normalizeFieldLookup(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderPackOptions(selectedKey = "") {
  packSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = Object.keys(library).length ? translate("noneSelected") : translate("noneSelected");
  packSelect.appendChild(placeholder);

  const entries = Object.values(library).sort((left, right) =>
    left.packLabel.localeCompare(right.packLabel, "en"),
  );

  for (const entry of entries) {
    const option = document.createElement("option");
    option.value = entry.packKey;
    option.textContent = entry.packLabel;
    if (entry.packKey === selectedKey) {
      option.selected = true;
    }
    packSelect.appendChild(option);
  }
}

function setCurrentPack(packKey, options = {}) {
  currentPackKey = packKey || "";
  const entry = currentPackKey ? library[currentPackKey] : null;

  currentFields = entry?.fields || {};
  currentFieldOrder = entry?.fieldOrder || Object.keys(currentFields);
  if (packSelect.value !== currentPackKey) {
    packSelect.value = currentPackKey;
  }

  renderFields();

  if (options.persist) {
    persistLibrary(currentPackKey);
  }
}

function renderFields() {
  fieldsList.innerHTML = "";
  const orderedFields = orderFields(currentFields, currentFieldOrder);

  if (!orderedFields.length) {
    fieldsList.classList.add("empty");
    fieldsList.innerHTML = `<p>${translate("fieldsEmpty")}</p>`;
    return;
  }

  fieldsList.classList.remove("empty");

  for (const fieldName of orderedFields) {
    const node = fieldRowTemplate.content.firstElementChild.cloneNode(true);
    const value = currentFields[fieldName];
    node.querySelector(".field-name").textContent = fieldName;
    node.querySelector(".field-count").textContent = formatFieldCount(fieldName, value);
    node.querySelector(".fill-focused").textContent = translate("fillFocused");
    node.querySelector(".copy-value").textContent = translate("copy");
    node.querySelector(".fill-focused").addEventListener("click", () => fillFocusedField(fieldName));
    node.querySelector(".copy-value").addEventListener("click", () => copyFieldValue(fieldName));
    fieldsList.appendChild(node);
  }
}

function orderFields(fields, fieldOrder) {
  const names = Object.keys(fields);
  const known = KNOWN_FIELD_ORDER.filter((fieldName) => names.includes(fieldName));
  const parsed = fieldOrder.filter((fieldName) => names.includes(fieldName) && !known.includes(fieldName));
  const rest = names.filter((fieldName) => !known.includes(fieldName) && !parsed.includes(fieldName));
  return [...known, ...parsed, ...rest];
}

function formatFieldCount(fieldName, value) {
  const rule = FIELD_LIMITS[fieldName];
  if (!rule) {
    return `${value.length} ${translate("countChars")}`;
  }
  const count = rule.mode === "bytes" ? new TextEncoder().encode(value).length : value.length;
  return `${count}/${rule.limit} ${translate(rule.mode === "bytes" ? "countBytes" : "countChars")}`;
}

function buildFillStatus(response) {
  const parts = [`${library[currentPackKey]?.packLabel || currentPackKey}`];
  if (response.filled?.length) {
    parts.push(
      translate("fillSummaryFilled", {
        count: response.filled.length,
        names: response.filled.join(", "),
      }),
    );
  }
  if (response.missing?.length) {
    parts.push(
      translate("fillSummaryMissed", {
        count: response.missing.length,
        names: response.missing.join(", "),
      }),
    );
  }
  if (response.skipped?.length) {
    parts.push(translate("fillSummarySkipped", { count: response.skipped.length }));
  }

  return parts.join(" | ") || translate("noMatchingEditableFields");
}

function translateResponseMessage(response, fallbackKey) {
  if (response?.messageKey) {
    return translate(response.messageKey);
  }
  if (response?.message) {
    return response.message;
  }
  return translate(fallbackKey);
}

function setStatus(message, level = "") {
  statusText.textContent = message;
  statusText.className = `status ${level}`.trim();
}

async function restoreSavedLibrary() {
  const saved = await chrome.storage.local.get([
    STORAGE_LIBRARY_KEY,
    STORAGE_SELECTED_PACK_KEY,
  ]);

  const rawLibrary = saved[STORAGE_LIBRARY_KEY] || {};
  library = normalizeSavedLibrary(rawLibrary);
  const savedSelectedKey = saved[STORAGE_SELECTED_PACK_KEY] || "";
  const selectedKey =
    (library[savedSelectedKey] ? savedSelectedKey : "") ||
    migrateSelectedPackKey(savedSelectedKey, rawLibrary) ||
    Object.keys(library)[0] ||
    "";

  renderPackOptions(selectedKey);
  setCurrentPack(selectedKey, { persist: false });

  if (!Object.keys(library).length) {
    setStatus(translate("emptyStatus"), "warn");
    return;
  }

  setStatus(translate("restoredTextPacks", { count: Object.keys(library).length }), "ok");
}

function normalizeSavedLibrary(savedLibrary) {
  const normalized = {};
  for (const [key, entry] of Object.entries(savedLibrary)) {
    const packKey = entry.fileName ? `file:${entry.fileName}` : key;
    normalized[packKey] = {
      ...entry,
      packKey,
      packLabel: entry.fileName || entry.packLabel || packKey,
    };
  }
  return normalized;
}

function migrateSelectedPackKey(savedSelectedKey, rawLibrary) {
  const entry = rawLibrary[savedSelectedKey];
  return entry?.fileName ? `file:${entry.fileName}` : "";
}

async function clearLibrary() {
  library = {};
  currentPackKey = "";
  currentFields = {};
  currentFieldOrder = [];
  await persistLibrary("");
  renderPackOptions("");
  renderFields();
  setStatus(translate("libraryCleared"), "ok");
}

function persistLibrary(selectedPackKey) {
  return chrome.storage.local.set({
    [STORAGE_LIBRARY_KEY]: library,
    [STORAGE_SELECTED_PACK_KEY]: selectedPackKey || "",
  });
}

function getActiveTab() {
  return chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

function sendMessageToTab(tabId, message) {
  return chrome.tabs.sendMessage(tabId, message);
}

async function sendMessageToTabWithRetry(tabId, message) {
  try {
    return await sendMessageToTab(tabId, message);
  } catch (error) {
    if (!shouldRetryWithInjection(error)) {
      throw error;
    }

    await injectContentScript(tabId);
    return sendMessageToTab(tabId, message);
  }
}

function shouldRetryWithInjection(error) {
  const text = String(error?.message || error || "");
  return (
    text.includes("Receiving end does not exist") ||
    text.includes("Could not establish connection")
  );
}

function injectContentScript(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
}

function isFillableTab(tab) {
  return typeof tab?.url === "string" && tab.url.startsWith(APP_STORE_CONNECT_URL);
}

async function checkForUpdates() {
  const current = chrome.runtime.getManifest().version;
  checkUpdateButton.disabled = true;
  checkUpdateButton.textContent = translate("checkingUpdate");

  try {
    const res = await fetch(UPDATE_API, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (res.status === 403 || res.status === 429) {
      setStatus(translate("updateRateLimited"), "warn");
      return;
    }

    if (res.status === 404) {
      setStatus(translate("alreadyLatest", { version: current }), "ok");
      return;
    }

    const data = await res.json();
    const latest = (data.tag_name || "").replace(/^v/i, "");

    if (compareVersions(latest, current) > 0) {
      setStatus(translate("updateAvailable", { version: latest }), "warn");
    } else {
      setStatus(translate("alreadyLatest", { version: current }), "ok");
    }
  } catch (error) {
    setStatus(translate("updateCheckFailed", { message: error.message }), "error");
  } finally {
    checkUpdateButton.disabled = false;
    checkUpdateButton.textContent = translate("checkForUpdates");
  }
}

function compareVersions(a, b) {
  const parse = (v) =>
    String(v)
      .replace(/^v/i, "")
      .split(".")
      .map((n) => parseInt(n, 10) || 0);
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}
