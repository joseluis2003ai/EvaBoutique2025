async function verDetallesPedido(req, res) {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config);
        
        // Obtener información del pedido
        const pedidoResult = await pool.request()
            .input('idPedido', sql.Int, id)
            .query(`
                SELECT p.IdPedido, p.FechaPedido, p.Estado, u.Nombre as Usuario
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
            pedido: pedidoResult.recordset[0],
            detalles: detallesResult.recordset 
        });
    } catch (err) {
        console.error('Error al obtener detalles del pedido:', err);
        res.status(500).send('Error al obtener detalles del pedido');
    }
}