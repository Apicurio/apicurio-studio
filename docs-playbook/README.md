# Antora Build for Apicurio Studio Documentation

This folder contains the configuration and scripts used when building the Apicurio Studio 
documentation for publishing to the Apicurio project web site.  We are using a tool called
Antora to build the asciidoc based documentation into a publishable site.  However, due to
some issues with building on various platforms (I'm looking at you, Windows) and also some
conflicts between what Antora builds and what our GitHub Pages (jekyll) project site expects,
we have created a non-trivial (but automated) process for building the docs.

# Building the Documentation Locally

The easiest way to build the documentation locally is to use the included `_build-all.sh`
script.  This script will build a docker image that includes all of the tooling needed
for the build.  It will then run the built image (which ultimately just executes the
included `build.sh` script).

Once this process completes, you will find the built documentation in the `./target/dist`
directory.
