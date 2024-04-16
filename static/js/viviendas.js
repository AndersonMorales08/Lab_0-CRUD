document.addEventListener("DOMContentLoaded", function() {
    // Escuchador de eventos para el botón "Mostrar viviendas"
    document.getElementById("mostrar-viviendas-btn").addEventListener("click", function() {
        console.log("Botón 'Mostrar viviendas' presionado.");
        obtenerViviendas();
    });
});

function obtenerViviendas() {
    console.log("Haciendo solicitud para obtener viviendas...");
    // Realizar una solicitud GET a la ruta '/obtener_viviendas' en el servidor
    fetch("/obtener_viviendas")
        .then(response => {
            if (!response.ok) {
                throw new Error('Hubo un problema al obtener las viviendas.');
            }
            return response.json();
        })
        .then(data => {
            console.log("Viviendas obtenidas:", data);
            // Llamar a la función para mostrar las viviendas en la tabla
            mostrarViviendas(data);
        })
        .catch(error => {
            console.error("Error al obtener las viviendas:", error);
        });
}

function mostrarViviendas(viviendas) {
    console.log("Mostrando viviendas en la tabla...");
    // Obtener la tabla de viviendas
    var tablaViviendas = document.getElementById("tabla-viviendas");

    // Limpiar la tabla antes de agregar nuevas filas
    tablaViviendas.innerHTML = "";

    // Recorrer cada vivienda y agregar una fila a la tabla
    viviendas.forEach(function(vivienda) {
        var fila = document.createElement("tr");

        var celdaId = document.createElement("td");
        celdaId.textContent = vivienda.id;
        fila.appendChild(celdaId);

        var celdaDireccion = document.createElement("td");
        celdaDireccion.textContent = vivienda.direccion;
        fila.appendChild(celdaDireccion);

        var celdaCapacidad = document.createElement("td");
        celdaCapacidad.textContent = vivienda.capacidad;
        fila.appendChild(celdaCapacidad);

        var celdaPisos = document.createElement("td");
        celdaPisos.textContent = vivienda.pisos;
        fila.appendChild(celdaPisos);

        tablaViviendas.appendChild(fila);
    });
}
