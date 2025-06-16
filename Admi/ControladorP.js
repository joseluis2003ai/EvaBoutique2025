async function listarPedidos(req, res) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .query(`
                SELECT p.IdPedido, p.FechaPedido, p.Estado, u.Nombre as Usuario
                FROM Pedidos p
                JOIN Usuarios u ON p.IdUsuario = u.IdUsuario
                ORDER BY p.FechaPedido DESC
            `);
        
        res.render('pedidos', { pedidos: result.recordset });
    } catch (err) {
        console.error('Error al obtener pedidos:', err);
        res.status(500).send('Error al obtener pedidos');
    }
}