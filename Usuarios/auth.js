require('dotenv').config(); // Asegurar que las variables de entorno estén cargadas
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const { poolPromise, sql } = require('./conexion');

// Validación de variables de entorno para Google OAuth
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Faltan variables de entorno para Google OAuth');
}

// Configuración común para las estrategias
const poolErrorHandler = async (error) => {
  console.error('Error de conexión a la base de datos:', error);
  throw error;
};

// Estrategia Local para Login
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: false
}, async (email, password, done) => {
  try {
    const pool = await poolPromise.catch(poolErrorHandler);
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query("SELECT * FROM Usuarios WHERE Correo = @email AND MetodoLogin = 'normal'");

    if (result.recordset.length === 0) {
      return done(null, false, { message: 'Credenciales inválidas' }); // Mensaje genérico por seguridad
    }

    const user = result.recordset[0];
    const isValid = await bcrypt.compare(password, user.ContraseñaHash);

    if (!isValid) {
      return done(null, false, { message: 'Credenciales inválidas' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia Local para Registro
passport.use('local-register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const pool = await poolPromise.catch(poolErrorHandler);
    
    // Validación de campos adicionales
    if (!req.body.name || !email || !password) {
      return done(null, false, { message: 'Faltan campos requeridos' });
    }

    const checkResult = await pool.request()
      .input('email', sql.NVarChar, email)
      .query("SELECT 1 FROM Usuarios WHERE Correo = @email");

    if (checkResult.recordset.length > 0) {
      return done(null, false, { message: 'El correo ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Aumentamos el salt rounds

    const insertResult = await pool.request()
      .input('nombre', sql.NVarChar, req.body.name.trim())
      .input('email', sql.NVarChar, email.toLowerCase().trim())
      .input('passwordHash', sql.NVarChar, hashedPassword)
      .input('metodoLogin', sql.NVarChar, 'normal')
      .query(`INSERT INTO Usuarios (Nombre, Correo, ContraseñaHash, MetodoLogin) 
              VALUES (@nombre, @email, @passwordHash, @metodoLogin);
              SELECT SCOPE_IDENTITY() AS IdUsuario;`);

    const newUser = {
      IdUsuario: insertResult.recordset[0].IdUsuario,
      Nombre: req.body.name,
      Correo: email,
      MetodoLogin: 'normal'
    };

    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Estrategia Google OAuth mejorada
passport.use('google', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
  scope: ['profile', 'email'],
  state: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile.emails || !profile.emails[0]) {
      return done(null, false, { message: 'No se pudo obtener el email de Google' });
    }

    const pool = await poolPromise.catch(poolErrorHandler);
    const email = profile.emails[0].value.toLowerCase();
    const displayName = profile.displayName || email.split('@')[0];

    // Transacción para mayor seguridad
    const transaction = new sql.Transaction(await pool.connect());
    try {
      await transaction.begin();

      let userResult = await transaction.request()
        .input('email', sql.NVarChar, email)
        .query("SELECT * FROM Usuarios WHERE Correo = @email");

      if (userResult.recordset.length === 0) {
        const insertResult = await transaction.request()
          .input('nombre', sql.NVarChar, displayName)
          .input('email', sql.NVarChar, email)
          .input('metodoLogin', sql.NVarChar, 'google')
          .query(`INSERT INTO Usuarios (Nombre, Correo, MetodoLogin) 
                  VALUES (@nombre, @email, @metodoLogin);
                  SELECT SCOPE_IDENTITY() AS IdUsuario;`);

        userResult = {
          recordset: [{
            IdUsuario: insertResult.recordset[0].IdUsuario,
            Nombre: displayName,
            Correo: email,
            MetodoLogin: 'google'
          }]
        };
      }

      await transaction.commit();
      return done(null, userResult.recordset[0]);
    } catch (txError) {
      await transaction.rollback();
      throw txError;
    }
  } catch (err) {
    return done(err);
  }
}));

// Serialización/Deserialización mejorada
passport.serializeUser((user, done) => {
  done(null, {
    id: user.IdUsuario,
    type: user.MetodoLogin // Guardamos el método de login para la deserialización
  });
});

passport.deserializeUser(async (serializedUser, done) => {
  try {
    const pool = await poolPromise.catch(poolErrorHandler);
    const result = await pool.request()
      .input('id', sql.Int, serializedUser.id)
      .query("SELECT * FROM Usuarios WHERE IdUsuario = @id");
    
    if (result.recordset.length === 0) {
      return done(new Error('Usuario no encontrado'));
    }

    const user = result.recordset[0];
    
    // Validación adicional para usuarios de Google
    if (serializedUser.type === 'google' && user.MetodoLogin !== 'google') {
      return done(new Error('Método de autenticación inválido'));
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;