import mysql.connector
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

import calendar


# Conexión a la base de datos MySQL
def conectar_bd():
    cnx = mysql.connector.connect(user='root', password='',
                                  host='localhost', database='clima')
    return cnx

# Obtener los datos de entrenamiento desde MySQL

def obtener_datos_fecha():
    conexion = conectar_bd()
    cursor = conexion.cursor()

    # Ejecutar consulta para obtener los datos (solo temperatura)
    consulta2="SELECT time,hora,minuto FROM tesjo ORDER BY time desc LIMIT 1"
    cursor.execute(consulta2)

    # Obtener todos los registros
    datosFecha=cursor.fetchall()

    # Cerrar cursor y conexión
    cursor.close()
    conexion.close()

    # Devolver los datos obtenidos como un array
    return datosFecha

def obtener_datos_entrenamiento():
    conexion = conectar_bd()
    cursor = conexion.cursor()

    # Ejecutar consulta para obtener los datos (solo temperatura)
    consulta = "SELECT hora,minuto,temperatura FROM tesjo"
    cursor.execute(consulta)

    # Obtener todos los registros
    datos = cursor.fetchall()

    # Cerrar cursor y conexión
    cursor.close()
    conexion.close()

    # Devolver los datos obtenidos como un array
    return datos


# Generar predicciones usando regresión lineal
def generar_predicciones(datos):
    # Separar los datos en características (X) y etiquetas (y)
    X = [dato[:-1] for dato in datos]
    y = [dato[-1] for dato in datos]

    # Dividir los datos en conjuntos de entrenamiento y prueba
    X_entrenamiento, X_prueba, y_entrenamiento, y_prueba = train_test_split(X, y, test_size=0.2)

    # Crear el modelo de regresión lineal
    modelo = LinearRegression()

    # Entrenar el modelo
    modelo.fit(X_entrenamiento, y_entrenamiento)

    # Realizar predicciones en el conjunto de prueba
    predicciones = modelo.predict(X_prueba)

    return predicciones


def obtener_ultimo_dia_mes(mes, anio):
    ultimo_dia = calendar.monthrange(anio, mes)[1]
    return ultimo_dia


# Insertar las predicciones en la base de datos
def insertar_predicciones(predicciones,datos_fecha):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    fecha = datos_fecha[0][0]
    hora = datos_fecha[0][1]
    minuto = datos_fecha[0][2]
    fechas = fecha.split('/')
    dia=int(fechas[0])
    mes=int(fechas[1])
    anio=int(fechas[2])
    for prediccion in predicciones:
        minuto = minuto + 1
        if minuto == 60:
            if hora == 23:
                hora = 0
                dia = dia + 1
                if dia > obtener_ultimo_dia_mes(mes, anio):
                    dia = 1
                    mes = mes + 1
                    if mes > 12:
                        mes = 1
                        anio = anio + 1
            else:
                hora = hora + 1
            minuto = 1

        fecha = str(dia) + "/" + str(mes) + "/" + str(anio)
        insert_query = "INSERT INTO tabla_predicciones (fecha, hora, minuto, prediccion) VALUES (%s, %s, %s, %s)"
        cursor.execute(insert_query, (fecha,hora,minuto, prediccion,))

    # Confirmar los cambios en la base de datos
    conexion.commit()

    # Cerrar cursor y conexión
    cursor.close()
    conexion.close()

# Función principal del programa
def main():
    # Obtener los datos de entrenamiento desde MySQL
    datos_fecha=obtener_datos_fecha()
    datos_entrenamiento = obtener_datos_entrenamiento()

    # Generar predicciones
    predicciones = generar_predicciones(datos_entrenamiento)

    # Imprimir las predicciones
    print("Predicciones:")
    for prediccion in predicciones:
        print(prediccion)

    # Insertar las predicciones en la base de datos
    insertar_predicciones(predicciones,datos_fecha)

# Ejecutar el programa
if __name__ == "__main__":
    main()
