document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('.signup-form');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const description = document.getElementById('description').value;
        
        // Validación básica
        if (!email || !password || !description) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        console.log('Registrando usuario:', { email, password, description });
        // Aquí iría la lógica para registrar al usuario
        
        // Redirección temporal (simulación)
        alert('Registro exitoso. Redirigiendo al inicio de sesión...');
        // window.location.href = 'login.html';
    });
});