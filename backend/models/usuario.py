from app import db

#Definición del modelo de usuario para la base de datos
class Usuario(db.Model):
    __tablename__ = 'usuarios'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    passw = db.Column(db.String(255), nullable=False)
    estado = db.Column(db.Integer, nullable=False, default=1)

    def __repr__(self):
        return f'<Usuario {self.nombre}>'