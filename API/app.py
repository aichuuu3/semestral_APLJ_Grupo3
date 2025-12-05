from flask import Flask, jsonify
from flask_mysqldb import MySQL
from flask_restx import Api, Namespace
from flask_cors import CORS
from config import DB_CONFIG
from miembro.usuario import crearUsuario
from miembro.tipoUsuario import crearTipoUsuario
from miembro.pagarCuota import crearPago
from miembro.membresia import crearMembresia
from miembro.miembro import crearMiembro
from Admin import admin
from Admin import libros
from Admin import talleres
#Para comprobar cositas esos 2 ultimos imports -- se puede quitar si quieres
import os
import sys

app = Flask(__name__)
app.config.update(DB_CONFIG)

CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
mysql = MySQL(app)

api = Api(app, doc='/docs/', title='API APLJ',
          description='API para gestión de usuarios, talleres y libros')

app.url_map.strict_slashes = False
# Namespaces
api.add_namespace(crearUsuario(mysql), path='/usuarios')
api.add_namespace(crearTipoUsuario(mysql), path='/tipoUsuario')
api.add_namespace(crearMembresia(mysql), path='/membresia')
api.add_namespace(crearPago(mysql), path='/pagarCuota')
api.add_namespace(crearMiembro(mysql), path='/miembro')
api.add_namespace(admin.register_admin_routes(app), path='/admin')
api.add_namespace(libros.register_libro_routes(app), path='/libros')
api.add_namespace(talleres.register_taller_routes(app), path='/talleres')

#Endpoint simple para probar que la api este funcando jejeje
@app.route('/test')
def test():
    return {'mensaje': 'API funcionando correctamente', 'status': 'OK'}

#Endpoint para probar conexión a la bd
@app.route('/test-db')
def test_db():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT 1")
        result = cur.fetchone()
        cur.close()
        return {'mensaje': 'Conexión a la base de datos exitosa', 'status': 'OK'}
    except Exception as e:
        return {'error': f'Error de conexión a la base de datos: {str(e)}', 'status': 'ERROR'}, 500

#Endpoint para obtener información sobre el entorno de la aplicación -- si quieres lo puedes quitar jeejeje
@app.route('/whoami')
def whoami():
    return jsonify({
        'pid': os.getpid(),
        'cwd': os.getcwd(),
        'python_executable': sys.executable,
        'app_file': __file__
    })

# Configurar CORS para permitir peticiones desde cualquier origen //


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)