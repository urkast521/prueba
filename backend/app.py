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
from flask import Flask, jsonify, request, send_from_directory 


#Cargar variables de entorno
load_dotenv()

#Configurar el inicio
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 2))
)
#Ruta estatica
UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads', 'profilepics')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
print(f"La carpeta estática está mapeada a: {UPLOAD_FOLDER}")
app.static_folder = UPLOAD_FOLDER
app.static_url_path = '/uploads'


#Extensiones de foto
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'} 
jwt = JWTManager(app)

#Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS

#Inicialización de la base de datos
db = SQLAlchemy(app)

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
    #Recuperar datos
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

    #Construir los datos
    datos={
        'nombre': request.form.get('nombre'),
        'correo': request.form.get('correo'),
        'passw': request.form.get('passw'),
    }
    #revisar si hay foto y en caso de haber agregarla al archivo de datos
    foto_file = request.files.get('foto')
    ruta = None
    if foto_file and foto_file.filename:
        if not allowed_file(foto_file.filename):
            return jsonify({
                "success": False, 
                "error": "Tipo de archivo no permitido. Solo se aceptan PNG, JPG, JPEG o GIF."
            }), 400
        
        ext = foto_file.filename.rsplit('.', 1)[1].lower()
        nombre_unico = f"profile_{id_usuario}.{ext}"
        ruta = os.path.join(app.config['UPLOAD_FOLDER'], nombre_unico)
        foto_file.save(ruta)

        datos['foto'] = nombre_unico
    #Limpiar datos
    datos_limpios = {k: v for k, v in datos.items() if v is not None}

    return modificar_usuario(db, id_usuario, datos_limpios)

#Ruta para desactivar un usuario
@app.route('/usuarios/desactivar', methods=['PUT'])
@jwt_required()
def desactivar():
    id_usuario= int(get_jwt_identity())
    return desactivar_usuario(db, id_usuario)

#Funcion para validar tipo de archivo valido de la foto
def allowed_file(filename):
    #Asegura que el archivo tenga un nombre y un punto
    if '.' not in filename:
        return False
    
    #obtiene la parte de la extensión (después del último punto) y la convierte a minúsculas
    extension = filename.rsplit('.', 1)[1].lower()
    
    #Verifica si la extensión está en la lista de permitidas
    return extension in ALLOWED_EXTENSIONS

# Nueva ruta dedicada para servir las imágenes de perfil
@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    # Usa send_from_directory para servir el archivo desde la carpeta UPLOAD_FOLDER
    # Flask manejará automáticamente la ruta y los errores 404 si el archivo no existe.
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)