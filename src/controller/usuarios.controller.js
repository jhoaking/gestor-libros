import { usuarioModel } from "../model/usuariosModel.js";
import { validarUsuarioRegister,validarUsuarioLogin } from "../schema/usuariosSchema.js";

export class usuarioController{
    static register = async (req,res) =>{
        try {
            const vali = validarUsuarioRegister(req.body);
            if(!vali.valid){
                return res.status(400).json({message: "error al validar"})
            }
            const {nombre,email,password} = vali.data;

          
            const user = await usuarioModel.obtenerPorEmail(email);
 
            if(user){
                return res.status(400).json({message: "el usuario ya esta registrado"});
            }
                await usuarioModel.registerUser({nombre,email,password});

            res.status(201).json({message: "ya se registro con exito"});
        } catch (error) { 
            res.status(500).json({message : "erro al registrar"}, error.message)
        }
    }

    static login = async (req,res) =>{
        try {
            const vali = validarUsuarioLogin(req.body);

            if(!vali.valid){
                return res.status(400).json({message: "error al validar"})
            }

            const {email,password} = vali.data;

            const user  = await usuarioModel.obtenerPorEmail(email);
            console.log('🧠 USER QUE LLEGA AL TOKEN:', user);

            if(!user){ 
                return res.status(400).json({message: "necesitas registrarte primero"});
            }

            const comparePassword = await usuarioModel.compararContra(password,user.password);
            if(!comparePassword){
                return res.status(400).json({message: "contraseña invalida"});
            }

            const token =  usuarioModel.createToken(user);

            res
            .cookie('access_token',token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 1000 * 60 * 60 * 48
            })
            .send({user,token})
            
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error.message);
        }
    }

    static logout = async (req,res) =>{
        res.clearCookie("access_token");

        return res.status(200).json({ message: "Logout exitoso" });
    }

    static protected = async (req,res) =>{
        try {
            if(!req.user){
                return res.status(401).json({ message: "Acceso denegado" });
            }
            res.status(200).json({
                message: "bienvnido a la ruta protegida",
                user: req.user
            })
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error.message);
        }
    }

    static getUser = async (req,res) =>{
        try {
            const result = await usuarioModel.obtenerUsuario();
            res.status(200).json(result)
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error.message);
        }
    }
}