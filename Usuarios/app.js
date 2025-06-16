require('dotenv').config();
console.log('Variables cargadas:', {
  DB_USER: process.env.DB_USER,
  DB_SERVER: process.env.DB_SERVER,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'OK' : 'FALTA'
});
const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash'); // Añadido para mensajes flash
const passport = require('./auth'); // Asegúrate que auth.js esté en el mismo directorio

const app = express(); // Crear la instancia de Express aquí

// Configuración de middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(flash()); // Configurar flash messages

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', // Usa un fallback para desarrollo
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de Autenticación
app.post('/auth/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true
}));

app.post('/auth/register', passport.authenticate('local-register', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { 
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  }));

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Rutas de la aplicación
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error') });
});

app.get('/register', (req, res) => {
  res.render('register', { error: req.flash('error') });
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${3000}`);
});