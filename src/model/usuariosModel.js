import { connection } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SALT_ROUNDS,SECRET_JWT_KEY } from "../config.js";

 
export class usuarioModel{
    static createToken = async (user) =>{
        try {
            const token = jwt.sign(
                {id:user.user_id,nombre : user.nombre, email : user.email},
                SECRET_JWT_KEY,
                {expiresIn: "48h"}
            )
            return token;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al crear el token ");  
        }
    }

    static hashrContra = async (password) =>{
        try {
            const hashedPassword =  await bcrypt.hash(password,Number(SALT_ROUNDS));
           
            
            return hashedPassword;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al hashear la password "); 
        }
    }

    static registerUser = async ({nombre,email,password}) =>{
        try {
            const hashedPasswrod = await this.hashrContra(password);
            const query = "INSERT INTO usuarios(nombre,email,password) VALUES (?,?,?)";

            const [result] = await connection.query(query,[nombre,email,hashedPasswrod]);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al registrar el user "); 
        }
    }

    static compararContra = async ({passwordUser, hashedPassword}) =>{
        try {
            const comparePassword = bcrypt.compare(passwordUser, hashedPassword);
            return comparePassword;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al comparar la password algo esta mal  ");
        }
    }



    static obtenerPorEmail = async (email) =>{
        try {
            const query = 'SELECT BIN_TO_UUID(user_id) as id , email,password from usuarios WHERE email = ?';

            const [result] = await connection.query(query,[email]);
            if(!result === 0){
                return null;
            }

            return result[0];
        } catch (error) {
            console.error(error.message);
            throw new Error("error al comparar la password algo esta mal  ");
        }
    }

    static obtenerUsuario = async() =>{
        try {
            const query = "SELECT BIN_TO_UUID(user_id)AS id , email,password FROM usuarios";
            const [result] = await connection.query(query);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al obtener el usuario en la db   ");
        }
    }
}