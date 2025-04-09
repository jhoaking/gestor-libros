import { authoresModel } from "../model/autores.model.js";
import {validarAutor} from '../schema/authores.js'

export class autoresController{
    static  getAutores = async (req,res)=>{
        try {
            const result = await authoresModel.obtenerUsers();
            res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({message : ' error al obtener autores',error:error.message})
        }
    }
    static getAutoresById = async (req,res) =>{
        const {id} = req.params;
        try {
            const result = await authoresModel.getAuthorById(id);
             if(result.length === 0){
                return res.status(400).json({message :"no se encontro el autor el id no existe"});
             }
             
            res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({message : ' error al obtener autores por id',error:error.message})
        }
    }

    static createAutor = async (req,res) =>{
        try {
            const vali = validarAutor(req.body);
            if(!vali.valid){
                return res.status(400).json({error: vali.errors})
            }

            const result = await authoresModel.agregarAuthor(vali.data);
            
            if(!result){
                return res.status(400).json({message : "no se agrego el autor "})
            }  
          
           return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({message : ' error al crear autores ',error:error.message})
        }
    }

    static deleteUser = async(req,res)=>{
        const {id} = req.params;
        try {
            const result = await authoresModel.eliminarAuthor(id);
            if(!result){
                res.status(404).json({message: ' no se encontro el autor'})
            }

            res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({message : ' error al eliminar autores ',error:error.message})
        }
    }

    static uodateUser = async (req,res) =>{
        const {id} = req.params;
        try {
            const vali = validarAutor(req.body);
            const result = await authoresModel.actualizarAuthores(vali.data,id);

            res.status(200).json(result)
        } catch (error) {
            return res.status(500).json({message : ' error al actualizar autores ',error:error.message})
        }
    }
}