const express = require('express');
const router = express.Router();
// const models = require('./models');



router.get('/login', (req, res) => {
  let newUser = false;
  res.render('login', {newUser: newUser});
});

router.get('/register', (req, res) => {
  let newUser = true;
  res.render('login', {newUser: newUser});
})

router.get('/home', (req, res) => {
  res.render('index');
})


module.exports = router;
