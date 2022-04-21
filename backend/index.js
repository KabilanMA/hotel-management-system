const express = require('express'); 
const app = express();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); 
const Router = require('./routes/Router');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
});

db.connect(function(err){
    if(err) {
        console.log("DB ERROR");
        throw err;
    }
});

const sessionStore = new MySQLStore({
    expiration : (365 * 60 * 60 * 24 * 1000),
    endConnectionOnClose: false,
}, db);

app.use(session({
    key: 'fsasfsfafawfrhykuytjdafapsovapjv32fq',
    secret: 'abc2idnoin2^*(doaiwu', 
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (365 * 86400 * 1000),
        httpOnly: false,
    }
}));

new Router(app, db);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// app.listen(3000, '192.168.1.101');
app.listen(3000);

console.log("Testing Server ");