#!/bin/bash

oc process -f apicurio-standalone-template.yml > apicurio-studio.yml
oc apply -f apicurio-studio.yml
rm apicurio-studio.yml