const express = require('express');
const app = express();
const db = require('./db');
const expresssession = require('express-session');
const bodyParser = require('body-parser');
const passport = require('./auth');

app.use(bodyParser.json());

app.use(expresssession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000 * 60 // 60 minutes
  }
}));

const logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request Made to : ${req.originalUrl}`);
  next(); // Move on to the next phase
};

app.use(logRequest);

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.send('Welcome to our Hotel');
});

// Middleware to check if session exists
const checkSession = (req, res, next) => {
  console.log('Checking session:', req.session);
  if (req.session && req.session.visited) {
    next();
  } else {
    res.redirect('http://localhost:3000/login');
  }
};


const userRoute = require('./routes/userRoute');
const itemRoute = require('./routes/itemRoute');
const cartRoute = require('./routes/cartRoute');
const authRoute = require('./routes/authRoute');


app.use('/', authRoute);

app.use(checkSession);

app.use('/user', userRoute);
app.use('/item', itemRoute);
app.use('/cart', cartRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
