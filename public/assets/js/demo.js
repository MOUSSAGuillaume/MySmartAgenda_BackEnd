const API_URL = '';

let token = localStorage.getItem('token');
let editingAppointmentId = null;
let editingTaskId = null;

window.addEventListener('DOMContentLoaded', async () => {
    document
        .getElementById('loginForm')
        .addEventListener('submit', event => {
            event.preventDefault();
            login();
        });

    if (token) {
        await restoreSession();
    }
});

function apiHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function escapeHtml(value) {
    const element = document.createElement('div');
    element.textContent = value ?? '';
    return element.innerHTML;
}

async function parseResponse(response) {
    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (response.status === 401) {
        logout('Votre session a expiré. Veuillez vous reconnecter.');
        throw new Error('Session expirée');
    }

    if (!response.ok) {
        throw new Error(
            data.error || 'Une erreur est survenue.'
        );
    }

    return data;
}

async function restoreSession() {
    try {
        const response = await fetch(`${API_URL}/api/me`, {
            headers: apiHeaders()
        });

        await parseResponse(response);

        showConnectedState();
        await Promise.all([
            loadAppointments(),
            loadTasks()
        ]);
    } catch {
        // parseResponse gère déjà le token expiré.
    }
}

function showConnectedState() {
    document
        .getElementById('appointmentsSection')
        .classList.remove('d-none');

    document
        .getElementById('tasksSection')
        .classList.remove('d-none');

    document
        .getElementById('loginButton')
        .classList.add('d-none');

    document
        .getElementById('logoutButton')
        .classList.remove('d-none');

    document.getElementById('email').disabled = true;
    document.getElementById('password').disabled = true;

    document.getElementById('loginStatus').innerHTML = `
        <div class="alert alert-success mb-0">
            Utilisateur connecté avec succès
        </div>
    `;
}

function showDisconnectedState(message = 'Utilisateur déconnecté.') {
    document
        .getElementById('appointmentsSection')
        .classList.add('d-none');

    document
        .getElementById('tasksSection')
        .classList.add('d-none');

    document
        .getElementById('loginButton')
        .classList.remove('d-none');

    document
        .getElementById('logoutButton')
        .classList.add('d-none');

    document.getElementById('email').disabled = false;
    document.getElementById('password').disabled = false;

    document.getElementById('loginStatus').innerHTML = `
        <div class="alert alert-secondary mb-0">
            ${escapeHtml(message)}
        </div>
    `;
}

async function login() {
    const loginButton = document.getElementById('loginButton');
    loginButton.disabled = true;

    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value
            })
        });

        const data = await parseResponse(response);

        if (!data.token) {
            throw new Error('Le serveur n’a retourné aucun token.');
        }

        token = data.token;
        localStorage.setItem('token', token);

        showConnectedState();

        await Promise.all([
            loadAppointments(),
            loadTasks()
        ]);
    } catch (error) {
        document.getElementById('loginStatus').innerHTML = `
            <div class="alert alert-danger mb-0">
                ${escapeHtml(error.message)}
            </div>
        `;
    } finally {
        loginButton.disabled = false;
    }
}

function logout(message = 'Utilisateur déconnecté.') {
    localStorage.removeItem('token');
    token = null;

    editingAppointmentId = null;
    editingTaskId = null;

    document.getElementById('appointmentsList').innerHTML = '';
    document.getElementById('tasksList').innerHTML = '';

    document.getElementById('appointmentsCount').textContent = '0';
    document.getElementById('tasksCount').textContent = '0';

    resetAppointmentForm();
    resetTaskForm();

    showDisconnectedState(message);
}

/* =========================
   RENDEZ-VOUS
========================= */

async function saveAppointment() {
    const title = document
        .getElementById('appointmentTitle')
        .value
        .trim();

    const description = document
        .getElementById('appointmentDescription')
        .value
        .trim();

    const appointmentDate = document
        .getElementById('appointmentDate')
        .value;

    if (!title || !appointmentDate) {
        showAppointmentMessage(
            'Le titre et la date sont obligatoires.',
            'danger'
        );
        return;
    }

    const payload = {
        title,
        description,
        appointment_date:
            appointmentDate.replace('T', ' ') + ':00'
    };

    const url = editingAppointmentId
        ? `${API_URL}/api/appointments/${editingAppointmentId}`
        : `${API_URL}/api/appointments`;

    const method = editingAppointmentId
        ? 'PUT'
        : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: apiHeaders(),
            body: JSON.stringify(payload)
        });

        await parseResponse(response);

        showAppointmentMessage(
            editingAppointmentId
                ? 'Rendez-vous modifié avec succès.'
                : 'Rendez-vous créé avec succès.',
            'success'
        );

        resetAppointmentForm();
        await loadAppointments();
    } catch (error) {
        showAppointmentMessage(error.message, 'danger');
    }
}

function editAppointment(item) {
    editingAppointmentId = Number(item.id);

    document.getElementById('appointmentTitle').value =
        item.title || '';

    document.getElementById('appointmentDescription').value =
        item.description || '';

    document.getElementById('appointmentDate').value =
        item.appointment_date
            .replace(' ', 'T')
            .substring(0, 16);

    document.getElementById('appointmentSubmitButton').textContent =
        'Mettre à jour';

    document.getElementById('appointmentMode').textContent =
        'Mode modification';

    document.getElementById('appointmentMode').className =
        'badge text-bg-warning mb-3';

    document
        .getElementById('appointmentsSection')
        .scrollIntoView({ behavior: 'smooth' });
}

function resetAppointmentForm() {
    editingAppointmentId = null;

    document.getElementById('appointmentTitle').value = '';
    document.getElementById('appointmentDescription').value = '';
    document.getElementById('appointmentDate').value = '';

    document.getElementById('appointmentSubmitButton').textContent =
        'Ajouter';

    document.getElementById('appointmentMode').textContent =
        'Mode ajout';

    document.getElementById('appointmentMode').className =
        'badge text-bg-secondary mb-3';
}

async function loadAppointments() {
    try {
        const response = await fetch(`${API_URL}/api/appointments`, {
            headers: apiHeaders()
        });

        const appointments = await parseResponse(response);

        if (!Array.isArray(appointments)) {
            throw new Error(
                'Le format des rendez-vous est incorrect.'
            );
        }

        renderAppointments(appointments);
    } catch (error) {
        if (token) {
            showAppointmentMessage(error.message, 'danger');
        }
    }
}

function renderAppointments(appointments) {
    const list = document.getElementById('appointmentsList');

    list.innerHTML = '';
    document.getElementById('appointmentsCount').textContent =
        String(appointments.length);

    if (appointments.length === 0) {
        list.innerHTML = `
            <li class="list-group-item text-muted">
                Aucun rendez-vous enregistré.
            </li>
        `;
        return;
    }

    appointments.forEach(item => {
        const listItem = document.createElement('li');

        listItem.className =
            'list-group-item d-flex flex-column flex-md-row ' +
            'justify-content-between align-items-md-center gap-3';

        listItem.innerHTML = `
            <div>
                <strong>${escapeHtml(item.title)}</strong><br>
                <small class="text-muted">
                    ${escapeHtml(item.description || 'Aucune description')}
                </small><br>
                <span class="badge text-bg-primary mt-1">
                    ${escapeHtml(item.appointment_date)}
                </span>
            </div>

            <div class="d-flex gap-2">
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm edit-button"
                >
                    Modifier
                </button>

                <button
                    type="button"
                    class="btn btn-outline-danger btn-sm delete-button"
                >
                    Supprimer
                </button>
            </div>
        `;

        listItem
            .querySelector('.edit-button')
            .addEventListener('click', () => editAppointment(item));

        listItem
            .querySelector('.delete-button')
            .addEventListener('click', () => deleteAppointment(item.id));

        list.appendChild(listItem);
    });
}

async function deleteAppointment(id) {
    if (!confirm('Supprimer ce rendez-vous ?')) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/appointments/${id}`,
            {
                method: 'DELETE',
                headers: apiHeaders()
            }
        );

        await parseResponse(response);

        showAppointmentMessage(
            'Rendez-vous supprimé avec succès.',
            'success'
        );

        await loadAppointments();
    } catch (error) {
        showAppointmentMessage(error.message, 'danger');
    }
}

function showAppointmentMessage(message, type) {
    document.getElementById('appointmentsMessage').innerHTML = `
        <div class="alert alert-${type} py-2">
            ${escapeHtml(message)}
        </div>
    `;
}

/* =========================
   TÂCHES
========================= */

async function saveTask() {
    const title = document
        .getElementById('taskTitle')
        .value
        .trim();

    const description = document
        .getElementById('taskDescription')
        .value
        .trim();

    const status = document.getElementById('taskStatus').value;

    if (!title) {
        showTaskMessage(
            'Le titre de la tâche est obligatoire.',
            'danger'
        );
        return;
    }

    const payload = {
        title,
        description,
        status
    };

    const url = editingTaskId
        ? `${API_URL}/api/tasks/${editingTaskId}`
        : `${API_URL}/api/tasks`;

    const method = editingTaskId
        ? 'PUT'
        : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: apiHeaders(),
            body: JSON.stringify(payload)
        });

        await parseResponse(response);

        showTaskMessage(
            editingTaskId
                ? 'Tâche modifiée avec succès.'
                : 'Tâche créée avec succès.',
            'success'
        );

        resetTaskForm();
        await loadTasks();
    } catch (error) {
        showTaskMessage(error.message, 'danger');
    }
}

function editTask(item) {
    editingTaskId = Number(item.id);

    document.getElementById('taskTitle').value =
        item.title || '';

    document.getElementById('taskDescription').value =
        item.description || '';

    document.getElementById('taskStatus').value =
        item.status || 'TODO';

    document.getElementById('taskSubmitButton').textContent =
        'Mettre à jour';

    document.getElementById('taskMode').textContent =
        'Mode modification';

    document.getElementById('taskMode').className =
        'badge text-bg-warning mb-3';

    document
        .getElementById('tasksSection')
        .scrollIntoView({ behavior: 'smooth' });
}

function resetTaskForm() {
    editingTaskId = null;

    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskStatus').value = 'TODO';

    document.getElementById('taskSubmitButton').textContent =
        'Ajouter';

    document.getElementById('taskMode').textContent =
        'Mode ajout';

    document.getElementById('taskMode').className =
        'badge text-bg-secondary mb-3';
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/api/tasks`, {
            headers: apiHeaders()
        });

        const tasks = await parseResponse(response);

        if (!Array.isArray(tasks)) {
            throw new Error(
                'Le format des tâches est incorrect.'
            );
        }

        renderTasks(tasks);
    } catch (error) {
        if (token) {
            showTaskMessage(error.message, 'danger');
        }
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('tasksList');

    list.innerHTML = '';
    document.getElementById('tasksCount').textContent =
        String(tasks.length);

    if (tasks.length === 0) {
        list.innerHTML = `
            <li class="list-group-item text-muted">
                Aucune tâche enregistrée.
            </li>
        `;
        return;
    }

    tasks.forEach(item => {
        const badgeClass =
            item.status === 'DONE'
                ? 'text-bg-success'
                : 'text-bg-warning';

        const statusLabel =
            item.status === 'DONE'
                ? 'Terminée'
                : 'À faire';

        const listItem = document.createElement('li');

        listItem.className =
            'list-group-item d-flex flex-column flex-md-row ' +
            'justify-content-between align-items-md-center gap-3';

        listItem.innerHTML = `
            <div>
                <strong>${escapeHtml(item.title)}</strong><br>
                <small class="text-muted">
                    ${escapeHtml(item.description || 'Aucune description')}
                </small><br>
                <span class="badge ${badgeClass} mt-1">
                    ${statusLabel}
                </span>
            </div>

            <div class="d-flex gap-2">
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm edit-button"
                >
                    Modifier
                </button>

                <button
                    type="button"
                    class="btn btn-outline-danger btn-sm delete-button"
                >
                    Supprimer
                </button>
            </div>
        `;

        listItem
            .querySelector('.edit-button')
            .addEventListener('click', () => editTask(item));

        listItem
            .querySelector('.delete-button')
            .addEventListener('click', () => deleteTask(item.id));

        list.appendChild(listItem);
    });
}

async function deleteTask(id) {
    if (!confirm('Supprimer cette tâche ?')) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/tasks/${id}`,
            {
                method: 'DELETE',
                headers: apiHeaders()
            }
        );

        await parseResponse(response);

        showTaskMessage(
            'Tâche supprimée avec succès.',
            'success'
        );

        await loadTasks();
    } catch (error) {
        showTaskMessage(error.message, 'danger');
    }
}

function showTaskMessage(message, type) {
    document.getElementById('tasksMessage').innerHTML = `
        <div class="alert alert-${type} py-2">
            ${escapeHtml(message)}
        </div>
    `;
}