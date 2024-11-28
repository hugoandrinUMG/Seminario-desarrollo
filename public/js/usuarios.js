document.addEventListener('DOMContentLoaded', () => {
    const usuariosLink = document.getElementById('usuariosLink');
    const content = document.getElementById('content');
    const dashboardLink = document.getElementById('dashboardLink');

    
// Mostrar el módulo de usuarios al hacer clic
usuariosLink.addEventListener('click', async () => {
    content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga
 
    const token = localStorage.getItem('token');
    if (!token) {
        content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
        return;
    }
 
    try {
        // Solicitar usuarios al backend
        const response = await fetch('/api/usuarios', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
 
        if (!response.ok) {
            throw new Error('No tiene permisos para acceder a esta sección.');
        }
 
        const usuarios = await response.json();
 
        // Generar contenido dinámico para los usuarios
        content.innerHTML = `
<div id="usuariosCrud" class="container mt-5">
<h2>Gestión de Usuarios</h2>
<button id="crearUsuarioBtn" class="btn btn-primary mb-3">Crear Usuario</button>
<input type="text" id="buscarUsuario" class="form-control mb-3" placeholder="Buscar usuario por correo">
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
<nav id="paginacion" class="mt-3">
<!-- La paginación se generará dinámicamente -->
</nav>
</div>
        `;
 
        // Agregar funcionalidad a los botones y la búsqueda
        document.getElementById('crearUsuarioBtn').addEventListener('click', mostrarFormularioCrear);
        document.querySelectorAll('.editUsuarioBtn').forEach(button => {
            button.addEventListener('click', mostrarFormularioEditar);
        });
        document.querySelectorAll('.deleteUsuarioBtn').forEach(button => {
            button.addEventListener('click', eliminarUsuario);
        });
        document.getElementById('buscarUsuario').addEventListener('input', buscarUsuario);
 
        // Generar paginación
        generarPaginacion(usuarios);
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
});
 
// Función para la búsqueda de usuarios por correo
function buscarUsuario() {
    const query = document.getElementById('buscarUsuario').value.toLowerCase();
    const filas = document.querySelectorAll('#usuariosTable tr');
    filas.forEach(fila => {
        const email = fila.children[2].textContent.toLowerCase();
        fila.style.display = email.includes(query) ? '' : 'none';
    });
}
 
// Función para generar la paginación
function generarPaginacion(usuarios, elementosPorPagina = 10) {
    const totalPaginas = Math.ceil(usuarios.length / elementosPorPagina);
    const paginacion = document.getElementById('paginacion');
    paginacion.innerHTML = '';
 
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        boton.className = 'btn btn-secondary mx-1';
        boton.addEventListener('click', () => cargarPagina(usuarios, i, elementosPorPagina));
        paginacion.appendChild(boton);
    }
 
    // Cargar la primera página al iniciar
    cargarPagina(usuarios, 1, elementosPorPagina);
}
 
// Función para cargar una página de usuarios
function cargarPagina(usuarios, pagina, elementosPorPagina) {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const usuariosPagina = usuarios.slice(inicio, fin);
 
    const tabla = document.getElementById('usuariosTable');
    tabla.innerHTML = usuariosPagina.map(user => `
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
    `).join('');
 
    // Reactivar botones en la tabla
    document.querySelectorAll('.editUsuarioBtn').forEach(button => {
        button.addEventListener('click', mostrarFormularioEditar);
    });
    document.querySelectorAll('.deleteUsuarioBtn').forEach(button => {
        button.addEventListener('click', eliminarUsuario);
    });
}



 
// Función para mostrar el formulario de creación
function mostrarFormularioCrear() {
    content.innerHTML = `
<div class="container mt-5">
<h2>Crear Usuario</h2>
<form id="crearUsuarioForm">
<div class="mb-3">
<label for="nombre" class="form-label">Nombre</label>
<input type="text" class="form-control" id="nombre" required>
<div id="errorNombre" class="text-danger mt-2" style="display: none;"></div>
</div>
<div class="mb-3">
<label for="email" class="form-label">Email</label>
<input type="email" class="form-control" id="email" required>
<div id="errorEmail" class="text-danger mt-2" style="display: none;"></div>
</div>
<div class="mb-3">
<label for="contrasena" class="form-label">Contraseña</label>
<input type="password" class="form-control" id="contrasena" required>
<div id="errorContrasena" class="text-danger mt-2" style="display: none;"></div>
</div>
<div class="mb-3">
<label for="rol" class="form-label">Rol</label>
<select id="rol" class="form-select">
<option value="Administrador">Administrador</option>
<option value="Desarrollador">Desarrollador</option>
<option value="Diseñador">Diseñador</option>
<option value="Tester">Tester</option>
<option value="Analista">Analista</option>
<option value="Soporte Técnico">Soporte Técnico</option>
<option value="Líder de Proyecto">Líder de Proyecto</option>
<option value="Scrum Master">Scrum Master</option>
<option value="Arquitecto de Software">Arquitecto de Software</option>
</select>
</div>
<button type="submit" class="btn btn-success">Crear</button>
<button type="button" class="btn btn-secondary" id="cancelarCrear">Cancelar</button>
</form>
</div>
    `;
 
    document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
        e.preventDefault();
 
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();
        const rol = document.getElementById('rol').value;
        const errorNombre = document.getElementById('errorNombre');
        const errorEmail = document.getElementById('errorEmail');
        const errorContrasena = document.getElementById('errorContrasena');
 
        // Validar nombre y correo existentes
        try {
            const usuarios = await fetch('/api/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => res.json());
 
            // Validar nombre existente
            const nombreExistente = usuarios.find((u) => u.nombre === nombre);
            if (nombreExistente) {
                errorNombre.textContent = 'El nombre ya está registrado.';
                errorNombre.style.display = 'block';
                return;
            } else {
                errorNombre.style.display = 'none';
            }
 
            // Validar correo existente
            const emailExistente = usuarios.find((u) => u.email === email);
            if (emailExistente) {
                errorEmail.textContent = 'El email ya está registrado.';
                errorEmail.style.display = 'block';
                return;
            } else {
                errorEmail.style.display = 'none';
            }
        } catch (error) {
            alert('Error al validar nombre o correo.');
            return;
        }
 
        // Validar contraseña
        if (contrasena.length < 15) {
            errorContrasena.textContent = 'La contraseña debe tener al menos 15 caracteres.';
            errorContrasena.style.display = 'block';
            return;
        }
 
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{15,}$/;
        if (!regex.test(contrasena)) {
            errorContrasena.textContent = 'La contraseña debe contener al menos una mayúscula, un número y un símbolo.';
            errorContrasena.style.display = 'block';
            return;
        }
 
        errorContrasena.style.display = 'none';
 
        const usuario = { nombre, email, contrasena, rol };
 
        // Crear usuario
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
            usuariosLink.click(); // Volver a la lista
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
<div id="errorNombre" class="text-danger mt-2" style="display: none;"></div>
</div>
<div class="mb-3">
<label for="email" class="form-label">Email</label>
<input type="email" class="form-control" id="email" value="${email}" required>
<div id="errorEmail" class="text-danger mt-2" style="display: none;"></div>
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
<div id="errorContrasena" class="text-danger mt-2" style="display: none;"></div>
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
 
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const rol = document.getElementById('rol').value;
        const contrasena = document.getElementById('contrasena').value.trim();
        const errorNombre = document.getElementById('errorNombre');
        const errorEmail = document.getElementById('errorEmail');
        const errorContrasena = document.getElementById('errorContrasena');
 
        // Validar nombre y correo directamente
        try {
            const usuarios = await fetch('/api/usuarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((res) => res.json());
 
            // Validar nombre existente
            const nombreExistente = usuarios.find((u) => u.nombre === nombre && u.id !== parseInt(userId));
            if (nombreExistente) {
                errorNombre.textContent = 'El nombre ya está registrado.';
                errorNombre.style.display = 'block';
                return;
            } else {
                errorNombre.style.display = 'none';
            }
 
            // Validar correo existente
            const emailExistente = usuarios.find((u) => u.email === email && u.id !== parseInt(userId));
            if (emailExistente) {
                errorEmail.textContent = 'El email ya está registrado.';
                errorEmail.style.display = 'block';
                return;
            } else {
                errorEmail.style.display = 'none';
            }
        } catch (error) {
            alert('Error al validar nombre o correo.');
            return;
        }
 
        // Validaciones de contraseña
        if (contrasena && contrasena.length < 15) {
            errorContrasena.textContent = 'La contraseña debe tener al menos 15 caracteres.';
            errorContrasena.style.display = 'block';
            return;
        }
 
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{15,}$/;
        if (contrasena && !regex.test(contrasena)) {
            errorContrasena.textContent = 'La contraseña debe contener al menos una mayúscula, un número y un símbolo.';
            errorContrasena.style.display = 'block';
            return;
        }
 
        errorContrasena.style.display = 'none';
 
        // Actualizar usuario
        const usuario = { nombre, email, rol, contrasena: contrasena || undefined };
 
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