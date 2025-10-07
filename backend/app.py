import os
from datetime import timedelta

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager


from endpoints import auth, users, media
from config import SQLALCHEMY_DATABASE_URI, SQLALCHEMY_TRACK_MODIFICATIONS


# Cargar variables de entorno
load_dotenv()

# Configurar el inicio
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
    hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 2))
)
# Ruta estatica
UPLOAD_FOLDER = os.path.join(app.root_path, "uploads", "profilepics")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
print(f"La carpeta estática está mapeada a: {UPLOAD_FOLDER}")
app.static_folder = UPLOAD_FOLDER
app.static_url_path = "/uploads"


# Extensiones de foto
jwt = JWTManager(app)

# Configuración de la base de datos
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = SQLALCHEMY_TRACK_MODIFICATIONS

# Inicialización de la base de datos
db = SQLAlchemy(app)


auth.init_router(app, db)
users.init_router(app, db)
media.init_router(app)


if __name__ == "__main__":
    app.run(debug=True)
