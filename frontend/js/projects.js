document.addEventListener('DOMContentLoaded', () => {
    const projectsTableBody = document.getElementById('projectsTableBody');
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const cancelProjectBtn = document.getElementById('cancelProjectBtn');
    const projectForm = document.getElementById('projectForm');
    const modalTitle = document.getElementById('modalTitle');
    const clientIdSelect = document.getElementById('client_id');

    const API_URL_PROJECTS = 'http://localhost:3000/api/projects';
    const API_URL_CLIENTS = 'http://localhost:3000/api/clients';

    // Obtener usuario actual
    const userStr = localStorage.getItem('ff_user');
    let userId = null;
    if (userStr) {
        try {
            userId = JSON.parse(userStr).id;
        } catch (e) {
            console.error('Error parseando usuario', e);
        }
    }

    // Cargar clientes para el select
    const loadClients = async () => {
        try {
            let url = API_URL_CLIENTS;
            if (userId) {
                url += `?user_id=${userId}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener clientes');

            const clients = await response.json();

            clientIdSelect.innerHTML = '<option value="">Seleccione un cliente...</option>';
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.full_name + (client.company ? ` (${client.company})` : '');
                clientIdSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando clientes:', error);
            clientIdSelect.innerHTML = '<option value="">Error al cargar clientes</option>';
        }
    };

    // Cargar Proyectos
    const loadProjects = async () => {
        try {
            let url = API_URL_PROJECTS;
            if (userId) {
                url += `?user_id=${userId}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener proyectos');

            const projects = await response.json();
            renderProjects(projects);
        } catch (error) {
            console.error('Error:', error);
            projectsTableBody.innerHTML = '<tr><td colspan="6">Error al cargar proyectos. Asegúrate de que el backend esté ejecutándose.</td></tr>';
        }
    };

    // Renderizar Proyectos
    const renderProjects = (projects) => {
        projectsTableBody.innerHTML = '';

        if (projects.length === 0) {
            projectsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay proyectos registrados.</td></tr>';
            return;
        }

        projects.forEach(project => {
            // Formatear fechas
            const start = project.start_date ? new Date(project.start_date).toLocaleDateString() : '-';
            const end = project.deadline ? new Date(project.deadline).toLocaleDateString() : '-';

            // Etiqueta de estado
            let statusClass = 'statusPending';
            if (project.status === 'En Progreso') statusClass = 'statusProgress';
            if (project.status === 'Completado') statusClass = 'statusDone';

            // Barra de progreso (simulada basada en estado)
            let progress = 10;
            let progressClass = '';
            if (project.status === 'En Progreso') progress = 50;
            if (project.status === 'Completado') {
                progress = 100;
                progressClass = 'bgSuccess';
            }

            const clientName = project.client ? project.client.full_name : 'Desconocido';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="cellStrong">${project.title}</td>
                <td>${clientName}</td>
                <td class="textSmall">${start} - ${end}</td>
                <td><span class="statusTag ${statusClass}">${project.status}</span></td>
                <td>
                    <div class="progressBar"><div class="progressFill ${progressClass}" style="width: ${progress}%;"></div></div>
                </td>
                <td>
                    <button class="btn btnSecondary btnSmall editBtn" data-id="${project.id}">✏️</button>
                    <button class="btn btnSecondary btnSmall textDanger deleteBtn" data-id="${project.id}">🗑️</button>
                </td>
            `;
            projectsTableBody.appendChild(tr);
        });

        // Eventos botones
        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteProject(e.target.dataset.id));
        });
    };

    // Abrir Modal
    const openModal = async (projectId = null) => {
        projectForm.reset();
        document.getElementById('projectId').value = '';
        modalTitle.textContent = 'Nuevo Proyecto';
        await loadClients(); // Asegurar que clientes están cargados

        if (projectId) {
            modalTitle.textContent = 'Editar Proyecto';
            try {
                const response = await fetch(`${API_URL_PROJECTS}/${projectId}`);
                if (!response.ok) throw new Error('Error al obtener el proyecto');

                const project = await response.json();
                document.getElementById('projectId').value = project.id;
                document.getElementById('title').value = project.title;
                document.getElementById('client_id').value = project.client_id || '';
                document.getElementById('description').value = project.description || '';
                document.getElementById('start_date').value = project.start_date || '';
                document.getElementById('deadline').value = project.deadline || '';
                document.getElementById('category').value = project.category || '';
                document.getElementById('status').value = project.status || 'Pendiente';
                document.getElementById('estimated_income').value = project.estimated_income || 0;
                document.getElementById('advance_paid').value = String(project.advance_paid);
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo cargar la información del proyecto.');
                return;
            }
        }

        projectModal.showModal();
    };

    // Cerrar Modal
    const closeModal = () => {
        projectModal.close();
    };

    // Guardar Proyecto
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const projectId = document.getElementById('projectId').value;
        const projectData = {
            title:
                document.getElementById('title').value,

            client_id:
                document.getElementById('client_id').value,

            description:
                document.getElementById('description').value,

            start_date:
                document.getElementById('start_date').value,

            deadline:
                document.getElementById('deadline').value,

            category:
                document.getElementById('category').value,

            status:
                document.getElementById('status').value,

            estimated_income:
                parseFloat(
                    document.getElementById('estimated_income').value
                ) || 0,

            advance_paid:
                document.getElementById('advance_paid').value === 'true'
        };

        if (!projectData.client_id) {
            alert('Por favor seleccione un cliente.');
            return;
        }

        try {
            let response;
            if (projectId) {
                response = await fetch(`${API_URL_PROJECTS}/${projectId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
            } else {
                response = await fetch(API_URL_PROJECTS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(projectData)
                });
            }

            if (!response.ok) throw new Error('Error al guardar el proyecto');

            closeModal();
            loadProjects();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el proyecto.');
        }
    });

    // Eliminar Proyecto
    const deleteProject = async (projectId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL_PROJECTS}/${projectId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar el proyecto');

            loadProjects();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el proyecto.');
        }
    };

    // Event Listeners base
    if (newProjectBtn) {
        newProjectBtn.addEventListener('click', () => openModal());
    }

    if (cancelProjectBtn) {
        cancelProjectBtn.addEventListener('click', closeModal);
    }

    // Inicializar
    loadProjects();
});
