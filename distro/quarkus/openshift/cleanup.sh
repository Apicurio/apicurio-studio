#!/bin/bash

oc process -f apicurio-deployment-configs-template.yml | oc delete -f -
oc process -f apicurio-services-template.yml | oc delete -f -
oc process -f apicurio-routes-template.yml | oc delete -f -
oc process -f apicurio-image-streams-template.yml | oc delete -f -
oc process -f apicurio-secrets-template.yml | oc delete -f -
