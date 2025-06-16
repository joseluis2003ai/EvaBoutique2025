import db from './database.js';

class PedidosManager {
    constructor() {
        this.tablaPedidos = document.getElementById('tabla-pedidos');
        this.init();
    }

    async init() {
        await db.connect();
        this.cargarPedidos();
        this.actualizarEstadisticas();
    }

    async cargarPedidos() {
        try {
            const pedidos = await db.query(`
                SELECT p.IdPedido, p.idUsuario, p.FechaPedido, p.Total, c.Nombre as NombreCliente
                FROM pedidos p
                JOIN clientes c ON p.idUsuario = c.idUsuario
                ORDER BY p.FechaPedido DESC
                LIMIT 10
            `);

            this.mostrarPedidos(pedidos);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        }
    }

    mostrarPedidos(pedidos) {
        const tbody = this.tablaPedidos.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (pedidos.length === 0) {
            const tr = document.createElement('tr');
            tr.className = 'empty-row';
            tr.innerHTML = '<td colspan="4">No hay pedidos recientes</td>';
            tbody.appendChild(tr);
            return;
        }

        pedidos.forEach(pedido => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${pedido.IdPedido}</td>
                <td>${pedido.NombreCliente}</td>
                <td>${new Date(pedido.FechaPedido).toLocaleDateString()}</td>
                <td>$${pedido.Total.toFixed(2)}</td>
            `;
            
            tbody.appendChild(tr);
        });
    }

    async actualizarEstadisticas() {
        try {
            // Pedidos de hoy
            const [pedidosHoy] = await db.query(`
                SELECT COUNT(*) as count FROM pedidos 
                WHERE DATE(FechaPedido) = CURDATE()
            `);
            
            document.getElementById('pedidos-hoy').textContent = pedidosHoy.count;

            // Total de productos
            const [totalProductos] = await db.query(`
                SELECT COUNT(*) as total FROM productos
            `);
            
            document.getElementById('total-productos').textContent = totalProductos.total;
        } catch (error) {
            console.error("Error al actualizar estadísticas:", error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PedidosManager();
});