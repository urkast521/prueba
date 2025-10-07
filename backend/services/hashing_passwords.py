import bcrypt


# Funcion para hacer hash a la contraseña
def hash_password(password):
    salt = bcrypt.gensalt(rounds=12)
    hash = bcrypt.hashpw(password.encode("utf8"), salt)
    return hash.decode("utf-8")


# Verificación de la contraseña
def comparar_password(password, hashPassword):
    return bcrypt.checkpw(password.encode("utf-8"), hashPassword.encode("utf-8"))
