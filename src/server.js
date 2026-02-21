// src/server.js

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import authRoutes from './routes/authRoutes.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import usersRoutes from './routes/usersRoutes.js';
import storiesRoutes from './routes/storiesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// глобальні middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// подключение роутов
app.use('/api/auth', authRoutes);
// підключаємо групу маршрутів юзерів
app.use('/api/users', usersRoutes);

app.use(storiesRoutes);

// 404 і обробник помилок — наприкінці ланцюжка
app.use(notFoundHandler);

app.use(errors());

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
