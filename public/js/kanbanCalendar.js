document.addEventListener('DOMContentLoaded', () => {
    // Cargar vista inicial Kanban + Calendario
    loadKanbanAndCalendar();

    function loadKanbanAndCalendar() {
      const content = document.getElementById('content');
      content.innerHTML = `
        <div class="kanban-calendar-container">
          <div id="kanban" class="kanban-board"></div>
          <div id="calendar" class="calendar-container"></div>
        </div>
      `;

      // Llenar el tablero Kanban
      fetch('/api/proyectos')
        .then(response => response.json())
        .then(proyectos => {
          const kanban = document.getElementById('kanban');
          kanban.innerHTML = proyectos.map(proyecto => `
            <div class="kanban-card" style="border-left-color: ${getPriorityColor(proyecto.estado)}">
              <div class="project-title">${proyecto.nombre}</div>
              <div class="project-description">${proyecto.descripcion}</div>
              <div class="project-dates">Inicio: ${proyecto.fecha_inicio} | Fin: ${proyecto.fecha_fin}</div>
            </div>
          `).join('');
        });

      // Inicializar el calendario
      initializeCalendar();
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

