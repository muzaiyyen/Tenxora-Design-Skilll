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
cp out/our-team.html "$THEME_DIR/site/our-team.html"
# the theme ships a screenshot for the Appearance > Themes screen if one exists
[ -f wordpress/screenshot.png ] && cp wordpress/screenshot.png "$THEME_DIR/screenshot.png"

mkdir -p dist
rm -f dist/tenxora-theme.zip
(cd wordpress && zip -qr ../dist/tenxora-theme.zip tenxora -x '*.DS_Store')
# update-only package for a live site whose theme was edited on the server: just the page bundle
# and the Our Team template, so nothing else in the live theme folder is replaced
rm -f dist/tenxora-theme-update.zip
(cd wordpress/tenxora && zip -qr ../../dist/tenxora-theme-update.zip site page-our-team.php -x '*.DS_Store')
echo "Theme zip: dist/tenxora-theme.zip (assets served from $THEME_PATH)"
echo "Update-only zip: dist/tenxora-theme-update.zip (site/ + page-our-team.php)"

# child theme for the live site: installs from Appearance > Themes > Upload without touching the
# server-edited parent theme (contact form, service pages and their styles stay as they are)
CHILD_DIR=wordpress/tenxora-home
CHILD_PATH="${WP_CHILD_URL_PATH:-/wp-content/themes/tenxora-home}"
rm -rf .next out "$CHILD_DIR/site"
STATIC_EXPORT=1 ASSET_PREFIX="$CHILD_PATH/site" NEXT_PUBLIC_ASSET_BASE="$CHILD_PATH/site" npx next build
mkdir -p "$CHILD_DIR/site"
cp -r out/_next out/brand out/figma out/icon.svg "$CHILD_DIR/site/"
cp out/index.html "$CHILD_DIR/site/index.html"
cp out/our-team.html "$CHILD_DIR/site/our-team.html"
cp "$THEME_DIR/front-page.php" "$THEME_DIR/page-our-team.php" "$CHILD_DIR/"
rm -f dist/tenxora-home.zip
(cd wordpress && zip -qr ../dist/tenxora-home.zip tenxora-home -x '*.DS_Store')
echo "Child theme zip: dist/tenxora-home.zip (assets served from $CHILD_PATH)"

# standalone copy under its own folder, so it installs next to the live "tenxora" theme
ALT_DIR=wordpress/tenxora-2026
ALT_PATH="${WP_ALT_URL_PATH:-/wp-content/themes/tenxora-2026}"
rm -rf .next out "$ALT_DIR/site"
STATIC_EXPORT=1 ASSET_PREFIX="$ALT_PATH/site" NEXT_PUBLIC_ASSET_BASE="$ALT_PATH/site" npx next build
mkdir -p "$ALT_DIR/site"
cp -r out/_next out/brand out/figma out/icon.svg "$ALT_DIR/site/"
cp out/index.html "$ALT_DIR/site/index.html"
cp out/our-team.html "$ALT_DIR/site/our-team.html"
cp "$THEME_DIR/front-page.php" "$THEME_DIR/page-our-team.php" "$ALT_DIR/"
rm -f dist/tenxora-2026.zip
(cd wordpress && zip -qr ../dist/tenxora-2026.zip tenxora-2026 -x '*.DS_Store')
echo "Standalone theme zip: dist/tenxora-2026.zip (assets served from $ALT_PATH)"
