import pymysql.cursors

class MySQLConnection:
    def __init__(self, db):
        try:
            self.connection = pymysql.connect(
                host='localhost',
                user='root',  # Cambia por tu usuario de MySQL
                password='Hans989!',  # Cambia por tu contraseña de MySQL
                db=db,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
        except Exception as e:
            print(f"Error conectando a la base de datos: {e}")
            self.connection = None

    def query_db(self, query, data=None):
        if not self.connection:
            print("No hay conexión a la base de datos")
            return False
            
        try:
            with self.connection.cursor() as cursor:
                print(f"Ejecutando query: {query}")
                
                if data:
                    cursor.execute(query, data)
                else:
                    cursor.execute(query)
                
                # Para SELECT
                if query.strip().lower().startswith('select'):
                    result = cursor.fetchall()
                    print(f"Resultados obtenidos: {len(result)} filas")
                    return result
                # Para INSERT
                elif query.strip().lower().startswith('insert'):
                    self.connection.commit()
                    last_id = cursor.lastrowid
                    print(f"INSERT exitoso, ID: {last_id}")
                    return last_id
                # Para UPDATE/DELETE
                else:
                    self.connection.commit()
                    rows_affected = cursor.rowcount
                    print(f"Operación exitosa, filas afectadas: {rows_affected}")
                    return rows_affected
                    
        except Exception as e:
            print(f"Error en la consulta: {e}")
            return False
        finally:
            if self.connection:
                self.connection.close()

def connectToMySQL(db):
    return MySQLConnection(db)