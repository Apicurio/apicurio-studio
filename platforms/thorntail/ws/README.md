Instructions
============

## Usage

To start up the image

    docker run -it -p 8080:8080 apicurio/apicurio-studio-ws

## Building the image

    docker build -t="apicurio/apicurio-studio-ws" --rm .

## Pushing the image to Docker Hub

    docker push apicurio/apicurio-studio-ws

## How to customize the image

The following environment variables control configuration of the app:

	APICURIO_PORT_OFFSET=0
	APICURIO_DB_DRIVER_NAME=h2
	APICURIO_DB_CONNECTION_URL=jdbc:h2:mem:apicuriodb
	APICURIO_DB_USER_NAME=sa
	APICURIO_DB_PASSWORD=sa
	APICURIO_DB_INITIALIZE=true
	APICURIO_LOGGING_LEVEL=INFO
