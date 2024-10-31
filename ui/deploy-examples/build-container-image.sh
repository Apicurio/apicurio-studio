#!/bin/sh

UI_DIR="$(dirname "$(dirname "$(realpath "$0")")")"
echo "Building all using base directory: $UI_DIR"

cd $UI_DIR/ui
npm install
npm run clean
npm run build
npm run package

cd $UI_DIR/ui
docker build -t apicurio/apicurio-studio-ui:latest-snapshot .
