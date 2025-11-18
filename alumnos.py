from mysqlconnection import connectToMySQL

class Alumnos:
    def __init__(self, data):
        self.nombre = data.get('nombre')
        self.rut = data.get('rut')
        self.curso = data.get('curso')
    
    @classmethod
    def obtener_todos(cls):
        """Obtiene todos los alumnos de la base de datos"""
        try:
            query = "SELECT nombre, rut, curso FROM alumnos"
            resultados = connectToMySQL('db_buzon').query_db(query)
            
            alumnos = []
            for fila in resultados:
                alumnos.append(cls(fila))
            return alumnos
        except Exception as e:
            print(f"Error al obtener alumnos: {e}")
            return [] 