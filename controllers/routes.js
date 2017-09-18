const express = require('express');
const router = express.Router();
const models = require('../models');
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true}));



router.get('/auth/login', (req, res) => {
  let newUser = false;
  res.render('login-register', {newUser});
});

// Create a new user
router.get('/auth/register', (req, res) => {
  let newUser = true;
  res.render('login-register', {newUser});
})

router.post('/auth/register', (req, res) => {
  // models.User.create({
  //   username: 'test',
  //   password: 'test',
  //   displayName: 'Test User'
  // })
  //This is for when we switch to the front end, commented out to pass tests
  models.User.create({
    displayName: req.body.displayName,
    username: req.body.username,
    password: req.body.password
  })
  .then(function(user) {

     console.log(user.get('id'));
     res.json({username: user.get('username'), displayName: user.get('displayName')});
    //  res.redirect('/home')
  });
})

router.get('/home', (req, res) => {
  res.render('index');
})


module.exports = router;
