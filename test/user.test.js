import { app } from "../src/app.js";
import request  from "supertest";
import { connection } from "../src/db.js";
import jwt from 'jsonwebtoken';

let server;

beforeAll(() => {
    server = app.listen(4000); 
    
});

afterAll(async () => {
    await connection.end(); 
    await new Promise(resolve => server.close(resolve));
});


const user = {nombre : "pepe", email : "pepe@gmail.com", password : "1111111"}

describe('POST /register', () =>{

    test('espera un 201 si se registro el usuario ', async () => {
      const res = await request(app).post('/user/register').send(user);
      expect(res.status).toBe(201);
    })
    

    
})