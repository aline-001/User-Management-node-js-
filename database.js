const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // This tells Node to look at 3306
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.message);
        return;
    }
    console.log('✅ Connected to MySQL on port ' + process.env.DB_PORT);
});

module.exports = connection;