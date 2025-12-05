from flask import jsonify, request
from config import obtener_conexion
from flask_restx import Namespace, Resource

def register_libro_routes(app):
    api = Namespace('libros', description='Operaciones de libros')

    # ---- LISTAR Y CREAR LIBROS ----
    @api.route("")
    class LibroList(Resource):
        def get(self):
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Libro")
            libros = cursor.fetchall()
            cursor.close()
            conexion.close()
            return jsonify(libros)

        def post(self):
            try:
                datos = request.get_json()
                
                # Validaciones de datos faltantes (opcional, pero recomendado)
                campos_requeridos = ["isbn", "titulo", "autor", "cantidad", "fechaIngreso", "categoria"]
                for campo in campos_requeridos:
                    if campo not in datos:
                        return {"mensaje": f"Falta el campo requerido: {campo}"}, 400
                
                # Inserción en la base de datos
                conexion = obtener_conexion()
                cursor = conexion.cursor()

                # Usa el nombre de columna tal cual aparece en tu BD (Estado o estado)
                query = """
                    INSERT INTO Libro (isbn, titulo, autor, cantidad, fechaIngreso, Estado, categoria)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """

                valores = (
                    datos["isbn"],
                    datos["titulo"],
                    datos["autor"],
                    datos["cantidad"],
                    str(datos["fechaIngreso"]),  # Si la BD espera formato "YYYY-MM-DD", esto funciona
                    datos.get("estado", "disponible"),
                    datos["categoria"]
                )

                # Debug: imprime lo que realmente envías al SQL
                print("Query:", query)
                print("Valores:", valores)

                cursor.execute(query, valores)
                conexion.commit()

                cursor.close()
                conexion.close()

                return {"mensaje": "Libro creado correctamente"}, 201

            except KeyError as e:
                print(f"ERROR: Falta una clave en el JSON: {e}")
                return {"mensaje": f"Error en los datos enviados: Falta la clave {str(e)}"}, 400

            except Exception as e:
                print(f"Error al insertar libro en DB: {e}")
                return {"mensaje": f"Error interno al procesar la solicitud: {str(e)}"}, 500

    # ---- OBTENER / ACTUALIZAR LIBRO POR ID ----
    @api.route("/<int:idLibro>")
    class Libro(Resource):
        def get(self, idLibro):
            conexion = obtener_conexion()
            cursor = conexion.cursor(dictionary=True)
            cursor.execute("SELECT * FROM Libro WHERE idLibro=%s", (idLibro,))
            libro = cursor.fetchone()
            cursor.close()
            conexion.close()

            if libro:
                return jsonify(libro)
            else:
                return {"mensaje": "Libro no encontrado"}, 404

        def put(self, idLibro):
            datos = request.get_json()
            conexion = obtener_conexion()
            cursor = conexion.cursor()

            query = """
                UPDATE Libro
                SET isbn=%s, titulo=%s, autor=%s, cantidad=%s, fechaIngreso=%s, Estado=%s, categoria=%s
                WHERE idLibro=%s
            """

            valores = (
                datos["isbn"],
                datos["titulo"],
                datos["autor"],
                datos["cantidad"],
                datos["fechaIngreso"],
                datos["estado"], # Usamos 'estado' del JSON
                datos["categoria"],
                idLibro
            )

            cursor.execute(query, valores)
            conexion.commit()

            cursor.close()
            conexion.close()

            return {"mensaje": "Libro actualizado correctamente"}

    return api