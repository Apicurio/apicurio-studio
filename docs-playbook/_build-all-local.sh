#!/bin/sh

# Build the docker image
docker build -t="apicurio/apicurio-docs-builder" --rm .

# Use the docker image to build the docs
docker run --env PLAYBOOK=local-test-playbook.yml --env SEARCH_PLAYBOOK=local-test-playbook.yml -v $(pwd)/..:/repository apicurio/apicurio-docs-builder:latest
