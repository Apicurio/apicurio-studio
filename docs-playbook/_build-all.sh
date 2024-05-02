#!/bin/sh

# Build the docker image
docker build -t="apicurio/apicurio-studio-docs-builder" --rm .

# Use the docker image to build the docs
docker run -v $(pwd):/apicurio-docs-playbook apicurio/apicurio-studio-docs-builder:latest
