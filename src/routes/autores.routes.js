import { Router } from "express";
import { autoresController } from "../controller/autores.controller.js";
import { validarId } from "../middleware/controlId.js";
export const autorRouter = Router();

    autorRouter.get('/',autoresController.getAutores);
    autorRouter.get('/:id',validarId,autoresController.getAutoresById);
    autorRouter.post('/',autoresController.createAutor);
    autorRouter.put('/:id',validarId,autoresController.uodateUser);
    autorRouter.delete('/:id',validarId,autoresController.deleteUser);

 