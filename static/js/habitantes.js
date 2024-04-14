const btns_edit = document.querySelectorAll('.btn-edit-habitante');
const btns_delete = document.querySelectorAll('.btn-delete-habitante'); 
const btn_edit_cancel = document.querySelector('#btn-edit-cancel');
const btn_delete_cancel = document.querySelector('#btn-delete-cancel');
const modal_container = document.querySelector('#modal-container');
const modal_container_delete = document.querySelector('#modal-container-eliminar');
const delete_submit = document.querySelector('#input-submit-delete');
const input_submit = document.querySelector('#input-submit');
const input_submit_edit = document.querySelector('#input-submit-edit');
const input_search = document.getElementById("search");
const input_cabeza_familia = document.getElementById('cabeza-familia');

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

function search(){
    var num_cols, display, input, filter, table_body, tr, td, i, txtValue;
    num_cols = 4;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table_body = document.getElementById("body");
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function cleanString(strData, obj) {
    let str_var = strData.split(":");
    obj[str_var[0].trim().replaceAll("'", "")] = str_var[1].trim().replaceAll("'", "");
}

function selectTypeDocument(tipo_doc) {
    if (tipo_doc === 'Cédula') {
        return 1;
    } else if (tipo_doc === 'Tarjeta de identidad') {
        return 2;
    } else if (tipo_doc === 'Cédula de extranjería') {
        return 3;
    } else {
        return 4;
    }
}

function selectSex(sexo) {
    if (sexo === 'Masculino') {
        return 1;
    } else {
        return 0;
    }
} 

function desactiveModal(event, container) {
    event.preventDefault();
    container.classList.remove('show');
}

function initModal(inputs, obj, modal) {
    const input_nom1 = document.querySelector(`#${inputs[0]}`);
    const input_nom2 = document.querySelector(`#${inputs[1]}`);
    const input_ape1 = document.querySelector(`#${inputs[2]}`);
    const input_ape2 = document.querySelector(`#${inputs[3]}`);
    const input_tipo_doc = document.querySelector(`#${inputs[4]}`);
    const input_num_doc = document.querySelector(`#${inputs[5]}`);
    const input_fecha_nac = document.querySelector(`#${inputs[6]}`);
    const input_telefono = document.querySelector(`#${inputs[7]}`);
    const input_sexo = document.querySelector(`#${inputs[8]}`);
    const input_municipio = document.querySelector(`#${inputs[9]}`);

    input_nom1.value = obj["nombres"].split(" ")[0];
    input_nom2.value = obj["nombres"].split(" ")[1];
    input_ape1.value = obj["apellidos"].split(" ")[0];
    input_ape2.value = obj["apellidos"].split(" ")[1];
    input_tipo_doc.value = selectTypeDocument(obj["tipo_documento"]);
    input_num_doc.value = obj["num_doc"];
    input_fecha_nac.value = obj["fecha_nac"];
    input_sexo.value = selectSex(obj["sexo"]);
    input_telefono.value = obj["telefono"]; 
    input_municipio.value = obj["id_municipio"];

    modal.classList.add('show');
}

function reloadPage() {
    location.reload()
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

btns_edit.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const inputs = ['nombre1-edit', 'nombre2-edit', 'apellido1-edit', 'apellido2-edit', 'tipo-doc-edit', 'num-doc-edit', 'fecha-nac-edit', 'telefono-edit', 'sexo-edit', 'municipio-edit'];
        const persona = btn.parentNode.parentNode.dataset.persona;

        let obj_person = {};

        persona.slice(1, persona.length-1).split(",").forEach(str => cleanString(str, obj_person));

        console.log(obj_person);

        initModal(inputs, obj_person, modal_container);
    });
});

btn_edit_cancel.addEventListener('click', e => desactiveModal(e, modal_container)); 

btns_delete.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const inputs = ['nombre1-delete', 'nombre2-delete', 'apellido1-delete', 'apellido2-delete', 'tipo-doc-delete', 'num-doc-delete', 'fecha-nac-delete', 'telefono-delete', 'sexo-delete', 'municipio-delete'];
        const persona = btn.parentNode.parentNode.dataset.persona;

        var obj_person = {};

        persona.slice(1, persona.length-1).split(",").forEach(str => cleanString(str, obj_person));

        // console.log(obj_person);
        initModal(inputs, obj_person, modal_container_delete);
    });
});

btn_delete_cancel.addEventListener('click', e => desactiveModal(e, modal_container_delete));

delete_submit.addEventListener('click', (e) => {
    const input_num_doc = document.querySelector('#num-doc-delete');
    const message = document.querySelector('#message');
    const messages = ['Registro Eliminado con exito', 'No se pudo eliminar el registro'];

    e.preventDefault();

    requestData('/habitantes/eliminar', {'num-doc-delete': input_num_doc.value}).
    then(data => showMessage(data.response, message, messages));

    input_num_doc.disabled = false;
    
    modal_container_delete.classList.remove('show');

    setTimeout(() => reloadPage(), 2000);

});

input_submit.addEventListener('click', (e) => {
    const input_nom1 = document.querySelector('#nombre1');
    const input_nom2 = document.querySelector('#nombre2');
    const input_ape1 = document.querySelector('#apellido1');
    const input_ape2 = document.querySelector('#apellido2');
    const input_tipo_doc = document.querySelector('#tipo-doc');
    const input_num_doc = document.querySelector('#num-doc');
    const input_fecha_nac = document.querySelector('#fecha-nac');
    const input_telefono = document.querySelector('#telefono');
    const input_sexo = document.querySelector('#sexo');
    const input_municipio = document.querySelector('#municipio');
    const input_cabeza_familia = document.querySelector('#cabeza-familia');
    const input_num_doc_cabeza = document.querySelector('#num-doc-cabeza');
    const message = document.querySelector('#message');
    const messages = ['Registro insertado con exito', 'No se pudo insertar el registro'];

    e.preventDefault()

    requestData('/habitantes/insertar', {'num-doc': input_num_doc.value, 'nombre1': capitalizeFirstLetter(input_nom1.value), 'nombre2': capitalizeFirstLetter(input_nom2.value), 'apellido1': capitalizeFirstLetter(input_ape1.value), 'apellido2': capitalizeFirstLetter(input_ape2.value), 'tipo-doc': input_tipo_doc.value, 'fecha-nac': input_fecha_nac.value, 'telefono': input_telefono.value, 'sexo': input_sexo.value, 'municipio': input_municipio.value, 'cabeza-familia': input_cabeza_familia.value, 'num-doc-cabeza': input_num_doc_cabeza.value}).
    then(data => showMessage(data.response, message, messages));
    setTimeout(() => reloadPage(), 2000);
});

input_submit_edit.addEventListener('click', (e) => {
    const input_nom1 = document.querySelector('#nombre1-edit');
    const input_nom2 = document.querySelector('#nombre2-edit');
    const input_ape1 = document.querySelector('#apellido1-edit');
    const input_ape2 = document.querySelector('#apellido2-edit');
    const input_tipo_doc = document.querySelector('#tipo-doc-edit');
    const input_num_doc = document.querySelector('#num-doc-edit');
    const input_fecha_nac = document.querySelector('#fecha-nac-edit');
    const input_telefono = document.querySelector('#telefono-edit');
    const input_sexo = document.querySelector('#sexo-edit')
    const message = document.querySelector('#message');
    const messages = ['Registro actualizado con exito', 'No se pudo actualizar el registro'];

    e.preventDefault();
    requestData('/habitantes/actualizar', {'num-doc-edit': input_num_doc.value, 'nombre1-edit': capitalizeFirstLetter(input_nom1.value), 'nombre2-edit': capitalizeFirstLetter(input_nom2.value), 'apellido1-edit': capitalizeFirstLetter(input_ape1.value), 'apellido2-edit': capitalizeFirstLetter(input_ape2.value), 'tipo-doc-edit': input_tipo_doc.value, 'fecha-nac-edit': input_fecha_nac.value, 'telefono-edit': input_telefono.value, 'sexo-edit': input_sexo.value}).
    then(data => showMessage(data.response, message, messages));
    modal_container.classList.remove('show');

    setTimeout(reloadPage(), 2000);
});

input_search.addEventListener('keyup', search)

input_cabeza_familia.addEventListener('change', (e) => {
    const input_num_doc_cabeza = document.getElementById('div-num-doc-cabeza');
    
    if (e.target.value === '1') { 
        input_num_doc_cabeza.classList.add('div-num-doc-cabeza-show');
        
    } else {
        input_num_doc_cabeza.classList.remove('div-num-doc-cabeza-show');
    }
});