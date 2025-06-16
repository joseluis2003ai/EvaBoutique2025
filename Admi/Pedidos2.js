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
                SELECT p.IdPedido, p.idUsuario, p.FechaPedido, p.Total, p.Estado, c.Nombre as NombreCliente
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
        
        // Limpiar tabla
        tbody.innerHTML = '';
        
        if (pedidos.length === 0) {
            const tr = document.createElement('tr');
            tr.className = 'empty-row';
            tr.innerHTML = '<td colspan="6">No hay pedidos recientes</td>';
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
                <td class="estado-${pedido.Estado.toLowerCase()}">${pedido.Estado}</td>
                <td>
                    <button class="btn-accion btn-ver" data-id="${pedido.IdPedido}">Ver</button>
                    <button class="btn-accion btn-editar" data-id="${pedido.IdPedido}">Editar</button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });

        // Agregar eventos a los botones
        this.agregarEventosBotones();
    }

    agregarEventosBotones() {
        document.querySelectorAll('.btn-ver').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idPedido = e.target.getAttribute('data-id');
                this.verDetallePedido(idPedido);
            });
        });

        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idPedido = e.target.getAttribute('data-id');
                this.editarPedido(idPedido);
            });
        });
    }

    verDetallePedido(idPedido) {
        console.log(`Ver detalle del pedido ${idPedido}`);
        // Aquí iría la lógica para mostrar el detalle del pedido
        alert(`Mostrando detalle del pedido ${idPedido}`);
    }

    editarPedido(idPedido) {
        console.log(`Editar pedido ${idPedido}`);
        // Aquí iría la lógica para editar el pedido
        alert(`Editando pedido ${idPedido}`);
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