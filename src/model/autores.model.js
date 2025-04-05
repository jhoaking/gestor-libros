
import {connection} from '../db.js'

export class authoresModel{
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

    static getAuthorByName = async (name) => {
        try {
            const query = 'SELECT * FROM authors WHERE name = ?';
            const [result] = await connection.query(query, [name]);
            return result;
        } catch (error) {
            console.error('Error al obtener autor por nombre', error);
            throw error;
        }
    };

    static getAuthorById = async (id) =>{
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
            
            
            return {id:result.insertId};
        } catch (error) {
            console.error('error al agregar  authores  en el modelo',error);
            throw error;
        }
    }

    static eliminarAuthor = async(id) =>{
        try {
            const query = 'DELETE FROM authors WHERE id = ?';
            const [result] = await connection.query(query,[id]);

            if(result.affectedRows === 0){
                throw new Error ('no se elimino el autor de la DB');
            }

            return { message: "Autor eliminado correctamente" };
        } catch (error) {
            console.error('error al eliminar  authores  en el modelo',error);
            throw error;
        }
    }

    static actualizarAuthores = async ({name,birthdate},id) =>{
        try {
            const [rows] =  await this.getAuthorById(id);
            if(rows.length == 0){
                throw new Error ('no se actualizo el autor de la DB');
            }

            const query = 'UPDATE authors SET name = ? , birthdate = ? WHERE id = ?';

            const [result] = await connection.query(query,[name,birthdate,id]);

            if (result.affectedRows === 0) {
                throw new Error("No se actualizó el autor en la DB");
            }
            return result;
        } catch (error) {
            console.error('error al actualizar  authores  en el modelo',error);
            throw error;
        }
    }
}