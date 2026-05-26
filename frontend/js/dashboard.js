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

        try {

            const parsedUser = JSON.parse(savedUser);

            userNameDisplay.textContent =
                parsedUser.username ||
                parsedUser.email.split('@')[0];

        } catch(e) {

            userNameDisplay.textContent =
                savedUser.split('@')[0];
        }
    }

    // 5. Cargar Datos Dinámicos del Dashboard
    const loadDashboardData = async () => {

        const totalClientsCount =
            document.getElementById('totalClientsCount');

        const activeProjectsCount =
            document.getElementById('activeProjectsCount');

        const projectsRiskBadge =
            document.getElementById('projectsRiskBadge');

        const recentProjectsBody =
            document.getElementById('recentProjectsBody');

        const upcomingTasksList =
            document.getElementById('upcomingTasksList');

        const grossIncome =
            document.getElementById('grossIncome');

        const incomeForecastBadge =
            document.getElementById('incomeForecastBadge');

        // Si no existen los elementos, no estamos en la vista de Dashboard Inicio
        if (
            !totalClientsCount ||
            !activeProjectsCount ||
            !recentProjectsBody ||
            !upcomingTasksList
        ) return;

        let userId = null;

        try {

            userId = JSON.parse(savedUser).id;

        } catch(e) {}

        if (!userId) return;

        try {

            // Fetch Clientes
            const clientsRes =
                await fetch(
                    `${API_BASE}/api/clients?user_id=${userId}`
                );

            const clients =
                await clientsRes.json();

            totalClientsCount.textContent =
                clients.length || 0;

            // Fetch Proyectos
            const projectsRes =
                await fetch(
                    `${API_BASE}/api/projects?user_id=${userId}`
                );

            let projects =
                await projectsRes.json();
            
            // Proyectos Activos
            const activeProjects =
                projects.filter(
                    p => p.status !== 'Completado'
                );

            activeProjectsCount.textContent =
                activeProjects.length;

            const atRiskCount =
                activeProjects.filter(p => {

                    if(!p.deadline) return false;

                    const deadlineDate =
                        new Date(p.deadline);

                    const today =
                        new Date();

                    const diffTime =
                        deadlineDate.getTime() -
                        today.getTime();

                    const diffDays =
                        Math.ceil(
                            diffTime /
                            (1000 * 60 * 60 * 24)
                        ); 
                    
                    return diffDays <= 3;

                }).length;
            
            if(atRiskCount > 0) {

                projectsRiskBadge.textContent =
                    `${atRiskCount} en riesgo`;

                projectsRiskBadge.className =
                    'badge badgeNeutral';

                projectsRiskBadge.style.color =
                    'var(--dangerColor)';

                projectsRiskBadge.style.backgroundColor =
                    'rgba(239, 68, 68, 0.1)';

            } else {

                projectsRiskBadge.textContent =
                    'Al día';

                projectsRiskBadge.className =
                    'badge badgeSuccess';

                projectsRiskBadge.style.color = '';

                projectsRiskBadge.style.backgroundColor = '';
            }

            /* =========================
               INGRESOS MENSUALES
            ========================= */

            const today =
                new Date();

            const currentMonth =
                today.getMonth();

            const currentYear =
                today.getFullYear();

            let monthlyIncome = 0;

            let paidAdvances = 0;

            projects.forEach(project => {

                if (project.advance_paid) {
                    paidAdvances++;
                }

                if (!project.deadline) return;

                const deadline =
                    new Date(project.deadline);

                const sameMonth =
                    deadline.getMonth() === currentMonth;

                const sameYear =
                    deadline.getFullYear() === currentYear;

                const validStatus =
                    project.status !== 'Completado';

                if (
                    sameMonth &&
                    sameYear &&
                    validStatus
                ) {

                    monthlyIncome +=
                        Number(
                            project.estimated_income || 0
                        );
                }
            });

            if (grossIncome) {

                grossIncome.textContent =
                    `$${monthlyIncome.toLocaleString(
                        'en-US',
                        {
                            minimumFractionDigits: 2
                        }
                    )}`;
            }

            if (incomeForecastBadge) {

                incomeForecastBadge.textContent =
                    `${paidAdvances} anticipos pagados`;
            }

            // Proyectos Recientes (últimos 3)
            const recentProjects =
                [...projects]
                    .reverse()
                    .slice(0, 3);

            recentProjectsBody.innerHTML = '';

            if (recentProjects.length === 0) {

                recentProjectsBody.innerHTML =
                    '<tr><td colspan="4" style="text-align: center;">No hay proyectos recientes.</td></tr>';

            } else {

                recentProjects.forEach(p => {

                    const clientName =
                        p.client
                            ? p.client.full_name
                            : 'Desconocido';

                    let statusClass =
                        'statusPending';

                    if (p.status === 'En Progreso') {
                        statusClass = 'statusProgress';
                    }

                    if (p.status === 'Completado') {
                        statusClass = 'statusDone';
                    }
                    
                    let progress = 10;
                    let progressClass = '';

                    if (p.status === 'En Progreso') {
                        progress = 50;
                    }

                    if (p.status === 'Completado') {

                        progress = 100;

                        progressClass = 'bgSuccess';
                    }

                    const tr =
                        document.createElement('tr');

                    tr.innerHTML = `
                        <td class="cellStrong">${p.title}</td>
                        <td>${clientName}</td>
                        <td>
                            <span class="statusTag ${statusClass}">
                                ${p.status}
                            </span>
                        </td>
                        <td>
                            <div class="progressBar">
                                <div
                                    class="progressFill ${progressClass}"
                                    style="width: ${progress}%;">
                                </div>
                            </div>
                        </td>
                    `;

                    recentProjectsBody.appendChild(tr);
                });
            }

            // Próximas Entregas (activos ordenados por fecha)
            const upcoming =
                activeProjects
                    .filter(p => p.deadline)
                    .sort(
                        (a, b) =>
                            new Date(a.deadline) -
                            new Date(b.deadline)
                    )
                    .slice(0, 3);
            
            upcomingTasksList.innerHTML = '';

            if (upcoming.length === 0) {

                upcomingTasksList.innerHTML =
                    '<li class="taskItem"><div class="taskInfo">No hay entregas próximas.</div></li>';

            } else {

                upcoming.forEach(p => {

                    const clientName =
                        p.client
                            ? p.client.full_name
                            : '';

                    const dateStr =
                        new Date(p.deadline)
                            .toLocaleDateString();
                    
                    const li =
                        document.createElement('li');

                    li.className = 'taskItem';

                    li.innerHTML = `
                        <div class="taskInfo">
                            <h4 class="taskName">${p.title}</h4>
                            <span class="taskProject">${clientName}</span>
                        </div>

                        <span class="taskDate textWarning">
                            ${dateStr}
                        </span>
                    `;

                    upcomingTasksList.appendChild(li);
                });
            }

        } catch(err) {

            console.error(
                'Error cargando datos del dashboard',
                err
            );
        }
    };

    loadDashboardData();
});