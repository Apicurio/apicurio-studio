#!/bin/sh

set -e

echo "---------------------------------------------"
echo "Performing the Initial Config..."
echo "---------------------------------------------"
node /usr/local/bin/create-config.cjs

echo "---------------------------------------------"
echo "Config Complete. Nginx Server Started....."
echo "---------------------------------------------"
source /usr/libexec/s2i/run