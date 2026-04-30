/**
 * Archivo: dashboard.js
 * Propósito: Manejo interactivo del DOM en el panel administrativo,
 * menú responsivo en móviles, y protección básica de la ruta.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Protección de ruta (Route Guarding en Frontend)
    // Se verifica si existe el Token guardado en Auth.js
    const userToken = localStorage.getItem('ff_token');
    
    if (!userToken) {
        // Permitimos que continúe si se está ejecutando desde file:/// (desarrollo local estricto sin servidor)
        // pero mostramos una advertencia
        if(window.location.protocol !== 'file:') {
            alert('Acceso denegado. Redirigiendo al inicio de sesión...');
            window.location.href = '../index.html';
        } else {
            console.warn('Ejecutando en modo local (file://). Se omitió el bloqueo de sesión.');
        }
    }

    // 2. Menú Hamburguesa Responsivo
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');

    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle añade la clase si no existe, o la quita si existe
            sidebar.classList.toggle('isOpen');
        });
    }

    // 3. Manejo de estado "Activo" en los menúes laterales (Simulado)
    const navItems = document.querySelectorAll('.navItem');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Evitamos seguir enlaces que sean "#"
            if (e.target.getAttribute('href') === '#') {
                e.preventDefault();
            }

            // Removemos 'active' de todos los items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Añadimos 'active' solo al ítem clickeado
            this.classList.add('active');
            
            // Si el menú móvil estaba abierto, lo cerramos al elegir opción
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('isOpen');
            }
        });
    });

    // 4. Lógica de "Cerrar Sesión" de la Interfaz
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                // Borrar la memoria del navegador
                localStorage.removeItem('ff_token');
                localStorage.removeItem('ff_user');
                
                // Redirigir a login
                window.location.href = '../index.html';
            }
        });
    }

    // Personalización local
    const userNameDisplay = document.querySelector('.userName');
    const savedUser = localStorage.getItem('ff_user');
    if (userNameDisplay && savedUser) {
        // En un caso real mostraríamos el Nombre del usuario, no el correo. (Se arreglará en Etapa 4 BD)
        userNameDisplay.textContent = savedUser.split('@')[0];
    }
});
