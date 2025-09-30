from mysqlconnection import connectToMySQL

class Reportes:
    def __init__(self, data):
        self.id = data.get('id')
        self.categoria = data.get('categoria')
        self.estado = data.get('estado')
        self.tipo = data.get('tipo')
        self.descripcion = data.get('descripcion')
        self.created_at = data.get('created_at')
        self.updated_at = data.get('updated_at')

    @classmethod
    def ver_reportes(cls, ):
        query = """
            SELECT * FROM reportes
        """
        results = connectToMySQL('db_buzon').query_db(query)
        return results
    
    @classmethod
    def fun(cls):
        pass