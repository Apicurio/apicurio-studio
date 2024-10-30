#!/bin/sh

docker run -it -p 9999:8080 --env APICURIO_CONTEXT_PATH=/studio/ apicurio/apicurio-studio-ui:latest-snapshot
