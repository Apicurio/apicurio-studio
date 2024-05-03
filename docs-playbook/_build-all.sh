#!/bin/sh

# Build the docker image
docker build -t="apicurio/apicurio-docs-builder" --rm .

# Use the docker image to build the docs
docker run -v $(pwd)/..:/repository apicurio/apicurio-docs-builder:latest
