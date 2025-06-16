document.addEventListener('DOMContentLoaded', async () => {
    const productosContainer = document.querySelector('.productos-container');
    
    if (!productosContainer) {
        console.error('No se encontró el contenedor de productos');
        return;
    }

    // Mostrar mensaje de carga
    productosContainer.innerHTML = '<div class="loading">Cargando productos...</div>';

    try {
        // Cambiar la URL a /api/productos
        const response = await fetch('http://localhost:3000/api/Ropa');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const productos = await response.json();
        
        console.log('Productos recibidos:', productos); // Para depuración

        if (productos.length === 0) {
            productosContainer.innerHTML = '<div class="no-products">No hay productos disponibles</div>';
            return;
        }

        // Generar el HTML de los productos
        productosContainer.innerHTML = productos.map(producto => `
            <div class="producto-card">
                <div class="producto-imagen">
                    <img src="${producto.ImagenUrl}" alt="${producto.Nombre}"
                         onerror="this.onerror=null;this.src='https://via.placeholder.com/300x400?text=Imagen+no+disponible';">
                </div>
                <div class="producto-info">
                    <h3>${producto.Nombre}</h3>
                    <p class="categoria">${producto.Categoria}</p>
                    <p class="precio">$${producto.Precio.toFixed(2)}</p>
                    <p class="stock">${producto.Stock} unidades</p>
                    <button class="btn-agregar" data-id="${producto.IdProducto}">
                        Añadir al carrito
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error al cargar productos:', error);
        productosContainer.innerHTML = `
            <div class="error-loading">
                <p>Error al cargar los productos</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
});

function agregarAlCarrito(e) {
    const productId = e.currentTarget.getAttribute('data-id');
    Swal.fire({
        icon: 'success',
        title: 'Producto añadido',
        text: 'El producto ha sido añadido al carrito',
        confirmButtonText: 'Aceptar'
    });
    // Aquí puedes agregar la lógica del carrito
}