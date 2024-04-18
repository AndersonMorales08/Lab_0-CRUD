document.addEventListener('DOMContentLoaded', function() {
    const tablaViviendas = document.getElementById('tabla-viviendas');
    const tbody = tablaViviendas.querySelector('tbody');

    // Función para cargar los datos de las viviendas en la tabla
    function cargarViviendas(data) {
        tbody.innerHTML = ''; // Limpiar filas existentes
        data.forEach(vivienda => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vivienda.id_vivienda}</td>
                <td>${vivienda.direccion}</td>
                <td>${vivienda.capacidad}</td>
                <td>${vivienda.pisos}</td>
                <td>${vivienda.id_municipio}</td>
                <td>${vivienda.id_propietario}</td>
                <td>
                    <button class="btn-eliminar" data-id="${vivienda.id_vivienda}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    }

    // Evento para mostrar viviendas al hacer clic en el botón
    const mostrarBtn = document.getElementById('mostrar-viviendas-btn');
    mostrarBtn.addEventListener('click', function() {
        fetch('/obtener_viviendas')
            .then(response => response.json())
            .then(data => cargarViviendas(data))
            .catch(error => console.error('Error al cargar las viviendas:', error));
    });

    // Evento para eliminar vivienda al hacer clic en el botón
    tbody.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-eliminar')) {
            const id_vivienda = event.target.dataset.id;
            console.log('Eliminar vivienda', id_vivienda);
            if (confirm('¿Estás seguro de que deseas eliminar esta vivienda?')) {
                fetch(`/eliminar_vivienda/${id_vivienda}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.response) {
                        // Vivienda eliminada exitosamente
                        event.target.closest('tr').remove();
                    } else {
                        alert('Error al eliminar la vivienda');
                    }
                })
                .catch(error => console.error('Error al eliminar la vivienda:', error));
            }
        }
    });

    // Evento para mostrar mensaje de éxito después de registrar una vivienda
    const formularioRegistro = document.querySelector('form[action="/registrar_vivienda"]');
    formularioRegistro.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar recargar la página
        const formData = new FormData(formularioRegistro);
        fetch('/registrar_vivienda', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const mensajeExito = document.getElementById('mensaje-exito');
                mensajeExito.style.display = 'block';
                setTimeout(() => {
                    mensajeExito.style.display = 'none';
                }, 3000); // Ocultar el mensaje después de 3 segundos
            } else {
                alert('Exito al registrar la vivienda');
            }
        })
        .catch(error => console.error('Error al registrar la vivienda:', error));
    });

    // Evento para actualizar vivienda al enviar el formulario
    const formularioActualizacion = document.querySelector('form[action="/actualizar_vivienda"]');
    formularioActualizacion.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar recargar la página

        // Obtener los datos del formulario
        const formData = new FormData(formularioActualizacion);

        // Enviar los datos al servidor para actualizar la vivienda
        fetch('/actualizar_vivienda', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Mostrar mensaje de éxito
                alert('La vivienda se ha actualizado correctamente.');
            } else {
                // Mostrar mensaje de error
                alert('Error al actualizar la vivienda.');
            }
        })
        .catch(error => console.error('Error al actualizar la vivienda:', error));
    });
});
