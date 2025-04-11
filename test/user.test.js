import { app } from "../src/app.js";
import request  from "supertest";
import { connection } from "../src/db.js";
import jwt from 'jsonwebtoken';

let server;

beforeAll(() => {
    server = app.listen(4000); 
    
});

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await connection.end();
},10000);

beforeEach(async () => {
    await connection.query("DELETE FROM usuarios");
  });

let user = {
    nombre: "test" + Date.now(),
    email: "test" + Date.now() + "@gmail.com",
    password: "123456"
  };



describe('POST /register', () =>{

   
    test('espera un 201 si se registro el usuario ', async () => {
        const res = await request(app).post('/user/register').send(user);
        expect(res.status).toBe(201);
      })


    test('espera un 400 si el usuario ya se registro e intenta registrarse', async ()=>{
        await request(app).post('/user/register').send(user);
        const res = await request(app).post('/user/register').send(user);
        expect(res.status).toBe(400);
    })

    test('espera un 201 si al registrarse se autogenera un id', async() =>{
        const res = await request(app).post('/user/register').send(user);
        console.log(res.body);
        expect(res.status).toBe(201);
    })

    test('deberia devolver 400 si el email esta en formato no valido', async() =>{
        const res = await request(app).post('/user/register').send(
            {nombre: "test",
            email: "hola_123",
            password: "123456"});
        expect(res.status).toBe(400)
    })
    
    test('deberia un 400 si falta la contraseña', async () =>{
        const res = await request(app).post('/user/register').send(
            {nombre: "test",
            email: "test@gmail.com",})
        expect(res.status).toBe(400);
    })
})

