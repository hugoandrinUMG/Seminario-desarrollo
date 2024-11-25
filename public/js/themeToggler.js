document.getElementById('themeToggler').addEventListener('click', () => {
  const currentTheme = document.body.dataset.theme || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = newTheme;

  // Actualizar estilos dinámicamente para FullCalendar
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const calendar = FullCalendar.getCalendar(calendarEl);
    if (calendar) {
      calendar.setOption('themeSystem', newTheme === 'dark' ? 'bootstrap' : 'standard');
    }
  }
});
