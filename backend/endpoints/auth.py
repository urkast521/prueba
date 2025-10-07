from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

from services.auth import login_usuario


def init_router(app: Flask, db: SQLAlchemy):
    # Rutas para los servicios del usuario
    # Ruta de login no autenticada
    @app.route("/login", methods=["POST"])
    def login_app():
        datos = request.json
        return login_usuario(db, datos)
