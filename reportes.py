from mysqlconnection import connectToMySQL

class Reporte:
    def __init__(self, data):
        self.id = data.get('id')
        self.nombre = data.get('nombre')
        self.rut = data.get('rut')
        self.curso = data.get('curso')
        self.correo = data.get('correo')
        self.categoria = data.get('categoria')
        self.descripcion = data.get('descripcion')
        self.estado = data.get('estado', 'pendiente')
        self.prioridad = data.get('prioridad', 'media')
        self.created_at = data.get('created_at')
        self.updated_at = data.get('updated_at')

    @classmethod
    def crear_reporte(cls, nombre, rut, curso, correo, categoria, descripcion, prioridad='media'):
        query = """
            INSERT INTO reportes (nombre, rut, curso, correo, categoria, descripcion, prioridad) 
            VALUES (%(nombre)s, %(rut)s, %(curso)s, %(correo)s, %(categoria)s, %(descripcion)s, %(prioridad)s)
        """
        data = {
            'nombre': nombre,
            'rut': rut,
            'curso': curso,
            'correo': correo,
            'categoria': categoria,
            'descripcion': descripcion,
            'prioridad': prioridad
        }
        return connectToMySQL('db_buzon').query_db(query, data)

    @classmethod
    def obtener_todos(cls):
        query = """
            SELECT * FROM reportes 
            ORDER BY 
                CASE prioridad
                    WHEN 'alta' THEN 1
                    WHEN 'media' THEN 2
                    WHEN 'baja' THEN 3
                END,
                created_at DESC
        """
        results = connectToMySQL('db_buzon').query_db(query)
        reportes = []
        for row in results:
            reportes.append(cls(row))
        return reportes

    @classmethod
    def obtener_por_id(cls, reporte_id):
        query = "SELECT * FROM reportes WHERE id = %(id)s"
        data = {'id': reporte_id}
        results = connectToMySQL('db_buzon').query_db(query, data)
        if results:
            return cls(results[0])
        return None

    @classmethod
    def actualizar_estado(cls, reporte_id, nuevo_estado):
        query = "UPDATE reportes SET estado = %(estado)s, updated_at = NOW() WHERE id = %(id)s"
        data = {
            'id': reporte_id,
            'estado': nuevo_estado
        }
        return connectToMySQL('db_buzon').query_db(query, data)