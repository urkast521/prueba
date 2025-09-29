import bcrypt

#Funcion para hacer hash a la contraseña
def hash_password(password):
    salt = bcrypt.gensalt(rounds=12)
    hash = bcrypt.hashw()
    return 1