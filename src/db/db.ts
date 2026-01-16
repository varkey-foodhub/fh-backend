import mysql from "mysql2/promise";
import dotenv from 'dotenv'
dotenv.config();
const db = mysql.createPool({
  host: process.env.MYSQL_URL,
  user: process.env.MYSQL_USER_NAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;