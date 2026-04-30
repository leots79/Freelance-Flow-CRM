/**
 * Archivo: auth.js
 * Propósito: Manejo del DOM del login, validaciones de los inputs y simulación temporal
 * de inicio de sesión utilizando localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturar elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');

    // 2. Escuchar el evento "submit" del formulario
    loginForm.addEventListener('submit', (evento) => {
        // Prevenir que el navegador recargue la página automáticamente
        evento.preventDefault();

        // 3. Obtener los valores ingresados y limpiar espacios (trim)
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // 4. Validaciones de la Interfaz (Frontend)
        let isValid = true;
        let errorMessage = '';

        // Expresión regular básica para validar estructura de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailValue)) {
            isValid = false;
            errorMessage = 'Por favor ingresa un correo electrónico válido.';
            emailInput.style.borderColor = 'var(--dangerColor)';
        } else {
            emailInput.style.borderColor = '#d1d5db';
        }

        if (passwordValue.length < 6) {
            isValid = false;
            errorMessage = errorMessage || 'La contraseña debe tener al menos 6 caracteres.';
            passwordInput.style.borderColor = 'var(--dangerColor)';
        } else {
            passwordInput.style.borderColor = '#d1d5db';
        }

        // 5. Manejo de errores visuales
        if (!isValid) {
            // En la Etapa 3 podemos usar un simple alert, o insertar un div en el DOM
            alert('Error en Validación: ' + errorMessage);
            return;
        }

        // 6. Petición a Base de Datos (Fetch real al backend)
        btnLogin.textContent = 'Verificando...';
        btnLogin.disabled = true;

        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailValue, password: passwordValue })
        })
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(result => {
            if (result.status === 200) {
                // Guardamos el token real en el localStorage
                localStorage.setItem('ff_token', result.body.token);
                localStorage.setItem('ff_user', JSON.stringify(result.body.user));
                
                // Redirigir al dashboard
                window.location.href = './pages/dashboard.html';
            } else {
                alert('Error: ' + (result.body.msg || 'Credenciales inválidas'));
                btnLogin.textContent = 'Iniciar Sesión';
                btnLogin.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error de red:', error);
            alert('Error al conectar con el servidor.');
            btnLogin.textContent = 'Iniciar Sesión';
            btnLogin.disabled = false;
        });
    });

    // 7. Agregamos interactividad extra (Ej. limpiar bordes rojos al escribir)
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.style.borderColor = '#d1d5db';
        });
    });
});
