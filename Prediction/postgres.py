import psycopg2

# Datos de conexión a la base de datos
host = 'dpg-ci0cmc33cv232ebgjoog-a.oregon-postgres.render.com'  # Reemplaza con la dirección IP o el nombre de dominio del servidor de la base de datos
port = '5432'  # Puerto de PostgreSQL (por defecto es 5432)
database = 'clima'  # Reemplaza con el nombre de tu base de datos
user = 'root'  # Reemplaza con el nombre de usuario para acceder a la base de datos
password = '8sWnIWKoQ8aO8ll8hQNLqOc5MisP5VIO'  # Reemplaza con la contraseña correspondiente

# Intentar establecer la conexión
try:
    connection = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password
    )

    # La conexión se realizó con éxito
    print("Conexión exitosa a la base de datos")

    # Realiza operaciones en la base de datos...

    # Cerrar la conexión
    connection.close()
    print("Conexión cerrada")

except psycopg2.Error as e:
    # Ocurrió un error al intentar conectarse a la base de datos
    print("Error al conectar a la base de datos:", e)
