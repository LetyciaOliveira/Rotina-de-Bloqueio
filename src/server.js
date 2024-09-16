import mysql from 'mysql2/promise';
import dotenv from 'dotenv'
import { bloqueioTesteGratis } from './consumers/index.js';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

const iniciandoCodigo = async () => {
  try {
    await db.getConnection();
    await bloqueioTesteGratis(db);
  } catch (error) {
    console.error(error);
  }
};

iniciandoCodigo();

export default db;

