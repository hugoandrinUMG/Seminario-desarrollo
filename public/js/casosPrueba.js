document.addEventListener('DOMContentLoaded', async () => {
    const planesLink = document.getElementById('planesLink');
    const content = document.getElementById('content');

    let userRole = null; // Variable para almacenar el rol del usuario.

    // Obtener el rol del usuario.
    async function obtenerRolUsuario() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch('/api/usuarios/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                return data.rol;
            }
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
        }
        return null;
    }

    planesLink.addEventListener('click', async () => {
        try {
            content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga.

            const token = localStorage.getItem('token');
            if (!token) {
                content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
                return;
            }

            userRole = await obtenerRolUsuario();

            const response = await fetch('/api/casosPrueba', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Error al cargar los casos de prueba.');

            const casosPrueba = await response.json();

            content.innerHTML = `
                <div class="container mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2>Planes de Prueba</h2>
                        ${
                            ['Administrador', 'Desarrollador', 'Diseñador', 'Tester', 'Analista', 'Arquitecto de Software'].includes(userRole)
                                ? '<button class="btn btn-success" id="crearCasoBtn">Crear Caso de Prueba</button>'
                                : ''
                        }
                    </div>
                    <input type="text" id="buscarCaso" class="form-control mb-3" placeholder="Buscar caso de prueba por nombre">
                    <table class="table table-striped table-dark-mode">
                        <thead>
                            <tr>
                                <th>Nombre del Proyecto</th>
                                <th>Nombre del Script</th>
                                <th>Usuario</th>
                                <th>Nombre de la Prueba</th>
                                <th>Descripción</th>
                                <th>Pasos</th>
                                <th>Resultado Esperado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="casosTableBody">
                            ${casosPrueba
                                .map(
                                    (caso) => `
                                        <tr data-id="${caso.id}">
                                            <td>${caso.nombre_proyecto || 'No asignado'}</td>
                                            <td>${caso.nombre_script || 'No asignado'}</td>
                                            <td>${caso.nombre_usuario || 'No asignado'}</td>
                                            <td>${caso.nombre}</td>
                                            <td>${caso.descripcion}</td>
                                            <td>${caso.pasos}</td>
                                            <td>${caso.resultado_esperado}</td>
                                            <td>
                                                ${
                                                    ['Administrador', 'Desarrollador', 'Diseñador', 'Tester', 'Analista', 'Arquitecto de Software'].includes(userRole)
                                                        ? `
                                                            <button class="btn btn-primary btn-sm editarCasoBtn">Editar</button>
                                                            <button class="btn btn-danger btn-sm eliminarCasoBtn">Eliminar</button>
                                                          `
                                                        : ''
                                                }
                                            </td>
                                        </tr>
                                    `
                                )
                                .join('')}
                        </tbody>
                    </table>
                    <div id="paginacionCasos" class="mt-3"></div>
                </div>
            `;

            // Reactivar botones de editar y eliminar.
            document.querySelectorAll('.editarCasoBtn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('tr').dataset.id;
                    mostrarFormularioEditarCaso(id);
                });
            });

            document.querySelectorAll('.eliminarCasoBtn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('tr').dataset.id;
                    eliminarCaso(id);
                });
            });

            // Generar la paginación.
            generarPaginacionCasos(casosPrueba);

            // Aplicar modo oscuro a la tabla.
            document.querySelectorAll('table').forEach((table) => {
                table.classList.add('table-dark-mode');
            });

            // Event listener para buscar casos de prueba.
            document.getElementById('buscarCaso').addEventListener('input', buscarCaso);
        } catch (error) {
            console.error('Error al cargar los casos de prueba:', error);
            content.innerHTML = '<p>Error al cargar los casos de prueba.</p>';
        }
    });

    async function mostrarFormularioEditarCaso(id) {
        const token = localStorage.getItem('token');

        try {
            // Obtener datos del caso de prueba.
            const casoResponse = await fetch(`/api/casosPrueba/${id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!casoResponse.ok) throw new Error('Error al cargar el caso de prueba.');

            const caso = await casoResponse.json();

            // Obtener proyectos, scripts y usuarios.
            const [proyectosResponse, scriptsResponse, usuariosResponse] = await Promise.all([
                fetch('/api/proyectos', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/scripts', { headers: { Authorization: `Bearer ${token}` } }),
                fetch('/api/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!proyectosResponse.ok || !scriptsResponse.ok || !usuariosResponse.ok) {
                throw new Error('Error al cargar datos para editar el caso de prueba.');
            }

            const proyectos = await proyectosResponse.json();
            const scripts = await scriptsResponse.json();
            const usuarios = await usuariosResponse.json();

            content.innerHTML = `
                <div class="container mt-5">
                    <h2>Editar Caso de Prueba</h2>
                    <form id="editarCasoForm">
                        <div class="mb-3">
                            <label for="id_proyecto" class="form-label">Proyecto</label>
                            <select class="form-select" id="id_proyecto" required>
                                ${proyectos
                                    .map(
                                        (proyecto) =>
                                            `<option value="${proyecto.id}" ${
                                                proyecto.id === caso.id_proyecto ? 'selected' : ''
                                            }>${proyecto.nombre}</option>`
                                    )
                                    .join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="id_script" class="form-label">Script</label>
                            <select class="form-select" id="id_script" required>
                                ${scripts
                                    .map(
                                        (script) =>
                                            `<option value="${script.id}" ${
                                                script.id === caso.id_script ? 'selected' : ''
                                            }>${script.nombre}</option>`
                                    )
                                    .join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="id_usuario" class="form-label">Usuario</label>
                            <select class="form-select" id="id_usuario" required>
                                ${usuarios
                                    .map(
                                        (usuario) =>
                                            `<option value="${usuario.id}" ${
                                                usuario.id === caso.id_usuario ? 'selected' : ''
                                            }>${usuario.nombre}</option>`
                                    )
                                    .join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre del Caso</label>
                            <input type="text" class="form-control" id="nombre" value="${caso.nombre}" required>
                        </div>
                        <div class="mb-3">
                            <label for="descripcion" class="form-label">Descripción</label>
                            <textarea class="form-control" id="descripcion" rows="3" required>${caso.descripcion}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="pasos" class="form-label">Pasos</label>
                            <textarea class="form-control" id="pasos" rows="3" required>${caso.pasos}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="resultado_esperado" class="form-label">Resultado Esperado</label>
                            <textarea class="form-control" id="resultado_esperado" rows="3" required>${caso.resultado_esperado}</textarea>
                        </div>
                        <button type="submit" class="btn btn-success">Actualizar</button>
                        <button type="button" class="btn btn-secondary" id="cancelarEditarCaso">Cancelar</button>
                    </form>
                </div>
            `;

            document.getElementById('editarCasoForm').addEventListener('submit', async (e) => {
                e.preventDefault();

                const id_proyecto = document.getElementById('id_proyecto').value;
                const id_script = document.getElementById('id_script').value;
                const id_usuario = document.getElementById('id_usuario').value;
                const nombre = document.getElementById('nombre').value;
                const descripcion = document.getElementById('descripcion').value;
                const pasos = document.getElementById('pasos').value;
                const resultado_esperado = document.getElementById('resultado_esperado').value;

                try {
                    const response = await fetch(`/api/casosPrueba/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            id_proyecto,
                            id_script,
                            id_usuario,
                            nombre,
                            descripcion,
                            pasos,
                            resultado_esperado,
                        }),
                    });

                    if (!response.ok) throw new Error('Error al actualizar el caso de prueba.');
                    alert('Caso de prueba actualizado exitosamente.');
                    planesLink.click();
                } catch (error) {
                    alert('Error: ' + error.message);
                }
            });

            document.getElementById('cancelarEditarCaso').addEventListener('click', () => {
                planesLink.click();
            });
        } catch (error) {
            alert('Error al cargar los datos para editar el caso de prueba: ' + error.message);
        }
    }

    // Función para eliminar un caso.
    async function eliminarCaso(id) {
        if (!confirm('¿Está seguro de eliminar este caso de prueba?')) return;

        try {
            const response = await fetch(`/api/casosPrueba/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!response.ok) throw new Error('Error al eliminar el caso de prueba.');
            alert('Caso de prueba eliminado exitosamente.');
            planesLink.click(); // Refresca la lista.
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    // Función para buscar casos por nombre.
    function buscarCaso() {
        const query = document.getElementById('buscarCaso').value.toLowerCase();
        const filas = document.querySelectorAll('#casosTableBody tr');
        filas.forEach((fila) => {
            const nombre = fila.children[3].textContent.toLowerCase();
            fila.style.display = nombre.includes(query) ? '' : 'none';
        });
    }

    // Función para generar la paginación.
    function generarPaginacionCasos(casos, elementosPorPagina = 10) {
        const totalPaginas = Math.ceil(casos.length / elementosPorPagina);
        const paginacion = document.getElementById('paginacionCasos');
        paginacion.innerHTML = '';

        for (let i = 1; i <= totalPaginas; i++) {
            const boton = document.createElement('button');
            boton.textContent = i;
            boton.className = 'btn btn-secondary mx-1';
            boton.addEventListener('click', () => cargarPaginaCasos(casos, i, elementosPorPagina));
            paginacion.appendChild(boton);
        }

        cargarPaginaCasos(casos, 1, elementosPorPagina);
    }

    // Función para cargar una página específica de casos.
    function cargarPaginaCasos(casos, pagina, elementosPorPagina) {
        const inicio = (pagina - 1) * elementosPorPagina;
        const fin = inicio + elementosPorPagina;
        const casosPagina = casos.slice(inicio, fin);

        const tabla = document.getElementById('casosTableBody');
        tabla.innerHTML = casosPagina
            .map(
                (caso) => `
                    <tr data-id="${caso.id}">
                        <td>${caso.nombre_proyecto || 'No asignado'}</td>
                        <td>${caso.nombre_script || 'No asignado'}</td>
                        <td>${caso.nombre_usuario || 'No asignado'}</td>
                        <td>${caso.nombre}</td>
                        <td>${caso.descripcion}</td>
                        <td>${caso.pasos}</td>
                        <td>${caso.resultado_esperado}</td>
                        <td>
                            ${
                                ['Administrador', 'Desarrollador', 'Diseñador', 'Tester', 'Analista', 'Arquitecto de Software'].includes(userRole)
                                    ? `
                                        <button class="btn btn-primary btn-sm editarCasoBtn">Editar</button>
                                        <button class="btn btn-danger btn-sm eliminarCasoBtn">Eliminar</button>
                                      `
                                    : ''
                            }
                        </td>
                    </tr>
                `
            )
            .join('');

        // Reactivar botones en la tabla.
        document.querySelectorAll('.editarCasoBtn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('tr').dataset.id;
                mostrarFormularioEditarCaso(id);
            });
        });

        document.querySelectorAll('.eliminarCasoBtn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('tr').dataset.id;
                eliminarCaso(id);
            });
        });
    }
});
