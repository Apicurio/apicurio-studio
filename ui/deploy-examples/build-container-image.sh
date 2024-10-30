#!/bin/sh

BASE_DIR="$(dirname "$(dirname "$(realpath "$0")")")"
echo "Building all using base directory: $BASE_DIR"

cd $BASE_DIR/ui
npm install
npm run clean
npm run build
npm run package

docker build -t apicurio/apicurio-studio-ui:latest-snapshot .
