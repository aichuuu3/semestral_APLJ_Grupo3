document.addEventListener('DOMContentLoaded', function() {
    console.log('GestionarMiembro.js cargado');
    
    // Cargar datos al iniciar la página
    cargarSolicitudes();
    
    // SELECTORES PARA BOTONES
    const botones = document.querySelectorAll('.form-group button');
    console.log('Todos los botones encontrados:', botones);
    
    let btnConsultar = null;
    let btnActualizar = null;
    
    // Identificar botones por su texto
    botones.forEach((boton, index) => {
        console.log(`Botón ${index}:`, boton.textContent.trim());
        
        if (boton.textContent.trim() === 'Consultar') {
            btnConsultar = boton;
        } else if (boton.textContent.trim() === 'Actualizar Usuario' || boton.textContent.trim() === 'Actualizar') {
            btnActualizar = boton;
        }
    });
    
    console.log('Botón Consultar encontrado:', btnConsultar);
    console.log('Botón Actualizar encontrado:', btnActualizar);
    
    if (btnConsultar) {
        btnConsultar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('CLIC EN CONSULTAR');
            buscarUsuarioPorCedula().then(() => {
                if (btnActualizar) {
                    btnActualizar.style.display = 'block'; // Mostrar el botón después de consultar
                }
            });
        });
        console.log('Listener agregado al botón CONSULTAR');
    }
    
    // Oculta el botón "Actualizar Usuario" inicialmente
    if (btnActualizar) {
        btnActualizar.style.display = 'none';
    }
    
    // Modificación para limpiar los inputs y ocultar el botón "Actualizar Usuario" después de actualizar
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 CLIC EN ACTUALIZAR');
            actualizarUsuario().then(() => {
                limpiarFormulario(); // Limpiar los campos de entrada
                btnActualizar.style.display = 'none'; // Ocultar el botón "Actualizar Usuario"
            });
        });
        console.log('Listener modificado para el botón ACTUALIZAR');
    }
    
    // Función para cargar solicitudes desde la API
    async function cargarSolicitudes() {
        try {
            console.log('Cargando solicitudes...');
            
            const response = await fetch('http://localhost:5000/membresia/completas');
            
            if (response.ok) {
                const solicitudes = await response.json();
                console.log('Solicitudes cargadas:', solicitudes);
                
                mostrarSolicitudesEnTabla(solicitudes);
            } else {
                console.error('Error al cargar solicitudes:', response.status);
                mostrarMensajeError('Error al cargar las solicitudes');
            }
            
        } catch (error) {
            console.error('Error de conexión:', error);
            mostrarMensajeError('Error de conexión con el servidor');
        }
    }
    
    // FUNCIÓN BUSCAR USUARIO
    async function buscarUsuarioPorCedula() {
        const cedulaInput = document.getElementById('cedula');
        const cedula = cedulaInput.value.trim();
        
        console.log('EJECUTANDO BUSCAR USUARIO CON CÉDULA:', cedula);
        
        if (!cedula) {
            alert('Por favor ingrese una cédula');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/membresia/buscar-usuario/${cedula}`);
            
            if (response.ok) {
                const usuario = await response.json();
                console.log('Usuario encontrado:', usuario);
                
                // Llenar formulario
                document.getElementById('nombre').value = usuario.nombre || '';
                document.getElementById('telefono').value = usuario.telefono || '';
                document.getElementById('correo').value = usuario.correo || '';
                
                // Llenar select de estado
                const estadoSelect = document.getElementById('estado');
                if (usuario.estadoSolicitud && usuario.estadoSolicitud !== 'Sin solicitud') {
                    const estado = usuario.estadoSolicitud.toLowerCase();
                    if (estado === 'aceptada') {
                        estadoSelect.value = 'Aceptada';
                    } else if (estado === 'rechazada') {
                        estadoSelect.value = 'Rechazada';
                    } else if (estado === 'pendiente') {
                        estadoSelect.value = 'Pendiente';
                    }
                } else {
                    estadoSelect.value = '';
                }
                // Llenar select de Estado Miembro (si viene en la respuesta) y validar consistencia
                const estadoMiembroSelect = document.getElementById('estadoMiembro');
                if (estadoMiembroSelect) {
                    console.log('API: usuario.estadoMiembro raw =', usuario.estadoMiembro);

                    const raw = (usuario.estadoMiembro || '').toString().trim();
                    const normalized = normalize(raw);
                    const solNorm = normalize(usuario.estadoSolicitud || '');

                    // Mapear a opciones
                    let mapped = '';
                    if (normalized === 'activo') mapped = 'Activo';
                    else if (normalized === 'inactivo') mapped = 'Inactivo';
                    else mapped = 'Sin membresía';

                    // Validaciones según reglas
                    if (solNorm === 'aceptada') {
                        if (mapped !== 'Activo') {
                            console.warn(`Inconsistencia detectada al consultar cedula=${usuario.cedula}: solicitud ACEPTADA pero estadoMiembro='${raw}'. Forzando 'Activo' en UI.`);
                            estadoMiembroSelect.value = 'Activo';
                        } else {
                            estadoMiembroSelect.value = mapped;
                        }
                    } else if (solNorm === 'rechazada' || solNorm === 'pendiente') {
                        if (mapped === 'Activo' || mapped === 'Inactivo') {
                            console.warn(`Inconsistencia detectada al consultar cedula=${usuario.cedula}: solicitud ${solNorm.toUpperCase()} pero estadoMiembro='${raw}'. Forzando 'Sin membresía' en UI.`);
                        }
                        estadoMiembroSelect.value = 'Sin membresía';
                    } else {
                        // Si no hay solicitud conocida, asignar lo mapeado
                        estadoMiembroSelect.value = mapped;
                    }
                }
                
                // Guardar idSolicitud para actualizaciones
                window.currentSolicitudId = usuario.idSolicitud;
                
                alert(`Usuario encontrado: ${usuario.nombre}`);
                
            } else if (response.status === 404) {
                alert('Usuario no encontrado con esa cédula');
                limpiarFormulario();
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'No se pudo buscar el usuario'));
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al buscar usuario');
        }
    }
    
    // FUNCIÓN ACTUALIZAR USUARIO
    async function actualizarUsuario() {
        console.log('FUNCIÓN ACTUALIZAR USUARIO EJECUTÁNDOSE');
        
        const cedula = document.getElementById('cedula').value.trim();
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const estadoSelect = document.getElementById('estado');
        const estadoSeleccionado = estadoSelect.value;
        
        if (!cedula) {
            alert('Debe buscar un usuario primero ingresando la cédula y haciendo clic en Consultar');
            return;
        }
        
        if (!nombre || !telefono || !correo) {
            alert('Todos los campos (nombre, teléfono y correo) son requeridos');
            return;
        }
        
        try {
            //ACTUALIZAR DATOS DEL USUARIO
            const responseUsuario = await fetch(`http://localhost:5000/membresia/actualizar-usuario/${cedula}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    telefono: telefono,
                    correo: correo
                })
            });
            
            if (!responseUsuario.ok) {
                const error = await responseUsuario.json();
                console.error('Error del servidor:', error);
                alert('Error: ' + (error.error || 'No se pudo actualizar el usuario'));
                return;
            }
            
            let mensaje = 'Usuario actualizado correctamente';
            
            // 2️⃣ ACTUALIZAR ESTADO DE SOLICITUD (si está seleccionado y existe solicitud)
            if (estadoSeleccionado && window.currentSolicitudId) {
                const responseEstado = await fetch(`http://localhost:5000/membresia/cambiar-estado/${window.currentSolicitudId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: estadoSeleccionado.toLowerCase()
                    })
                });
                
                if (responseEstado.ok) {
                    if (estadoSeleccionado.toLowerCase() === 'aceptada') {
                        mensaje += '\nMembresía ACTIVADA automáticamente';
                    } else if (estadoSeleccionado.toLowerCase() === 'rechazada') {
                        mensaje += '\nMembresía mantenida como INACTIVA';
                    } else if (estadoSeleccionado.toLowerCase() === 'pendiente') {
                        mensaje += '\nSolicitud marcada como PENDIENTE';
                    }
                } else {
                    mensaje += '\nUsuario actualizado pero hubo error al cambiar el estado de la solicitud';
                }
            } else if (estadoSeleccionado && !window.currentSolicitudId) {
                mensaje += '\nNo se puede cambiar el estado: este usuario no tiene solicitud de membresía';
            }
            
            alert(mensaje);
            console.log('Actualización completada');
            
            // Recargar la tabla para mostrar los cambios
            cargarSolicitudes();
            
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Error de conexión al actualizar usuario');
        }
    }
    
    function limpiarFormulario() {
        document.getElementById('nombre').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('correo').value = '';
        document.getElementById('estado').value = '';
        window.currentSolicitudId = null;
    }
    
    // Ajuste adicional para mostrar "Sin membresía" también en solicitudes rechazadas
    function getEstadoClass(estadoMiembro, estadoSolicitud) {
        if (estadoSolicitud?.toLowerCase() === 'pendiente' || estadoSolicitud?.toLowerCase() === 'rechazada') {
            return 'sin-membresia'; // Mostrar "Sin membresía" para solicitudes pendientes o rechazadas
        }

        switch (estadoMiembro?.toLowerCase()) {
            case 'activo': return 'activo';
            case 'inactivo': return 'inactivo';
            default: return 'sin-membresia';
        }
    }

    // Normalizar un string de estado (quita acentos, trim, lower)
    function normalize(str) {
        if (!str && str !== '') return '';
        return str.toString().trim().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    }

    function mostrarSolicitudesEnTabla(solicitudes) {
        const tbody = document.querySelector('.tabla-solicitudes tbody');

        if (!tbody) {
            console.error('No se encontró el tbody de la tabla');
            return;
        }

        tbody.innerHTML = '';

        // Filtrar solicitudes: solo mostrar aquellas con estado pendiente/aceptada/rechazada
        const estadosValidos = ['pendiente', 'aceptada', 'rechazada'];
        const solicitudesFiltradas = solicitudes.filter(solicitud => {
            const est = (solicitud.estadoSolicitud || '').toString().toLowerCase();
            return estadosValidos.includes(est);
        });

        if (solicitudesFiltradas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 20px; color: #555;">No hay solicitudes para mostrar</td>
                </tr>
            `;
            console.log('No hay solicitudes válidas para mostrar');
            return;
        }

        solicitudesFiltradas.forEach(solicitud => {
            // Validaciones de consistencia entre estadoSolicitud y estadoMiembro
            const estSol = normalize(solicitud.estadoSolicitud || '');
            const estMie = normalize(solicitud.estadoMiembro || '');

            let displayEstadoMiembro = solicitud.estadoMiembro || 'Sin membresía';
            let estadoMiembroClass = getEstadoClass(solicitud.estadoMiembro, solicitud.estadoSolicitud);

            // Regla 1: si solicitud = aceptada, el miembro debe estar ACTIVO. Si no, log y forzar 'Activo'.
            if (estSol === 'aceptada') {
                if (estMie !== 'activo') {
                    console.warn(`Inconsistencia detectada para cedula=${solicitud.cedula}: solicitud ACEPTADA pero estadoMiembro='${solicitud.estadoMiembro}'. Forzando 'Activo'.`);
                    displayEstadoMiembro = 'Activo';
                    estadoMiembroClass = 'activo';
                }
            }

            // Regla 2: si solicitud = rechazada, el miembro no puede estar Activado ni Inactivo -> forzar Sin membresía
            if (estSol === 'rechazada') {
                if (estMie === 'activo' || estMie === 'inactivo') {
                    console.warn(`Inconsistencia detectada para cedula=${solicitud.cedula}: solicitud RECHAZADA pero estadoMiembro='${solicitud.estadoMiembro}'. Forzando 'Sin membresía'.`);
                    displayEstadoMiembro = 'Sin membresía';
                    estadoMiembroClass = 'sin-membresia';
                }
            }

            // Regla 3: si solicitud = pendiente, el miembro no puede estar activado ni inactivo -> forzar Sin membresía
            if (estSol === 'pendiente') {
                if (estMie === 'activo' || estMie === 'inactivo') {
                    console.warn(`Inconsistencia detectada para cedula=${solicitud.cedula}: solicitud PENDIENTE pero estadoMiembro='${solicitud.estadoMiembro}'. Forzando 'Sin membresía'.`);
                    displayEstadoMiembro = 'Sin membresía';
                    estadoMiembroClass = 'sin-membresia';
                } else {
                    // si no hay miembro válido, mostrar sin membresía
                    displayEstadoMiembro = 'Sin membresía';
                    estadoMiembroClass = 'sin-membresia';
                }
            }

            const fila = document.createElement('tr');
            // Mostrar solo las columnas necesarias (sin Tipo Usuario)
            const estadoSolicitudTexto = solicitud.estadoSolicitud || 'N/A';
            fila.innerHTML = `
                <td>${solicitud.nombre}</td>
                <td>${solicitud.cedula}</td>
                <td>${solicitud.telefono}</td>
                <td>${solicitud.correo}</td>
                <td>${solicitud.fechaSolicitud || 'N/A'}</td>
                <td><span class="estado ${estadoMiembroClass}">${displayEstadoMiembro}</span></td>
                <td>
                    <span class="estado ${estadoSolicitudTexto === 'N/A' ? 'na' : getEstadoSolicitudClass(solicitud.estadoSolicitud)}">${estadoSolicitudTexto}</span>
                </td>
            `;

            tbody.appendChild(fila);
        });

        console.log('Tabla actualizada con', solicitudesFiltradas.length, 'solicitudes mostradas (filtradas)');
    }
    
    function getEstadoSolicitudClass(estado) {
        switch (estado?.toLowerCase()) {
            case 'aceptada': return 'activo';
            case 'rechazada': return 'inactivo';
            case 'pendiente': return 'pendiente';
            default: return 'pendiente';
        }
    }
    
    function mostrarMensajeError(mensaje) {
        const tbody = document.querySelector('.tabla-solicitudes tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: red; padding: 20px;">
                        ${mensaje}
                    </td>
                </tr>
            `;
        }
    }
    
    // FUNCIÓN ACTUALIZAR ESTADO DE SOLICITUD
    async function actualizarEstadoSolicitud(idSolicitud, nuevoEstado) {
        try {
            console.log('🔄 Actualizando estado de solicitud:', idSolicitud, 'a:', nuevoEstado);
            
            const response = await fetch(`http://localhost:5000/membresia/cambiar-estado/${idSolicitud}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    estado: nuevoEstado.toLowerCase()
                })
            });
            
            if (response.ok) {
                let mensaje = 'Estado actualizado correctamente';
                
                if (nuevoEstado.toLowerCase() === 'aceptada') {
                    mensaje += '\nMembresía ACTIVADA automáticamente';
                } else if (nuevoEstado.toLowerCase() === 'rechazada') {
                    mensaje += '\nMembresía mantenida como INACTIVA';
                }
                
                alert(mensaje);
                
                // Recargar la tabla para mostrar los cambios
                cargarSolicitudes();
                
            } else {
                const error = await response.json();
                alert('Error: ' + (error.error || 'No se pudo actualizar el estado'));
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al actualizar estado');
        }
    }
    
    // Función global para cambiar estado de solicitud
    window.cambiarEstadoSolicitud = async function(idSolicitud, estadoActual) {
        const opciones = ['pendiente', 'aceptada', 'rechazada'];
        const estadoSeleccionado = prompt(
            `Estado actual: ${estadoActual}\n\nSeleccione nuevo estado:\n1. Pendiente\n2. Aceptada\n3. Rechazada\n\nIngrese número (1-3):`
        );
        
        if (estadoSeleccionado && estadoSeleccionado >= 1 && estadoSeleccionado <= 3) {
            const nuevoEstado = opciones[estadoSeleccionado - 1];
            
            try {
                const response = await fetch(`http://localhost:5000/membresia/cambiar-estado/${idSolicitud}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        estado: nuevoEstado
                    })
                });
                
                if (response.ok) {
                    alert('Estado actualizado correctamente');
                    cargarSolicitudes();
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.error || 'No se pudo actualizar'));
                }
                
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión');
            }
        }
    };
    
    // Botón recargar
    const btnRecargar = document.createElement('button');
    btnRecargar.textContent = '🔄 Recargar Datos';
    btnRecargar.className = 'btn-recargar';
    btnRecargar.onclick = cargarSolicitudes;
    
    const h3 = document.querySelector('.solicitudes-section h3');
    if (h3) {
        h3.insertAdjacentElement('afterend', btnRecargar);
    }
    
    // Event listener para el select de estado (solo para validación)
    const estadoSelect = document.getElementById('estado');
    if (estadoSelect) {
        estadoSelect.addEventListener('change', function() {
            const nuevoEstado = this.value;
            const cedula = document.getElementById('cedula').value.trim();
            
            if (nuevoEstado && cedula && !window.currentSolicitudId) {
                alert('Este usuario no tiene una solicitud de membresía registrada');
                this.value = '';
            }
        });
    }
    
    // Botón cancelar
    const btnCancelar = document.querySelector('.cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function() {
            if (confirm('¿Está seguro de que desea limpiar el formulario?')) {
                limpiarFormulario();
                document.getElementById('cedula').value = '';
                window.currentSolicitudId = null;
            }
        });
    }
    
    // Validación para el estado de miembro
    const estadoMiembroSelect = document.getElementById('estadoMiembro');
    if (estadoMiembroSelect) {
        estadoMiembroSelect.addEventListener('change', function() {
            const estadoMiembro = this.value;
            const estadoSolicitud = document.getElementById('estado').value;

            // Regla: si la solicitud está ACEPTADA, el estadoMiembro no puede ser 'Sin membresía'
            if (estadoSolicitud === 'Aceptada' && (estadoMiembro === 'Sin membresía' || estadoMiembro === '' )) {
                console.warn('No se permite dejar Sin membresía cuando la solicitud está Aceptada. Forzando a Activo.');
                alert('No se puede dejar Sin membresía para una solicitud Aceptada. Se asignará ACTIVO.');
                this.value = 'Activo';
                return;
            }

            if (estadoMiembro === 'Activo' && (estadoSolicitud === 'Rechazada' || estadoSolicitud === 'Pendiente')) {
                console.log('No se puede activar la membresía si la solicitud no está aceptada.');
                alert('No se puede activar la membresía si la solicitud no está aceptada.');
                this.value = '';
            } else if (estadoMiembro === 'Inactivo' && estadoSolicitud !== 'Aceptada') {
                console.log('No se puede poner el estado de miembro como inactivo si la solicitud no está aceptada.');
                alert('No se puede poner el estado de miembro como inactivo si la solicitud no está aceptada.');
                this.value = '';
            }
        });
    }
});