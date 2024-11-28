document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    let userRole = null;
 
    // Obtener el rol del usuario
    if (token) {
        try {
            const response = await fetch('/api/usuarios/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            userRole = data.rol;
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
        }
    }
 
    const columns = document.querySelectorAll('.card-body');
 
    // Verificar roles permitidos para drag and drop
    if (['Administrador', 'Líder de Proyecto', 'Scrum Master'].includes(userRole)) {
        columns.forEach(column => {
            // Evento para permitir el arrastre sobre la columna
            column.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(column, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    column.appendChild(draggable);
                } else {
                    column.insertBefore(draggable, afterElement);
                }
            });
 
            // Evento para el soltar (drop)
            column.addEventListener('drop', async e => {
                const draggable = document.querySelector('.dragging');
                draggable.classList.remove('dragging');
 
                // Actualizar estado en la base de datos
                const taskId = draggable.dataset.id; // ID de la tarea
                const newState = column.id; // ID de la columna representa el nuevo estado
 
                try {
                    const response = await fetch(`/api/proyectos/${taskId}/estado`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ estado: newState }),
                    });
 
                    if (!response.ok) {
                        throw new Error('Error al actualizar el estado del proyecto');
                    }
 
                    console.log(`Proyecto ${taskId} actualizado a estado: ${newState}`);
                } catch (error) {
                    console.error('Error al actualizar el estado del proyecto:', error);
                }
            });
        });
 
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
    } else {
        console.log('El usuario no tiene permisos para Drag and Drop');
    }
 
    // Función para determinar la posición de inserción del elemento arrastrado
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
 
        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            { offset: Number.NEGATIVE_INFINITY }
        ).element;
    }
});