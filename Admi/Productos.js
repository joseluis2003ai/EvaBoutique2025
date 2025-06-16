class ProductoManager {
    constructor() {
        this.formulario = document.getElementById('formulario-producto');
        this.btnGuardar = document.getElementById('btn-guardar');
        this.btnCancelar = document.getElementById('btn-cancelar');
        this.inputImagen = document.getElementById('imagen');
        this.nombreArchivo = document.getElementById('nombre-archivo');
        
        this.initEventos();
    }
    
    initEventos() {
        // Evento para mostrar el nombre del archivo seleccionado
        this.inputImagen.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.nombreArchivo.textContent = e.target.files[0].name;
            } else {
                this.nombreArchivo.textContent = 'Ningún archivo seleccionado';
            }
        });
        
        // Evento para enviar el formulario
        this.formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarProducto();
        });
        
        // Evento para cancelar
        this.btnCancelar.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.')) {
                window.location.href = 'Ropa.html';
            }
        });
    }
    
    async guardarProducto() {
        const formData = new FormData(this.formulario);
        
        // Validación básica
        if (!formData.get('nombre') || !formData.get('categoria')) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        this.btnGuardar.disabled = true;
        this.btnGuardar.textContent = 'Guardando...';
        
        try {
            // En un caso real, aquí subirías la imagen a un servidor primero
            const imagenUrl = await this.subirImagen(formData.get('imagen'));
            
            const productoData = {
                nombre: formData.get('nombre'),
                categoria: formData.get('categoria'),
                precio: parseFloat(formData.get('precio')),
                stock: parseInt(formData.get('stock')),
                descripcion: formData.get('descripcion'),
                imagenUrl: imagenUrl || 'default-product.jpg'
            };
            
            const response = await fetch('php/productos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert('Producto guardado exitosamente');
                this.formulario.reset();
                this.nombreArchivo.textContent = 'Ningún archivo seleccionado';
            } else {
                throw new Error(result.message || 'Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el producto: ' + error.message);
        } finally {
            this.btnGuardar.disabled = false;
            this.btnGuardar.textContent = 'Guardar Producto';
        }
    }
    
    async subirImagen(archivo) {
        if (!archivo) return null;
        
        // En una implementación real, usarías FormData para subir el archivo a tu servidor
        // y devolverías la URL de la imagen subida
        return new Promise((resolve) => {
            // Simulación de subida de archivo
            setTimeout(() => {
                resolve(`productos/${Date.now()}_${archivo.name}`);
            }, 1000);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ProductoManager();
});