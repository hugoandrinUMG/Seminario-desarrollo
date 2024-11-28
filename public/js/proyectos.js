// Configuración de URLs para las bases de datos
const productionApiBaseUrl = 'https://seminario-desarrollo-backend.onrender.com/api/proyectos';
const localApiBaseUrl = 'http://localhost:3000/api/proyectos';
 
// Función para alternar entre producción y local
async function fetchWithTimeout(resource, options = {}, timeout = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
 
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(timeoutId); // Limpiar timeout si responde a tiempo
        return response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Tiempo de espera agotado para la solicitud.');
        }
        throw error;
    }
}

// Mostrar el módulo de proyectos
proyectosLink.addEventListener('click', async () => {
    content.innerHTML = '<p>Cargando proyectos...</p>'; // Indicador de carga
 
    const token = localStorage.getItem('token');
    if (!token) {
        content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
        return;
    }
 
    try {
        const response = await fetch('/api/proyectos', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!response.ok) throw new Error('No tiene permisos para acceder a esta sección.');
 
        const proyectos = await response.json();
 
        content.innerHTML = `
<div id="proyectosCrud" class="container mt-5">
<h2>Gestión de Proyectos</h2>
<button id="crearProyectoBtn" class="btn btn-primary mb-3">Crear Proyecto</button>
<input type="text" id="buscarProyecto" class="form-control mb-3" placeholder="Buscar proyecto por nombre">
<table class="table table-striped table-dark-mode">
<thead>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Descripción</th>
<th>Fecha Inicio</th>
<th>Fecha Fin</th>
<th>Acciones</th>
</tr>
</thead>

<tbody id="proyectosTable">
    ${proyectos.map(proyecto => `
<tr data-id="${proyecto.id}">
<td>${proyecto.id}</td>
<td>${proyecto.nombre}</td>
<td>${proyecto.descripcion}</td>
<td>${formatFecha(proyecto.fecha_inicio)}</td>
<td>${formatFecha(proyecto.fecha_fin)}</td>
<td>${proyecto.estado || 'Sin Estado'}</td>
<td>
<button class="btn btn-warning btn-sm editProyectoBtn">Editar</button>
<button class="btn btn-danger btn-sm deleteProyectoBtn">Eliminar</button>
</td>
</tr>
    `).join('')}
</tbody>

</table>
<nav id="paginacionProyectos" class="mt-3"></nav>
</div>
        `;
 
        document.getElementById('crearProyectoBtn').addEventListener('click', mostrarFormularioCrearProyecto);
        document.querySelectorAll('.editProyectoBtn').forEach(button => {
            button.addEventListener('click', mostrarFormularioEditarProyecto);
        });
        document.querySelectorAll('.deleteProyectoBtn').forEach(button => {
            button.addEventListener('click', eliminarProyecto);
        });
        document.getElementById('buscarProyecto').addEventListener('input', buscarProyecto);
 
    // Generar paginación
    generarPaginacionProyectos(proyectos);
} catch (error) {
    content.innerHTML = `<p>${error.message}</p>`;
}
});

async function mostrarFormularioCrearProyecto() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/usuarios', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!response.ok) throw new Error('Error al cargar la lista de usuarios.');
 
        const usuarios = await response.json();
 

        content.innerHTML = `
<div class="container mt-5">
<h2>Crear Proyecto</h2>
<form id="crearProyectoForm">
<div class="mb-3">
<label for="nombre" class="form-label">Nombre</label>
<input type="text" class="form-control" id="nombre" required>
</div>
<div class="mb-3">
<label for="descripcion" class="form-label">Descripción</label>
<textarea class="form-control" id="descripcion" rows="3" required></textarea>
</div>
<div class="mb-3">
<label for="fecha_inicio" class="form-label">Fecha de Inicio</label>
<input type="date" class="form-control" id="fecha_inicio" required>
</div>
<div class="mb-3">
<label for="fecha_fin" class="form-label">Fecha de Fin</label>
<input type="date" class="form-control" id="fecha_fin" required>
</div>
<div class="mb-3">
<label for="id_usuario" class="form-label">Asignar a Usuario</label>
<select class="form-select" id="id_usuario" required>
                ${usuarios.map(usuario => `
<option value="${usuario.id}">
                        ${usuario.nombre} (${usuario.rol})
</option>
                `).join('')}
</select>
</div>
<div class="mb-3">
<label for="estado" class="form-label">Estado</label>
<select class="form-select" id="estado" required>
<option value="Pendiente">Pendiente</option>
<option value="Por Hacer">Por Hacer</option>
<option value="En Progreso">En Progreso</option>
<option value="Hecho">Hecho</option>
</select>
</div>
<button type="submit" class="btn btn-success">Crear</button>
<button type="button" class="btn btn-secondary" id="cancelarCrearProyecto">Cancelar</button>
</form>
</div>
`;



 
        document.getElementById('crearProyectoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const fecha_inicio = document.getElementById('fecha_inicio').value;
            const fecha_fin = document.getElementById('fecha_fin').value;
            const id_usuario = document.getElementById('id_usuario').value;
 
            try {
                const response = await fetch('/api/proyectos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado }),
                });
 
                if (!response.ok) throw new Error('Error al crear el proyecto.');
 
                alert('Proyecto creado exitosamente.');
                proyectosLink.click();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
 
        document.getElementById('cancelarCrearProyecto').addEventListener('click', () => {
            proyectosLink.click();
        });
    } catch (error) {
        alert('Error al cargar la lista de usuarios: ' + error.message);
    }
}

async function mostrarFormularioEditarProyecto(event) {
    const id = event.target.closest('tr').dataset.id;
 
    try {
        const token = localStorage.getItem('token');
        const proyectoResponse = await fetch(`/api/proyectos/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!proyectoResponse.ok) throw new Error('Error al cargar el proyecto.');
 
        const usuariosResponse = await fetch('/api/usuarios', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!usuariosResponse.ok) throw new Error('Error al cargar la lista de usuarios.');
 
        const proyecto = await proyectoResponse.json();
        const usuarios = await usuariosResponse.json();
 
        content.innerHTML = `
<div class="container mt-5">
<h2>Editar Proyecto</h2>
<form id="editarProyectoForm">
<div class="mb-3">
<label for="nombre" class="form-label">Nombre</label>
<input type="text" class="form-control" id="nombre" value="${proyecto.nombre}" required>
</div>
<div class="mb-3">
<label for="descripcion" class="form-label">Descripción</label>
<textarea class="form-control" id="descripcion" rows="3" required>${proyecto.descripcion}</textarea>
</div>
<div class="mb-3">
<label for="fecha_inicio" class="form-label">Fecha de Inicio</label>
<input type="date" class="form-control" id="fecha_inicio" value="${proyecto.fecha_inicio.split('T')[0]}" required>
</div>
<div class="mb-3">
<label for="fecha_fin" class="form-label">Fecha de Fin</label>
<input type="date" class="form-control" id="fecha_fin" value="${proyecto.fecha_fin.split('T')[0]}" required>
</div>

<div class="mb-3">
<label for="id_usuario" class="form-label">Asignar a Usuario</label>
<select class="form-select" id="id_usuario" required>
        ${usuarios.map(usuario => `
<option value="${usuario.id}" ${usuario.id === proyecto.id_usuario ? 'selected' : ''}>
                ${usuario.nombre} (${usuario.rol})
</option>
        `).join('')}
</select>
</div>
<div class="mb-3">
<label for="estado" class="form-label">Estado</label>
<select class="form-select" id="estado" required>
<option value="Pendiente" ${proyecto.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
<option value="Por Hacer" ${proyecto.estado === 'Por Hacer' ? 'selected' : ''}>Por Hacer</option>
<option value="En Progreso" ${proyecto.estado === 'En Progreso' ? 'selected' : ''}>En Progreso</option>
<option value="Hecho" ${proyecto.estado === 'Hecho' ? 'selected' : ''}>Hecho</option>
</select>
</div>

<button type="submit" class="btn btn-success">Actualizar</button>
<button type="button" class="btn btn-secondary" id="cancelarEditarProyecto">Cancelar</button>
</form>
</div>
        `;
 
        document.getElementById('editarProyectoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const fecha_inicio = document.getElementById('fecha_inicio').value;
            const fecha_fin = document.getElementById('fecha_fin').value;
            const id_usuario = document.getElementById('id_usuario').value;
 
            try {
                const response = await fetch(`/api/proyectos/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ nombre, descripcion, fecha_inicio, fecha_fin, id_usuario, estado }),
                });
 
                if (!response.ok) throw new Error('Error al actualizar el proyecto.');
 
                alert('Proyecto actualizado exitosamente.');
                proyectosLink.click();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
 
        document.getElementById('cancelarEditarProyecto').addEventListener('click', () => {
            proyectosLink.click();
        });
    } catch (error) {
        alert('Error al cargar los datos del proyecto: ' + error.message);
    }
}

// Formatear fecha para la tabla
function formatFecha(fecha) {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
 
// Función para eliminar proyectos
async function eliminarProyecto(event) {
    const id = event.target.closest('tr').dataset.id;
 
    if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
 
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/proyectos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
 
        if (!response.ok) throw new Error('Error al eliminar el proyecto.');
 
        alert('Proyecto eliminado exitosamente.');
        proyectosLink.click();
    } catch (error) {
        alert('Error al eliminar el proyecto: ' + error.message);
    }
}

// Generar paginación para proyectos
function generarPaginacionProyectos(proyectos, elementosPorPagina = 10) {
    const totalPaginas = Math.ceil(proyectos.length / elementosPorPagina);
    const paginacion = document.getElementById('paginacionProyectos');
    paginacion.innerHTML = '';
 
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        boton.className = 'btn btn-secondary mx-1';
        boton.addEventListener('click', () => cargarPaginaProyectos(proyectos, i, elementosPorPagina));
        paginacion.appendChild(boton);
    }
 
    // Cargar la primera página al iniciar
    cargarPaginaProyectos(proyectos, 1, elementosPorPagina);
}

// Cargar una página de proyectos
function cargarPaginaProyectos(proyectos, pagina, elementosPorPagina) {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const proyectosPagina = proyectos.slice(inicio, fin);
 
    const tabla = document.getElementById('proyectosTable');
    tabla.innerHTML = proyectosPagina.map(proyecto => `
<tr data-id="${proyecto.id}">
<td>${proyecto.id}</td>
<td>${proyecto.nombre}</td>
<td>${proyecto.descripcion}</td>
<td>${proyecto.fecha_inicio}</td>
<td>${proyecto.fecha_fin}</td>
<td>
<button class="btn btn-warning btn-sm editProyectoBtn">Editar</button>
<button class="btn btn-danger btn-sm deleteProyectoBtn">Eliminar</button>
</td>
</tr>
    `).join('');
 
    // Reactivar botones en la tabla
    document.querySelectorAll('.editProyectoBtn').forEach(button => {
        button.addEventListener('click', mostrarFormularioEditarProyecto);
    });
    document.querySelectorAll('.deleteProyectoBtn').forEach(button => {
        button.addEventListener('click', eliminarProyecto);
    });
}


// Función para buscar proyectos por nombre
function buscarProyecto() {
    const query = document.getElementById('buscarProyecto').value.toLowerCase();
    const filas = document.querySelectorAll('#proyectosTable tr');
    filas.forEach(fila => {
        const nombre = fila.children[1].textContent.toLowerCase();
        fila.style.display = nombre.includes(query) ? '' : 'none';
    });
}


// Función para actualizar el tablero Kanban
async function actualizarKanban() {
    const token = localStorage.getItem('token');
    if (!token) return;
 
    try {
        const response = await fetch('/api/proyectos', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
 
        if (!response.ok) throw new Error('Error al cargar los proyectos.');
 
        const proyectos = await response.json();
 
        // Limpiar columnas del Kanban
        document.getElementById('pendientes').innerHTML = '';
        document.getElementById('porHacer').innerHTML = '';
        document.getElementById('enProgreso').innerHTML = '';
        document.getElementById('hecho').innerHTML = '';
 
        // Distribuir proyectos en columnas
        
        proyectos.forEach(proyecto => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'task';
            tarjeta.textContent = proyecto.nombre;
         
            if (proyecto.estado === 'Pendiente') {
                document.getElementById('pendientes').appendChild(tarjeta);
            } else if (proyecto.estado === 'Por Hacer') {
                document.getElementById('porHacer').appendChild(tarjeta);
            } else if (proyecto.estado === 'En Progreso') {
                document.getElementById('enProgreso').appendChild(tarjeta);
            } else if (proyecto.estado === 'Hecho') {
                document.getElementById('hecho').appendChild(tarjeta);
            }
        });

    } catch (error) {
        console.error('Error al actualizar el tablero Kanban:', error);
    }
}