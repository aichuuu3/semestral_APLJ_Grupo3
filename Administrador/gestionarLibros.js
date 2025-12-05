document.addEventListener("DOMContentLoaded", function() {
    const tbody = document.getElementById("tabla-libros-body");

    async function cargarLibros() {
        try {
            const res = await fetch("http://127.0.0.1:5000/libros");
            const libros = await res.json();

            tbody.innerHTML = ""; // limpiar tabla
            libros.forEach(libro => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${libro.titulo}</td>
                    <td>${libro.autor}</td>
                    <td>${libro.isbn}</td>
                    <td>${libro.cantidad}</td>
                    <td>${libro.categoria || 'N/A'}</td>
                    <td>
                        <span class="estado ${libro.estado === 'disponible' ? 'activo' : 'inactivo'}">
                            ${libro.estado === 'disponible' ? 'Disponible' : 'No Disponible'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-editar" data-id="${libro.idLibro}">Editar</button>
                        <button class="btn-eliminar" data-id="${libro.idLibro}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // --- Eventos dinámicos para los botones ---
            document.querySelectorAll(".btn-editar").forEach(btn => {
                btn.addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    window.location.href = `infoLibro.html?id=${id}`;
                });
            });

            document.querySelectorAll(".btn-eliminar").forEach(btn => {
                btn.addEventListener("click", async function() {
                    const id = this.getAttribute("data-id");
                    if (confirm("¿Seguro que quieres eliminar este libro?")) {
                        try {
                            await fetch(`http://127.0.0.1:5000/libros/${id}`, {
                                method: "DELETE"
                            });
                            alert("Libro eliminado con éxito");
                            cargarLibros(); // recargar tabla
                        } catch (err) {
                            console.error("Error al eliminar libro:", err);
                        }
                    }
                });
            });

        } catch (err) {
            console.error("Error al cargar libros:", err);
        }
    }

    cargarLibros();
});
