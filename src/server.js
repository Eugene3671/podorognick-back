// src/server.js

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import rootRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT ?? 3000;

// глобальні middleware
app.use(logger);
app.use(express.json({ limit: '100kb' }));
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://podorognick-front.vercel.app'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

// ДОКУМЕНТАЦІЯ SWAGGER
try {
  const swaggerDocument = yaml.load(path.resolve('swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.error('Swagger document failed to load:', e);
}

app.use('/api', rootRouter);

// 404 і обробник помилок — наприкінці ланцюжка
app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
