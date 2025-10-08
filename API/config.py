import mysql.connector

DB_CONFIG = {
    'MYSQL_HOST': 'localhost',
    'MYSQL_USER': 'root',
    'MYSQL_PASSWORD': 'bethel0505',
    'MYSQL_DB': 'APLIJ'
}

def obtener_conexion():
    return mysql.connector.connect(
        host=DB_CONFIG['MYSQL_HOST'],
        user=DB_CONFIG['MYSQL_USER'],
        password=DB_CONFIG['MYSQL_PASSWORD'],
        database=DB_CONFIG['MYSQL_DB'],
        charset='utf8mb4',  # Forzar el uso de utf8mb4
        collation='utf8mb4_general_ci'  # Forzar la collation
    )

DB_CONFIG['conexion'] = obtener_conexion()