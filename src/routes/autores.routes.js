import { Router } from "express";
import { autoresController } from "../controller/autores.controller.js";

export const autorRouter = Router();

    autorRouter.get('/',autoresController.getAutores);
    autorRouter.get('/:id',autoresController.getAutoresById);
    autorRouter.post('/',autoresController.createAutor);
    autorRouter.put('/:id',autoresController.uodateUser);
    autorRouter.delete('/:id',autoresController.deleteUser);

