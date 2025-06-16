const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Configuración de SQL Server
const config = {
    user: 'BoutiqueAdmin',
    password: '1234',
    server: 'ALE-ROMERO\SQLEXPRESS', // Por ejemplo: 'localhost\\SQLEXPRESS'
    database: 'BoutiqueDB',
    options: {
        encrypt: true, // Si usas Azure
        trustServerCertificate: true // Para desarrollo local
    }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Usaremos EJS para las vistas

// Conexión a la base de datos
sql.connect(config).then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
}).catch(err => {
    console.error('Error de conexión:', err);
});

// Rutas
app.get('/pedidos', listarPedidos);
app.get('/pedidos/:id/detalles', verDetallesPedido);
async function verDetallesPedido(req, res) {
    try {
        const { id } = req.params;
        
        // Obtener información del pedido
        const pedidoResult = await pool.request()
            .input('idPedido', sql.Int, id)
            .query(`
                SELECT p.IdPedido, p.FechaPedido, p.Estado, 
                       u.Nombre as Cliente, p.Total
                FROM Pedidos p
                JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
                WHERE p.IdPedido = @idPedido
            `);
        
        // Obtener detalles del pedido
        const detallesResult = await pool.request()
            .input('idPedido', sql.Int, id)
            .query(`
                SELECT d.IdPedidoDetalle, d.Cantidad, 
                       pr.Nombre as Producto, pr.Precio,
                       (d.Cantidad * pr.Precio) as Subtotal
                FROM PedidoDetalles d
                JOIN Productos pr ON d.IdProducto = pr.IdProducto
                WHERE d.IdPedido = @idPedido
            `);
        
        res.render('detallesPedido', { 
            title: 'Detalles del Pedido',
            pedido: pedidoResult.recordset[0],
            detalles: detallesResult.recordset
        });
    } catch (err) {
        console.error('Error al obtener detalles del pedido:', err);
        res.status(500).send('Error al obtener detalles del pedido');
    }
}

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});