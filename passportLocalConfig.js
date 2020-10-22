const LocalStrategy = require('passport-local').Strategy;
const db = require('./database/db');
const bcrypt = require('bcrypt');

function initialize(passport) {
    const autheticateUser = (email, password, done) =>{
        db.query('SELECT * FROM users WHERE email = $1', [email], (error, dbResponse)=>{
            if(error){
                throw error;
            }

            if(dbResponse.rows.length > 0){
                const user = dbResponse.rows[0];

                console.log('this is user in local config!', user)

                bcrypt.compare(password, user.password, (error, isMatch)=>{
                    if (error) {
                        throw error;
                    }

                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "Password is not correct"})
                    }
                });
            } else {
                return done(null, false, {message: "Email is not registered"})
            }
        })
    };

    passport.use(
        new LocalStrategy({usernameField: "email", passwordField: "password"}, autheticateUser)
    );

    passport.serializeUser((user, done)=> done(null, user.id));

    passport.deserializeUser((id, done) =>{
        db.query('SELECT * FROM users WHERE id = $1', [id], (error, dbResponse)=>{
            if(error) {
                throw error;
            }
            console.log('deserializeUser============!!!', dbResponse.rows[0])
            return done(null, dbResponse.rows[0]);
        })
    })
}

module.exports = initialize;