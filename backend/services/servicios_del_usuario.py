from flask import jsonify, make_response
from sqlalchemy import text
from flask_jwt_extended import create_access_token
from services.hashing_passwords import hash_password, comparar_password
import re

#Expresion regular para verificar el correo
regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

#Funcion para registrar un usuario
def insertar_usuario(db, datos):
    #Se Valida que todos los campos requeridos estén presentes y no estén vacíos
    validaciones = ['nombre', 'correo', 'passw']
    for validacion in validaciones:
        if validacion not in datos or not datos[validacion]:
            return make_response(jsonify({
                "success": False,
                "message": f"Falta el campo requerido: '{validacion}'."
            }), 400)
        
    #Validar que el correo sea un correo valido
    if not re.fullmatch(regex,datos['correo']):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400
        
    # hashear la contraseña ingresada
    hashed_password = hash_password(datos['passw'])

    # sustituir el valor de passw por el valor hasheado
    datos['passw']= hashed_password

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
    
#Funcion para consultar un usuario especifico o todos
def consultar_usuarios(db, params=None):
    try:

        # Si se proporciona un nombre o id, busca por nombre o id, si no, devuelve todos
        if params:
            if 'id' in params:
                query = text("SELECT id, nombre, correo, estado FROM usuarios WHERE id = :id")
                resultado = db.session.execute(query, {"id": params['id']})
            elif 'nombre' in params:
                query = text("SELECT id, nombre, correo, estado FROM usuarios WHERE nombre = :nombre")
                resultado = db.session.execute(query, {"nombre": params['nombre']})
        else:
            query = text("SELECT id, nombre, correo, estado FROM usuarios")
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

#Modificar un usuario
def modificar_usuario(db, id, datos):

    #Validar que el ID sea proporcionado
    if not id:
        return jsonify({"success": False, "error": "ID de usuario no proporcionado"}), 400
    
    #validar que haya datos en datos
    if not datos:
        return jsonify({"success": False, "error": "No se proporcionaron datos para actualizar"}), 400
    
    #Validar que el correo sea un correo valido
    if not re.fullmatch(regex,datos['correo']):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400
    
    try:
    #Construir la consulta de actualización dinámicamente
    #Set_clauses contendrá las partes de la consulta SET
    #Params contendrá los valores a actualizar
        set_clauses = []
        params = {}
        for key, value in datos.items():
            set_clauses.append(f"{key} = :{key}")
            params[key] = value
            if key == 'passw':
                # hashear la contraseña ingresada
                hashed_password = hash_password(value)
                # sustituir el valor de passw por el valor hasheado
                params[key]= hashed_password
        #Agregar el ID del usuario a actualizar
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

#Desactivar usuario de manera logica
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

#Inicio de sesion del usuario
def login_usuario(db, datos):
    #Obtener datos de inicio de sesion
    correo = datos.get("correo")
    passw_sin_hash = datos.get("passw")

    #Validar que se proporcionen correo y contraseña
    if not correo or not passw_sin_hash:
        return jsonify({"success": False, "error": "Correo y contraseña son obligatorios"}), 400
    
    #Validar que el correo sea un correo valido
    if not re.fullmatch(regex,correo):
        return jsonify({"success": False, "error": "Correo o contraseña erroneos"}), 400

    #Si se proporcionan, se procede a verificar las credenciales
    try:
        #Consultar el usuario en la base de datos según el correo y la contraseña
        query = text("SELECT * FROM usuarios WHERE correo = :correo")
        resultado = db.session.execute(query, {"correo": correo})
        usuario = resultado.mappings().first()
        #Si no se encuentra el usuario, retornar error
        if not usuario:
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401

        #Validar que el usuario esté activo
        if usuario["estado"] != 1:
            return jsonify({"success": False, "error": "Tu cuenta está desactivada"}), 403
        
        #Obtener hash
        passw_con_hash=usuario["passw"]
        #Comparar hash con password
        if not comparar_password(passw_sin_hash, passw_con_hash):
            return jsonify({"success": False, "error": "Credenciales inválidas"}), 401
        

        #Si todo salio bien,  seguimos adelante
        #Generar token
        token_de_acceso = create_access_token(
            identity=str(usuario["id"]),
        )
        #Datos del usuario autenticado
        datos_usuario = {
            "id": usuario["id"],
            "nombre": usuario["nombre"],
            "correo": usuario["correo"],
            "foto": usuario["foto"],
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