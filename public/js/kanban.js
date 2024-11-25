document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.card-body');
  
    // Drag and Drop
    columns.forEach(column => {
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
  
      column.addEventListener('dragstart', e => {
        e.target.classList.add('dragging');
      });
  
      column.addEventListener('dragend', e => {
        e.target.classList.remove('dragging');
      });
    });
  
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
  
    // Función de ejemplo para agregar tareas
    function addTask(columnId, taskText) {
      const column = document.getElementById(columnId);
      const task = document.createElement('div');
      task.className = 'task';
      task.textContent = taskText;
      task.setAttribute('draggable', true);
      column.appendChild(task);
    }
  
    // Ejemplo de tareas iniciales
    addTask('pendientes', 'Tarea 1');
    addTask('porHacer', 'Tarea 2');
    addTask('enProgreso', 'Tarea 3');
    addTask('hecho', 'Tarea 4');
  });
  