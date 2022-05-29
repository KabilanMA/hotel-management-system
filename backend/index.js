const express = require('express'); 
const app = express();
const path = require('path');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); 
const Router = require('./routes/Router');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();
const cors=require("cors");
const bodyparser = require("body-parser")

//parse JSON using express
app.use(express.json())
// app.use(express.urlencoded({extended: false}))
app.use(bodyparser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// const corsOptions ={
//     origin:'*', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200,
//  }
// app.use(cors({
//     origin:'http://localhost:3000',
//     credentials:true
// }));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT
});

db.connect((err) => {
    if(err) {
        console.log('error when connecting to db: ', err);
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

const HotelRoom = require('./models/HotelRoom')
const bookingRouter = require('./routes/bookingRouter');


app.use('/book', bookingRouter);

// app.listen(3001, '192.168.1.101');
app.listen(process.env.PORT || 3001, () => {
    console.log("Server is listening at port 3001");
});
// app.get('/',(req, res)=>{
//     res.send("SUCCESS");
// })
app.on('close',()=>db.close());

app.get("/api/get-all-customers", (req, res) => {
    const sql = "SELECT * FROM user WHERE type=2;"
    db.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR WHEN FETCHING CUSTOMERS: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.get("/api/get-all-moderators", (req, res) => {
    const sql = "SELECT * FROM user WHERE type=1;"
    db.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR WHEN FETCHING MODERATORS: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.get("/api/get-all-rooms", (req, res) => {
    const sql = "SELECT * FROM room;"
    db.query(sql, (err, result) => {
        if (err) {
            console.log("ERROR WHEN FETCHING ROOMS: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.post("/api/create-customer", (req, res) => {
    const {first_name, last_name, email, password, mobile} = req.body
    const hash = bcrypt.hashSync(password, 9)
    const sql = "INSERT INTO user VALUES (DEFAULT, ?, ?, ?, ?, ?, 2, 1);"
    db.query(sql, [first_name, last_name, email, hash, mobile], (err, result) => {
        if (err) {
            console.log("ERROR WHEN ADDING A CUSTOMER: " + err)
            res.json({
                success: false,
                msg:err
            })
        } else {
            if (result.affectedRows === 1) {
                res.json({
                    success: true,
                    result
                })
            } else {
                res.json({
                    success: false,
                    result
                })
            }
        }
    })
})

app.post("/api/create-moderator", (req, res) => {
    const {first_name, last_name, email, password, mobile} = req.body
    const hash = bcrypt.hashSync(password, 9)
    const sql = "INSERT INTO user VALUES (DEFAULT, ?, ?, ?, ?, ?, 1, 1);"
    db.query(sql, [first_name, last_name, email, hash, mobile], (err, result) => {
        if (err) {
            console.log("ERROR WHEN ADDING A MODERATOR: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.post("/api/create-room", (req, res) => {
    const {hotelID, name, num_of_people, ac_or_non_ac, price} = req.body
    console.log({hotelID, name, num_of_people, ac_or_non_ac, price});
    const sql = "INSERT INTO room VALUES (DEFAULT, ?, ?, ?, ?, ?);"
    db.query(sql, [hotelID, name, num_of_people, ac_or_non_ac, price], async (err, result) => {
        if (err) {
            console.log("ERROR WHEN ADDING A ROOM: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            try{
                let new_room = new HotelRoom(result.insertId)
                await new_room.availableRoomForBooking()    
            }catch(err){
                console.log("ERROR WHEN CREATING A BOOKING: " + err)
                res.json({
                    success: false,
                    err
                })
            }
            res.json({
                success: true,
                result
            })
        }
    })
})

app.get('/api/get-user-by-id/:id', (req, res) => {
    const user_id = req.params.id
    const sql = "SELECT * FROM user WHERE user_id=?"
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log("ERROR WHEN FETCHING A CUSTOMER BY ID: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.put("/api/update-user", (req, res) => {
    const {user_id, first_name, last_name, email, password, mobile, type, status} = req.body
    const sql = "UPDATE user SET first_name=?, last_name=?, email=?, password=?, mobile=?, type=?, status=? WHERE user_id=?";
    const hash = bcrypt.hashSync(password, 9)
    db.query(sql, [first_name, last_name, email, hash, mobile, type, status, user_id], (err, result) => {
        if (err) {
            console.log("ERROR WHEN UPDATING AN USER: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.delete('/api/delete-user/:id', (req, res) => {
    const user_id = req.params.id
    const sql = "DELETE FROM user WHERE user_id=?"
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.log("ERROR WHEN DELETING AN USER: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.delete('/api/delete-room/:id', (req, res) => {
    const roomID = req.params.id
    const sql = "DELETE FROM room WHERE roomID=?"
    db.query(sql, [roomID], (err, result) => {
        if (err) {
            console.log("ERROR WHEN DELETING AN ROOM: " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.post('/api/register-customer', (req, res) => {
    const sql = "INSERT INTO user(first_name, last_name, email, password, mobile, type, status) VALUES (?,?,?,?,?,2,1)"
    const hash = bcrypt.hashSync(req.body.password, 9)
    db.query(sql, [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.mobile], (err, result) => {
        if (err) {
            console.log("ERROR WHEN ADDING AN USER(Customer): " + err)
            res.json({
                success: false,
                err
            })
        } else {
            res.json({
                success: true,
                result
            })
        }
    })
})

app.post("/create", (req, res) => {
    const name = req.body.name;
    const star_rating = req.body.star_rating;
    const facilities = req.body.facilities;
    const street_number = req.body.street_number;
    const street_name = req.body.street_name;
    const city = req.body.city;
    const img =  Math.floor((Math.random() * 10) + 1) + ".jpg"
    db.query('INSERT INTO hotel (name,star_rating,facilities,street_number,street_name, city, img) VALUES (?,?,?,?,?,?,?)', [name, star_rating, facilities, street_number, street_name, city, img],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Hotel Inserted");
            }
        })
});

app.get("/hotels", (req, res) => {
    db.query('SELECT * FROM hotel', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete("/remove/:id", (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM hotel WHERE hotelID= ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.put("/update/:id", (req, res) => {
    const id = req.params.id;
    db.query('UPDATE FROM hotel SET name=?,star_rating=?,facilities=?,street_number=?,street_name=?,city=? WHERE hotelID=?', [name, star_rating, facilities, street_number, street_name, city], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});


// error handler
app.use(function(err, req, res, next) {
    res.json({
        success: false,
        msg: 'An error occured, please try again'
    });
    return;
});


// let pswrd = bcrypt.hashSync('A123456', 9);
// console.log(bcrypt.compareSync('a123456', pswrd));
// console.log(pswrd);