document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.getElementById("tabla-miembros-body");

    async function cargarMiembros() {
        try {
            const res = await fetch("http://127.0.0.1:5000/membresia/completas");
            const usuarios = await res.json();

            tbody.innerHTML = ""; // limpiar tabla
            
            // Filtrar solo usuarios tipo 3 (Miembros)
            const miembros = usuarios.filter(usuario => usuario.tipoUsuario === 'Miembro' || usuario.idTipoUsuario === 3);
            
            miembros.forEach(usuario => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${usuario.nombre}</td>
                    <td>${usuario.cedula}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.correo}</td>
                    <td>${usuario.fechaSolicitud || 'N/A'}</td>
                    <td>
                        <span class="estado ${usuario.estadoMiembro === 'activo' ? 'activo' : 'inactivo'}">
                            ${usuario.estadoMiembro === 'activo' ? 'Activo' : usuario.estadoMiembro === 'Sin membresía' ? 'Sin membresía' : 'Inactivo'}
                        </span>
                    </td>
                    <td>
                        <span class="estado ${usuario.estadoSolicitud === 'aceptada' ? 'activo' : usuario.estadoSolicitud === 'pendiente' ? 'pendiente' : usuario.estadoSolicitud === 'rechazada' ? 'rechazado' : 'na'}">
                            ${usuario.estadoSolicitud ? usuario.estadoSolicitud.charAt(0).toUpperCase() + usuario.estadoSolicitud.slice(1) : 'Sin solicitud'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-editar" data-id="${usuario.cedula}">Editar</button>
                        <button class="btn-eliminar" data-id="${usuario.cedula}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // --- Eventos dinámicos para los botones ---
            document.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", function() {
                    const cedula = this.getAttribute("data-id");
                    window.location.href = `editarMiembro.html?cedula=${cedula}`;
                });
            });

            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", async function() {
                    const cedula = this.getAttribute("data-id");
                    
                    // Obtener datos del usuario para mostrar en la confirmación
                    const row = this.closest("tr");
                    const nombre = row.cells[0].textContent;
                    const correo = row.cells[3].textContent;
                    
                    // Confirmación detallada
                    const confirmacion = confirm(
                        `⚠️ ELIMINAR USUARIO\n\n` +
                        `Nombre: ${nombre}\n` +
                        `Cédula: ${cedula}\n` +
                        `Correo: ${correo}\n\n` +
                        `¿Estás completamente seguro de que deseas eliminar este usuario?\n` +
                        `Esta acción no se puede deshacer.`
                    );
                    
                    if (confirmacion) {
                        try {
                            const res = await fetch(`http://127.0.0.1:5000/usuarios/${cedula}`, {
                                method: "DELETE"
                            });
                            
                            if (res.ok) {
                                alert(`✓ Usuario "${nombre}" ha sido eliminado correctamente`);
                                cargarMiembros(); // recargar tabla
                            } else {
                                const error = await res.json();
                                alert(`Error: ${error.error || 'No se pudo eliminar el usuario'}`);
                            }
                        } catch (err) {
                            console.error("Error al eliminar usuario:", err);
                            alert("Error de conexión al intentar eliminar el usuario");
                        }
                    }
                });
            });

        } catch (err) {
            console.error("Error al cargar miembros:", err);
        }
    }

    cargarMiembros();
});