import mysql.connector
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

import calendar



def conectar_bd():
    cnx = mysql.connector.connect(user='root', password='',
                                  host='localhost', database='clima')
    return cnx


def obtener_datos_fecha():
    conexion = conectar_bd()
    cursor = conexion.cursor()

    consulta2="SELECT fecha,hora,minuto FROM tesjo ORDER BY fecha desc LIMIT 1"
    cursor.execute(consulta2)

    datosFecha=cursor.fetchall()

    print(datosFecha)

    cursor.close()
    conexion.close()

    return datosFecha

def obtener_datos_entrenamiento():
    conexion = conectar_bd()
    cursor = conexion.cursor()

    consulta = "SELECT hora,minuto,temperatura FROM tesjo"
    cursor.execute(consulta)

    datos = cursor.fetchall()

    cursor.close()
    conexion.close()

    return datos


def generar_predicciones(datos):
    X = [dato[:-1] for dato in datos]
    y = [dato[-1] for dato in datos]

    X_entrenamiento, X_prueba, y_entrenamiento, y_prueba = train_test_split(X, y, test_size=0.2)

    modelo = LinearRegression()

    modelo.fit(X_entrenamiento, y_entrenamiento)

    predicciones = modelo.predict(X_prueba)

    return predicciones


def obtener_ultimo_dia_mes(mes, anio):
    ultimo_dia = calendar.monthrange(anio, mes)[1]
    return ultimo_dia

def validarFecha(minuto, hora, dia, mes, anio):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    fecha=str(anio)+"-"+str(mes).zfill(2)+"-"+str(dia)
    consulta = "SELECT * from tabla_predicciones where fecha=%s and hora=%s and minuto=%s"
    cursor.execute(consulta,(fecha,hora,minuto))

    datos = cursor.fetchall()
    cursor.close()
    conexion.close()

    return datos

def insertar_predicciones(predicciones,datos_fecha):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    fecha = datos_fecha[0][0]
    hora = datos_fecha[0][1]
    minuto = datos_fecha[0][2]
    print (fecha)

    dia=fecha.day
    mes=fecha.month
    anio=fecha.year
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
        datos=validarFecha(minuto,hora,dia,mes,anio)
        if len(datos)==0:
            fecha = str(anio) + "-" + str(mes).zfill(2) + "-" + str(dia)
            insert_query = "INSERT INTO tabla_predicciones (fecha, hora, minuto, prediccion) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (fecha,hora,minuto, prediccion,))
            print(insert_query, (fecha,hora,minuto, prediccion,));

    conexion.commit()

    cursor.close()
    conexion.close()

def main():
    datos_fecha=obtener_datos_fecha()
    datos_entrenamiento = obtener_datos_entrenamiento()

    predicciones = generar_predicciones(datos_entrenamiento)

    print("Predicciones:")
    for prediccion in predicciones:
        print(prediccion)

    insertar_predicciones(predicciones,datos_fecha)

# Ejecutar el programa
if __name__ == "__main__":
    main()
