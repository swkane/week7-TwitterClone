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
  req.session.destroy();
  res.json({success: true, message: "Logged out!"});
})

// Index
router.get('/home', (req, res) => {
  res.render('index');
})

// LIKES

//create a like
router.post('/likes', (req, res) => {
  models.Like.create({
    postId: req.body.messageId,
    userId: req.body.userId
  })
  .then((like) => {
    console.log(like);
    res.json({message: like});
  })
})

// delete a like
router.delete('/likes/:id', (req, res) => {
  models.Like.destroy({
    where: {
      id: req.params.id
    }
  })
  .then((like) => {
    res.json({like: req.params.id});
  })
})



// MESSAGES

// create a message
router.post('/messages', (req, res) => {
  models.Post.create({
    body: req.body.text,
    userId: req.session.user_id
  })
  .then((post) => {
    console.log(post.get('id'));
    res.json({message: post})
  })
})

// get all messages created by all users with likes
router.get('/messages', (req, res) => {
  models.Post.findAll({include: [models.Like]})
  .then((posts) => {
    res.json({messages: posts})
  })
})

// get 1 message by id with its likes
router.get('/messages/:id', (req, res) => {
  models.Post.findById(req.params.id, {
    include: [models.Like]
  })
  .then((post) => {
    res.json({message: post})
  });
});

// Delete a specific message by id


router.delete('/messages/:id', (req, res) => {
  // delete the likes on the message
  models.Like.destroy({
    where: {
      postId: req.params.id
    }
  })
  .then(() => {
    return models.Post.destroy({
      where: {
        id: req.params.id
      }
    })
  })
  .then(() => {
    res.json({message: req.params.id})
  })
})

// USERS

// get a user
router.get('/user', (req, res) => {
  models.User.findById(req.session.user_id, {
    attributes: ['displayName'],
    include: [{
      model: models.Post,
      include: [models.Like]
    }]
  })
  .then(user => res.json({ user }));
});

// Update a users password


// delete a user and everything associated with it
router.delete('/user', (req, res) => {
  models.Like.destroy({
    where: {
      userId: req.session.user_id
    }
  })
  .then(() => {
    return models.Post.destroy({
      where: {
        userId: req.session.user_id
      }
    })
  })
  .then(() => {
    return models.User.destroy({
      where: {
        id: req.session.user_id
      }
    })
  })
  .then(user => res.json({user: req.session.user_id}))
});




module.exports = router;
