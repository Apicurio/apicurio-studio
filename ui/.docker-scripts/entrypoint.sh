#!/bin/sh

set -e

echo "---------------------------------------------"
echo "Performing the Initial Config..."
echo "---------------------------------------------"
node /usr/local/bin/create-config.cjs

echo "---------------------------------------------"
echo "Patching base hrefs..."
echo "---------------------------------------------"
node /usr/local/bin/update-base-href.cjs

echo "---------------------------------------------"
echo "Config Complete. Nginx Server Started....."
echo "---------------------------------------------"
source /usr/libexec/s2i/run
