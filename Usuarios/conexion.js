require('dotenv').config();
const sql = require('mssql');

// Configuración mejorada con validación de variables de entorno
const validateEnvVars = () => {
  const requiredVars = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
  }
};

// Configuración de conexión con opciones mejoradas
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000, // 30 segundos de timeout
    requestTimeout: 30000  // 30 segundos para las consultas
  },
  pool: {
    max: 10,               // Máximo de conexiones en el pool
    min: 0,                // Mínimo de conexiones
    idleTimeoutMillis: 30000 // Tiempo de inactividad
  }
};

// Conexión con manejo mejorado de errores y reconexión
const createConnectionPool = async () => {
  try {
    validateEnvVars();
    
    const pool = new sql.ConnectionPool(config);
    const poolConnect = pool.connect();

    // Manejo de eventos de conexión
    pool.on('error', err => {
      console.error('⚠️ Error en el pool de conexiones:', err.message);
      // Aquí podrías implementar lógica de reconexión
    });

    await poolConnect;
    console.log('✅ Conectado exitosamente a SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Error crítico de conexión:', err.message);
    
    // Intento de reconexión después de 5 segundos
    console.log('⚡ Intentando reconectar en 5 segundos...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return createConnectionPool();
  }
};

// Exportación con singleton pattern para reutilizar la conexión
module.exports = {
  sql,
  poolPromise: createConnectionPool(),
  close: async () => {
    try {
      const pool = await poolPromise;
      await pool.close();
      console.log('🔌 Conexión a SQL Server cerrada');
    } catch (err) {
      console.error('Error al cerrar la conexión:', err);
    }
  }
};