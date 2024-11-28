document.addEventListener('DOMContentLoaded', () => {
    const usuariosLink = document.getElementById('usuariosLink'); // Enlace del módulo de usuarios
    const token = localStorage.getItem('token'); // Obtener el token almacenado
 
    if (token) {
      // Decodificar el payload del JWT para obtener el rol del usuario
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar Base64
      const rol = payload.rol; // Asumiendo que el rol está en el payload del token
 
      // Ocultar el enlace si no es Administrador
      if (rol !== 'Administrador') {
        usuariosLink.style.display = 'none'; // Ocultar el enlace al módulo de usuarios
      }
    } else {
      // Si no hay token, oculta el enlace como medida de seguridad adicional
      usuariosLink.style.display = 'none';
    }
  });