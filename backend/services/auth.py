import re

from flask import jsonify
from sqlalchemy import text
from flask_jwt_extended import create_access_token

from services.hashing_passwords import comparar_password


# Expresion regular para verificar el correo
regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


# Inicio de sesion del usuario
def login_usuario(db, datos):
    # Obtener datos de inicio de sesion
    correo = datos.get("correo")
    passw_sin_hash = datos.get("passw")

    # Validar que se proporcionen correo y contraseña
    if not correo or not passw_sin_hash:
        return (
            jsonify(
                {"success": False, "error": "Correo y contraseña son obligatorios"}
            ),
            400,
        )

    # Validar que el correo sea un correo valido
    if not re.fullmatch(regex, correo):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400

    # Si se proporcionan, se procede a verificar las credenciales
    try:
        # Consultar el usuario en la base de datos según el correo y la contraseña
        query = text("SELECT * FROM usuarios WHERE correo = :correo")
        resultado = db.session.execute(query, {"correo": correo})
        usuario = resultado.mappings().first()
        # Si no se encuentra el usuario, retornar error
        if not usuario:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401

        # Validar que el usuario esté activo
        if usuario["estado"] != 1:
            return (
                jsonify({"success": False, "error": "Tu cuenta está desactivada"}),
                403,
            )

        # Obtener hash
        passw_con_hash = usuario["passw"]
        # Comparar hash con password
        if not comparar_password(passw_sin_hash, passw_con_hash):
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401

        # Si todo salio bien,  seguimos adelante
        # Generar token
        token_de_acceso = create_access_token(
            identity=str(usuario["id"]),
        )
        # Datos del usuario autenticado
        datos_usuario = {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "correo": usuario["correo"],
            "foto": usuario["foto"],
            "estado": usuario["estado"],
        }
        return (
            jsonify(
                {
                    "success": True,
                    "message": "Login exitoso",
                    "token": token_de_acceso,
                    "usuario": datos_usuario,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()
