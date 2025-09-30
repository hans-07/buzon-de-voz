from mysqlconnection import connectToMySQL

class Usuario:
    def __init__(self, data):
        self.id = data.get('id')
        self.nombre = data.get('nombre')
        self.rut = data.get('rut')
        self.curso = data.get('curso')
        self.correo = data.get('correo')
        self.tipo_reporte = data.get('tipo_reporte')
        self.declaracion = data.get('declaracion')
        self.created_at = data.get('created_at')
        self.updated_at = data.get('updated_at')

    @classmethod
    def enviar(cls, nombre, rut, curso, correo, declaracion, tipo_reporte):
        query = """
            INSERT INTO reportes 
            (nombre, rut, curso, correo, declaracion, tipo_reporte, created_at, updated_at) 
            VALUES (%(nombre)s, %(rut)s, %(curso)s, %(correo)s, %(declaracion)s, %(tipo_reporte)s, NOW(), NOW())
        """
        data = {
            'nombre': nombre,
            'rut': rut,
            'curso': curso,
            'correo': correo,
            'declaracion': declaracion,
            'tipo_reporte': tipo_reporte,
        }
        
        result = connectToMySQL('db_buzon').query_db(query, data)
        if result:
            print(f"Reporte guardado con ID: {result}")
            return True
        else:
            print("Error al guardar el reporte")
            return False

    @classmethod
    def get_all(cls):
        query = "SELECT * FROM reportes ORDER BY created_at DESC"
        results = connectToMySQL('db_buzon').query_db(query)
        
        if not results:
            print("No se pudieron obtener los reportes o no hay datos")
            return []
            
        usuarios = []
        for row in results:
            usuarios.append(cls(row))
        return usuarios

    @classmethod 
    def get_by_id(cls, reporte_id):
        query = "SELECT * FROM reportes WHERE id = %(id)s"
        data = {'id': reporte_id}
        results = connectToMySQL('db_buzon').query_db(query, data)
        
        if results:
            return cls(results[0])
        return None
