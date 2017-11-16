Instructions
============

## Usage

To start up the image

    docker run -it -p 8080:8080 apicurio/apicurio-studio-api

## Building the image

    docker build -t="apicurio/apicurio-studio-api" --rm .

## Pushing the image to Docker Hub

    docker push apicurio/apicurio-studio-api

## How to customize the image

The following environment variables control configuration of the app:

	APICURIO_KC_AUTH_URL=http://localhost:8081/auth
	APICURIO_KC_REALM=apicurio
	APICURIO_KC_CLIENT_ID=apicurio-api
	APICURIO_KC_SSL_REQUIRED=false
	APICURIO_KC_DISABLE_TRUST_MANAGER=true
	APICURIO_PORT_OFFSET=0
	APICURIO_DB_DRIVER_NAME=h2
	APICURIO_DB_CONNECTION_URL=jdbc:h2:mem:apicuriodb
	APICURIO_DB_USER_NAME=sa
	APICURIO_DB_PASSWORD=sa
	APICURIO_DB_INITIALIZE=true
	APICURIO_LOGGING_LEVEL=INFO
