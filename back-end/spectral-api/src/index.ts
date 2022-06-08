if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import fastify from 'fastify';
import { configureRoutes } from './routes';
import createService from './services/createService';
import cors, { FastifyCorsOptions } from '@fastify/cors';

const config = {
  allowedOrigins: process.env.ALLOWED_ORIGINS || process.env.APICURIO_UI_URL || '',
  host: process.env.HTTP_HOST || '127.0.0.1',
  port: process.env.HTTP_PORT || 8080
}

// Run the server!
const start = async () => {
  const server = fastify({ logger: true});

  // specify which origins can access the server
  server.register(cors, () => {
    return (req, callback) => {
      const origin = req.headers.origin

      const options: FastifyCorsOptions = { origin: false };
      if (!config.allowedOrigins) {
        callback(null, options);
      }
      const allowedOriginList = config.allowedOrigins.split(',');
      if (!allowedOriginList.length) {
        callback(null, options);
      }
      
      if (allowedOriginList.includes(origin)) {
        options.origin = true;
      }
      callback(null, options);
    } 
  });

  const spectralService = createService();

  configureRoutes(server, spectralService);

  try {
    await server.listen(config.port, config.host);
  } catch (err) {
    server.log.error(err);
    process.exit(1)
  }
}

start();