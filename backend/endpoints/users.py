import os

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import jwt_required, get_jwt_identity

from utils.media_utils import allowed_file
from services.users import (
    insertar_usuario,
    modificar_usuario,
    desactivar_usuario,
    consultar_usuarios,
)


def init_router(app: Flask, db: SQLAlchemy):
    # Ruta para insertar un nuevo usuario no autenticada por que es el registro
    @app.route("/insert_usuario", methods=["POST"])
    def insert_usuario_app():
        datos = request.json
        return insertar_usuario(db, datos)

    # Ruta para consultar usuarios
    @app.route("/usuarios", methods=["GET"])
    @jwt_required()
    def consultar_usuarios_app():
        # Recuperar datos
        id_usuario = request.args.get("id", type=int)
        nombre = request.args.get("nombre")

        # definir parámetros de consulta
        params = {}
        if id_usuario is not None:
            params["id"] = id_usuario
        elif nombre:
            params["nombre"] = nombre
        else:
            params = None

        return consultar_usuarios(db, params)

    # Ruta para actualizar un usuario
    @app.route("/usuarios/modificar", methods=["PUT"])
    @jwt_required()
    def actualizar_usuario_app():
        id_usuario = int(get_jwt_identity())

        # Construir los datos
        datos = {
            "nombre": request.form.get("nombre"),
            "correo": request.form.get("correo"),
            "passw": request.form.get("passw"),
        }
        # revisar si hay foto y en caso de haber agregarla al archivo de datos
        foto_file = request.files.get("foto")
        ruta = None
        if foto_file and foto_file.filename:
            if not allowed_file(foto_file.filename):
                return (
                    jsonify(
                        {
                            "success": False,
                            "error": "Tipo de archivo no permitido. Solo se aceptan PNG, JPG, JPEG o GIF.",
                        }
                    ),
                    400,
                )

            ext = foto_file.filename.rsplit(".", 1)[1].lower()
            nombre_unico = f"profile_{id_usuario}.{ext}"
            ruta = os.path.join(app.config["UPLOAD_FOLDER"], nombre_unico)
            foto_file.save(ruta)

            datos["foto"] = nombre_unico
        # Limpiar datos
        datos_limpios = {k: v for k, v in datos.items() if v is not None}

        return modificar_usuario(db, id_usuario, datos_limpios)

    # Ruta para desactivar un usuario
    @app.route("/usuarios/desactivar", methods=["PUT"])
    @jwt_required()
    def desactivar():
        id_usuario = int(get_jwt_identity())
        return desactivar_usuario(db, id_usuario)
