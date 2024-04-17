from supabase import create_client, Client
from datetime import date

#inicialización
url: str = "https://uesgiyebiofvboxlzrpk.supabase.co"
key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlc2dpeWViaW9mdmJveGx6cnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2MjUzNzAsImV4cCI6MjAyODIwMTM3MH0.pwdmCjWA-IW2h3YvrtwxF_DC2e_OMB44kR12iBTOLX8"
supabase: Client = create_client(url, key)

#queries
# ---------- Habitante ----------
def insertar(num_documento: str, tipo_documento: int, primer_nombre: str, segundo_nombre: str, primer_apellido: str, segundo_apellido: str, telefono:int, fecha_nacimiento:date, sexo: bool):
    response = supabase.table('Persona').insert({
        "num_documento": num_documento, 
        "tipo_documento": tipo_documento, 
        "primer_nombre": primer_nombre,
        "segundo_nombre": segundo_nombre,
        "primer_apellido": primer_apellido,
        "segundo_apellido": segundo_apellido,
        "telefono": telefono,
        "fecha_nacimiento": str(fecha_nacimiento),
        "sexo": sexo
    }).execute()
    return response

def actualizar_persona(num_documento: str, tipo_documento: int, primer_nombre: str, segundo_nombre: str, 
        primer_apellido: str, segundo_apellido: str, telefono:int, fecha_nacimiento:date, sexo: bool):
    response, count = supabase.table('Persona').update({
        "num_documento": num_documento, 
        "tipo_documento": tipo_documento, 
        "primer_nombre": primer_nombre,
        "segundo_nombre": segundo_nombre,
        "primer_apellido": primer_apellido,
        "segundo_apellido": segundo_apellido,
        "telefono": telefono,
        "fecha_nacimiento": str(fecha_nacimiento),
        "sexo": sexo
    }).eq('num_documento', num_documento).execute()
    return response

def delete_persona(num_documento: str):
    response, count = supabase.table('Persona').delete().eq('num_documento', num_documento).execute()
    return response  

def select_persona():
    response = supabase.table('Persona').select("*").order('primer_nombre', desc=False).execute()
    
    return response

# ---------- Depende_de ----------  
def insertar_dependiente(num_doc_dependiente:str, num_doc_cabeza:str):
    response = supabase.table('Depende_de').insert({
        'dependiente': num_doc_dependiente,
        'cabeza_familia': num_doc_cabeza
    }).execute()

    return response

def select_dependiente():
    response = supabase.table('Depende_de').select('cabeza_familia(*), dependiente(*)').execute()
    return response

def select_cabeza(num_doc:str):
    response = supabase.table('Depende_de').select('*').eq('cabeza_familia', num_doc).execute()
    return response

def select_solo_dependiente(num_doc:str):
    response = supabase.table('Depende_de').select('*').eq('dependiente', num_doc).execute()
    return response

def delete_dependiente(num_documento: str):
    response, count = supabase.table('Depende_de').delete().eq('dependiente', num_documento).execute()
    return response

def delete_cabeza(num_documento: str):
    response, count = supabase.table('Depende_de').delete().eq('cabeza_familia', num_documento).execute()
    return response

# ---------- Municipio ----------
def select_municipio():
    response = supabase.table('Municipio').select("*").order('nombre_municipio', desc=False).execute()
    return response

# ---------- Habita en muicipio ---------
def insertar_habita_municipio(num_doc:str, id_municipio:int):
    response = supabase.table('Habita_en_Municipio').insert({
        'num_documento': num_doc,
        'id_municipio': id_municipio
    }).execute()
    return response

def select_habita_municipio():
    response = supabase.table('Habita_en_Municipio').select('Persona(*), Municipio(*)').execute()
    return response

def select_uno_habita_municipio(num_doc:str):
    response = supabase.table('Habita_en_Municipio').select('Municipio(nombre_municipio)').eq('num_documento', num_doc).execute()
    return response  

def delete_habita_municipio(num_documento: str):
    response, count = supabase.table('Habita_en_Municipio').delete().eq('num_documento', num_documento).execute()
    return response 


#como un pop devuelve los datos de lo que borro
# response = supabase.table('Persona').delete().eq('num_documento', 100000).execute();
# response = insertar("100000", 1, "brayan", "camilo", "rodriguez", "diaz", 100000, date(2000,12,20), True)
# print (response)
# response = supabase.table('Persona').update({"tipo_documento": 2}).eq('num_documento', 100000).execute()
# print(response)

# delete_dependiente('1001218979')