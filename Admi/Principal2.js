$(document).ready(function() {
    // Esta función se conectará a tu API para cargar los datos reales
    cargarDatosDashboard();
});

function cargarDatosDashboard() {
    // Simulación de datos - Reemplazar con llamada real a tu API
    const datosSimulados = {
        pedidos_hoy: 0,
        total_productos: 0,
        total_clientes: 0,
        pedidos_recientes: []
    };
    
    // Actualizar la interfaz con los datos
    actualizarUI(datosSimulados);
}

function actualizarUI(datos) {
    $('#pedidos-hoy').text(datos.pedidos_hoy);
    $('#total-productos').text(datos.total_productos);
    $('#total-clientes').text(datos.total_clientes);
    
    // Actualizar tabla de pedidos recientes
    const $tbody = $('#pedidos-recientes');
    $tbody.empty();
    
    if (datos.pedidos_recientes.length > 0) {
        datos.pedidos_recientes.forEach(pedido => {
            $tbody.append(`
                <tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.cliente}</td>
                    <td>${pedido.fecha}</td>
                    <td>${pedido.total}</td>
                </tr>
            `);
        });
    } else {
        $tbody.append(`
            <tr>
                <td colspan="4">No hay pedidos recientes</td>
            </tr>
        `);
    }
}

// Ejemplo de función para conectar con tu API real
function cargarDatosReales() {
    $.ajax({
        url: '../api/estadisticas.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            actualizarUI(data);
        },
        error: function() {
            console.error('Error al cargar datos del dashboard');
        }
    });
}