const state = {
  token: localStorage.getItem('fitlogToken') || '',
  user: JSON.parse(localStorage.getItem('fitlogUser') || 'null')
};

const sessionBtn = document.getElementById('sessionBtn');
const completeProfileBtn = document.getElementById('completeProfileBtn');
const createExerciseBtn = document.getElementById('createExerciseBtn');
const adminPanelBtn = document.getElementById('adminPanelBtn');
const listBtn = document.getElementById('listBtn');
const sessionText = document.getElementById('sessionText');
const message = document.getElementById('message');
const exerciseList = document.getElementById('exerciseList');
const adminPanel = document.getElementById('adminPanel');
const pendingList = document.getElementById('pendingList');
const refreshPendingBtn = document.getElementById('refreshPendingBtn');
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const createModal = document.getElementById('createModal');
const closeCreateModalBtn = document.getElementById('closeCreateModalBtn');
const createExerciseForm = document.getElementById('createExerciseForm');
const profileModal = document.getElementById('profileModal');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const profileForm = document.getElementById('profileForm');

function setMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? 'message error' : 'message';
}

function formatApiError(data, statusCode) {
  if (data?.details && Array.isArray(data.details) && data.details.length > 0) {
    const details = data.details
      .map((detail) => `${detail.field || 'campo'}: ${detail.message}`)
      .join(' | ');

    return `${data.message || 'Validation error'}: ${details}`;
  }

  return data?.message || `HTTP ${statusCode}`;
}

function isProfileComplete(user) {
  return Boolean(user && user.bodyWeightKg !== null && user.bodyWeightKg !== undefined && user.experience && user.objective);
}

function saveSession(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('fitlogToken', token);
  localStorage.setItem('fitlogUser', JSON.stringify(user));
  renderSession();
}

function clearSession() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('fitlogToken');
  localStorage.removeItem('fitlogUser');
  renderSession();
}

function renderSession() {
  if (state.user) {
    sessionText.textContent = `Cuenta: ${state.user.username || state.user.firstName || state.user.email}`;
    sessionBtn.textContent = 'Cerrar sesión';
    const profileIsComplete = isProfileComplete(state.user);
    completeProfileBtn.classList.toggle('hidden', profileIsComplete);
    createExerciseBtn.classList.remove('hidden');
    if (state.user.role === 'admin') {
      adminPanelBtn.classList.remove('hidden');
    } else {
      adminPanelBtn.classList.add('hidden');
      adminPanel.classList.add('hidden');
    }
    return;
  }

  sessionText.textContent = 'Sin sesión iniciada.';
  sessionBtn.textContent = 'Login';
  completeProfileBtn.classList.add('hidden');
  createExerciseBtn.classList.add('hidden');
  adminPanelBtn.classList.add('hidden');
  adminPanel.classList.add('hidden');
}

function renderExercises(items) {
  exerciseList.innerHTML = items.length
    ? items.map((item) => `
        <article class="exercise-item">
          <h3>${item.name}</h3>
          <p>${item.description || 'Sin descripción'}</p>
        </article>
      `).join('')
    : '<p class="muted">No hay ejercicios para mostrar.</p>';
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(formatApiError(data, response.status));
  }

  return data;
}

function openModal(tab = 'login') {
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  setActiveTab(tab);
}

function openCreateModal() {
  createModal.classList.remove('hidden');
  createModal.setAttribute('aria-hidden', 'false');
}

function closeCreateModal() {
  createModal.classList.add('hidden');
  createModal.setAttribute('aria-hidden', 'true');
}

function openProfileModal() {
  profileModal.classList.remove('hidden');
  profileModal.setAttribute('aria-hidden', 'false');
}

function closeProfileModal() {
  profileModal.classList.add('hidden');
  profileModal.setAttribute('aria-hidden', 'true');
}

function closeModal() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
}

function setActiveTab(tab) {
  const isLogin = tab === 'login';
  loginTab.classList.toggle('active', isLogin);
  registerTab.classList.toggle('active', !isLogin);
  loginTab.setAttribute('aria-selected', String(isLogin));
  registerTab.setAttribute('aria-selected', String(!isLogin));
  loginForm.classList.toggle('hidden', !isLogin);
  registerForm.classList.toggle('hidden', isLogin);
}

sessionBtn.addEventListener('click', () => {
  if (state.user) {
    clearSession();
    exerciseList.innerHTML = '<p class="muted">Pulsa “Listar ejercicios”.</p>';
    setMessage('Sesión cerrada.');
    return;
  }

  openModal('login');
});

listBtn.addEventListener('click', async () => {
  try {
    const response = await apiRequest('/api/exercises');
    renderExercises(response.data || []);
    setMessage(`Se cargaron ${response.data?.length || 0} ejercicios.`);
  } catch (error) {
    setMessage(error.message, true);
  }
});

createExerciseBtn.addEventListener('click', () => {
  if (!state.user) {
    setMessage('Primero inicia sesión.', true);
    return;
  }

  openCreateModal();
});

completeProfileBtn.addEventListener('click', () => {
  if (!state.user) {
    return;
  }

  openProfileModal();
});

adminPanelBtn.addEventListener('click', async () => {
  if (!state.user || state.user.role !== 'admin') {
    setMessage('Solo el admin puede revisar pendientes.', true);
    return;
  }

  adminPanel.classList.toggle('hidden');
  if (!adminPanel.classList.contains('hidden')) {
    await loadPendingExercises();
  }
});

refreshPendingBtn.addEventListener('click', async () => {
  if (!state.user || state.user.role !== 'admin') {
    return;
  }

  await loadPendingExercises();
});

loginTab.addEventListener('click', () => setActiveTab('login'));
registerTab.addEventListener('click', () => setActiveTab('register'));
closeModalBtn.addEventListener('click', closeModal);
authModal.addEventListener('click', (event) => {
  if (event.target && event.target.hasAttribute('data-close-modal')) {
    closeModal();
  }
});

closeCreateModalBtn.addEventListener('click', closeCreateModal);
createModal.addEventListener('click', (event) => {
  if (event.target && event.target.hasAttribute('data-close-create-modal')) {
    closeCreateModal();
  }
});

closeProfileModalBtn.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (event) => {
  if (event.target && event.target.hasAttribute('data-close-profile-modal')) {
    closeProfileModal();
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    saveSession(response.data.token, response.data.user);
    closeModal();
    setMessage(`Login correcto como ${response.data.user.username || response.data.user.email}.`);
  } catch (error) {
    setMessage(error.message, true);
  }
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const payload = Object.fromEntries(formData.entries());

  if (payload.username) {
    payload.username = payload.username.trim().toLowerCase();
    if (!payload.username) {
      delete payload.username;
    }
  }

  try {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    saveSession(response.data.token, response.data.user);
    closeModal();
    setMessage(`Cuenta creada para ${response.data.user.username || response.data.user.email}.`);
  } catch (error) {
    setMessage(error.message, true);
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(profileForm);
  const payload = Object.fromEntries(formData.entries());

  if (payload.bodyWeightKg) {
    payload.bodyWeightKg = Number(payload.bodyWeightKg);
  } else {
    delete payload.bodyWeightKg;
  }

  try {
    const response = await apiRequest('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    state.user = response.data;
    localStorage.setItem('fitlogUser', JSON.stringify(response.data));
    renderSession();
    closeProfileModal();
    setMessage('Perfil completado.');
  } catch (error) {
    setMessage(error.message, true);
  }
});

function parseListField(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function loadPendingExercises() {
  try {
    const response = await apiRequest('/api/exercises/pending');
    const items = response.data || [];

    pendingList.innerHTML = items.length
      ? items.map((item) => `
          <article class="exercise-item">
            <h3>${item.name}</h3>
            <p>${item.description || 'Sin descripción'}</p>
            <div class="row-actions">
              <button type="button" data-approve="${item._id}">Aprobar</button>
              <button type="button" class="secondary" data-reject="${item._id}">Rechazar</button>
            </div>
          </article>
        `).join('')
      : '<p class="muted">No hay ejercicios pendientes.</p>';
  } catch (error) {
    setMessage(error.message, true);
  }
}

pendingList.addEventListener('click', async (event) => {
  const approveId = event.target.getAttribute('data-approve');
  const rejectId = event.target.getAttribute('data-reject');

  try {
    if (approveId) {
      await apiRequest(`/api/exercises/${approveId}/approve`, { method: 'PATCH' });
      setMessage('Ejercicio aprobado.');
    }

    if (rejectId) {
      await apiRequest(`/api/exercises/${rejectId}/reject`, { method: 'PATCH' });
      setMessage('Ejercicio rechazado.');
    }

    if (approveId || rejectId) {
      await loadPendingExercises();
    }
  } catch (error) {
    setMessage(error.message, true);
  }
});

createExerciseForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(createExerciseForm);
  const payload = Object.fromEntries(formData.entries());

  payload.primaryMuscles = parseListField(payload.primaryMuscles || '');
  payload.secondaryMuscles = parseListField(payload.secondaryMuscles || '');

  try {
    const response = await apiRequest('/api/exercises', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    closeCreateModal();
    createExerciseForm.reset();
    setMessage(`Ejercicio creado: ${response.data.name}`);
    if (state.user.role === 'admin') {
      await loadPendingExercises();
    }
  } catch (error) {
    setMessage(error.message, true);
  }
});

renderSession();