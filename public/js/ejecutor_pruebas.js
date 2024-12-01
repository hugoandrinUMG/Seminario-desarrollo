document.addEventListener('DOMContentLoaded', async () => {
    const casosLink = document.getElementById('casosLink');
    const content = document.getElementById('content');
    let userRole = null;
    let scriptsData = [];

    // Obtener el rol del usuario
    async function obtenerRolUsuario() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch('/api/usuarios/me', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                return data.rol;
            }
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
        }
        return null;
    }

    // Evento para cargar los scripts y mostrar botones
    casosLink.addEventListener('click', async () => {
        try {
            content.innerHTML = '<p>Cargando...</p>'; // Indicador de carga

            const token = localStorage.getItem('token');
            if (!token) {
                content.innerHTML = '<p>Acceso denegado. Debe iniciar sesión.</p>';
                return;
            }

            // Obtener el rol del usuario
            userRole = await obtenerRolUsuario();

            if (!['Administrador', 'Desarrollador', 'Tester'].includes(userRole)) {
                content.innerHTML = '<p>No tienes permiso para ejecutar pruebas unitarias.</p>';
                return;
            }

            const response = await fetch('/api/scripts', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Error al cargar los scripts.');

            const scripts = await response.json();
            scriptsData = scripts; // Guardar los datos en la variable global

            // Generar contenido inicial con los tres botones
            content.innerHTML = `
                <div class="container mt-4">
                    <h2>Pruebas Unitarias</h2>
                    <button id="createExecutionBtn" class="btn btn-success mb-3">Crear registro de ejecución</button>
                    <button id="executeOnlineBtn" class="btn btn-primary mb-3">Ejecutar prueba online</button>
                    <button id="executionHistoryBtn" class="btn btn-secondary mb-3">Historial de ejecuciones</button>
                    <div id="formContainer"></div>
                    <div id="result"></div>
                </div>
            `;

            // Event listeners para los botones
            document.getElementById('createExecutionBtn').addEventListener('click', mostrarFormularioEjecucion);
            document.getElementById('executeOnlineBtn').addEventListener('click', ejecutarPruebaOnline);
            document.getElementById('executionHistoryBtn').addEventListener('click', mostrarHistorialEjecuciones);
        } catch (error) {
            console.error('Error al cargar los scripts:', error);
            content.innerHTML = '<p>Error al cargar los scripts.</p>';
        }
    });

    // **1. Crear Registro de Ejecución**
async function mostrarFormularioEjecucion() {
    let casosPruebaData = []; // Almacenará los casos de prueba
    try {
        const response = await fetch('/api/casos-prueba'); // Ruta para obtener los casos de prueba
        if (!response.ok) throw new Error('Error al cargar los casos de prueba.');
        casosPruebaData = await response.json();
    } catch (error) {
        console.error('Error al cargar los casos de prueba:', error);
        casosPruebaData = []; // En caso de error, se usa un arreglo vacío
    }

    content.innerHTML = `
        <h3>Formulario de Ejecución de Prueba</h3>
        
        <label for="casoPruebaSelector">Seleccionar Caso de Prueba:</label>
        <select id="casoPruebaSelector" class="form-control mb-3">
            <option value="" disabled selected>Selecciona un caso de prueba</option>
            ${casosPruebaData.map(caso => `<option value="${caso.id}">${caso.nombre}</option>`).join('')}
        </select>
        
        <label for="scriptSelector">Seleccionar Script:</label>
        <select id="scriptSelector" class="form-control mb-3">
            <option value="" disabled selected>Selecciona un script</option>
            <option value="otro">Otro</option>
            ${scriptsData.map(script => `<option value="${script.id}">${script.nombre}</option>`).join('')}
        </select>
        
        <label for="executionType">Tipo de Ejecución:</label>
        <select id="executionType" class="form-control mb-3">
            <option value="ejecucion_local">Ejecución Local</option>
            <option value="ejecucion_online">Ejecución Online</option>
        </select>

        <label for="scriptContent">Contenido del Script:</label>
        <textarea id="scriptContent" class="form-control mb-3" rows="6" readonly>Selecciona un script</textarea>

        <label for="executionComments">Comentarios:</label>
        <textarea id="executionComments" class="form-control mb-3" rows="4" placeholder="Escribe comentarios sobre la ejecución..."></textarea>

        <button id="submitExecutionBtn" class="btn btn-primary mt-3">Registrar Ejecución</button>
    `;

    // Cargar el contenido del script seleccionado
    document.getElementById('scriptSelector').addEventListener('change', cargarContenidoScript);
    document.getElementById('submitExecutionBtn').addEventListener('click', registrarEjecucion);
    activarTextarea();
}

async function registrarEjecucion() {
    const casoPruebaId = document.getElementById('casoPruebaSelector').value; // ID del caso de prueba seleccionado
    const scriptId = document.getElementById('scriptSelector').value;
    const scriptContent = document.getElementById('scriptContent').value;
    const executionType = document.getElementById('executionType').value;
    const comments = document.getElementById('executionComments').value;
    const fecha_ejecucion = new Date().toISOString();

    if (!casoPruebaId) {
        alert('Debes seleccionar un caso de prueba.');
        return;
    }

    const data = {
        id_caso_prueba: casoPruebaId,
        id_script: scriptId === 'otro' ? null : scriptId,
        fecha_ejecucion,
        resultado: executionType,
        comentarios: comments || (scriptId === 'otro' ? scriptContent : null),
    };

    console.log('Datos enviados al backend:', data);

    try {
        const response = await fetch('/api/ejecucionesPrueba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Error al registrar ejecución de prueba:', error);
            alert(`Error: ${error}`);
        } else {
            alert('Ejecución registrada correctamente');
        }
    } catch (error) {
        console.error('Error al registrar ejecución:', error);
        alert('Error al registrar ejecución.');
    }
}

async function cargarContenidoScript() {
    const scriptId = document.getElementById('scriptSelector').value;
    const scriptContent = document.getElementById('scriptContent');

    if (scriptId === 'otro') {
        scriptContent.removeAttribute('readonly');
        scriptContent.value = ''; // Limpiar textarea para entrada manual
    } else {
        try {
            const response = await fetch(`/api/scripts/${scriptId}`);
            if (!response.ok) throw new Error('Error al cargar el script.');
            const script = await response.json();
            scriptContent.value = script.contenido || 'El script no tiene contenido.';
            scriptContent.setAttribute('readonly', true);
        } catch (error) {
            console.error('Error al cargar el contenido del script:', error);
            scriptContent.value = 'Error al cargar el contenido.';
        }
    }
}

function activarTextarea() {
    const scriptSelector = document.getElementById('scriptSelector');
    const scriptContent = document.getElementById('scriptContent');

    if (scriptSelector.value === 'otro') {
        scriptContent.removeAttribute('readonly');
        scriptContent.value = '';
    } else {
        scriptContent.setAttribute('readonly', true);
        scriptContent.value = '';
    }
}

      

    
// **2. Ejecutar Prueba Online**
async function ejecutarPruebaOnline() {
    content.innerHTML = `
        <h3>Ejecutar Prueba Online</h3>
        
        <label for="caseSelector">Seleccionar Caso de Prueba:</label>
        <select id="caseSelector" class="form-control mb-3">
            <option value="" disabled selected>Selecciona un caso de prueba</option>
        </select>

        <label for="scriptSelector">Seleccionar Script:</label>
        <select id="scriptSelector" class="form-control mb-3">
            <option value="" disabled selected>Selecciona un script</option>
            ${scriptsData.map(script => `<option value="${script.id}">${script.nombre}</option>`).join('')}
        </select>

        <label for="apiSelector">Seleccionar API de Evaluación:</label>
        <select id="apiSelector" class="form-control mb-3">
            <option value="" disabled selected>Selecciona una API</option>
            <option value="chatgpt">ChatGPT API</option>
            <option value="jdoodle">JDoodle</option>
            <option value="compilerExplorer">Compiler Explorer</option>
            <option value="piston">Piston API</option>
        </select>

        <label for="scriptContent">Contenido del Script:</label>
        <div class="input-group mb-3">
            <textarea id="scriptContent" class="form-control" rows="6" readonly>Selecciona un script para cargar el contenido</textarea>
            <button id="copyButton" class="btn btn-secondary" type="button">Copiar</button>
        </div>

        <div id="apiInstructions" class="mt-4"></div>

        <hr>

        <h4>Detalles de la Evaluación</h4>
        
        <label for="executionStatus">Estado de la Prueba:</label>
        <select id="executionStatus" class="form-control mb-3">
            <option value="" disabled selected>Selecciona el estado</option>
            <option value="Prueba exitosa">Prueba exitosa</option>
            <option value="Prueba fallida">Prueba fallida</option>
        </select>

        <label for="executionComments">Comentarios:</label>
        <textarea id="executionComments" class="form-control mb-3" rows="4" placeholder="Ingresa comentarios sobre la prueba..."></textarea>

        <button id="saveEvaluationBtn" class="btn btn-success mt-3">Guardar Evaluación</button>
    `;

    // Asociar eventos
    cargarCasosDePrueba(); // Cargar casos de prueba
    document.getElementById('scriptSelector').addEventListener('change', cargarContenidoScript);
    document.getElementById('copyButton').addEventListener('click', copiarCodigo);
    document.getElementById('apiSelector').addEventListener('change', mostrarInstruccionesAPI);
    document.getElementById('saveEvaluationBtn').addEventListener('click', guardarEvaluacion);
}

// Cargar casos de prueba
async function cargarCasosDePrueba() {
    try {
        const response = await fetch('/api/casos-prueba');
        const cases = await response.json();

        const caseSelector = document.getElementById('caseSelector');
        caseSelector.innerHTML += cases
            .map(
                (testCase) =>
                    `<option value="${testCase.id}">${testCase.nombre} (${testCase.descripcion})</option>`
            )
            .join('');
    } catch (error) {
        console.error('Error al cargar los casos de prueba:', error);
    }
}

// Cargar contenido del script seleccionado
async function cargarContenidoScript() {
    const scriptId = document.getElementById('scriptSelector').value;
    const scriptContent = document.getElementById('scriptContent');

    if (!scriptId) return;

    try {
        const response = await fetch(`/api/scripts/${scriptId}`);
        const script = await response.json();

        if (script && script.contenido) {
            scriptContent.value = script.contenido;
        } else {
            console.error('Contenido del script no encontrado.');
            scriptContent.value = 'No se pudo cargar el contenido del script.';
        }
    } catch (error) {
        console.error('Error al cargar el contenido del script:', error);
        scriptContent.value = 'Error al cargar el contenido del script.';
    }
}

// Copiar código al portapapeles
function copiarCodigo() {
    const scriptContent = document.getElementById('scriptContent');
    scriptContent.select();
    document.execCommand('copy');
    alert('Código copiado al portapapeles.');
}

// Mostrar instrucciones específicas para cada API
function mostrarInstruccionesAPI() {
    const api = document.getElementById('apiSelector').value;
    const apiInstructions = document.getElementById('apiInstructions');
    const code = document.getElementById('scriptContent').value;

    // Validar si hay contenido en el script
    if (!code) {
        apiInstructions.innerHTML = '<p>Por favor selecciona un script válido primero.</p>';
        return;
    }

    // Mostrar las instrucciones correspondientes
    switch (api) {
        case 'chatgpt':
            apiInstructions.innerHTML = `
                <p><strong>Instrucciones para ChatGPT API:</strong></p>
                <p>Abre <a href="https://chat.openai.com/" target="_blank">ChatGPT</a> y utiliza el código cargado arriba.</p>
            `;
            break;
        case 'jdoodle':
            apiInstructions.innerHTML = `
                <p><strong>Instrucciones para JDoodle:</strong></p>
                <p>Abre <a href="https://www.jdoodle.com/" target="_blank">JDoodle</a> y utiliza el código cargado arriba.</p>
            `;
            break;
        case 'compilerExplorer':
            apiInstructions.innerHTML = `
                <p><strong>Instrucciones para Compiler Explorer:</strong></p>
                <p>Abre <a href="https://godbolt.org/" target="_blank">Compiler Explorer</a> y utiliza el código cargado arriba.</p>
            `;
            break;
        case 'piston':
            apiInstructions.innerHTML = `
                <p><strong>Instrucciones para Piston API:</strong></p>
                <p>Consulta la consola en línea en <a href="https://emkc.org/" target="_blank">Piston</a> y utiliza el código cargado arriba.</p>
            `;
            break;
        default:
            apiInstructions.innerHTML = '<p>Selecciona una API para ver las instrucciones.</p>';
    }
}

// Guardar evaluación manual
async function guardarEvaluacion() {
    const caseId = document.getElementById('caseSelector').value;
    const scriptId = document.getElementById('scriptSelector').value;
    const api = document.getElementById('apiSelector').value;
    const status = document.getElementById('executionStatus').value;
    const comments = document.getElementById('executionComments').value;

    if (!caseId || !api || !status) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }

    try {
        const response = await fetch('/api/ejecucionesPrueba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_caso_prueba: caseId,
                id_script: scriptId || null,
                fecha_ejecucion: new Date().toISOString(),
                resultado: `${status} - ${api}`,
                comentarios: comments || '',
            }),
        });

        if (response.ok) {
            alert('Evaluación guardada exitosamente.');
        } else {
            const error = await response.json();
            console.error('Error al guardar la evaluación:', error);
            alert('Error al guardar la evaluación.');
        }
    } catch (error) {
        console.error('Error al guardar la evaluación:', error);
        alert('Error al guardar la evaluación.');
    }
}




    // Evaluar el código
    async function evaluarCodigo() {
        const scriptId = document.getElementById('scriptSelector').value;
        const apiSelector = document.getElementById('apiSelector').value;
    
        const response = await fetch(`/api/scripts/${scriptId}`);
        const script = await response.json();
        const codigo = script.contenido;
    
        console.log('Código a evaluar:', codigo);
        console.log('API seleccionada:', apiSelector);
    
        try {
            const result = await fetch('/api/evaluarCodigo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    codigo,
                    api: apiSelector,
                }),
            });
    
            const data = await result.json();
            console.log('Respuesta del backend:', data);
            document.getElementById('result').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            console.error('Error al evaluar el código:', error);
            document.getElementById('result').innerHTML = '<p>Error al evaluar el código.</p>';
        }
    }
    
    

// **3. Ver Historial de Ejecuciones**
async function mostrarHistorialEjecuciones() {
    try {
        const response = await fetch('/api/ejecucionesPrueba');
        if (!response.ok) throw new Error('Error al obtener el historial de ejecuciones.');

        const data = await response.json();

        content.innerHTML = `
            <h3>Historial de Ejecuciones de Prueba</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Resultado</th>
                        <th>Comentarios</th>
                        <th>Script Evaluado</th>
                        <th>Caso de Prueba</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(ejecucion => `
                        <tr>
                            <td>${ejecucion.id}</td>
                            <td>${new Date(ejecucion.fecha_ejecucion).toLocaleString()}</td>
                            <td>${ejecucion.resultado}</td>
                            <td>${ejecucion.comentarios || 'Sin comentarios'}</td>
                            <td>${ejecucion.nombre_script || 'Script no especificado'}</td>
                            <td>${ejecucion.nombre_caso_prueba || 'Caso no especificado'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al obtener el historial de ejecuciones:', error);
        content.innerHTML = '<p>Error al cargar el historial de ejecuciones.</p>';
    }
}



});

