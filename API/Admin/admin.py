# admin.py
from flask import jsonify
from config import obtener_conexion
from flask_restx import Namespace, Resource

def register_admin_routes(app):
    api = Namespace('admin', description='Operaciones de administrador')
    
    @api.route("/")
    class AdminRoot(Resource):
        def get(self):
            return jsonify({"mensaje": "API del Panel de Admin funcionando"})

    @api.route("/resumen") 
    class AdminResumen(Resource):
        def get(self):
            # Lógica original para GET: resumen
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)

            # Contar solicitudes pendientes y aceptadas
            cursor.execute("SELECT COUNT(*) AS pendientes FROM SolicitudMembresia WHERE estado='pendiente'")
            pendientes = cursor.fetchone()["pendientes"]

            cursor.execute("SELECT COUNT(*) AS aceptadas FROM SolicitudMembresia WHERE estado='aceptada'")
            aceptadas = cursor.fetchone()["aceptadas"]

            # Contar libros disponibles
            cursor.execute("SELECT COUNT(*) AS total_libros FROM Libro")
            total_libros = cursor.fetchone()["total_libros"] or 0

            # Contar talleres disponibles
            cursor.execute("SELECT COUNT(*) AS total_talleres FROM Taller")
            total_talleres = cursor.fetchone()["total_talleres"]

            cursor.close()
            conexion.close()

            return jsonify({
                "solPend": pendientes,
                "solAcep": aceptadas,
                "libros": total_libros,
                "talleres": total_talleres
            })
            
    return api