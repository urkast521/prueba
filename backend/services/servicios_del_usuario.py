from flask import jsonify, make_response
from sqlalchemy import text
from flask_jwt_extended import create_access_token



def insertar_usuario(db, datos):
    #Se Valida que todos los campos requeridos estén presentes y no estén vacíos
    validaciones = ['nombre', 'correo', 'passw']
    for validacion in validaciones:
        if validacion not in datos or not datos[validacion]:
            return make_response(jsonify({
                "success": False,
                "message": f"Falta el campo requerido: '{validacion}'."
            }), 400)
    # Si todas las validaciones pasan, se procede a insertar el usuario
    try:
        query = text("""
            INSERT INTO usuarios (nombre, correo, passw, estado)
            VALUES (:nombre, :correo, :passw, :estado)
        """)
        db.session.execute(query, {
            "nombre": datos['nombre'],
            "correo": datos['correo'],
            "passw": datos['passw'],
            "estado": 1
        })
        db.session.commit()
        return  make_response(jsonify({
                "success": True,
                "message": f"Usuario '{datos['nombre']}' insertado correctamente."
            }), 200)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})
    finally:
        db.session.close()
    
def consultar_usuarios(db, params=None):
    try:
        # Si se proporciona un nombre o id, busca por nombre o id, si no, devuelve todos
        if params:
            if 'id' in params:
                query = text("SELECT * FROM usuarios WHERE id = :id")
                resultado = db.session.execute(query, {"id": params['id']})
            elif 'nombre' in params:
                query = text("SELECT * FROM usuarios WHERE nombre = :nombre")
                resultado = db.session.execute(query, {"nombre": params['nombre']})
        else:
            query = text("SELECT * FROM usuarios")
            resultado = db.session.execute(query)
            
        usuarios = [dict(row) for row in resultado.mappings().all()]
        return make_response(jsonify({
            "success": True, 
            "message": "Consulta exitosa.",
            "data": usuarios
        }), 200)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()

def modificar_usuario(db, id, datos):

    #Validar que el ID sea proporcionado
    if not id:
        return jsonify({"success": False, "error": "ID de usuario no proporcionado"}), 400
    
    #Validar que haya algo que actualizar
    try:
        if not datos:
            return jsonify({"success": False, "error": "No se proporcionaron datos para actualizar"}), 400

    #Construir la consulta de actualización dinámicamente
    #Set_clauses contendrá las partes de la consulta SET
    #Params contendrá los valores a actualizar
        set_clauses = []
        params = {}
        for key, value in datos.items():
            set_clauses.append(f"{key} = :{key}")
            params[key] = value

        params['id'] = id
        query = text(f"UPDATE usuarios SET {', '.join(set_clauses)} WHERE id = :id")

        db.session.execute(query, params)
        db.session.commit()

        return make_response(jsonify({
                "success": True,
                "message": f"Usuario con ID '{id}' modificado correctamente."
            }), 200)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()

def desactivar_usuario(db, id):

    #Validar que el ID sea proporcionado
    if not id:
        return jsonify({"success": False, "error": "ID de usuario no proporcionado"}), 400
    
    try:
        query = text("UPDATE usuarios SET estado = 0 WHERE id = :id")
        db.session.execute(query, {"id": id})
        db.session.commit()

        return make_response(jsonify({
                "success": True,
                "message": f"Usuario con ID '{id}' desactivado correctamente."
            }), 200)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()

def login_usuario(db, datos):
    correo = datos.get("correo")
    passw = datos.get("passw")

    #Validar que se proporcionen correo y contraseña
    if not correo or not passw:
        return jsonify({"success": False, "error": "Correo y contraseña son obligatorios"}), 400

    #Si se proporcionan, se procede a verificar las credenciales
    try:
        #Consultar el usuario en la base de datos según el correo y la contraseña
        query = text("SELECT * FROM usuarios WHERE correo = :correo AND passw = :passw")
        resultado = db.session.execute(query, {"correo": correo, "passw": passw})
        usuario = resultado.mappings().first()
        #Si no se encuentra el usuario, retornar error
        if not usuario:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401

        #Validar que el usuario esté activo
        if usuario["estado"] != 1:
            return jsonify({"success": False, "error": "Tu cuenta está desactivada"}), 403
        
        #Generar token
        token_de_acceso = create_access_token(
            identity=str(usuario["id"]),
        )
        #Datos del usuario autenticado
        datos_usuario = {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "correo": usuario["correo"],
            "estado": usuario["estado"]
        }
        return jsonify({
            "success": True,
            "message": "Login exitoso",
            "token": token_de_acceso,
            "usuario": datos_usuario
        }), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        db.session.close()