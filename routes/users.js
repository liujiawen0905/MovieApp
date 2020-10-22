var express = require('express');
var router = express.Router();

const db = require('../database/db')
const usersql = require('../database/usersql')
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

const passport = require('passport')
const initializePassport = require('../passportLocalConfig')
 initializePassport(passport);

router.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized:false
}));

router.use(passport.initialize())
router.use(passport.session())

router.use(flash());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', (req, res, next)=>{
  let { email, password } = req.body;
  console.log({email, password});
  res.render('login');
})

router.get('/register', (req, res, next)=>{
  res.render('register');
})

router.post('/register', async (req, res, next)=>{
  let { email, password } = req.body;
  console.log({email, password});

  let error_messages = [];

  if(!email, !password){
    error_messages.push({message: "Please enter all fields!"})
  }

  if(password.length < 6){
    error_messages.push({message: "Password should be at leaset 6 characters!"})
  }

  if(error_messages.length > 0){
    console.log(error_messages);
    res.render('register', {
      error_messages: error_messages
    });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);
    db.query(usersql.getUserByEmail, [email], (error, dbResponse)=>{
      if(error){
        throw error
      }
      console.log('user data from database', dbResponse.rows)

      if(dbResponse.rows.length > 0){
        error_messages.push({message:"Email already regitered"})
      res.render('register',{
        error_messages: error_messages
      })
    } else {
      db.query(usersql.insertUserInfo, [email, hashedPassword], (error, dbResponse)=>{
        if(error){
          throw error
        }
        console.log(dbResponse.rows)
        req.flash("success_msg", "You are now registered, please log in")
        // console.log("This is locals data!!!!!!!===================== start")
        // console.log(req.flash("success_msg"))
        // console.log("This is locals data!!!!!!!===================== end")
        res.redirect('/users/login')
      })
    }
  })
}
})

router.post("/login", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'login',
  failureFlash: true
}))

module.exports = router;
