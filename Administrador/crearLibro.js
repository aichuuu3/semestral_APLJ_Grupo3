// script para manejar el formulario de agregar nuevo libro
const form = document.getElementById('form-libro');

// Función para capitalizar título
function capitalizar(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Función para validar libro antes de enviar
async function validarLibro(datos) {
    // Título
    datos.titulo = capitalizar(datos.titulo.trim());
    if (!datos.titulo || datos.titulo.length < 2 || datos.titulo.length > 100) {
        alert("El título debe tener entre 2 y 100 caracteres.");
        return false;
    }

    // Autor
    datos.autor = datos.autor.trim().toUpperCase();
    if (!datos.autor || datos.autor.length < 2 || datos.autor.length > 100) {
        alert(" El autor debe tener entre 2 y 100 caracteres.");
        return false;
    }

    // ISBN (7 a 13 dígitos)
    const isbnPattern = /^\d{7,13}$/;
    if (!isbnPattern.test(datos.isbn)) {
        // ⚠️ CORRECCIÓN del mensaje de alerta para coincidir con el patrón regex
        alert("ISBN inválido. Debe contener entre 7 y 13 dígitos.");
        return false;
    }

    // Fecha de ingreso
    if (!datos.fechaIngreso) {
        alert("La fecha de ingreso es obligatoria.");
        return false;
    }
    
    // ⚠️ CORRECCIÓN de la validación de fecha
    const fechaIngresada = new Date(datos.fechaIngreso);
    // Para normalizar a medianoche (ignorar la hora), tomamos solo la parte de la fecha.
    fechaIngresada.setHours(0, 0, 0, 0); 
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 

    if (fechaIngresada < hoy) {
        alert("⚠️ La fecha de ingreso no puede ser anterior a la fecha actual.");
        return false;
    }


    // Cantidad
    const cantidadNum = Number(datos.cantidad);
    if (cantidadNum <= 0 || !Number.isInteger(cantidadNum)) {
        // La cantidad debe ser positiva, no negativa
        alert("La cantidad debe ser un número entero positivo (mayor a cero).");
        return false;
    }

    // Categoría
    if (!datos.categoria) {
        alert("Seleccione una categoría.");
        return false;
    }

    // Estado
    if (!datos.estado) {
        datos.estado = "disponible";
    }

    // Validar duplicados en la BD (Este fetch también necesita CORS)
    try {
        const res = await fetch("http://127.0.0.1:5000/libros/");
        if (!res.ok) throw new Error(`Error al cargar libros: ${res.status}`);
        const libros = await res.json();

        const tituloExistente = libros.some(libro => libro.titulo && libro.titulo.toLowerCase() === datos.titulo.toLowerCase());
        if (tituloExistente) {
            alert("Ya existe un libro con ese título.");
            return false;
        }

        const isbnExistente = libros.some(libro => libro.isbn === datos.isbn);
        if (isbnExistente) {
            alert("Ya existe un libro con ese ISBN.");
            return false;
        }
    } catch (e) {
        console.error("Error al verificar duplicados:", e);
        // Podrías permitir el envío si la verificación falla (o bloquearlo)
        alert("Error al validar duplicados en el servidor. Intente de nuevo.");
        return false;
    }

    return true; // todo OK
}

// Manejo del submit
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // ⚠️ ATENCIÓN: Asegúrate de que tu HTML tenga inputs con los nombres 'titulo', 'autor' e 'isbn'
    const datos = {
        titulo: form.titulo.value,
        autor: form.autor.value,
        isbn: form.isbn.value,
        fechaIngreso: form.fechaIngreso.value,
        cantidad: form.cantidad.value,
        categoria: form.categoria.value,
        estado: form.estado ? form.estado.value : "disponible"
    };

    if (!await validarLibro(datos)) return;

    fetch("http://127.0.0.1:5000/libros/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(res => {
        // Manejamos la respuesta, incluso si es un error 4xx o 5xx
        if (!res.ok) {
            // Leemos el JSON de error que enviamos desde Flask
            return res.json().then(error => {
                throw new Error(error.mensaje || `Error de servidor: ${res.status}`);
            });
        }
        return res.json();
    })
    .then(resp => {
        alert(resp.mensaje);
        window.location.href = "gestionarLibros.html";
    })
    .catch(err => {
        // Mostramos el mensaje de error del servidor o del fetch.
        alert(`Error al crear libro: ${err.message}`);
    });
});