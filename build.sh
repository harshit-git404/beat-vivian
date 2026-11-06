#!/usr/bin/env sh
# Wraps game.html into a full page for static hosting.
set -e
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">\n</head>\n<body>\n'
  cat game.html
  printf '\n</body>\n</html>\n'
} > public/index.html
echo "Built public/index.html"
