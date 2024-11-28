document.addEventListener('DOMContentLoaded', () => {
    const dashboardLink = document.getElementById('dashboardLink');
    const content = document.getElementById('content');
 
    // Función para cargar el Dashboard
    async function cargarDashboard() {
        // Cargar estructura HTML del Dashboard
        content.innerHTML = `
<h1>Bienvenido al Dashboard de AndriQA</h1>
<p>Selecciona una opción en el menú lateral para comenzar.</p>
<div id="kanban" class="row">
<!-- Columna: Pendientes -->
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-secondary text-white text-center"><strong>Pendientes</strong></div>
<div class="card-body" id="pendientes"></div>
</div>
</div>
<!-- Columna: Por Hacer -->
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-primary text-white text-center"><strong>Por Hacer</strong></div>
<div class="card-body" id="porHacer"></div>
</div>
</div>
<!-- Columna: En Progreso -->
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-warning text-white text-center"><strong>En Progreso</strong></div>
<div class="card-body" id="enProgreso"></div>
</div>
</div>
<!-- Columna: Hecho -->
<div class="col-lg-2 col-md-6 mb-4">
<div class="card shadow-sm">
<div class="card-header bg-success text-white text-center"><strong>Hecho</strong></div>
<div class="card-body" id="hecho"></div>
</div>
</div>
</div>
<div id="calendar" style="margin-top: 50px;"></div>
        `;
 
        // Cargar datos del Kanban y calendario
        await actualizarKanban();
        initializeCalendar();
    }
 
    // Función para llenar el Kanban dinámicamente
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


 
    // Función para inicializar el calendario
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('No se encontró el contenedor del calendario.');
        return;
    }
 
    // Limpia cualquier contenido previo
    calendarEl.innerHTML = '';
 
    // Verificar el tema actual
    const currentTheme = document.body.dataset.theme || 'light';
 
    // Crear una nueva instancia de FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Vista mensual
        headerToolbar: {
            left: 'prev,next today', // Controles de navegación
            center: 'title', // Título del calendario
            right: '' // Sin opciones adicionales
        },
        locale: 'es', // Idioma español
        themeSystem: currentTheme === 'dark' ? 'bootstrap' : 'standard', // Tema dinámico
        buttonText: {
            today: 'Hoy' // Texto del botón "Hoy"
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                // Obtener los proyectos de la API
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
 
                // Convertir proyectos en eventos
                const eventos = proyectos.flatMap(proyecto => [
                    {
                        title: `Inicio: ${proyecto.nombre}`,
                        start: proyecto.fecha_inicio,
                        description: proyecto.descripcion,
                        color: '#28a745', // Verde para inicio
                        textColor: '#ffffff',
                    },
                    {
                        title: `Fin: ${proyecto.nombre}`,
                        start: proyecto.fecha_fin,
                        description: proyecto.descripcion,
                        color: '#dc3545', // Rojo para fin
                        textColor: '#ffffff',
                    },
                ]);
 
                successCallback(eventos);
            } catch (error) {
                console.error('Error al cargar eventos del calendario:', error);
                failureCallback(error);
            }
        },
        eventClick: function (info) {
            // Manejador de clic en eventos
            const event = info.event;
            const description = event.extendedProps.description || 'Sin descripción adicional.';
            alert(`Evento: ${event.title}\nDescripción: ${description}`);
        },
        editable: false, // No permite mover eventos
        droppable: false, // No permite arrastrar eventos
        eventClassNames: function () {
            return currentTheme === 'dark' ? 'fc-event-dark' : 'fc-event-light';
        },
    });
 
    // Renderizar el calendario
    calendar.render();
 
    // Escucha cambios en el tema y actualiza el calendario
    document.addEventListener('themeChange', function () {
        const newTheme = document.body.dataset.theme || 'light';
        calendar.setOption('themeSystem', newTheme === 'dark' ? 'bootstrap' : 'standard');
        calendar.refetchEvents();
    });
}
 
    // Mostrar el dashboard al hacer clic en el enlace del Dashboard
    dashboardLink.addEventListener('click', () => {
        cargarDashboard();
    });
 
    // Cargar el Dashboard por defecto al inicio
    cargarDashboard();
});