document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-editar-miembro');
    const urlParams = new URLSearchParams(window.location.search);
    const cedula = urlParams.get('cedula');

    // Toggle mostrar/ocultar contraseña
    const togglePasswordBtn = document.getElementById('togglePassword');
    const claveInput = document.getElementById('clave');

    togglePasswordBtn.addEventListener('click', function() {
        if (claveInput.type === 'password') {
            claveInput.type = 'text';
            togglePasswordBtn.textContent = 'Ocultar';
        } else {
            claveInput.type = 'password';
            togglePasswordBtn.textContent = 'Ver';
        }
    });

    if (!cedula) {
        alert('No se especificó un usuario para editar');
        window.location.href = 'GestionarMiembro.html';
        return;
    }

    // Validar contraseña según requisitos
    function validarContrasena(clave) {
        if (!clave) return true; // Permitir dejar vacío (no cambiar contraseña)
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(clave);
    }

    // Cargar datos del usuario
    async function cargarUsuario() {
        try {
            const res = await fetch(`http://127.0.0.1:5000/membresia/buscar-usuario/${cedula}`);
            if (!res.ok) {
                alert('Error al cargar el usuario');
                window.location.href = 'GestionarMiembro.html';
                return;
            }
            
            const usuario = await res.json();
            
            // Llenar formulario
            document.getElementById('nombre').value = usuario.nombre || '';
            document.getElementById('cedula').value = usuario.cedula || '';
            document.getElementById('telefono').value = usuario.telefono || '';
            document.getElementById('correo').value = usuario.correo || '';
            
            // Llenar estado miembro
            const estadoMiembroSelect = document.getElementById('estadoMiembro');
            if (usuario.estadoMiembro === 'activo') {
                estadoMiembroSelect.value = 'activo';
            } else if (usuario.estadoMiembro === 'inactivo') {
                estadoMiembroSelect.value = 'inactivo';
            } else {
                estadoMiembroSelect.value = 'Sin membresía';
            }
            
            // Llenar estado solicitud
            const estadoSolicitudSelect = document.getElementById('estadoSolicitud');
            if (usuario.estadoSolicitud) {
                estadoSolicitudSelect.value = usuario.estadoSolicitud.toLowerCase();
            }

        } catch (err) {
            console.error('Error:', err);
            alert('Error al cargar el usuario');
            window.location.href = 'GestionarMiembro.html';
        }
    }

    // Guardar cambios
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const clave = document.getElementById('clave').value.trim();
        const estadoMiembro = document.getElementById('estadoMiembro').value;
        const estadoSolicitud = document.getElementById('estadoSolicitud').value;

        // Validaciones
        if (!nombre || !telefono || !correo) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Validar contraseña si se intenta cambiar
        if (clave && !validarContrasena(clave)) {
            alert('La contraseña debe tener:\n- Mínimo 8 caracteres\n- Al menos 1 mayúscula\n- Al menos 1 minúscula\n- Al menos 1 número\n- Al menos 1 carácter especial (@$!%*?&)');
            return;
        }

        try {
            // Actualizar datos del usuario
            const datosActualizacion = {
                nombre: nombre,
                telefono: telefono,
                correo: correo
            };

            if (clave) {
                datosActualizacion.clave = clave;
            }

            const resPut = await fetch(`http://127.0.0.1:5000/membresia/actualizar-usuario/${cedula}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosActualizacion)
            });

            if (!resPut.ok) {
                const error = await resPut.json();
                alert('Error: ' + (error.error || 'No se pudo actualizar el usuario'));
                return;
            }

            let mensaje = 'Usuario actualizado correctamente';

            // Actualizar estado de solicitud si cambió
            if (estadoSolicitud) {
                try {
                    const resEstado = await fetch(`http://127.0.0.1:5000/membresia/cambiar-estado/${cedula}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ estado: estadoSolicitud })
                    });

                    if (resEstado.ok) {
                        if (estadoSolicitud === 'aceptada') {
                            mensaje += '\nMembresía ACTIVADA automáticamente';
                        } else if (estadoSolicitud === 'rechazada') {
                            mensaje += '\nMembresía mantenida como INACTIVA';
                        }
                    }
                } catch (err) {
                    console.warn('No se pudo actualizar el estado de solicitud:', err);
                }
            }

            alert(mensaje);
            window.location.href = 'GestionarMiembro.html';

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });

    // Cargar usuario al abrir la página
    cargarUsuario();
});
