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
})

describe('POST /user', () =>{

   let  personasPrueba = {name : 'joaco', birthdate : '2025-03-03'};

    test('espera 201 si se creo el usuario', async ()=>{
        const result = await request(app).post('/user').send({name : "juan",birthdate : '2025-03-03'})
        expect(result.status).toBe(201);
    })

    test('espera que el  content-type: application/json en el encabezado', async () =>{
        const res = await request(app).post('/user').send(personasPrueba);
        expect(res.header['content-type']).toEqual(expect.stringContaining('json'))
    })
    
    test('espera 201 si al crear esta con un id', async () =>{
        const result = await request(app).post('/user').send({name : "pepe", birthdate : "2024-04-03"});

        expect (result.status).toBe(201);
        expect(result.body.id).toBeDefined();
    })

    test('espera 400 si crea  autor  duplicado ', async() =>{
          await request(app).post('/user').send(personasPrueba);
         const res = await request(app).post('/user').send(personasPrueba);
        expect(res.status).toBe(400);

    })
})