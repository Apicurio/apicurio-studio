#!/bin/sh

echo "---------------------------------------------------"
echo " Building apiman-studio."
echo "---------------------------------------------------"
echo ""
echo ""


gulp dist

if [ "x$1" != "x" ]
then
  echo "Updating the index.html with the given context: /$1/"
  sed -i "s/href=.\/./href=\"\/$1\/\"/g" ./dist/index.html
fi

echo "Build complete."

