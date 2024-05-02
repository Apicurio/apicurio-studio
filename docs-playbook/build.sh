#!/bin/sh

#BASE_DIR=
#PLAYBOOK=

if [ "x$BASE_DIR" = "x" ]
then
  BASE_DIR=`pwd`
fi

if [ "x$PLAYBOOK" = "x" ]
then
  PLAYBOOK=docs-playbook.yml
fi

if [ "x$SEARCH_PLAYBOOK" = "x" ]
then
  SEARCH_PLAYBOOK=search-playbook.yml
fi


OUTPUT_DIR=$BASE_DIR/target

mkdir -p $OUTPUT_DIR

echo "Cleaning output directory: $OUTPUT_DIR"
rm -rf $OUTPUT_DIR/*

echo "Running : antora $PLAYBOOK from $BASE_DIR"
cd $BASE_DIR

# Set some Lunr env variables.
export DOCSEARCH_ENABLED=true
export DOCSEARCH_ENGINE=lunr
export NODE_PATH="$(npm -g root)"

# create search index on subset of titles and stash it
echo "Building antora search index..."
antora --generator antora-site-generator-lunr $SEARCH_PLAYBOOK
cp $OUTPUT_DIR/dist/search-index.js /tmp

# clean output directory to prep for final antora run
rm -rf $OUTPUT_DIR/*

# create final set of docs
echo "Building antora docs..."
antora --generator antora-site-generator-lunr $PLAYBOOK
echo "Antora build completed successfully."

echo "Customizing output."
find $OUTPUT_DIR/dist -name '*.html' -exec sed -i 's/_images/assets-images/g' {} \;
find $OUTPUT_DIR/dist -name '*.html' -exec sed -i 's/_attachments/assets-attachments/g' {} \;
find $OUTPUT_DIR/dist -name '_images' -execdir mv _images assets-images \;
find $OUTPUT_DIR/dist -name '_attachments' -execdir mv _attachments assets-attachments \;

echo "Done."

# restore stashed search index
cp -rf /tmp/search-index.js $OUTPUT_DIR/dist
