document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-miembro');

    // Validar contraseña según requisitos
    function validarContrasena(clave) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/;
        return regex.test(clave);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const cedula = document.getElementById('cedula').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const clave = document.getElementById('clave').value.trim();
        const idTipoUsuario = document.getElementById('idTipoUsuario').value;

        // Validaciones básicas
        if (!nombre || !cedula || !telefono || !correo || !clave || !idTipoUsuario) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Validar contraseña
        if (!validarContrasena(clave)) {
            alert('La contraseña debe tener:\n- Mínimo 8 caracteres\n- Al menos 1 mayúscula\n- Al menos 1 minúscula\n- Al menos 1 número\n- Al menos 1 carácter especial (@$!%*?&)');
            return;
        }

        const datos = {
            nombre: nombre,
            cedula: cedula,
            telefono: telefono,
            correo: correo,
            clave: clave,
            idTipoUsuario: parseInt(idTipoUsuario)
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Usuario creado exitosamente');
                window.location.href = 'GestionarMiembro.html';
            } else {
                alert('Error: ' + (result.error || result.mensaje || 'Error al crear el usuario'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });
});