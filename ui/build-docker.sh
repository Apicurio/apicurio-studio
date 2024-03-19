#!/bin/sh

if [ "x$DOCKER_CMD" = "x" ]
then
  DOCKER_CMD="docker"
fi

if [ ! -d "dist" ]
then
  echo "Missing 'dist' directory.  Build first!"
  exit 1
fi

$DOCKER_CMD build -t="apicurio/apicurio-studio-ui:latest-snapshot" --rm .
