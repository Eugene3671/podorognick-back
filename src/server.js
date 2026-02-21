// src/server.js

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';

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
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use('/api', rootRouter);

// 404 і обробник помилок — наприкінці ланцюжка
app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
