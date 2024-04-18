const input_insert_municipio = document.getElementById("input-submit");
const btn_edit_cancel = document.getElementById("btn-edit-cancel");
const btn_edit_submit = document.getElementById("input-submit-edit");
const btn_delete_cancel = document.getElementById("btn-delete-cancel");
const btn_delete_submit = document.getElementById("input-submit-delete");
const btn_habitantes_cancel = document.getElementById("btn-habitantes-cancel");

const input_search = document.getElementById("search");

const btns_edit_municipio = document.querySelectorAll(".btn-edit-municipio");
const btns_delete_municipio = document.querySelectorAll(".btn-delete-municipio")
const btns_ver_municipio = document.querySelectorAll(".btn-ver-municipio");

const modal_container = document.getElementById('modal-container');
const modal_container_eliminar = document.getElementById('modal-container-eliminar');
const modal_container_habitantes = document.getElementById('modal-container-habitantes');
const message = document.querySelector('#message');

async function requestData(url, data) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':  '*',
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    return response.json()
}

function showMessage(correct, message_container, messages) {
    if (correct) {
        message_container.textContent = messages[0];
        message_container.classList.add('good-message');
    } else {
        message_container.textContent = messages[1];
        message_container.classList.add('bad-message');
    }
}

function reloadPage() {
    location.reload()
}

function desactiveModal(event, container) {
    event.preventDefault();
    container.classList.remove('show');
}

function search(search_input, body, col){
    var num_cols, display, input, filter, table_body, tr, td, i, txtValue;
    num_cols = col;
    input = document.getElementById(search_input);
    filter = input.value.toUpperCase();
    table_body = document.getElementById(body);
    tr = table_body.getElementsByTagName("tr");

    for(i=0; i< tr.length; i++){				
        display = "none";
        for(j=0; j < num_cols; j++){
            td = tr[i].getElementsByTagName("td")[j];
            if(td){
                txtValue = td.textContent || td.innerText;
                if(txtValue.toUpperCase().indexOf(filter) > -1){
                    display = "";
                }
            }
        }
        tr[i].style.display = display;
    }
}

input_insert_municipio.addEventListener('click', e => {
    const nom_municipio = document.getElementById("nombre-municpio");
    const area = document.getElementById("area");
    const presupuesto = document.getElementById("presup");

    const messages = ['Municipio insertado con exito', 'No se pudo insertar el municipio'];

    e.preventDefault()

    console.log({'nom-mun': nom_municipio.value, 'area': area.value, 'presupuesto': presupuesto.value})
    requestData('/municipios/insertar', {'nom-mun': nom_municipio.value, 'area': area.value, 'presupuesto': presupuesto.value}).
    then(data => showMessage(data.response, message, messages));

    setTimeout(reloadPage(), 2000)
});

btns_edit_municipio.forEach(btn => {
    btn.addEventListener('click', e => {
        const nom_municipio = document.getElementById("nombre-municpio-edit");
        const area = document.getElementById("area-edit");
        const presupuesto = document.getElementById("presup-edit");
        const id = document.getElementById("div-submit-edit-municipio");        

        const municipio = btn.parentNode.parentNode.dataset;

        id.setAttribute('data-id', municipio.id);

        nom_municipio.value = municipio.nom;
        area.value = municipio.area;
        presupuesto.value = municipio.presupuesto;

        modal_container.classList.add('show');
        console.log(btn.parentNode.parentNode.dataset);
    });
});

btn_edit_cancel.addEventListener('click', e => desactiveModal(e, modal_container));

btn_edit_submit.addEventListener('click', e => {
    const nom_municipio = document.getElementById("nombre-municpio-edit");
    const area = document.getElementById("area-edit");
    const presupuesto = document.getElementById("presup-edit");
    const id = document.getElementById("div-submit-edit-municipio");

    const messages = ['Municipio editdo con exito', 'No se pudo editar el municipio'];

    e.preventDefault();

    console.log({'id-mun': id.dataset.id, 'nom-mun': nom_municipio.value, 'area': area.value, 'presupuesto': presupuesto.value})
    requestData('/municipios/editar', {'id-mun': id.dataset.id, 'nom-mun': nom_municipio.value, 'area': area.value, 'presupuesto': presupuesto.value}).
    then(data => showMessage(data.response, message, messages));

    modal_container.classList.remove('show');

    setTimeout(reloadPage(), 2000)
});

btns_delete_municipio.forEach(btn => {
    btn.addEventListener('click', e => {
        const nom_municipio = document.getElementById("nombre-municpio-delete");
        const area = document.getElementById("area-delete");
        const presupuesto = document.getElementById("presup-delete");
        const id = document.getElementById("div-submit-delete-municipio");        

        const municipio = btn.parentNode.parentNode.dataset;

        id.setAttribute('data-id', municipio.id);

        nom_municipio.value = municipio.nom;
        area.value = municipio.area;
        presupuesto.value = municipio.presupuesto;

        modal_container_eliminar.classList.add('show');
        console.log(btn.parentNode.parentNode.dataset);
    });
});

btn_delete_cancel.addEventListener('click', e => desactiveModal(e, modal_container_eliminar));

btn_delete_submit.addEventListener('click', e => {
    const id = document.getElementById("div-submit-delete-municipio");

    const messages = ['Municipio eliminado con exito', 'No se pudo eliminar el municipio'];

    e.preventDefault();

    console.log({'id-mun': id.dataset.id});
    requestData('/municipios/eliminar', {'id-mun': id.dataset.id}).
    then(data => showMessage(data.response, message, messages));

    modal_container_eliminar.classList.remove('show');

    setTimeout(reloadPage(), 2000)
});

btns_ver_municipio.forEach(btn => {
    btn.addEventListener('click', e => {
        const municipio = btn.parentNode.parentNode.dataset;
        const bodyTable = document.getElementById("body-habitantes");

        bodyTable.innerHTML = "";

        requestData('/municipios/habitantes', {'id-mun': municipio.id}).
        then(data => {
            console.log(data.habitantes);
            if (data.habitantes !== "False") {
                data.habitantes.forEach(habitante => {
                    const tr = document.createElement("tr");
                    const td_nombres = document.createElement("td");
                    const td_apellidos = document.createElement("td");
                    const td_num_doc = document.createElement("td");
                    const td_edad = document.createElement("td");
                    const td_sexo = document.createElement("td");
                    
                    td_nombres.classList.add("td-data");
                    td_nombres.innerText = `${habitante["primer_nombre"]} ${habitante["segundo_nombre"]}`
                    tr.append(td_nombres);

                    td_apellidos.classList.add("td-data");
                    td_apellidos.innerText = `${habitante["primer_apellido"]} ${habitante["segundo_apellido"]}`
                    tr.append(td_apellidos);

                    td_num_doc.classList.add("td-data");
                    td_num_doc.innerText = habitante["num_documento"];
                    tr.append(td_num_doc);

                    td_edad.classList.add("td-data");
                    td_edad.innerText = habitante["edad"];
                    tr.append(td_edad);

                    td_sexo.classList.add("td-data");

                    if (habitante["sexo"]) {
                        td_sexo.innerText = "Masculino";
                    } else {
                        td_sexo.innerText = "Femenino";
                    }

                    tr.append(td_sexo);

                    bodyTable.append(tr);
                });
            }
            modal_container_habitantes.classList.add('show');
        });
    });
});

btn_habitantes_cancel.addEventListener('click', e => desactiveModal(e, modal_container_habitantes));

input_search.addEventListener('keyup', e => search("search", "body", 1));