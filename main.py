from flask import Flask, jsonify, render_template, request, redirect, url_for
from test import select_persona, insertar, actualizar_persona, delete_persona, select_municipio, select_dependiente, insertar_habita_municipio, insertar_dependiente, select_habita_municipio, delete_habita_municipio, actualizar_vivienda_db, registrar_vivienda_db, seleccionar_viviendas, select_uno_habita_municipio, delete_cabeza, delete_dependiente, select_cabeza, select_solo_dependiente
from datetime import datetime, date
from dateutil import relativedelta

def prepararDatosPersona(response, entity):
    dataArr = []
    for i in range(len(response.data)):
        rawData = response.data[i]
        tipo_doc = None
        sexo = None
        edad =  relativedelta.relativedelta(datetime.now(), datetime.strptime(rawData[entity]["fecha_nacimiento"], '%Y-%m-%d'))

        # print(edad.years)

        if rawData[entity]["tipo_documento"] == 1:
            tipo_doc = "Cédula"
        elif rawData[entity]["tipo_documento"] == 2:
            tipo_doc = "Tarjeta de identidad"
        elif rawData[entity]["tipo_documento"] == 3:
            tipo_doc = "Cédula de extranjería"
        elif rawData[entity]["tipo_documento"] == 4:
            tipo_doc = "Pasaporte"

        if rawData[entity]["sexo"]:
            sexo = "Masculino"
        else:
            sexo ="Femenino"

        data = {
            "nombres": f"{rawData[entity]['primer_nombre'].capitalize()} {rawData[entity]['segundo_nombre'].capitalize()}",
            "apellidos": f"{rawData[entity]['primer_apellido'].capitalize()} {rawData[entity]['segundo_apellido'].capitalize()}",
            "tipo_documento": tipo_doc,
            "telefono": rawData[entity]["telefono"],
            "sexo": sexo,
            "num_doc": rawData[entity]["num_documento"],
            "edad": edad.years,
            "fecha_nac": rawData[entity]["fecha_nacimiento"]
        }

        dataArr.append(data)

    return dataArr

def prepararDatosMunicipios(obj, entity):
    dataArr = []
    for i in range(len(obj.data)):
        rawData = obj.data[i] 
        
        municipio ={
            "id_municipio": rawData[entity]["id_municipio"],
            "municipio": rawData[entity]["nombre_municipio"]
        }

        dataArr.append(municipio)
    
    return dataArr

app = Flask(__name__, template_folder="templates")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/habitantes")
def habitantes():
    arrCabezasFamilia = []
    familias = select_dependiente().data
    for j in range(len(familias)):
        if len(arrCabezasFamilia) != 0:
            for k in range(len(arrCabezasFamilia)):
                if familias[j]["cabeza_familia"]["num_documento"] == arrCabezasFamilia[k]["num_documento"]:
                    arrCabezasFamilia[k]["dependientes"].append(familias[j]["dependiente"])
                    break
                elif k == len(arrCabezasFamilia) - 1:
                    arrCabezasFamilia.append(familias[j]["cabeza_familia"])
                    arrCabezasFamilia[-1]["dependientes"] = [familias[j]["dependiente"]]
        else:
            arrCabezasFamilia.append(familias[j]["cabeza_familia"])
            arrCabezasFamilia[-1]["dependientes"] = [familias[j]["dependiente"]]

    for m in arrCabezasFamilia:
        m |= select_uno_habita_municipio(m["num_documento"]).data[0]["Municipio"]
        edad =  relativedelta.relativedelta(datetime.now(), datetime.strptime(m["fecha_nacimiento"], '%Y-%m-%d'))
        m |= {'edad': edad.years}
        m |= {'cant_dependientes': len(m["dependientes"])}
        for n in m["dependientes"]:
            n |= select_uno_habita_municipio(n["num_documento"]).data[0]["Municipio"]
            edad =  relativedelta.relativedelta(datetime.now(), datetime.strptime(n["fecha_nacimiento"], '%Y-%m-%d'))
            n |= {'edad': edad.years}
            
    print('---------- Depende ----------')
    # print(select_dependiente().data)
    print(arrCabezasFamilia)
    print('---------- Depende ----------')
    # print(select_persona())
    personas = prepararDatosPersona(select_habita_municipio(), "Persona")
    mun = prepararDatosMunicipios(select_habita_municipio(), "Municipio")

    for i in range(len(personas)):
        personas[i] |= mun[i]

    # print(personas)
    # print(prepararDatos(select_dependiente()))
    return render_template('habitantes.html', response=personas, municipios=select_municipio().data, familias=arrCabezasFamilia)

@app.route("/habitantes/insertar", methods=['POST', "GET"])
def insertar_habitante():
    if request.method == "POST":
        nombre1 = request.json["nombre1"]
        nombre2 = request.json["nombre2"]
        apellido1 = request.json["apellido1"]
        apellido2 = request.json["apellido2"]
        tipo_doc = request.json["tipo-doc"]
        num_doc = request.json["num-doc"]
        fecha_nac = request.json["fecha-nac"]
        telefono = request.json["telefono"]
        sexo = request.json["sexo"]
        municipio = request.json["municipio"]
        cabeza_familia = request.json["cabeza-familia"]
        
        try:
            insertar(num_doc, tipo_doc, nombre1, nombre2, apellido1, apellido2, telefono, fecha_nac, sexo)
            insertar_habita_municipio(num_doc, municipio)
            if int(cabeza_familia):
                num_doc_cabeza = request.json["num-doc-cabeza"]
                insertar_dependiente(num_doc, num_doc_cabeza)
            return {"response": True}
        except:
            return {"response": False}
        
@app.route("/depende_de/actualizar", methods=['POST', "GET"])
def depende_de_actualizar():
    if request.method == "POST":
        cabeza = request.json["cabeza"]
        dependiente = request.json["dependiente"]

        print(cabeza)
        print(dependiente)
        
        try:
            insertar_dependiente(dependiente, cabeza)
            return {"response": True}
        except:
            return {"response": False}
        
@app.route("/depende_de/eliminar_cabeza", methods=['POST', "GET"])
def depende_de_eliminar_cabeza():
    if request.method == "POST":
        cabeza = request.json["num-doc-delete"]
        
        try:
            delete_cabeza(cabeza)
            return {"response": True}
        except:
            return {"response": False}

@app.route("/depende_de/eliminar_solo_dependiente", methods=['POST', "GET"])
def depende_de_eliminar_solo_dependiente():
    if request.method == "POST":
        doc = request.json["num-doc-delete"]
        
        try:
            delete_dependiente(doc)
            return {"response": True}
        except:
            return {"response": False}

@app.route("/habitantes/actualizar", methods=['POST', "GET"])
def actualizar_habitante():
    if request.method == "POST":
        nombre1 = request.json["nombre1-edit"]
        nombre2 = request.json["nombre2-edit"]
        apellido1 = request.json["apellido1-edit"]
        apellido2 = request.json["apellido2-edit"]
        tipo_doc = request.json["tipo-doc-edit"]
        num_doc = request.json["num-doc-edit"]
        fecha_nac = request.json["fecha-nac-edit"]
        telefono = request.json["telefono-edit"]
        sexo = request.json["sexo-edit"]
  
        try:
            actualizar_persona(num_doc, tipo_doc, nombre1, nombre2, apellido1, apellido2, telefono, fecha_nac, sexo)
            return {"response": True}
        except:
            return {"response": False}
        
    
@app.post("/habitantes/eliminar")
def eliminar_habitante():
    if request.method == "POST":
        num_doc = request.json['num-doc-delete']
        try:
            if len(select_solo_dependiente(num_doc).data) != 0:
                delete_dependiente(num_doc)
            elif len(select_cabeza(num_doc).data) != 0:
                delete_cabeza(num_doc)
            
            delete_habita_municipio(num_doc)
            delete_persona(num_doc)
            return {"response": True}
        except:
            return {"response": False}

@app.route("/viviendas")
def viviendas():
    # Obtener las viviendas desde la base de datos
    viviendas = seleccionar_viviendas()
    return render_template('viviendas.html', viviendas=viviendas)

@app.route("/actualizar_vivienda", methods=['POST'])
def actualizar_vivienda():
    if request.method == "POST":
        vivienda_id = request.form["vivienda_id"]
        direccion = request.form["direccion"]
        capacidad = request.form["capacidad"]
        pisos = request.form["pisos"]

        try:
            # Lógica para actualizar la vivienda en la base de datos
            actualizar_vivienda_db(vivienda_id, direccion, capacidad, pisos)
            return {"response": True}
        except:
            return {"response": False}

@app.route("/registrar_vivienda", methods=['POST'])
def registrar_vivienda():
    if request.method == "POST":
        direccion = request.form["direccion"]
        capacidad = request.form["capacidad"]
        pisos = request.form["pisos"]
        fecha_creacion = datetime.now().date()  # Obtiene la fecha actual del servidor

        try:
            # Lógica para insertar la nueva vivienda en la base de datos
            registrar_vivienda_db(direccion, capacidad, pisos)
            return jsonify({"success": True})
        except Exception as e:
            return jsonify({"error": str(e)})

@app.route('/obtener_viviendas', methods=['GET'])
def obtener_viviendas():
    try:
        # Lógica para obtener las viviendas de la base de datos
        viviendas = seleccionar_viviendas()

        # Extraer los datos relevantes del objeto APIResponse
        datos_viviendas = viviendas.data

        # Retornar los datos serializados a JSON
        return jsonify(datos_viviendas)
    except Exception as e:
        # Manejar cualquier excepción y retornar un mensaje de error
        return jsonify({"error": str(e)})


@app.route("/municipios")
def municipios():
    return render_template('municipios.html')
