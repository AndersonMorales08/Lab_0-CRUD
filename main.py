from flask import Flask, render_template

app = Flask(__name__, template_folder="templates")

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/habitantes")
def habitantes():
    return render_template('habitantes.html')

@app.route("/viviendas")
def viviendas():
    return render_template('viviendas.html')

@app.route("/habitantes")
def municipios():
    return render_template('municipios.html')