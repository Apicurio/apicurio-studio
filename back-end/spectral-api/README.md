## Apicurio Spectral API

**Install npm dependencies**
`yarn install`

**Run in development mode**

- `yarn start` - starts the development server
- `yarn start:watch` - starts the development server and reloads when a change is made

You can pass environment variables to affect the server behaviour:

`HTTP_PORT=8081 yarn start`.

Please see [Environment variables](#environment-variables) below for all options.

**Run in production mode**

Run `yarn build` to build the production code.

Run `node dist/index.js` to run the compiled server.`

### Environment variables

- `APICURIO_UI_URL` - The Apicurio UI URL. Used in CORS enablement
- `ALLOWED_ORIGINS` - A list of allowed origins in CORS. If set this will be used instead of `APICURIO_UI_URL`.
- `HTTP_PORT` - Set the port that the server runs on (default: 8080).
- `HTTP_HOST` - Set the host that the server runs on (default: 127.0.0.1)
