#!/usr/bin/env bash
# Packpour release packager.
#
# Reads the version from local/manifest.json and writes a flat "load unpacked"
# compatible zip into github/releases/. Run from the project root:
#
#   bash github/pack-release.sh
#
# The zip is NOT committed to the github/ repo (see .gitignore). Upload it
# manually as an asset on GitHub Releases.

set -euo pipefail

# Move to the project root (parent of github/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f "local/manifest.json" ]; then
  echo "✗ local/manifest.json not found. Run this script from the project root." >&2
  exit 1
fi

VERSION=$(python3 -c 'import json,sys; print(json.load(open("local/manifest.json"))["version"])')
NAME="Packpour"
ZIP_NAME="${NAME}-v${VERSION}.zip"
OUT_DIR="github/releases"
OUT_PATH="${OUT_DIR}/${ZIP_NAME}"

mkdir -p "$OUT_DIR"
rm -f "$OUT_PATH"

# Zip local/ contents (flat — manifest.json at zip root), excluding dev files.
# docs/ holds developer-only markdown (release checklist, store listing drafts)
# and must never ship inside the extension bundle.
( cd local && zip -qry "../${OUT_PATH}" . \
    -x "dist/*" \
    -x "scripts/*" \
    -x "docs/*" \
    -x "docs" \
    -x ".DS_Store" \
    -x "**/.DS_Store" \
    -x "icons/README.md" \
    -x "icons/generate_icons.py" \
    -x "icons/icon-source.svg" \
    -x "icons/icon-source.svg.png" )

SIZE=$(du -h "$OUT_PATH" | cut -f1)
echo "✓ Packaged ${ZIP_NAME} (${SIZE})"
echo "  Path:    ${OUT_PATH}"
echo ""
echo "Next steps:"
echo "  1. Open https://github.com/hooosberg/Packpour/releases/new"
echo "  2. Tag:   v${VERSION}"
echo "  3. Title: ${NAME} v${VERSION}"
echo "  4. Attach ${OUT_PATH}"
echo "  5. Publish release"
