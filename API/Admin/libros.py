# libros.py
from flask import jsonify, request
from config import obtener_conexion
from flask_restx import Namespace, Resource

def register_libro_routes(app):
    api = Namespace('libros', description='Operaciones de libros')

    @api.route("/")
    class LibroList(Resource):
        def get(self):
            # Lógica original para GET: todos los libros
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Libro")
            libros = cursor.fetchall()
            cursor.close()
            conexion.close()
            return jsonify(libros)

        def post(self):
            # Lógica original para POST: crear libro
            datos = request.get_json()
            conexion = obtener_conexion()
            cursor = conexion.cursor()
            query = """
                INSERT INTO Libro (isbn, titulo, autor, cantidad, fechaIngreso, estado, categoria)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            valores = (
                datos["isbn"],
                datos["titulo"],
                datos["autor"],
                datos["cantidad"],
                datos["fechaIngreso"],
                datos.get("estado", "disponible"),
                datos["categoria"]
            )
            cursor.execute(query, valores)
            conexion.commit()
            cursor.close()
            conexion.close()
            return jsonify({"mensaje": "Libro creado correctamente"}), 201

    @api.route("/<int:idLibro>")
    class Libro(Resource):
        def get(self, idLibro):
            # Lógica original para GET: libro por ID
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Libro WHERE idLibro=%s", (idLibro,))
            libro = cursor.fetchone()
            cursor.close()
            conexion.close()
            if libro:
                return jsonify(libro)
            else:
                return jsonify({"mensaje": "Libro no encontrado"}), 404

        def put(self, idLibro):
            # Lógica original para PUT: actualizar libro
            datos = request.get_json()
            conexion = obtener_conexion()
            cursor = conexion.cursor()
            query = """
                UPDATE Libro
                SET isbn=%s, titulo=%s, autor=%s, cantidad=%s, fechaIngreso=%s, estado=%s, categoria=%s
                WHERE idLibro=%s
            """
            valores = (
                datos["isbn"],
                datos["titulo"],
                datos["autor"],
                datos["cantidad"],
                datos["fechaIngreso"],
                datos["estado"],
                datos["categoria"],
                idLibro
            )
            cursor.execute(query, valores)
            conexion.commit()
            cursor.close()
            conexion.close()
            return jsonify({"mensaje": "Libro actualizado correctamente"})
        
    return api