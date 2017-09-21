const express = require('express');
const router = express.Router();
const models = require('../models');
const bodyParser = require('body-parser');
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));

// Authentication Boiler Plate

const { Strategy } = require("passport-jwt");
const authMiddleware = passport.authenticate("jwt", { session: false });
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "elbbag"
};

passport.use(new Strategy(jwtOptions, (payload, done) => {
    models.users.findById(payload.id)
      .then(user => {
        if (typeof user !== "undefined") {
          // authenticated!
          done(null, user);
        } else {
          // not authenticated
          done(null, false);
        }
      })
      // or, more succinctly..
      .then(user => done(null, user || false));
}));
router.use(passport.initialize());

// setting up session
passport.session = {
    user_id: "",
    username: "",
    displayName: "",
    password: "",
    created_at: "",
    updated_at: "",
    messages: [],
    token: ""
}


// Create a new user
router.get('/auth/register', (req, res) => {
  let newUser = true;
  res.render('login-register', {newUser});
})

router.post('/auth/register', (req, res) => {
  models.User.create({
    displayName: req.body.displayName,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  })
  .then(function(user) {

     console.log(user.get('id'));
     res.json({username: user.get('username'), displayName: user.get('displayName')});
    //  res.redirect('/home')
  });
})

// AUTH

// Login
router.get('/auth/login', (req, res) => {
  let newUser = false;
  res.render('login-register', {newUser});
});

router.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    models.User.find({  where: { username }})
        .then(user => {
              if (user && bcrypt.compareSync(password, user.get("password"))) {
                  const payload = { id: user.get("id") };
                  const token = jwt.sign(payload, jwtOptions.secretOrKey);
                  req.session.username = username;
                  req.session.password = password;
                  req.session.user_id = user.get('id');
                  req.session.token = token;
                  res.json({token: req.session.token, username: req.session.username, success: true });
              } else {
                  res.json({ success: false });
              }
        });
});

// Logout
router.get('/auth/logout', (req, res) => {
  req.session.username = "";
  req.session.token = "";
  res.json({success: true, message: "Logged out!"});
})

// Index
router.get('/home', (req, res) => {
  res.render('index');
})

// LIKES


// MESSAGES


// USERS

// ERROR claims that username is undefined
router.delete('/user', (req, res) => {
  console.log(req.session.user_id);
  models.User.destroy({
    where: {
      id: req.session.user_id
    }
  }).then((user) => {
    res.json({user: req.session.user_id})
  });
});




module.exports = router;
