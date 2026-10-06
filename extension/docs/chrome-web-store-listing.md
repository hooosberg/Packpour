# Chrome Web Store Listing Draft

更新日期：2026-04-21

## Product Name

App Store Connect Locale Filler

## One-line Positioning

Local-first Chrome side panel for filling App Store Connect metadata from structured TXT or Markdown packs.

## Short Description Draft

Generate and fill App Store Connect ASO metadata from structured multilingual TXT and Markdown files.

## Long Description Draft

App Store Connect Locale Filler helps you move from AI-generated copy to a real App Store Connect page without repetitive copy and paste.

Import structured TXT or Markdown packs, pick the locale pack you want, and fill the current App Store Connect metadata page. The extension is built for new app launches, version updates, and multilingual metadata work.

What it does:

- Imports TXT and Markdown metadata packs
- Preserves file names so you can switch locale packs quickly
- Matches visible App Store Connect fields by labels and nearby text
- Lets you fill the focused field manually if automatic matching misses something
- Shows field counts for important metadata limits
- Keeps everything local in Chrome storage

What it does not do:

- It does not click Save
- It does not click Publish
- It does not click Submit for Review
- It does not send your metadata to a remote server

Best for:

- Indie developers shipping multilingual apps
- Teams preparing App Store version updates
- Operators who want a safer review step before submission

## Privacy / Data Handling Notes

Current implementation notes to keep aligned with store answers:

- No account system
- No analytics
- No remote server
- No password or cookie reading
- No automatic submit behavior
- Uses `storage` to save imported packs locally
- Uses `activeTab` and `scripting` only to fill the current App Store Connect page after user action

## Permissions Justification Draft

### `storage`

Stores imported metadata packs and interface language locally in the browser.

### `activeTab`

Lets the extension act only on the current App Store Connect tab after the user clicks the extension.

### `scripting`

Injects the content script into the active App Store Connect tab when needed so fields can be filled.

### `sidePanel`

Provides the main extension UI in the Chrome side panel.

## Support Links

- Homepage: planned GitHub Pages site
- Support page: `github/site/support.html`
- Privacy page: `github/site/privacy.html`

## Submission Gaps Remaining

- Store screenshots still need to be produced
- Final GitHub repository URL must be confirmed
- Final support workflow must be confirmed
