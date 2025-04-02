import { app } from "../src/app.js";
import request  from "supertest";
import { connection } from "../src/db.js";

let server;
let personasPrueba ;

beforeAll(() => {
    server = app.listen(4000); 
    personasPrueba = {name : 'joaco', birthdata : '2025-09-06'};
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
        const result = await request(app).get('/:id').send();
        expect(result.status).toBe(200)
    })
})

describe('POST /user', () =>{
    test('espera 201 si se creo el usuario', async ()=>{
        const result = await request(app).post('/user').send(personasPrueba)
        expect(result.status).toBe(201);
    })
    
    test('espera 201 si al crear esta con un id', async () =>{
        const result = await request(app).post('/').send(personasPrueba);
        expect (result.status).toBe(201)
        expect(result.body.id).toBeDefined()
    })
})