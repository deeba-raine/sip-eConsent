require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

pool.query("SELECT 1")
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database connection failed:", err.message));

module.exports = pool;
