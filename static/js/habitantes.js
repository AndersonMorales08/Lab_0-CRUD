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

btns_edit.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const input_nom1 = document.querySelector('#nombre1-edit');
        const input_nom2 = document.querySelector('#nombre2-edit');
        const input_ape1 = document.querySelector('#apellido1-edit');
        const input_ape2 = document.querySelector('#apellido2-edit');
        const input_tipo_doc = document.querySelector('#tipo-doc-edit');
        const input_num_doc = document.querySelector('#num-doc-edit');
        const input_fecha_nac = document.querySelector('#fecha-nac-edit');
        const input_telefono = document.querySelector('#telefono-edit');
        const input_sexo = document.querySelector('#sexo-edit')

        const persona = btn.parentNode.parentNode.dataset.persona;

        input_nom1.value = persona.nombres;

        var obj_person = {};

        let var1 = persona.slice(1, persona.length-1).split(",").forEach(param => {
            let str_var = param.split(":");
            let key = str_var[0].trim();
            let value = str_var[1].trim()
            obj_person[str_var[0].trim().replaceAll("'", "")] = str_var[1].trim().replaceAll("'", "");
        })

        // console.log('"'+persona+'"');
        // console.log(obj_person);
        console.log(obj_person);
        input_nom1.value = obj_person["nombres"].split(" ")[0];
        input_nom2.value = obj_person["nombres"].split(" ")[1];
        input_ape1.value = obj_person["apellidos"].split(" ")[0];
        input_ape2.value = obj_person["apellidos"].split(" ")[1];

        if (obj_person["tipo_documento"] === 'Cédula') {
            input_tipo_doc.value = 1;
        } else if (obj_person["tipo_documento"] === 'Tarjeta de identidad') {
            input_tipo_doc.value = 2;
        } else if (obj_person["tipo_documento"] === 'Cédula de extranjería') {
            input_tipo_doc.value = 3;
        } else {
            input_tipo_doc.value = 4;
        }

        input_num_doc.value = obj_person["num_doc"];
        input_fecha_nac.value = obj_person["fecha_nac"];

        if (obj_person["sexo"] === 'Masculino') {
            input_sexo.value = 1;
        } else {
            input_sexo.value = 0;
        }

        input_telefono.value = obj_person["telefono"]; 
        
        modal_container.classList.add('show');

    });
});

btn_edit_cancel.addEventListener('click', (e) => {
    e.preventDefault();
    modal_container.classList.remove('show');
}); 

btns_delete.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const input_nom1 = document.querySelector('#nombre1-delete');
        const input_nom2 = document.querySelector('#nombre2-delete');
        const input_ape1 = document.querySelector('#apellido1-delete');
        const input_ape2 = document.querySelector('#apellido2-delete');
        const input_tipo_doc = document.querySelector('#tipo-doc-delete');
        const input_num_doc = document.querySelector('#num-doc-delete');
        const input_fecha_nac = document.querySelector('#fecha-nac-delete');
        const input_telefono = document.querySelector('#telefono-delete');
        const input_sexo = document.querySelector('#sexo-delete')

        const persona = btn.parentNode.parentNode.dataset.persona;

        input_nom1.value = persona.nombres;

        var obj_person = {};

        let var1 = persona.slice(1, persona.length-1).split(",").forEach(param => {
            let str_var = param.split(":");
            let key = str_var[0].trim();
            let value = str_var[1].trim()
            obj_person[str_var[0].trim().replaceAll("'", "")] = str_var[1].trim().replaceAll("'", "");
        })

        // console.log('"'+persona+'"');
        // console.log(obj_person);
        input_nom1.value = obj_person["nombres"].split(" ")[0];
        input_nom2.value = obj_person["nombres"].split(" ")[1];
        input_ape1.value = obj_person["apellidos"].split(" ")[0];
        input_ape2.value = obj_person["apellidos"].split(" ")[1];

        if (obj_person["tipo_documento"] === 'Cédula') {
            input_tipo_doc.value = 1;
        } else if (obj_person["tipo_documento"] === 'Tarjeta de identidad') {
            input_tipo_doc.value = 2;
        } else if (obj_person["tipo_documento"] === 'Cédula de extranjería') {
            input_tipo_doc.value = 3;
        } else {
            input_tipo_doc.value = 4;
        }

        input_num_doc.value = obj_person["num_doc"];
        input_fecha_nac.value = obj_person["fecha_nac"];

        if (obj_person["sexo"] === 'Masculino') {
            input_sexo.value = 1;
        } else {
            input_sexo.value = 0;
        }

        input_telefono.value = obj_person["telefono"]; 
        
        modal_container_delete.classList.add('show');

    });
});

btn_delete_cancel.addEventListener('click', (e) => {
    e.preventDefault();
    modal_container_delete.classList.remove('show');
});

delete_submit.addEventListener('click', (e) => {
    const input_num_doc = document.querySelector('#num-doc-delete');
    const message = document.querySelector('#message');
    let form = new FormData();

    e.preventDefault()

    form.append('num-doc-delete', input_num_doc.value);

    requestData('/habitantes/eliminar', {'num-doc-delete': input_num_doc.value}).
    then(data => {
        console.log(data.response)
        if (data.response) {
            message.textContent = "Registro Eliminado con exito"
            message.classList.add('good-message');
        } else {
            message.textContent = "No se pudo eliminar el registro"
            message.classList.add('bad-message');
        }
    });

    input_num_doc.disabled = false;
    
    modal_container_delete.classList.remove('show');

    setTimeout(() => {
        location.reload()
    }, 2000);

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
    const input_sexo = document.querySelector('#sexo')
    const message = document.querySelector('#message');

    e.preventDefault()

    requestData('/habitantes/insertar', {'num-doc': input_num_doc.value, 'nombre1': input_nom1.value, 'nombre2': input_nom2.value, 'apellido1': input_ape1.value, 'apellido2': input_ape2.value, 'tipo-doc': input_tipo_doc.value, 'fecha-nac': input_fecha_nac.value, 'telefono': input_telefono.value, 'sexo': input_sexo.value}).
    then(data => {
        console.log(data.response)
        if (data.response) {
            message.textContent = "Registro insertado con exito"
            message.classList.add('good-message');
        } else {
            message.textContent = "No se pudo insertar el registro"
            message.classList.add('bad-message');
        }
    });

    setTimeout(() => {
        location.reload()
    }, 2000);

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

    e.preventDefault()

    requestData('/habitantes/actualizar', {'num-doc-edit': input_num_doc.value, 'nombre1-edit': input_nom1.value, 'nombre2-edit': input_nom2.value, 'apellido1-edit': input_ape1.value, 'apellido2-edit': input_ape2.value, 'tipo-doc-edit': input_tipo_doc.value, 'fecha-nac-edit': input_fecha_nac.value, 'telefono-edit': input_telefono.value, 'sexo-edit': input_sexo.value}).
    then(data => {
        console.log(data.response)
        if (data.response) {
            message.textContent = "Registro actualizado con exito"
            message.classList.add('good-message');
        } else {
            message.textContent = "No se pudo actualizar el registro"
            message.classList.add('bad-message');
        }
    });

    modal_container.classList.remove('show');

    setTimeout(() => {
        location.reload()
    }, 2000);

});

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

input_search.addEventListener('keyup', search)

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