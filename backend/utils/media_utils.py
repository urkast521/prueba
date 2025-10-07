from config import ALLOWED_EXTENSIONS


# Funcion para validar tipo de archivo valido de la foto
def allowed_file(filename):
    # Asegura que el archivo tenga un nombre y un punto
    if "." not in filename:
        return False

    # obtiene la parte de la extensión (después del último punto) y la convierte a minúsculas
    extension = filename.rsplit(".", 1)[1].lower()

    # Verifica si la extensión está en la lista de permitidas
    return extension in ALLOWED_EXTENSIONS
