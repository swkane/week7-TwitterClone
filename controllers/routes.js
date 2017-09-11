const express = require('express');
const router = express.Router();
const models = require('../models');



router.get('/login', (req, res) => {
  let newUser = false;
  res.render('login-register', {newUser});
});

// Create a new user
router.get('/register', (req, res) => {
  let newUser = true;
  res.render('login-register', {newUser});
})

router.post('/register', (req, res) => {

})

router.get('/home', (req, res) => {
  res.render('index');
})


module.exports = router;
