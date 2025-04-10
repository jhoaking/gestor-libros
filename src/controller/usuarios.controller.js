import { usuarioModel } from "../model/usuariosModel.js";
import { validarUsuarioRegister,validarUsuarioLogin } from "../schema/usuariosSchema.js";

export class usuarioController{
    static register = async (req,res) =>{
        try {
            const vali = validarUsuarioRegister(req.body);

            const {nombre,email,password} = vali.data;

            if(!password){
                return res.status(404).json({message : "falta la contraseña"});
            }
            const user = await usuarioModel.obtenerPorEmail(email);

            if(user){
                res.status(400).json({message: "el usuario ya esta registrado"});
            }

             await usuarioModel.register(nombre,email,password);

            res.status(200).json({message: "ya se registro con exito"});
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error.message)
        }
    }

    static login = async (req,res) =>{
        try {
            const vali = validarUsuarioLogin(req.body);

            const {email,password} = vali.data;

            const user  =await usuarioModel.obtenerPorEmail(email);
            

            if(!user){
                return res.status(400).json({message: "necesitas registrarte primero"});
            }

            const comparePassword = usuarioModel.comparePassword(password,user.password);
            if(!comparePassword){
                return res.status(400).json({message: "contraseña invalida"});
            }

            const token = await usuarioModel.createToken(user);

            res
            .cookie('access_toekn',token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 1000 * 60 * 60* 48
            })
            .send({user,token});
        } catch (error) {
            console.error(error.message);
            res.status(500).json(error.message);
        }
    }

    static logout = (req,res) =>{
        res.clearCookie("access_token", { httpOnly: true, sameSite: "Strict" });

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
}