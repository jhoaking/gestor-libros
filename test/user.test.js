import { app } from "../src/app.js";
import request  from "supertest";
import { connection } from "../src/db.js";
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from "../src/config.js";

let server;

beforeAll(() => {
    server = app.listen(4000); 
    
});

afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await connection.end();
},10000);




describe('AUTH', () =>{

    const user = {
        nombre: "test" + Date.now(),
        email: "test" + Date.now() + "@gmail.com",
        password: "123456"
      };

      beforeEach(async () => {
        await connection.query("DELETE FROM usuarios");
      });
    

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
            expect(res.status).toBe(201);
        })
    
        test('deberia devolver 400 si el email esta en formato no valido', async() =>{
            const res = await request(app).post('/user/register').send(
                {nombre: "test",
                email: "hola_123",
                password: "123456"});
            expect(res.status).toBe(400);
        })
        
        test('deberia un 400 si falta la contraseña', async () =>{
            const res = await request(app).post('/user/register').send(
                {nombre: "test",
                email: "test@gmail.com",});
            expect(res.status).toBe(400);
        })
    
        test('deberia mandar 400 si falta el email', async() =>{
            const res = await request(app).post('/user/register').send(
                {nombre: "test",
                password: "123456"}
            );
            expect(res.status).toBe(400);
        });

        test('espera ignorar y mandar un 201 si al registrar ponemos datos incesesarios solo se queda con lo que necesita', async () =>{
            const res = await request(app).post('/user/register').send(
                {   nombre: "test" + Date.now(),
                    email: "test" + Date.now() + "@gmail.com",
                    password: "123456",
                    sql : "asdasd",
                    asdsda: "asdasdasd"
                });
            expect(res.status).toBe(201);
        });

        test('espera un 400 si el nombre tiene menos de 4 caracteres', async() =>{
            const res = await request(app).post('/user/register').send(
             { nombre: "t",
                email: "test" + Date.now() + "@gmail.com",
                password: "123456"});
            expect(res.status).toBe(400);
        });

        test('espera un 400 si la contraseña tiene enos de 6 caracteres', async () =>{
            const res = await request(app).post('/user/register').send(
                { nombre: "test" + Date.now(),
                  email: "test" + Date.now() + "@gmail.com",
                  password: "1234"});
            expect(res.status).toBe(400);
        });
      });
    


    describe('POST /login', ()=>{

        beforeEach(async () => {
            await request(app).post('/user/register').send(user);
          });

        test('espera un 200 si se logeo con exito', async () =>{
            const res = await request(app).post('/user/login').send(user);
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        })

        test('deberia mandar 400 si  la contraseña no es correcta', async () =>{
            const res = await request(app).post('/user/login').send(
                {email: user.email,
                password: "incorrecta"});
            expect(res.status).toBe(400);
        })

        test('deberia mandar 400 si falta el email', async() =>{
            const res = await request(app).post('/user/login').send(
                {password :user.password});
            expect(res.status).toBe(400);
        });

        test('espera un 400  si el email no fue reistrado antes', async () =>{
            const res = await request(app).post('/user/login').send(
                {email : "hola@gmail.com",
                password : user.password});
            expect(res.status).toBe(400);
        });

        test('deberia mandar 400 si falta la contraseña', async() =>{
            const res = await request(app).post('/user/login').send(
                {email : user.email});
            expect(res.status).toBe(400);
        });

        test('deberia mandar 400 si el email no esta en formato correcto', async () =>{
            const res = await request(app).post('/user/login').send(
                {email : "hola",
                 password: user.password});
            expect(res.status).toBe(400);
        });

        test('validar que el token sea un jwt valido y manda 200', async () => {
            const res = await request(app).post('/user/login').send(user);
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        
            const decoded = jwt.verify(res.body.token, SECRET_JWT_KEY);
            expect(decoded).toHaveProperty('id');
            expect(decoded).toHaveProperty('email', user.email);
        });
        
    })
})



