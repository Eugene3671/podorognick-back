// src/middleware/logger.js

import pino from 'pino-http';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: isDevelopment ? 'debug' : 'info',
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
          messageFormat:
            '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
          hideObject: true,
        },
      }
    : undefined,
});
