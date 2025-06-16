const { poolPromise } = require('./conexion');

const userRepository = {
  async getUsers() {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .query('SELECT * FROM Usuarios');
      return result.recordset;
    } catch (err) {
      console.error('Error en consulta de usuarios:', err);
      throw err; // O maneja el error como prefieras
    }
  },

  // Puedes agregar más métodos aquí
  async getUserById(id) {
    // Implementación similar
  }
};

module.exports = userRepository;