from flask import Flask, render_template, request, redirect, url_for
from test import select_persona, insertar, actualizar_persona, delete_persona, select_municipio, select_dependiente, insertar_habita_municipio, insertar_dependiente, select_habita_municipio, delete_habita_municipio
from datetime import datetime, date
from dateutil import relativedelta

def prepararDatos(response):
    dataArr = []
    for i in range(len(response.data)):
        rawData = response.data[i]
        tipo_doc = None
        sexo = None
        edad =  relativedelta.relativedelta(datetime.now(), datetime.strptime(rawData["Persona"]["fecha_nacimiento"], '%Y-%m-%d'))

        # print(edad.years)

        if rawData["Persona"]["tipo_documento"] == 1:
            tipo_doc = "Cédula"
        elif rawData["Persona"]["tipo_documento"] == 2:
            tipo_doc = "Tarjeta de identidad"
        elif rawData["Persona"]["tipo_documento"] == 3:
            tipo_doc = "Cédula de extranjería"
        elif rawData["Persona"]["tipo_documento"] == 4:
            tipo_doc = "Pasaporte"

        if rawData["Persona"]["sexo"]:
            sexo = "Masculino"
        else:
            sexo ="Femenino"

        data = {
            "nombres": f"{rawData['Persona']['primer_nombre'].capitalize()} {rawData['Persona']['segundo_nombre'].capitalize()}",
            "apellidos": f"{rawData['Persona']['primer_apellido'].capitalize()} {rawData['Persona']['segundo_apellido'].capitalize()}",
            "tipo_documento": tipo_doc,
            "telefono": rawData["Persona"]["telefono"],
            "sexo": sexo,
            "num_doc": rawData["Persona"]["num_documento"],
            "edad": edad.years,
            "fecha_nac": rawData["Persona"]["fecha_nacimiento"],
            "id_municipio": rawData["Municipio"]["id_municipio"],
            "municipio": rawData["Municipio"]["nombre_municipio"]
        }

        dataArr.append(data)

    return dataArr

app = Flask(__name__, template_folder="templates")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/habitantes")
def habitantes():
    # print('---------- Depende ----------')
    # print(select_dependiente())
    # print('---------- Depende ----------')
    # print(select_persona())
    print(select_habita_municipio())
    return render_template('habitantes.html', response=prepararDatos(response=select_habita_municipio()), municipios=select_municipio().data)

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
            delete_habita_municipio(num_doc)
            delete_persona(num_doc)
            return {"response": True}
        except:
            return {"response": False}

@app.route("/viviendas")
def viviendas():
    return render_template('viviendas.html')

@app.route("/municipios")
def municipios():
    return render_template('municipios.html')
