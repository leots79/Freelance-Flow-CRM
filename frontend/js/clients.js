document.addEventListener('DOMContentLoaded', () => {
    const clientsTableBody = document.getElementById('clientsTableBody');
    const newClientBtn = document.getElementById('newClientBtn');
    const clientModal = document.getElementById('clientModal');
    const cancelClientBtn = document.getElementById('cancelClientBtn');
    const clientForm = document.getElementById('clientForm');
    const modalTitle = document.getElementById('modalTitle');

    // API URL
    const API_URL = `${API_BASE}/api/clients`;

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

    // Si estamos en entorno local estricto sin servidor, userId podría ser null, manejamos eso graciosamente.

    // 1. Cargar Clientes
    const loadClients = async () => {
        try {
            let url = API_URL;
            if (userId) {
                url += `?user_id=${userId}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener clientes');
            
            const clients = await response.json();
            renderClients(clients);
        } catch (error) {
            console.error('Error:', error);
            clientsTableBody.innerHTML = '<tr><td colspan="6">Error al cargar clientes. Asegúrate de que el backend esté ejecutándose.</td></tr>';
        }
    };

    // 2. Renderizar Clientes en la tabla
    const renderClients = (clients) => {
        clientsTableBody.innerHTML = '';

        if (clients.length === 0) {
            clientsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay clientes registrados.</td></tr>';
            return;
        }

        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="cellStrong">${client.full_name}</td>
                <td>${client.company || '-'}</td>
                <td>${client.tax_id || '-'}</td>
                <td>${client.email || '-'}</td>
                <td>${client.phone || '-'}</td>
                <td>
                    <button class="btn btnSecondary btnSmall editBtn" data-id="${client.id}">✏️</button>
                    <button class="btn btnSecondary btnSmall textDanger deleteBtn" data-id="${client.id}">🗑️</button>
                </td>
            `;
            clientsTableBody.appendChild(tr);
        });

        // Eventos para botones de editar y eliminar
        document.querySelectorAll('.editBtn').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
        });

        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteClient(e.target.dataset.id));
        });
    };

    // 3. Abrir Modal (Crear o Editar)
    const openModal = async (clientId = null) => {
        clientForm.reset();
        document.getElementById('clientId').value = '';
        modalTitle.textContent = 'Nuevo Cliente';

        if (clientId) {
            modalTitle.textContent = 'Editar Cliente';
            try {
                const response = await fetch(`${API_URL}/${clientId}`);
                if (!response.ok) throw new Error('Error al obtener el cliente');
                
                const client = await response.json();
                document.getElementById('clientId').value = client.id;
                document.getElementById('full_name').value = client.full_name;
                document.getElementById('company').value = client.company || '';
                document.getElementById('tax_id').value = client.tax_id || '';
                document.getElementById('email').value = client.email || '';
                document.getElementById('phone').value = client.phone || '';
                document.getElementById('status').value = client.status || 'Activo';
            } catch (error) {
                console.error('Error:', error);
                alert('No se pudo cargar la información del cliente.');
                return;
            }
        }

        clientModal.showModal();
    };

    // 4. Cerrar Modal
    const closeModal = () => {
        clientModal.close();
    };

    // 5. Guardar Cliente (Crear o Actualizar)
    clientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientId = document.getElementById('clientId').value;
        const clientData = {
            full_name: document.getElementById('full_name').value,
            company: document.getElementById('company').value,
            tax_id: document.getElementById('tax_id').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            status: document.getElementById('status').value,
            user_id: userId // Enviamos el user_id para relacionarlo
        };

        try {
            let response;
            if (clientId) {
                // Actualizar
                response = await fetch(`${API_URL}/${clientId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clientData)
                });
            } else {
                // Crear
                if (!userId) {
                    alert('Error: No se encontró la sesión del usuario. No se puede crear el cliente.');
                    return;
                }
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(clientData)
                });
            }

            if (!response.ok) throw new Error('Error al guardar el cliente');
            
            closeModal();
            loadClients(); // Recargar la tabla
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el cliente.');
        }
    });

    // 6. Eliminar Cliente
    const deleteClient = async (clientId) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Todos sus proyectos relacionados podrían verse afectados.')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${clientId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar el cliente');
            
            loadClients();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el cliente.');
        }
    };

    // Event Listeners base
    if (newClientBtn) {
        newClientBtn.addEventListener('click', () => openModal());
    }

    if (cancelClientBtn) {
        cancelClientBtn.addEventListener('click', closeModal);
    }

    // Inicializar
    loadClients();
});
