import { createPool } from "mysql2/promise";

import { DB_HOST,DB_PASSWORD,DB_PORT,DB_USER,DB } from "./config.js";

export const connection = createPool({
    port : DB_PORT,
    user : DB_USER,
    host : DB_HOST,
    password : DB_PASSWORD,
    database : DB
})

