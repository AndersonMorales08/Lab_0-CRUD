from flask import Flask, render_template, request, redirect, url_for
from test import response, insertar, actualizar_persona
from datetime import datetime
from dateutil import relativedelta

def prepararDatos(response):
    dataArr = []
    for i in range(len(response.data)):
        rawData = response.data[i]
        tipo_doc = None
        sexo = None
        edad =  relativedelta.relativedelta(datetime.now(), datetime.strptime(rawData["fecha_nacimiento"], '%Y-%m-%d'))

        # print(edad.years)

        if rawData["tipo_documento"] == 1:
            tipo_doc = "Cédula"
        elif rawData["tipo_documento"] == 2:
            tipo_doc = "Tarjeta de identidad"
        elif rawData["tipo_documento"] == 3:
            tipo_doc = "Cédula de extranjería"
        elif rawData["tipo_documento"] == 4:
            tipo_doc = "Pasaporte"

        if rawData["sexo"]:
            sexo = "Masculino"
        else:
            sexo ="Femenino"

        data = {
            "nombres": f"{rawData['primer_nombre'].capitalize()} {rawData['segundo_nombre'].capitalize()}",
            "apellidos": f"{rawData['primer_apellido'].capitalize()} {rawData['segundo_apellido'].capitalize()}",
            "tipo_documento": tipo_doc,
            "telefono": rawData["telefono"],
            "sexo": sexo,
            "num_doc": rawData["num_documento"],
            "edad": edad.years,
            "fecha_nac": rawData["fecha_nacimiento"]
        }

        dataArr.append(data)

    return dataArr

app = Flask(__name__, template_folder="templates")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/habitantes", methods=['POST', "GET"])
def habitantes():
    if request.method == "POST":
        nombre1 = request.form["nombre1"]
        nombre2 = request.form["nombre2"]
        apellido1 = request.form["apellido1"]
        apellido2 = request.form["apellido2"]
        tipo_doc = request.form["tipo-doc"]
        num_doc = request.form["num-doc"]
        fecha_nac = request.form["fecha-nac"]
        telefono = request.form["telefono"]
        sexo = request.form["sexo"]

        print(nombre1, nombre2, apellido1, apellido2, tipo_doc, num_doc, fecha_nac, telefono, sexo)  
        print(insertar(num_doc, tipo_doc, nombre1, nombre2, apellido1, apellido2, telefono, fecha_nac, sexo))
    print(response)
    return render_template('habitantes.html', response=prepararDatos(response=response))

@app.route("/habitantes/actualizar", methods=['POST', "GET"])
def actualizar_habitante():
    if request.method == "POST":
        nombre1 = request.form["nombre1-edit"]
        nombre2 = request.form["nombre2-edit"]
        apellido1 = request.form["apellido1-edit"]
        apellido2 = request.form["apellido2-edit"]
        tipo_doc = request.form["tipo-doc-edit"]
        num_doc = request.form["num-doc-edit"]
        fecha_nac = request.form["fecha-nac-edit"]
        telefono = request.form["telefono-edit"]
        sexo = request.form["sexo-edit"]

        print(nombre1, nombre2, apellido1, apellido2, tipo_doc, num_doc, fecha_nac, telefono, sexo)  
        actualizar_persona(num_doc, tipo_doc, nombre1, nombre2, apellido1, apellido2, telefono, fecha_nac, sexo)
        return redirect(url_for('habitantes'))

@app.route("/viviendas")
def viviendas():
    return render_template('viviendas.html')

@app.route("/habitantes")
def municipios():
    return render_template('municipios.html')