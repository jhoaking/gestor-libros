import { app } from "../src/app.js";
import request  from "supertest";
import { connection } from "../src/db.js";


let server;

beforeAll(() => {
    server = app.listen(4000); 
    
});

afterAll(async () => {
    await connection.end(); 
    server.close(() => {
        console.log("Server closed after tests.");
    }); 
});

describe('GET /user', ()=>{
    test('esperamos un 200 al hacer el get', async () =>{
        const result = await request(app).get('/user').send();
        expect(result.status).toBe(200);
    })

    test('espera 200 si se encontro con id', async () =>{
        const  id = 1;
        const result = await request(app).get(`/user/${id}`).send();
        expect(result.status).toBe(200)
    })

    test('espera un 400 si el id no existe',async ()=>{
        const id = 0;
        const result = await request(app).get(`/user/${id}`).send();
        expect(result.status).toBe(400);
    })

    test('espera un 400 si el id no es un entero', async()=>{
        const id = 'as';
        const result = await request(app).get(`/user/${id}`).send();
        expect(result.status).toBe(400)
    })

    test('espera un 404 si al buscar por id no se encuentra el usuario', async ()=>{
        const id = 999;
        const res = await request(app).get(`/user${id}`).send();
        expect(res.status).toBe(404);
    })
})

describe('POST /user', () =>{

   let  personasPrueba = {name : 'joaco', birthdate : '2025-03-03'};

    test('espera 201 si se creo el usuario', async ()=>{
        const result = await request(app).post('/user').send(personasPrueba)
        expect(result.status).toBe(201);
    })

    test('espera que el  content-type: application/json en el encabezado', async () =>{
        const res = await request(app).post('/user').send(personasPrueba);
        expect(res.header['content-type']).toEqual(expect.stringContaining('json'))
    })
    
    test('espera 201 si al crear esta con un id', async () =>{
        const result = await request(app).post('/user').send(personasPrueba);

        expect (result.status).toBe(201);
        expect(result.body.id).toBeDefined();
    })

    test('espera un 400 si no se mando un dato', async () =>{
        const res = await request(app).post('/user').send({birthdate : "2006-09-02"});
        expect(res.status).toBe(400);
    })

    test('espera 400 si la fecha no esta en su formato', async () =>{
        const res = await request(app).post('/user').send({name : 'pepe', birthdate : 'abril'});
        expect(res.status).toBe(400);
    })
   
   
    
})