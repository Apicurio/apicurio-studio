Instructions
============

## Usage

To start up the image

    docker run -it -p 8080:8080 apicurio/apicurio-studio-auth

## Building the image

    docker build -t="apicurio/apicurio-studio-auth" --rm .

## Pushing the image to Docker Hub

    docker push apicurio/apicurio-studio-auth

## How to customize the image

The following environment variables control configuration of the app:

    APICURIO_KEYCLOAK_USER=admin
    APICURIO_KEYCLOAK_PASSWORD=password123!
    APICURIO_UI_URL=http://localhost:8080/
