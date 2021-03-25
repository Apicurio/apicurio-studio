Instructions
============

## Usage

To start up the image

    docker run -it -p 8080:8080 apicurio/apicurio-studio-ui

## Building the image

    docker build -t="apicurio/apicurio-studio-ui" --rm .

## Pushing the image to Docker Hub

    docker push apicurio/apicurio-studio-ui

## How to customize the image

The following environment variables control configuration of the app:

	APICURIO_KC_AUTH_URL=http://localhost:8180/auth
	APICURIO_KC_REALM=apicurio
	APICURIO_KC_CLIENT_ID=apicurio-studio
	APICURIO_KC_SSL_REQUIRED=NONE
	APICURIO_KC_DISABLE_TRUST_MANAGER=true
	APICURIO_PORT_OFFSET=0
	APICURIO_LOGGING_LEVEL=INFO
	APICURIO_UI_LOGOUT_REDIRECT_URI=/logout
	APICURIO_UI_HUB_UI_URL=http://localhost:8080
    APICURIO_UI_VALIDATION_CHANNELNAME_REGEXP='([^{}\/]*(\{[a-zA-Z_][0-9a-zA-Z_]*\})?)+'
	APICURIO_UI_HUB_API_URL=http://localhost:8090/
	APICURIO_UI_EDITING_URL=http://localhost:8091/
	APICURIO_UI_FEATURE_MICROCKS=false
	APICURIO_UI_FEATURE_SHARE_WITH_EVERYONE=false
