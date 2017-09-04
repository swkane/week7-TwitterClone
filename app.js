const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
app.use(express.static('public'));
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/login', (req, res) => {
  let newUser = false;
  res.render('login', {newUser: newUser});
});

app.get('/register', (req, res) => {
  let newUser = true;
  res.render('login', {newUser: newUser});
})

app.get('/home', (req, res) => {
  res.render('index');
})

app.listen(3000, () => console.log("Gabble Running on Port 3000"));
