document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  if (calendarEl) {
    // Verificar el tema actual
    var currentTheme = document.body.dataset.theme || 'light';

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
      events: [
        {
          title: 'Inicio del desarrollo del proyecto',
          start: '2024-11-04',
          description: 'Este día comenzó el desarrollo del proyecto'
        },
        {
          title: 'Finalización del Seminario',
          start: '2024-11-24',
          description: 'Este día fue la última clase del área de desarrollo'
        },
        {
          title: 'Entrega de proyecto',
          start: '2024-12-01',
          description: 'Fecha límite de entrega'
        }
      ],
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
