import re


from sqlalchemy import text
from flask import jsonify, make_response

from services.hashing_passwords import hash_password


# Expresion regular para verificar el correo
regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


# Funcion para registrar un usuario
def insertar_usuario(db, datos):
    # Se Valida que todos los campos requeridos estén presentes y no estén vacíos
    validaciones = ["nombre", "correo", "passw"]
    for validacion in validaciones:
        if validacion not in datos or not datos[validacion]:
            return make_response(
                jsonify(
                    {
                        "success": False,
                        "message": f"Falta el campo requerido: '{validacion}'.",
                    }
                ),
                400,
            )

    # Validar que el correo sea un correo valido
    if not re.fullmatch(regex, datos["correo"]):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400

    # hashear la contraseña ingresada
    hashed_password = hash_password(datos["passw"])

    # sustituir el valor de passw por el valor hasheado
    datos["passw"] = hashed_password

    # Si todas las validaciones pasan, se procede a insertar el usuario
    try:
        query = text(
            """
            INSERT INTO usuarios (nombre, correo, passw, estado)
            VALUES (:nombre, :correo, :passw, :estado)
        """
        )
        db.session.execute(
            query,
            {
                "nombre": datos["nombre"],
                "correo": datos["correo"],
                "passw": datos["passw"],
                "estado": 1,
            },
        )
        db.session.commit()
        return make_response(
            jsonify(
                {
                    "success": True,
                    "message": f"Usuario '{datos['nombre']}' insertado correctamente.",
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        db.session.close()


# Funcion para consultar un usuario especifico o todos
def consultar_usuarios(db, params=None):
    try:

        # Si se proporciona un nombre o id, busca por nombre o id, si no, devuelve todos
        if params:
            if "id" in params:
                query = text(
                    "SELECT id, nombre, correo, estado FROM usuarios WHERE id = :id"
                )
                resultado = db.session.execute(query, {"id": params["id"]})
            elif "nombre" in params:
                query = text(
                    "SELECT id, nombre, correo, estado FROM usuarios WHERE nombre = :nombre"
                )
                resultado = db.session.execute(query, {"nombre": params["nombre"]})
        else:
            query = text("SELECT id, nombre, correo, estado FROM usuarios")
            resultado = db.session.execute(query)

        usuarios = [dict(row) for row in resultado.mappings().all()]
        return make_response(
            jsonify(
                {"success": True, "message": "Consulta exitosa.", "data": usuarios}
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()


# Modificar un usuario
def modificar_usuario(db, id, datos):

    # Validar que el ID sea proporcionado
    if not id:
        return (
            jsonify({"success": False, "error": "ID de usuario no proporcionado"}),
            400,
        )

    # validar que haya datos en datos
    if not datos:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "No se proporcionaron datos para actualizar",
                }
            ),
            400,
        )

    # Validar que el correo sea un correo valido
    if not re.fullmatch(regex, datos["correo"]):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400

    try:
        # Construir la consulta de actualización dinámicamente
        # Set_clauses contendrá las partes de la consulta SET
        # Params contendrá los valores a actualizar
        set_clauses = []
        params = {}
        for key, value in datos.items():
            set_clauses.append(f"{key} = :{key}")
            params[key] = value
            if key == "passw":
                # hashear la contraseña ingresada
                hashed_password = hash_password(value)
                # sustituir el valor de passw por el valor hasheado
                params[key] = hashed_password
        # Agregar el ID del usuario a actualizar
        params["id"] = id
        query = text(f"UPDATE usuarios SET {', '.join(set_clauses)} WHERE id = :id")

        db.session.execute(query, params)
        db.session.commit()

        return make_response(
            jsonify(
                {
                    "success": True,
                    "message": f"Usuario con ID '{id}' modificado correctamente.",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()


# Desactivar usuario de manera logica
def desactivar_usuario(db, id):

    # Validar que el ID sea proporcionado
    if not id:
        return (
            jsonify({"success": False, "error": "ID de usuario no proporcionado"}),
            400,
        )

    try:
        query = text("UPDATE usuarios SET estado = 0 WHERE id = :id")
        db.session.execute(query, {"id": id})
        db.session.commit()

        return make_response(
            jsonify(
                {
                    "success": True,
                    "message": f"Usuario con ID '{id}' desactivado correctamente.",
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()
