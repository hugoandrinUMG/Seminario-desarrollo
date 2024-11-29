document.addEventListener('DOMContentLoaded', () => {
    const scriptsLink = document.getElementById('scriptsLink');
    const content = document.getElementById('content');
   
    // Mostrar el módulo de Scripts
    scriptsLink.addEventListener('click', async () => {
      try {
        content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga
   
        const token = localStorage.getItem('token');
        if (!token) {
          content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
          return;
        }
   
        const response = await fetch('/api/scripts', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
   
        if (!response.ok) throw new Error('Error al cargar los scripts.');
   
        const scripts = await response.json();
   
        content.innerHTML = `
  <div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-3">
  <h2>Códigos y Scripts</h2>
  <button class="btn btn-success" id="crearScriptBtn">Crear Nuevo Script</button>
  </div>
  <table class="table table-striped">
  <thead>
  <tr>
  <th>Nombre</th>
  <th>Proyecto</th>
  <th>Descripción</th>
  <th>Usuario Creador</th>
  <th>Acciones</th>
  </tr>
  </thead>
  <tbody>
                ${scripts
                  .map(
                    (script) => `
  <tr data-id="${script.id}">
  <td>${script.nombre}</td>
  <td>${script.proyecto_nombre}</td>
  <td>${script.descripcion}</td>
  <td>${script.usuario_nombre}</td>
  <td>
  <button class="btn btn-primary btn-sm editarScriptBtn">Editar</button>
  <button class="btn btn-danger btn-sm eliminarScriptBtn">Eliminar</button>
  </td>
  </tr>
                `
                  )
                  .join('')}
  </tbody>
  </table>
  </div>
        `;
   
        // Event listener para el botón de crear script
        document.getElementById('crearScriptBtn').addEventListener('click', () => {
          mostrarFormularioCrearScript();
        });
   
        // Event listeners para los botones de edición y eliminación
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
      } catch (error) {
        console.error('Error al cargar los scripts:', error);
        content.innerHTML = '<p>Error al cargar los scripts.</p>';
      }
    });
   
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
     
        content.innerHTML = `
    <div class="container mt-5">
    <h2>Editar Script</h2>
    <form id="editarScriptForm">
    <div class="mb-3">
    <label for="id_proyecto" class="form-label">Proyecto</label>
    <select class="form-select" id="id_proyecto" required>
                  ${proyectos.map(
                    (proyecto) =>
                      `<option value="${proyecto.id}" ${
                        proyecto.id === script.id_proyecto ? 'selected' : ''
                      }>${proyecto.nombre}</option>`
                  ).join('')}
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
          const nombre = document.getElementById('nombre').value;
          const descripcion = document.getElementById('descripcion').value;
          const contenido = document.getElementById('contenido').value;
     
          try {
            const response = await fetch(`/api/scripts/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ id_proyecto, nombre, descripcion, contenido }),
            });
     
            if (!response.ok) throw new Error('Error al actualizar el script.');
            alert('Script actualizado exitosamente.');
            scriptsLink.click();
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
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
   
        if (!response.ok) throw new Error('Error al eliminar el script.');
        alert('Script eliminado exitosamente.');
        scriptsLink.click(); // Recargar la lista de scripts
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
   
    
  });