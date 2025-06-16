// Función para marcar el item activo en el menú
$(document).ready(function() {
    // Resaltar la página actual en el menú
    const currentPage = window.location.pathname.split('/').pop();
    $('.nav-item').removeClass('active');
    $(`.nav-item[href="${currentPage}"]`).addClass('active');
    
    // Mostrar año actual en el footer (si existe)
    if ($('#current-year').length) {
        $('#current-year').text(new Date().getFullYear());
    }
});