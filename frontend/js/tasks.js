/**
 * Archivo: tasks.js
 * Propósito: Lógica CRUD completa para la gestión de tareas.
 * Permite añadir, editar y eliminar tareas, organizadas por estado
 * (Pendiente, En Progreso, Completada).
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Capturar elementos del DOM
    const newTaskBtn = document.getElementById('newTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const taskForm = document.getElementById('taskForm');
    const taskModalTitle = document.getElementById('taskModalTitle');

    // Listas de tareas por estado
    const pendingTasksList = document.getElementById('pendingTasksList');
    const progressTasksList = document.getElementById('progressTasksList');
    const completedTasksList = document.getElementById('completedTasksList');

    // Contadores
    const pendingCount = document.getElementById('pendingCount');
    const progressCount = document.getElementById('progressCount');
    const completedCount = document.getElementById('completedCount');

    // API URLs
    const API_TASKS = `${API_BASE}/api/tasks`;
    const API_PROJECTS = `${API_BASE}/api/projects`;

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

    // ========================
    // 2. Cargar Tareas
    // ========================
    const loadTasks = async () => {
        try {
            let url = API_TASKS;
            if (userId) {
                url += `?user_id=${userId}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener tareas');

            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error:', error);
            if (pendingTasksList) {
                pendingTasksList.innerHTML = '<li class="taskItem"><div class="taskInfo">Error al cargar tareas. Asegúrate de que el backend esté ejecutándose.</div></li>';
            }
        }
    };

    // ========================
    // 3. Renderizar tareas por columnas
    // ========================
    const renderTasks = (tasks) => {
        const pending = tasks.filter(t => t.status === 'Pendiente');
        const inProgress = tasks.filter(t => t.status === 'En Progreso');
        const completed = tasks.filter(t => t.status === 'Completada');

        // Actualizar contadores
        if (pendingCount) pendingCount.textContent = pending.length;
        if (progressCount) progressCount.textContent = inProgress.length;
        if (completedCount) completedCount.textContent = completed.length;

        // Renderizar cada columna
        renderTaskList(pendingTasksList, pending, 'No hay tareas pendientes.');
        renderTaskList(progressTasksList, inProgress, 'No hay tareas en progreso.');
        renderTaskList(completedTasksList, completed, 'No hay tareas completadas.');
    };

    const renderTaskList = (container, tasks, emptyMessage) => {
        if (!container) return;
        container.innerHTML = '';

        if (tasks.length === 0) {
            container.innerHTML = `<li class="taskItem"><div class="taskInfo" style="color: var(--textMuted); font-style: italic;">${emptyMessage}</div></li>`;
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'taskItem';

            // Determinar el color del borde según el estado
            let borderColor = 'var(--warningColor)';
            if (task.status === 'En Progreso') borderColor = 'var(--accentColor)';
            if (task.status === 'Completada') borderColor = 'var(--successColor)';

            li.style.borderLeft = `4px solid ${borderColor}`;
            li.style.paddingLeft = '1rem';

            // Nombre del proyecto asociado
            const projectName = task.project ? task.project.title : '';
            const clientName = task.project && task.project.client ? task.project.client.full_name : '';
            const subtitle = projectName ? `${projectName}${clientName ? ' · ' + clientName : ''}` : '';

            // Formatear fecha
            let dateDisplay = '';
            let dateClass = '';
            if (task.due_date) {
                const dueDate = new Date(task.due_date + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                if (task.status !== 'Completada') {
                    if (diffDays < 0) {
                        dateDisplay = 'Vencida';
                        dateClass = 'textDanger';
                    } else if (diffDays === 0) {
                        dateDisplay = 'Hoy';
                        dateClass = 'textDanger';
                    } else if (diffDays === 1) {
                        dateDisplay = 'Mañana';
                        dateClass = 'textWarning';
                    } else {
                        dateDisplay = dueDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
                    }
                } else {
                    dateDisplay = dueDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
                }
            }

            li.innerHTML = `
                <div class="taskInfo">
                    <h4 class="taskName">${task.title}</h4>
                    ${subtitle ? `<span class="taskProject">${subtitle}</span>` : ''}
                    ${task.description ? `<span class="taskProject" style="margin-top: 0.25rem; display: block; opacity: 0.7;">${task.description}</span>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
                    ${dateDisplay ? `<span class="taskDate ${dateClass}">${dateDisplay}</span>` : ''}
                    <button class="btn btnSecondary btnSmall editTaskBtn" data-id="${task.id}" title="Editar">✏️</button>
                    <button class="btn btnSecondary btnSmall textDanger deleteTaskBtn" data-id="${task.id}" title="Eliminar">🗑️</button>
                </div>
            `;

            container.appendChild(li);
        });

        // Agregar eventos a botones de editar y eliminar
        container.querySelectorAll('.editTaskBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.id;
                openModal(taskId);
            });
        });

        container.querySelectorAll('.deleteTaskBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.currentTarget.dataset.id;
                deleteTask(taskId);
            });
        });
    };

    // ========================
    // 4. Cargar Proyectos para el select del modal
    // ========================
    const loadProjectsSelect = async () => {
        const taskProjectSelect = document.getElementById('taskProject');
        if (!taskProjectSelect) return;

        try {
            let url = API_PROJECTS;
            if (userId) {
                url += `?user_id=${userId}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener proyectos');

            const projects = await response.json();

            // Mantener la opción por defecto
            taskProjectSelect.innerHTML = '<option value="">Sin proyecto</option>';

            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                const clientName = project.client ? ` (${project.client.full_name})` : '';
                option.textContent = `${project.title}${clientName}`;
                taskProjectSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error cargando proyectos:', error);
        }
    };

    // ========================
    // 5. Abrir Modal (Crear o Editar)
    // ========================
    const openModal = async (taskId = null) => {
        taskForm.reset();
        document.getElementById('taskId').value = '';
        taskModalTitle.textContent = 'Nueva Tarea';

        // Cargar proyectos para el dropdown
        await loadProjectsSelect();

        if (taskId) {
            taskModalTitle.textContent = 'Editar Tarea';
            try {
                const response = await fetch(`${API_TASKS}/${taskId}`);
                if (!response.ok) throw new Error('Error al obtener la tarea');

                const task = await response.json();
                document.getElementById('taskId').value = task.id;
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskStatus').value = task.status || 'Pendiente';
                document.getElementById('taskDueDate').value = task.due_date || '';
                document.getElementById('taskProject').value = task.project_id || '';
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo cargar la información de la tarea.');
                return;
            }
        }

        taskModal.showModal();
    };

    // ========================
    // 6. Cerrar Modal
    // ========================
    const closeModal = () => {
        taskModal.close();
    };

    // ========================
    // 7. Guardar Tarea (Crear o Actualizar)
    // ========================
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const taskId = document.getElementById('taskId').value;
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            status: document.getElementById('taskStatus').value,
            due_date: document.getElementById('taskDueDate').value || null,
            project_id: document.getElementById('taskProject').value || null,
            user_id: userId
        };

        try {
            let response;
            if (taskId) {
                // Actualizar
                response = await fetch(`${API_TASKS}/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            } else {
                // Crear
                if (!userId) {
                    alert('Error: No se encontró la sesión del usuario. No se puede crear la tarea.');
                    return;
                }
                response = await fetch(API_TASKS, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(taskData)
                });
            }

            if (!response.ok) throw new Error('Error al guardar la tarea');

            closeModal();
            loadTasks(); // Recargar las listas
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar la tarea.');
        }
    });

    // ========================
    // 8. Eliminar Tarea
    // ========================
    const deleteTask = async (taskId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            return;
        }

        try {
            const response = await fetch(`${API_TASKS}/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar la tarea');

            loadTasks();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar la tarea.');
        }
    };

    // ========================
    // 9. Event Listeners base
    // ========================
    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', () => openModal());
    }

    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', closeModal);
    }

    // ========================
    // 10. Inicializar
    // ========================
    loadTasks();
});
