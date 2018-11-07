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
	APICURIO_UI_HUB_API_URL=https://localhost:8090/
