from flask import Flask, send_from_directory


def init_router(app: Flask):
    # Nueva ruta dedicada para servir las imágenes de perfil
    @app.route("/uploads/<filename>")
    def serve_uploaded_file(filename):
        # Usa send_from_directory para servir el archivo desde la carpeta UPLOAD_FOLDER
        # Flask manejará automáticamente la ruta y los errores 404 si el archivo no existe.
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
