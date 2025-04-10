import { connection } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SALT_ROUNDS,SECRET_JWT_KEY } from "../config.js";


export class usuario{
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

    static hashearContra = async (password) =>{
        try {
            const hasshedPassword = bcrypt.hash(password,SALT_ROUNDS);
            return hasshedPassword;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al hashear la password "); 
        }
    }

    static registerUser = async ({nombre,email,password}) =>{
        try {
            const hashedPasswrod = this.hashearContra(password);
            const query = "INSERT INTO usuarios(nombre,email,password)";

            const [result] = await connection.query(query,{nombre,email,hashedPasswrod});
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al registrar el user "); 
        }
    }

    static compararContra = async (passwordUser, hashedaPassword) =>{
        try {
            const comparePassword = bcrypt.compare(passwordUser, hashedaPassword);
            return comparePassword;
        } catch (error) {
            console.error(error.message);
            throw new Error("error al comparar la password algo esta mal  ");
        }
    }



    static getByEmail = async (email) =>{
        try {
            const query = 'SELECT BIN_TO_UUID(user_id) as id , email,password from usuarios WHERE email = ?';

            const [result] = await connection.query(query,[email]);
            if(!result){
                return null;
            }

            return result[0];
        } catch (error) {
            console.error(error.message);
            throw new Error("error al comparar la password algo esta mal  ");
        }
    }

    static obtenerUsuario = async(id) =>{
        try {
            const query = "SELECT BIN_TO_UUID(user_id)AS id , email,password FROM usuarios WHERE id = ?";
            const [result] = await connection.query(query,[id]);
            return result[0];
        } catch (error) {
            console.error(error.message);
            throw new Error("error al obtener el usuario en la db   ");
        }
    }
}