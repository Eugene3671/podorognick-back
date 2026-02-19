import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());

await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
