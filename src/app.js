import express from 'express';
import { autorRouter } from './routes/autores.routes.js';
export const app = express();

app.use(express.json());
    
app.use('/user',autorRouter);