// Funcionalidad de cerrar sesión
const logoutLink = document.getElementById('logoutLink');
const logoutDropdown = document.getElementById('logoutDropdown');

// Verificar si los elementos existen antes de agregar los eventos
if (logoutLink) {
  logoutLink.addEventListener('click', () => {
    handleLogout();
  });
}

if (logoutDropdown) {
  logoutDropdown.addEventListener('click', () => {
    handleLogout();
  });
}

// Función común para manejar el cierre de sesión
function handleLogout() {
  localStorage.removeItem('token');
  window.location.href = 'home.html';
}
