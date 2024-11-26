document.addEventListener('DOMContentLoaded', () => {
    const usuariosLink = document.getElementById('usuariosLink');
    const content = document.getElementById('content');
    const dashboardLink = document.getElementById('dashboardLink');
 
    // Función para mostrar el contenido predeterminado (Kanban + Calendario)
    function mostrarDashboard() {
        content.innerHTML = `
<h1>Bienvenido al Dashboard de AndriQA</h1>
<p>Selecciona una opción en el menú lateral para comenzar.</p>
<div id="kanban" class="row">
<!-- Aquí va el Kanban -->
</div>
<div id="calendar" style="margin-top: 50px;"></div>
        `;
    }
 
    // Mostrar el dashboard por defecto
    dashboardLink.addEventListener('click', () => {
        mostrarDashboard();
    });
 
    // Mostrar el módulo de usuarios al hacer clic
    usuariosLink.addEventListener('click', async () => {
        content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga
 
        const token = localStorage.getItem('token');
        if (!token) {
            content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
            return;
        }
 
        try {
            const response = await fetch('/api/usuarios', {
                headers: { Authorization: `Bearer ${token}` },
            });
 
            if (!response.ok) throw new Error('Acceso denegado o error al cargar datos.');
 
            const usuarios = await response.json();
 
            content.innerHTML = `
<div id="usuariosCrud" class="container mt-5">
<h2>Gestión de Usuarios</h2>
<button id="crearUsuarioBtn" class="btn btn-primary mb-3">Crear Usuario</button>
<table class="table table-striped table-dark-mode">
<thead>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Email</th>
<th>Rol</th>
<th>Acciones</th>
</tr>
</thead>
<tbody id="usuariosTable">
                            ${usuarios.map(user => `
<tr data-id="${user.id}">
<td>${user.id}</td>
<td>${user.nombre}</td>
<td>${user.email}</td>
<td>${user.rol}</td>
<td>
<button class="btn btn-warning btn-sm editUsuarioBtn">Editar</button>
<button class="btn btn-danger btn-sm deleteUsuarioBtn">Eliminar</button>
</td>
</tr>
                            `).join('')}
</tbody>
</table>
</div>
            `;
 
            // Agregar funcionalidad a los botones
            document.getElementById('crearUsuarioBtn').addEventListener('click', mostrarFormularioCrear);
            document.querySelectorAll('.editUsuarioBtn').forEach(button => {
                button.addEventListener('click', mostrarFormularioEditar);
            });
            document.querySelectorAll('.deleteUsuarioBtn').forEach(button => {
                button.addEventListener('click', eliminarUsuario);
            });
        } catch (error) {
            content.innerHTML = '<p>No tiene permisos para acceder a esta sección.</p>';
        }
    });
 
    // Función para mostrar el formulario de creación
    function mostrarFormularioCrear() {
        content.innerHTML = `
<div class="container mt-5">
<h2>Crear Usuario</h2>
<form id="crearUsuarioForm">
<div class="mb-3">
<label for="nombre" class="form-label">Nombre</label>
<input type="text" class="form-control" id="nombre" required>
</div>
<div class="mb-3">
<label for="email" class="form-label">Email</label>
<input type="email" class="form-control" id="email" required>
</div>
<div class="mb-3">
<label for="contrasena" class="form-label">Contraseña</label>
<input type="password" class="form-control" id="contrasena" required>
</div>
<div class="mb-3">
<label for="rol" class="form-label">Rol</label>
<input type="text" class="form-control" id="rol" required>
</div>
<button type="submit" class="btn btn-success">Crear</button>
<button type="button" class="btn btn-secondary" id="cancelarCrear">Cancelar</button>
</form>
</div>
        `;
 
        document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
            e.preventDefault();
 
            const usuario = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                contrasena: document.getElementById('contrasena').value,
                rol: document.getElementById('rol').value,
            };
 
            try {
                const response = await fetch('/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(usuario),
                });
 
                if (!response.ok) throw new Error('Error al crear usuario.');
 
                alert('Usuario creado exitosamente.');
                usuariosLink.click(); // Volver a cargar el módulo de usuarios
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
 
        document.getElementById('cancelarCrear').addEventListener('click', () => {
            usuariosLink.click(); // Volver al listado
        });
    }
 

// Mostrar formulario de edición con datos precargados
function mostrarFormularioEditar(e) {
    const userId = e.target.closest('tr').dataset.id;
    const userRow = e.target.closest('tr');
    const nombre = userRow.children[1].textContent;
    const email = userRow.children[2].textContent;
    const rol = userRow.children[3].textContent;
 
    content.innerHTML = `
<div class="container mt-5">
<h2>Editar Usuario</h2>
<form id="editarUsuarioForm">
<div class="mb-3">
<label for="nombre" class="form-label">Nombre</label>
<input type="text" class="form-control" id="nombre" value="${nombre}" required>
</div>
<div class="mb-3">
<label for="email" class="form-label">Email</label>
<input type="email" class="form-control" id="email" value="${email}" required>
</div>
<div class="mb-3">
<label for="rol" class="form-label">Rol</label>
<select id="rol" class="form-select">
<option value="Administrador" ${rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
<option value="Desarrollador" ${rol === 'Desarrollador' ? 'selected' : ''}>Desarrollador</option>
<option value="Diseñador" ${rol === 'Diseñador' ? 'selected' : ''}>Diseñador</option>
<option value="Tester" ${rol === 'Tester' ? 'selected' : ''}>Tester</option>
<option value="Analista" ${rol === 'Analista' ? 'selected' : ''}>Analista</option>
<option value="Soporte Técnico" ${rol === 'Soporte Técnico' ? 'selected' : ''}>Soporte Técnico</option>
<option value="Líder de Proyecto" ${rol === 'Líder de Proyecto' ? 'selected' : ''}>Líder de Proyecto</option>
<option value="Scrum Master" ${rol === 'Scrum Master' ? 'selected' : ''}>Scrum Master</option>
<option value="Arquitecto de Software" ${rol === 'Arquitecto de Software' ? 'selected' : ''}>Arquitecto de Software</option>
</select>
</div>
<div class="mb-3">
<label for="contrasena" class="form-label">Contraseña</label>
<div class="input-group">
<input type="password" class="form-control" id="contrasena" placeholder="Ingresa una nueva contraseña">
<button type="button" class="btn btn-outline-secondary" id="mostrarContrasena">👁️</button>
</div>
<small class="form-text text-muted">Dejar vacío si no deseas cambiar la contraseña.</small>
</div>
<button type="submit" class="btn btn-primary">Actualizar</button>
<button type="button" class="btn btn-secondary" id="cancelarEditar">Cancelar</button>
</form>
</div>
    `;
 
    // Mostrar/Ocultar contraseña
    document.getElementById('mostrarContrasena').addEventListener('click', () => {
        const contrasenaField = document.getElementById('contrasena');
        contrasenaField.type = contrasenaField.type === 'password' ? 'text' : 'password';
    });
 
    // Manejar envío del formulario
    document.getElementById('editarUsuarioForm').addEventListener('submit', async (event) => {
        event.preventDefault();
 
        const usuario = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            rol: document.getElementById('rol').value,
            contrasena: document.getElementById('contrasena').value || undefined,
        };
 
        try {
            const response = await fetch(`/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(usuario),
            });
 
            if (!response.ok) throw new Error('Error al actualizar usuario.');
 
            alert('Usuario actualizado exitosamente.');
            usuariosLink.click(); // Regresar a la lista
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
 
    document.getElementById('cancelarEditar').addEventListener('click', () => {
        usuariosLink.click(); // Regresar a la lista
    });
}


 
    // Función para eliminar usuario
    async function eliminarUsuario(e) {
        const userId = e.target.closest('tr').dataset.id;
 
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            try {
                const response = await fetch(`/api/usuarios/${userId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
 
                if (!response.ok) throw new Error('Error al eliminar usuario.');
 
                alert('Usuario eliminado exitosamente.');
                usuariosLink.click(); // Recargar el módulo de usuarios
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    }
});