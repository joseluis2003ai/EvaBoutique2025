import db from './agregar.js';

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formAgregarProducto');
    const inputImagen = document.getElementById('imagen');
    const nombreArchivo = document.getElementById('nombre-archivo');

    // Mostrar nombre de archivo seleccionado
    inputImagen.addEventListener('change', (e) => {
        nombreArchivo.textContent = e.target.files[0]?.name || 'Seleccionar archivo';
    });

    // Manejar envío del formulario
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(formulario);
        const producto = {
            nombre: formData.get('nombre'),
            categoria: formData.get('categoria'),
            precio: parseFloat(formData.get('precio')),
            stock: parseInt(formData.get('stock')),
            descripcion: formData.get('descripcion'),
            imagenUrl: await subirImagen(inputImagen.files[0])
        };

        try {
            const resultado = await db.agregarProducto(producto);
            alert('Producto agregado exitosamente');
            formulario.reset();
            nombreArchivo.textContent = 'Seleccionar archivo';
        } catch (error) {
            console.error('Error:', error);
            alert('Error al agregar producto: ' + error.message);
        }
    });

    // Función para subir imagen (simulada)
    async function subirImagen(archivo) {
        if (!archivo) return 'default.jpg';
        
        // En una implementación real, aquí subirías el archivo al servidor
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`productos/${Date.now()}_${archivo.name}`);
            }, 1000);
        });
    }
});