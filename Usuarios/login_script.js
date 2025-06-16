document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validación básica
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        console.log('Iniciando sesión con:', { email, password });
        // Aquí iría la lógica para autenticar al usuario
        
        // Redirección temporal (simulación)
        alert('Inicio de sesión exitoso. Redirigiendo...');
        // window.location.href = 'index.html';
    });
});