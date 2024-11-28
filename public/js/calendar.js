document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');
 
  if (calendarEl) {
    // Verificar el tema actual
    var currentTheme = document.body.dataset.theme || 'light';
 
    // Crear instancia de FullCalendar
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth', // Vista de cuadrícula mensual
      headerToolbar: {
        left: 'prev,next today', // Controles de navegación
        center: 'title', // Título del mes y año
        right: '' // Sin otras opciones
      },
      locale: 'es', // Idioma español
      themeSystem: currentTheme === 'dark' ? 'bootstrap' : 'standard', // Cambiar tema dinámicamente
      buttonText: {
        today: 'Hoy' // Cambiar el texto del botón "today"
      },
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          // Hacer fetch a los proyectos
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No se ha iniciado sesión.');
 
          const response = await fetch('/api/proyectos', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
 
          if (!response.ok) throw new Error('Error al cargar los proyectos.');
 
          const proyectos = await response.json();
 
          // Transformar los proyectos en eventos para el calendario
          const eventos = proyectos.flatMap(proyecto => [
            {
              title: `Inicio: ${proyecto.nombre}`,
              start: proyecto.fecha_inicio,
              description: proyecto.descripcion,
              color: '#28a745', // Verde para el inicio
              textColor: '#ffffff', // Texto blanco
            },
            {
              title: `Fin: ${proyecto.nombre}`,
              start: proyecto.fecha_fin,
              description: proyecto.descripcion,
              color: '#dc3545', // Rojo para el fin
              textColor: '#ffffff', // Texto blanco
            },
          ]);
 
          successCallback(eventos); // Enviar eventos al calendario
        } catch (error) {
          console.error('Error al cargar eventos para el calendario:', error);
          failureCallback(error);
        }
      },
      eventClick: function (info) {
        // Manejo del clic en una nota/evento
        var event = info.event;
        var description = event.extendedProps.description || 'Sin descripción adicional.';
        alert(`Evento: ${event.title}\nDescripción: ${description}`);
      },
      editable: false, // No permite mover eventos
      droppable: false, // No permite arrastrar eventos
      eventClassNames: function () {
        return currentTheme === 'dark' ? 'fc-event-dark' : 'fc-event-light';
      }
    });
 
    // Escucha cambios en el tema y actualiza el calendario
    document.addEventListener('themeChange', function () {
      currentTheme = document.body.dataset.theme || 'light';
      calendar.setOption('themeSystem', currentTheme === 'dark' ? 'bootstrap' : 'standard');
      calendar.refetchEvents();
    });
 
    calendar.render(); // Renderizar el calendario
  } else {
    console.error('El contenedor #calendar no se encuentra en el DOM.');
  }
});