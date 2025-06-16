// Función para inicializar el formulario
export function initAddProductForm() {
  const form = document.getElementById('formAgregarProducto');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('.submit-btn');
      
      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
        
        const response = await fetch('http://localhost:3000/api/agregar', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: data.message,
            confirmButtonText: 'Aceptar'
          }).then(() => {
            form.reset();
            document.getElementById('nombre-archivo').textContent = 'Seleccionar archivo';
            // Opcional: Redirigir o actualizar la lista
            window.location.href = '../Usuarios/Ropa.html';
          });
        } else {
          throw new Error(data.message || 'Error desconocido');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          confirmButtonText: 'Aceptar'
        });
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Producto';
      }
    });
  }
  
  // Mostrar nombre del archivo seleccionado
  const fileInput = document.getElementById('imagen');
  const fileNameLabel = document.getElementById('nombre-archivo');
  
  if (fileInput && fileNameLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameLabel.textContent = fileInput.files[0].name;
      } else {
        fileNameLabel.textContent = 'Seleccionar archivo';
      }
    });
  }
}