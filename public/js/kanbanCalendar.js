document.addEventListener('DOMContentLoaded', () => {
  loadKanbanAndCalendar();

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
            tarjeta.setAttribute('draggable', true); // Habilitar drag-and-drop
            tarjeta.dataset.id = proyecto.id; // ID del proyecto para actualizar estado
 
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

  function loadKanbanAndCalendar() {
      const content = document.getElementById('content');
      content.innerHTML = `
<div class="kanban-calendar-container">
<div id="kanban" class="row">
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-secondary text-white text-center">
<strong>Pendientes</strong>
</div>
<div class="card-body" id="pendientes"></div>
</div>
</div>
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-primary text-white text-center">
<strong>Por Hacer</strong>
</div>
<div class="card-body" id="porHacer"></div>
</div>
</div>
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-warning text-white text-center">
<strong>En Progreso</strong>
</div>
<div class="card-body" id="enProgreso"></div>
</div>
</div>
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-success text-white text-center">
<strong>Hecho</strong>
</div>
<div class="card-body" id="hecho"></div>
</div>
</div>
</div>
<div id="calendar" class="calendar-container"></div>
</div>
      `;
      
    

      // Actualizar Kanban y cargar calendario
      actualizarKanban();
      initializeCalendar(); // Asume que esta función ya existe para el calendario


      // Eventos globales de dragstart y dragend
      document.addEventListener('dragstart', e => {
        if (e.target.classList.contains('task')) {
            e.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', e => {
        if (e.target.classList.contains('task')) {
            e.target.classList.remove('dragging');
        }
    });
    
  }


    function initializeCalendar() {
      const calendar = document.getElementById('calendar');
      calendar.innerHTML = '<p>Aquí se mostrará el calendario dinámico.</p>';
      // Aquí podrías integrar una librería como FullCalendar.js
    }

    function getPriorityColor(estado) {
      switch (estado) {
        case 'Alta': return '#dc3545'; // Rojo
        case 'Media': return '#ffc107'; // Amarillo
        case 'Baja': return '#28a745'; // Verde
        default: return '#007bff'; // Azul
      }
    }
  });

