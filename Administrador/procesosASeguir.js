document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.getElementById("tabla-procesos-body");
    let todosLosProcesos = []; // Almacenar todos los datos
    let filtroActual = 'todos';

    // Configurar filtros
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase activo de todos
            document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
            // Agregar clase activo al clickeado
            this.classList.add('activo');
            
            filtroActual = this.getAttribute('data-filtro');
            mostrarProcesos();
        });
    });

    async function cargarProcesos() {
        try {
            const res = await fetch("http://127.0.0.1:5000/membresia/completas");
            todosLosProcesos = await res.json();
            mostrarProcesos();
        } catch (err) {
            console.error("Error al cargar procesos:", err);
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red;">Error al cargar los procesos</td></tr>';
        }
    }

    function mostrarProcesos() {
        tbody.innerHTML = "";
        
        // Filtrar según el filtro seleccionado
        let procesosFiltrados = todosLosProcesos;
        if (filtroActual !== 'todos') {
            procesosFiltrados = todosLosProcesos.filter(p => 
                p.estadoSolicitud && p.estadoSolicitud.toLowerCase() === filtroActual
            );
        }

        if (procesosFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; color:#999;">No hay procesos para mostrar</td></tr>';
            return;
        }

        procesosFiltrados.forEach(proceso => {
            const tr = document.createElement("tr");

            const estadoSolicitudClass = proceso.estadoSolicitud === 'aceptada' ? 'aceptada'
                : proceso.estadoSolicitud === 'rechazada' ? 'rechazada'
                : 'pendiente';

            const estadoMiembroClass = proceso.estadoMiembro === 'activo' ? 'activo'
                : proceso.estadoMiembro === 'inactivo' ? 'inactivo'
                : 'rechazada';

            tr.innerHTML = `
                <td>${proceso.nombre}</td>
                <td>${proceso.cedula}</td>
                <td>${proceso.telefono}</td>
                <td>${proceso.correo}</td>
                <td>${proceso.fechaSolicitud || 'N/A'}</td>
                <td>
                    <span class="estado-badge ${estadoSolicitudClass}">
                        ${proceso.estadoSolicitud ? proceso.estadoSolicitud.charAt(0).toUpperCase() + proceso.estadoSolicitud.slice(1) : 'N/A'}
                    </span>
                </td>
                <td>
                    <span class="estado ${proceso.estadoMiembro === 'activo' ? 'activo' : 'inactivo'}">
                        ${proceso.estadoMiembro === 'activo' ? 'Activo' : proceso.estadoMiembro === 'Sin membresía' ? 'Sin membresía' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <button class="btn-aceptar" data-cedula="${proceso.cedula}">✓ Aceptar</button>
                    <button class="btn-rechazar" data-cedula="${proceso.cedula}">✗ Rechazar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Agregar eventos a los botones
        document.querySelectorAll('.btn-aceptar').forEach(btn => {
            btn.addEventListener('click', function() {
                const cedula = this.getAttribute('data-cedula');
                cambiarEstadoSolicitud(cedula, 'aceptada');
            });
        });

        document.querySelectorAll('.btn-rechazar').forEach(btn => {
            btn.addEventListener('click', function() {
                const cedula = this.getAttribute('data-cedula');
                cambiarEstadoSolicitud(cedula, 'rechazada');
            });
        });
    }

    async function cambiarEstadoSolicitud(cedula, nuevoEstado) {
        // Obtener el idSolicitud
        const proceso = todosLosProcesos.find(p => p.cedula === cedula);
        if (!proceso || !proceso.idSolicitud) {
            alert('No se encontró la solicitud');
            return;
        }

        const confirmacion = confirm(
            `¿Estás seguro de que deseas ${nuevoEstado === 'aceptada' ? 'ACEPTAR' : 'RECHAZAR'} ` +
            `la solicitud de ${proceso.nombre}?`
        );

        if (!confirmacion) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/membresia/cambiar-estado/${proceso.idSolicitud}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                let mensaje = `Solicitud ${nuevoEstado === 'aceptada' ? 'ACEPTADA' : 'RECHAZADA'} correctamente`;
                if (nuevoEstado === 'aceptada') {
                    mensaje += '\n✓ Membresía ACTIVADA automáticamente';
                }
                alert(mensaje);
                cargarProcesos(); // Recargar tabla
            } else {
                const error = await res.json();
                alert('Error: ' + (error.error || 'No se pudo actualizar el estado'));
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error de conexión');
        }
    }

    // Cargar procesos al iniciar
    cargarProcesos();
});
