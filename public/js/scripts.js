document.addEventListener('DOMContentLoaded', async () => {
    const scriptsLink = document.getElementById('scriptsLink');
    const content = document.getElementById('content');
    let userRole = null; // Variable para guardar el rol del usuario
    let scriptsData = []; // Para almacenar los datos de scripts

    // Obtener el rol del usuario
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

    scriptsLink.addEventListener('click', async () => {
        try {
            content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga
    
            const token = localStorage.getItem('token');
            if (!token) {
                content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
                return;
            }
    
            // Obtener el rol del usuario
            userRole = await obtenerRolUsuario();
    
            const response = await fetch('/api/scripts', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error('Error al cargar los scripts.');
    
            const scripts = await response.json();
            scriptsData = scripts; // Guardar los datos en la variable global
    
            // Generar contenido inicial
            content.innerHTML = `
                <div class="container mt-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2>Códigos y Scripts</h2>
                        ${
                            ['Administrador', 'Desarrollador', 'Arquitecto de Software'].includes(userRole)
                                ? '<button class="btn btn-success" id="crearScriptBtn">Crear Nuevo Script</button>'
                                : ''
                        }
                    </div>
                    <input type="text" id="buscarScript" class="form-control mb-3" placeholder="Buscar script por nombre">
                    <table class="table table-striped table-dark-mode">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Proyecto</th>
                                <th>Descripción</th>
                                <th>Usuario Creador</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="scriptsTableBody"></tbody>
                    </table>
                    <div id="paginacionScripts" class="mt-3"></div> <!-- Contenedor para paginación -->
                </div>
            `;
    
            // Generar la paginación inicial
            generarPaginacionScripts(scriptsData);
    
            // Event listener para el buscador
            document.getElementById('buscarScript').addEventListener('input', buscarScript);
    
            // Event listener para el botón de crear script
            if (document.getElementById('crearScriptBtn')) {
                document.getElementById('crearScriptBtn').addEventListener('click', mostrarFormularioCrearScript);
            }
        } catch (error) {
            console.error('Error al cargar los scripts:', error);
            content.innerHTML = '<p>Error al cargar los scripts.</p>';
        }
    });

// Función para generar la paginación
function generarPaginacionScripts(scripts, elementosPorPagina = 10) {
    const totalPaginas = Math.ceil(scripts.length / elementosPorPagina);
    const paginacion = document.getElementById('paginacionScripts');
    paginacion.innerHTML = ''; // Limpiar paginación previa

    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        boton.className = 'btn btn-secondary mx-1';
        boton.addEventListener('click', () => cargarPaginaScripts(scripts, i, elementosPorPagina));
        paginacion.appendChild(boton);
    }

    // Cargar la primera página al iniciar
    cargarPaginaScripts(scripts, 1, elementosPorPagina);
}

// Función para cargar una página específica de scripts
function cargarPaginaScripts(scripts, pagina, elementosPorPagina) {
    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const scriptsPagina = scripts.slice(inicio, fin);

    const tablaBody = document.getElementById('scriptsTableBody');
    tablaBody.innerHTML = ''; // Limpiar la tabla antes de cargar

    tablaBody.innerHTML = scriptsPagina.map((script) => `
        <tr data-id="${script.id}">
            <td>${script.nombre}</td>
            <td>${script.nombre_proyecto || 'No asignado'}</td>
            <td>${script.descripcion}</td>
            <td>${script.usuario_creador || 'No asignado'}</td>
            <td>
                ${
                    ['Administrador', 'Desarrollador', 'Arquitecto de Software'].includes(userRole)
                        ? `
                            <button class="btn btn-primary btn-sm editarScriptBtn">Editar</button>
                            <button class="btn btn-danger btn-sm eliminarScriptBtn">Eliminar</button>
                          `
                        : ''
                }
            </td>
        </tr>
    `).join('');

    // Reactivar eventos para los botones de edición y eliminación
    document.querySelectorAll('.editarScriptBtn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            mostrarFormularioEditarScript(id);
        });
    });

    document.querySelectorAll('.eliminarScriptBtn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('tr').dataset.id;
            eliminarScript(id);
        });
    });
}


    // Función para buscar scripts por nombre
    function buscarScript() {
        const query = document.getElementById('buscarScript').value.toLowerCase();
        const filas = document.querySelectorAll('#scriptsTableBody tr');
        filas.forEach((fila) => {
            const nombre = fila.children[0].textContent.toLowerCase(); // Primera columna: Nombre del script
            fila.style.display = nombre.includes(query) ? '' : 'none';
        });
    }
    
  async function mostrarFormularioCrearScript() {
      try {
          const token = localStorage.getItem('token');

          // Obtener proyectos
          const proyectosResponse = await fetch('/api/proyectos', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!proyectosResponse.ok) throw new Error('Error al cargar los proyectos.');
          const proyectos = await proyectosResponse.json();

          // Obtener usuarios con roles permitidos
          const usuariosResponse = await fetch('/api/usuarios', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!usuariosResponse.ok) throw new Error('Error al cargar los usuarios.');
          const usuarios = await usuariosResponse.json();

          content.innerHTML = `
              <div class="container mt-5">
                  <h2>Crear Script</h2>
                  <form id="crearScriptForm">
                      <div class="mb-3">
                          <label for="id_proyecto" class="form-label">Proyecto</label>
                          <select class="form-select" id="id_proyecto" required>
                              ${proyectos.map((proyecto) => `<option value="${proyecto.id}">${proyecto.nombre}</option>`).join('')}
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="id_usuario" class="form-label">Creador</label>
                          <select class="form-select" id="id_usuario" required>
                              ${usuarios
                                  .filter((usuario) => ['Administrador', 'Desarrollador', 'Arquitecto de Software'].includes(usuario.rol))
                                  .map((usuario) => `<option value="${usuario.id}">${usuario.nombre} (${usuario.rol})</option>`)
                                  .join('')}
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="nombre" class="form-label">Nombre</label>
                          <input type="text" class="form-control" id="nombre" required>
                      </div>
                      <div class="mb-3">
                          <label for="descripcion" class="form-label">Estado</label>
                          <select class="form-select" id="descripcion" required>
                              <option value="Primer version de codigo">Primer versión de código</option>
                              <option value="Codigo en pruebas">Código en pruebas</option>
                              <option value="Codigo a la espera de aprobacion">Código a la espera de aprobación</option>
                              <option value="Codigo Aprobado">Código Aprobado</option>
                              <option value="Codigo Descartado">Código Descartado</option>
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="contenido" class="form-label">Contenido</label>
                          <textarea class="form-control" id="contenido" rows="6" required></textarea>
                      </div>
                      <button type="submit" class="btn btn-success">Crear</button>
                      <button type="button" class="btn btn-secondary" id="cancelarCrearScript">Cancelar</button>
                  </form>
              </div>
          `;

          document.getElementById('crearScriptForm').addEventListener('submit', async (e) => {
              e.preventDefault();

              const id_proyecto = document.getElementById('id_proyecto').value;
              const id_usuario = document.getElementById('id_usuario').value;
              const nombre = document.getElementById('nombre').value;
              const descripcion = document.getElementById('descripcion').value;
              const contenido = document.getElementById('contenido').value;

              try {
                  const response = await fetch('/api/scripts', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ id_proyecto, id_usuario, nombre, descripcion, contenido }),
                  });

                  if (!response.ok) throw new Error('Error al crear el script.');
                  alert('Script creado exitosamente.');
                  scriptsLink.click();
              } catch (error) {
                  alert('Error: ' + error.message);
              }
          });

          document.getElementById('cancelarCrearScript').addEventListener('click', () => {
              scriptsLink.click();
          });
      } catch (error) {
          alert('Error al cargar los datos para crear el script: ' + error.message);
      }
  }

  async function mostrarFormularioEditarScript(id) {
      try {
          const token = localStorage.getItem('token');

          // Obtener datos del script
          const scriptResponse = await fetch(`/api/scripts/${id}`, {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!scriptResponse.ok) throw new Error('Error al cargar el script.');
          const script = await scriptResponse.json();

          // Obtener proyectos
          const proyectosResponse = await fetch('/api/proyectos', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!proyectosResponse.ok) throw new Error('Error al cargar los proyectos.');
          const proyectos = await proyectosResponse.json();

          // Obtener usuarios con roles permitidos
          const usuariosResponse = await fetch('/api/usuarios', {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
          });
          if (!usuariosResponse.ok) throw new Error('Error al cargar los usuarios.');
          const usuarios = await usuariosResponse.json();

          content.innerHTML = `
              <div class="container mt-5">
                  <h2>Editar Script</h2>
                  <form id="editarScriptForm">
                      <div class="mb-3">
                          <label for="id_proyecto" class="form-label">Proyecto</label>
                          <select class="form-select" id="id_proyecto" required>
                              ${proyectos
                                  .map(
                                      (proyecto) =>
                                          `<option value="${proyecto.id}" ${
                                              proyecto.id === script.id_proyecto ? 'selected' : ''
                                          }>${proyecto.nombre}</option>`
                                  )
                                  .join('')}
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="id_usuario" class="form-label">Creador</label>
                          <select class="form-select" id="id_usuario" required>
                              ${usuarios
                                  .filter((usuario) => ['Administrador', 'Desarrollador', 'Arquitecto de Software'].includes(usuario.rol))
                                  .map(
                                      (usuario) =>
                                          `<option value="${usuario.id}" ${
                                              usuario.id === script.id_usuario_creador ? 'selected' : ''
                                          }>${usuario.nombre} (${usuario.rol})</option>`
                                  )
                                  .join('')}
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="nombre" class="form-label">Nombre</label>
                          <input type="text" class="form-control" id="nombre" value="${script.nombre}" required>
                      </div>
                      <div class="mb-3">
                          <label for="descripcion" class="form-label">Estado</label>
                          <select class="form-select" id="descripcion" required>
                              <option value="Primer version de codigo" ${
                                  script.descripcion === 'Primer version de codigo' ? 'selected' : ''
                              }>Primer versión de código</option>
                              <option value="Codigo en pruebas" ${
                                  script.descripcion === 'Codigo en pruebas' ? 'selected' : ''
                              }>Código en pruebas</option>
                              <option value="Codigo a la espera de aprobacion" ${
                                  script.descripcion === 'Codigo a la espera de aprobacion' ? 'selected' : ''
                              }>Código a la espera de aprobación</option>
                              <option value="Codigo Aprobado" ${
                                  script.descripcion === 'Codigo Aprobado' ? 'selected' : ''
                              }>Código Aprobado</option>
                              <option value="Codigo Descartado" ${
                                  script.descripcion === 'Codigo Descartado' ? 'selected' : ''
                              }>Código Descartado</option>
                          </select>
                      </div>
                      <div class="mb-3">
                          <label for="contenido" class="form-label">Contenido</label>
                          <textarea class="form-control" id="contenido" rows="6" required>${script.contenido}</textarea>
                      </div>
                      <button type="submit" class="btn btn-success">Actualizar</button>
                      <button type="button" class="btn btn-secondary" id="cancelarEditarScript">Cancelar</button>
                  </form>
              </div>
          `;

          document.getElementById('editarScriptForm').addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const id_proyecto = document.getElementById('id_proyecto').value;
            const id_usuario = document.getElementById('id_usuario').value;
            const nombre = document.getElementById('nombre').value;
            const descripcion = document.getElementById('descripcion').value;
            const contenido = document.getElementById('contenido').value;
        
            try {
                const response = await fetch(`/api/scripts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ id_proyecto, id_usuario, nombre, descripcion, contenido }),
                });
        
                if (!response.ok) throw new Error('Error al actualizar el script.');
                alert('Script actualizado exitosamente.');
                document.getElementById('scriptsLink').click();
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
        

          document.getElementById('cancelarEditarScript').addEventListener('click', () => {
              scriptsLink.click();
          });
      } catch (error) {
          alert('Error al cargar los datos para editar el script: ' + error.message);
      }
  }

  // Función para eliminar un script
  async function eliminarScript(id) {
    if (!confirm('¿Está seguro de eliminar este script?')) return;

    try {
        const response = await fetch(`/api/scripts/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) throw new Error('Error al eliminar el script.');
        alert('Script eliminado exitosamente.');
        document.getElementById('scriptsLink').click(); // Refresca la lista
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

    

});
