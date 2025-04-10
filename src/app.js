import express from 'express';
import { autorRouter } from './routes/autores.routes.js';
import { routerUser } from './routes/usuarios.routes.js';
import cookieParser from 'cookie-parser';
export const app = express();

app.use(express.json());
app.use(cookieParser()); 


app.use('/autor',autorRouter);
app.use('/user',routerUser);