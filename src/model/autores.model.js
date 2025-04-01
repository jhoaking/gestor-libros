
import {connection} from '../db.js'

export class usuariosModel{
    static   obtenerUsers = async () =>{
        try {
            const query = 'SELECT * FROM authors';
            const [result] = await connection.query(query);

            return result;
        } catch (error) {
            console.error('error al obtener authores en el modelo',error);
            throw error;
        }
    }

    static getAuthorById = async ({id}) =>{
        try {
            const query = 'SELECT * FROM authors WHERE id = ?';
            const [result] = await connection.query(query,[id])
            return result;
        } catch (error) {
            console.error('error al obtener authores  por id en el modelo',error);
            throw error;
        }
    }

    static agregarAuthor = async ({name,birthdate}) =>{
        try {
            const query = 'INSERT INTO authors(name,birthdate) VALUES (?,?)';
            const [result] = await connection.query(query,[name,birthdate]);

            return result.insertId;
        } catch (error) {
            console.error('error al agregar  authores  en el modelo',error);
            throw error;
        }
    }

    static eliminarAuthor = async(id) =>{
        try {
            const query = 'DELETE FROM authors WHERE id = ?';
            const [result] = await connection.query(query,[id]);

            if(result.affectedRows == 0){
                throw new Error ('no se elimino el autor de la DB');
            }

            return result[0];
        } catch (error) {
            console.error('error al eliminar  authores  en el modelo',error);
            throw error;
        }
    }

    static actualizarAuthores = async ({name,birthdate},id) =>{
        try {
            const [rows] = this.getAuthorById(id);
            if(rows.affectedRows == 0){
                throw new Error ('no se actualizo el autor de la DB');
            }

            const query = 'UPDATE authors SET name = ? , birthdate = ? WHERE id = ?';

            const [result] = await connection.query(query,[name,birthdate,rows])
            return result;
        } catch (error) {
            console.error('error al actualizar  authores  en el modelo',error);
            throw error;
        }
    }
}