from mysqlconnection import connectToMySQL

class Usuario:
    def __init__(self, data):
        self.id = data.get('id')
        self.nombre = data.get('nombre')
        self.rut = data.get('rut')
        self.curso = data.get('curso')
        self.correo = data.get('correo')
        self.tipo_usuario = data.get('tipo_usuario')
        self.password = data.get('password')
        self.created_at = data.get('created_at')

    @classmethod
    def crear_usuario(cls, nombre, rut, curso, correo=None, tipo_usuario='estudiante', password='estudiante123'):
        query = """
            INSERT INTO usuarios (nombre, rut, curso, correo, tipo_usuario, password) 
            VALUES (%(nombre)s, %(rut)s, %(curso)s, %(correo)s, %(tipo_usuario)s, %(password)s)
        """
        data = {
            'nombre': nombre,
            'rut': rut,
            'curso': curso,
            'correo': correo,
            'tipo_usuario': tipo_usuario,
            'password': password
        }
        return connectToMySQL('db_buzon').query_db(query, data)

    @classmethod
    def obtener_por_rut(cls, rut):
        query = "SELECT * FROM usuarios WHERE rut = %(rut)s"
        data = {'rut': rut}
        results = connectToMySQL('db_buzon').query_db(query, data)
        if results:
            return cls(results[0])
        return None

    @classmethod
    def obtener_por_email(cls, email):
        query = "SELECT * FROM usuarios WHERE correo = %(email)s"
        data = {'email': email}
        results = connectToMySQL('db_buzon').query_db(query, data)
        if results:
            return cls(results[0])
        return None

    @classmethod
    def obtener_por_id(cls, usuario_id):
        query = "SELECT * FROM usuarios WHERE id = %(id)s"
        data = {'id': usuario_id}
        results = connectToMySQL('db_buzon').query_db(query, data)
        if results:
            return cls(results[0])
        return None

