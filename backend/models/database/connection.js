const mysql = require('mysql');

const con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT
});

con.connect((err) => {
    if(err) {
        console.log('error when connecting to db: ', err);
        throw err;
    }
});

module.exports = con;