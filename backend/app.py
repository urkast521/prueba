from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS
from services.servicios_del_usuario import (
    insertar_usuario, 
    consultar_usuarios,
    modificar_usuario, 
    desactivar_usuario, 
    login_usuario)
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 2))
)
jwt = JWTManager(app)


#Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

#Inicialización de la base de datos
db = SQLAlchemy(app)

# Ruta de prueba
# @app.route('/')
# def index():
#     return "¡Backend funcionando con Flask y MySQL!"

#Rutas para los servicios del usuario
#Ruta de login no autenticada
@app.route('/login', methods=['POST'])
def login_app():
    datos = request.json
    return login_usuario(db, datos)

#Ruta para insertar un nuevo usuario no autenticada por que es el registro
@app.route('/insert_usuario', methods=['POST'])
def insert_usuario_app():
    datos = request.json
    return insertar_usuario(db,datos)

#Ruta para consultar usuarios
@app.route('/usuarios', methods=['GET'])
@jwt_required()
def consultar_usuarios_app():
    id_usuario = request.args.get('id', type=int)
    nombre = request.args.get('nombre')

    #definir parámetros de consulta
    params = {}
    if id_usuario is not None:
        params['id'] = id_usuario
    elif nombre:
        params['nombre'] = nombre
    else:
        params = None

    return consultar_usuarios(db, params)

#Ruta para actualizar un usuario
@app.route('/usuarios/modificar', methods=['PUT'])
@jwt_required()
def actualizar_usuario_app():
    id_usuario= int(get_jwt_identity())
    datos = request.json 
    return modificar_usuario(db, id_usuario, datos)

#Ruta para desactivar un usuario
@app.route('/usuarios/desactivar', methods=['PUT'])
@jwt_required()
def desactivar():
    id_usuario= int(get_jwt_identity())
    return desactivar_usuario(db, id_usuario)

if __name__ == '__main__':
    app.run(debug=True)