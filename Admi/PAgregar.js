document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formAgregarProducto');
    const fileInput = document.getElementById('imagen');
    const fileNameSpan = document.getElementById('nombre-archivo');

    // Mostrar nombre del archivo seleccionado
    fileInput.addEventListener('change', function() {
        fileNameSpan.textContent = this.files[0] ? this.files[0].name : 'Seleccionar archivo';
    });

    // Enviar formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        try {
            const response = await fetch('/api/agregar', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Producto agregado correctamente',
                    confirmButtonText: 'Aceptar'
                });
                form.reset();
                fileNameSpan.textContent = 'Seleccionar archivo';
            } else {
                throw new Error(data.message || 'Error al agregar producto');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonText: 'Aceptar'
            });
            console.error('Error:', error);
        }
    });

    // Botón cancelar
    document.querySelector('.cancel-btn').addEventListener('click', function() {
        form.reset();
        fileNameSpan.textContent = 'Seleccionar archivo';
    });
});