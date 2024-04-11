const btns_edit = document.querySelectorAll('.btn-edit-habitante'); 
const btn_edit_cancel = document.querySelector('#btn-edit-cancel');
const modal_container = document.querySelector('#modal-container');

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
    modal_container.classList.remove('show');
}); 