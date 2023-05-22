import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyCustomer } from './middleware';

dotenv.config();

const app = express();

app.use(cors());

app.get('/api/test', verifyCustomer, async (req, res) => {
  res.send('Hello, World!');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});