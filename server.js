if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser'); // Added body-parser middleware

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users = [];

app.set('view engine', 'ejs');
app.use(bodyParser.json()); // Added body-parser middleware
app.use(bodyParser.urlencoded({ extended: false })); // Added body-parser middleware
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => { // Changed to checkNotAuthenticated middleware
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => { // Changed to checkNotAuthenticated middleware
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => { // Changed to checkNotAuthenticated middleware
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.name, // Is this intended? It is duplicated with the line below
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
});

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

app.listen(5500); // Apply this code into the program: // server.js or app.js

const express = require('express');
const bodyParser = require('body-parser');

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Route handler for "/login" endpoint
app.post('/login', (req, res) => {
  // Extract form data from request body
  const email = req.body.email;
  const password = req.body.password;

  // TODO: Implement login logic here
  // Validate form data, check against stored credentials, etc.

  // Send response or redirect to appropriate page
  res.send('Login successful!'); // or res.redirect('/dashboard') for example
});

// Start server
app.listen(5500, () => {
  console.log('Server is running on http://localhost:5500');
});
