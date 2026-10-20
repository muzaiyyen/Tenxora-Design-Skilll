#!/usr/bin/env bash
# Builds the WordPress theme: exports the home page with asset paths pointing at the theme
# folder, copies it into wordpress/tenxora/site, and zips the theme to dist/tenxora-theme.zip.
#
#   scripts/build-wp-theme.sh                      # WordPress at the domain root (default)
#   WP_THEME_URL_PATH=/blog/wp-content/themes/tenxora scripts/build-wp-theme.sh   # WordPress in a subfolder
set -euo pipefail
cd "$(dirname "$0")/.."

THEME_PATH="${WP_THEME_URL_PATH:-/wp-content/themes/tenxora}"
THEME_DIR=wordpress/tenxora

rm -rf .next out "$THEME_DIR/site"
STATIC_EXPORT=1 ASSET_PREFIX="$THEME_PATH/site" NEXT_PUBLIC_ASSET_BASE="$THEME_PATH/site" npx next build

mkdir -p "$THEME_DIR/site"
cp -r out/_next out/brand out/figma out/icon.svg "$THEME_DIR/site/"
cp out/index.html "$THEME_DIR/site/index.html"
# the theme ships a screenshot for the Appearance > Themes screen if one exists
[ -f wordpress/screenshot.png ] && cp wordpress/screenshot.png "$THEME_DIR/screenshot.png"

mkdir -p dist
rm -f dist/tenxora-theme.zip
(cd wordpress && zip -qr ../dist/tenxora-theme.zip tenxora -x '*.DS_Store')
echo "Theme zip: dist/tenxora-theme.zip (assets served from $THEME_PATH)"
