#!/bin/bash

oc process -f apicurio-image-streams-template.yml | oc apply -f -
oc process -f apicurio-secrets-template.yml | oc apply -f -
oc process -f apicurio-deployment-configs-template.yml | oc apply -f -
oc process -f apicurio-services-template.yml | oc apply -f -
oc process -f apicurio-routes-template.yml | oc apply -f -

#Fetch Openshift route values

apiurl=$(oc get route apicurio-studio-api -o go-template --template='{{.spec.host}}{{println}}')
wsurl=$(oc get route apicurio-studio-ws -o go-template --template='{{.spec.host}}{{println}}')
authurl=$(oc get route apicurio-studio-auth -o go-template --template='{{.spec.host}}{{println}}')


#Set Openshift route values based on fetch

oc set env dc/apicurio-studio-api APICURIO_KC_AUTH_URL=http://"$authurl"/auth/realms/apicurio

oc set env dc/apicurio-studio-ui APICURIO_KC_AUTH_URL=http://"$authurl"/auth/realms/apicurio
oc set env dc/apicurio-studio-ui APICURIO_UI_HUB_API_URL=http://"$apiurl"
oc set env dc/apicurio-studio-ui APICURIO_UI_EDITING_URL=ws://"$wsurl"





