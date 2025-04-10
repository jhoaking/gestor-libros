import jwt from 'jsonwebtoken';
import {SECRET_JWT_KEY} from '../config.js' 

export const authenticate = async (req,res,next) =>{
    try {
        const token = req.cookies.access_token;
        if(!token){
            return res.status(400).json({message : "token no creado"});
        }

        const decoded = jwt.verify(token,SECRET_JWT_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "token expirado"});
    }
}