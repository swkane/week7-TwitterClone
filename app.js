const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./controllers/routes');
app.use(express.static('public'));
// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

// Boiler Plate

// Mustache
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('landing');
});

// routes
app.use(routes);


app.listen(3000, () => console.log("Gabble Running on Port 3000"));
