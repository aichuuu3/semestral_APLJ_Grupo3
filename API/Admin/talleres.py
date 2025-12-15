# talleres.py
from flask import request
from config import obtener_conexion
from flask_restx import Namespace, Resource

def register_taller_routes(app):
    api = Namespace('talleres', description='Operaciones de talleres')

    @api.route("/")
    class TallerList(Resource):
        def get(self):
            #todos los talleres
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Taller")
            talleres = cursor.fetchall()
            cursor.close()
            conexion.close()

            # Convertir DATE y TIME a string para JSON
            for taller in talleres:
                taller['fecha'] = taller['fecha'].strftime('%Y-%m-%d')
                taller['hora'] = str(taller['hora'])

            return talleres

        def post(self):
            #crear taller
            datos = request.get_json()
            conexion = obtener_conexion()
            cursor = conexion.cursor()
            query = """
                INSERT INTO Taller (nombre, tipo, ubicacion, fecha, hora, estado, detalles)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            valores = (
                datos["nombre"],
                datos["tipo"],
                datos["ubicacion"],
                datos["fecha"],
                datos["hora"],
                datos.get("estado", "Activo"),
                datos.get("detalles", "")
            )
            cursor.execute(query, valores)
            conexion.commit()
            cursor.close()
            conexion.close()
            return {"mensaje": "Taller creado correctamente"}, 201

    @api.route("/<int:idTaller>")
    class Taller(Resource):
        def get(self, idTaller):
            #taller por ID
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Taller WHERE idTaller=%s", (idTaller,))
            taller = cursor.fetchone()
            cursor.close()
            conexion.close()

            if not taller:
                return {"mensaje": "Taller no encontrado"}, 404

            # Convertir DATE y TIME a string
            taller['fecha'] = taller['fecha'].strftime('%Y-%m-%d')
            taller['hora'] = str(taller['hora'])

            return taller

        def put(self, idTaller):
            #actualizar taller
            datos = request.get_json()
            conexion = obtener_conexion()
            cursor = conexion.cursor()

            query = """
                UPDATE Taller
                SET nombre=%s, tipo=%s, fecha=%s, hora=%s, ubicacion=%s, detalles=%s
                WHERE idTaller=%s
            """
            valores = (
                datos["nombre"],
                datos["tipo"],
                datos["fecha"],
                datos["hora"],
                datos["ubicacion"],
                datos.get("detalles", ""),
                idTaller
            )
            
            cursor.execute(query, valores)
            conexion.commit()
            cursor.close()
            conexion.close()

            return {"mensaje": "Taller actualizado correctamente"}

        def delete(self, idTaller):
            #eliminar taller
            conexion = obtener_conexion()
            cursor = conexion.cursor()
            cursor.execute("DELETE FROM Taller WHERE idTaller=%s", (idTaller,))
            conexion.commit()
            cursor.close()
            conexion.close()
            return {"mensaje": "Taller eliminado correctamente"}
            
    return api