const bcrypt = require('bcryptjs');

class Router {

    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.modifyModerator(app, db);
        this.createModerator(app, db);
        this.modifyRoom(app, db);
    }

    login(app , db) {
        app.post('/login', (req, res) => {
            let email = req.body.email;
            let password = req.body.password;


            email = email.toLowerCase().trim();

            if(email.length > 50 || password.length > 50){
                res.json({
                    success: false,
                    msg: 'An error occured, please try again'
                });
                return;
            }

            let cols = [email];
            db.query("SELECT * FROM user WHERE email = ? LIMIT 1", cols, (err, data, fields) => {

                if(err) {
                    res.json({
                        success: false,
                        msg: "login error occured, please restart the server and try again",
                    })
                    return;
                }

                //Found a user
                if(data && data.length === 1) {
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified)=>{
                        if(verified) {
                            req.session.userID = data[0].user_id;
                            res.json({
                                success:true,
                                first_name: data[0].first_name,
                                email: data[0].email,
                                type:data[0].type,
                            });
                            return;
                        }else {
                            res.json({
                                success:false,
                                msg : "Invalid password",
                            })
                        }
                    })
                } else {
                    res.json({
                        success:false,
                        msg: "User not found"
                    })
                }
            });
        });
    }

    logout(app, db) {

        app.post('/logout', (req, res)=>{
            if(req.session.userID) {

                req.session.destroy();
                console.log("Session succesfully destroyed");
                res.json({
                    success:true,
                })
                return true;
            } else {
                res.json({
                    success: false,
                })

                return false;
            }
        })
    }

    isLoggedIn(app, db) {

        app.post('/isLoggedIn', (req, res)=>{
            // req.session.destroy();
            if(req.session.userID || req.session.userID == 0) {
                let cols = [req.session.userID];
                db.query('SELECT * FROM user WHERE user_id = ? LIMIT 1',cols, (err, data, fields) => {
                    if(data && data.length === 1) {
                        res.json({
                            success: true,
                            first_name: data[0].first_name,
                            email: data[0].email,
                            type:data[0].type,
                        });

                        return true;
                    }else  {
                        res.json({
                            success: false,
                        });
                    }
                });
            }else {
                res.json({
                    success: false
                })
            }
        });
    }

    changeDatabase(sql, values, db) {
        db.query(sql, values, (err, fields)=>{
            if(err){
                return false;
            }else {
                return true;
            }
        });

    }

    modifyModerator(app, db) {
        app.post('/modifyModerator', (req, res) => {
            if(req.session.userID) {
                if(req.body.firstName !== ''){
                    if(this.changeDatabase('UPDATE user set first_name=? where user_id=?', [req.body.firstName, req.body.id], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.lastName !== '') {
                    if(this.changeDatabase('UPDATE user set last_name=? where user_id=?', [req.body.lastName, req.body.id], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.email !== '') {
                    if(this.changeDatabase('UPDATE user set email=? where user_id=?', [req.body.email, req.body.id], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.mobile !== '' || req.body.mobile >0) {
                    if(this.changeDatabase('UPDATE user set mobile=? where user_id=?', [req.body.email, req.body.id], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }

                res.json({
                    success: true,
                });
                return true;
            }
        });
    }

    createModerator(app, db) {
        app.post('/createModerator',(req, res)=>{
            if(req.session.userID) {
                
            }
        });
    }

    modifyRoom(app, db) {
        app.post('/modifyRoom', (req, res) => {
            if(req.session.userID) {
                if(req.body.hotelID !== '' && req.body.hotelID >0){
                    if(this.changeDatabase('UPDATE room set hotelID=? where roomID=?', [req.body.hotelID, req.body.roomID], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.name !== '') {
                    if(this.changeDatabase('UPDATE room set name=? where roomID=?', [req.body.name, req.body.roomID], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.num_of_people !== '' && req.body.num_of_people >0) {
                    if(this.changeDatabase('UPDATE room set num_of_people=? where roomID=?', [req.body.num_of_people, req.body.roomID], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.ac_or_non_ac !== '') {
                    if(this.changeDatabase('UPDATE room set ac_or_non_ac=? where roomID=?', [req.body.ac_or_non_ac, req.body.roomID], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }
                if(req.body.price >0) {
                    if(this.changeDatabase('UPDATE room set price=? where roomID=?', [req.body.price, req.body.roomID], db) === false){
                        res.json({
                            success: false,
                        });
                        return false;
                    }
                }

                res.json({
                    success: true,
                });
                return true;
            }
        });
    }
}

module.exports = Router;