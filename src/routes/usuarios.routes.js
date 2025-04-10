import { Router } from "express";
import { usuarioController } from "../controller/usuarios.controller.js";
import { authenticate } from "../middleware/usuarioJWT.js";

export const routerUser = Router();

routerUser.get('/logout',usuarioController.logout);
routerUser.post('/register',usuarioController.register);
routerUser.post('/login',usuarioController.login);
routerUser.get('/protected', authenticate , usuarioController.protected);


