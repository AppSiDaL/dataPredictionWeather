from django.http import JsonResponse
import psycopg2
from datetime import datetime, timedelta
import zoneinfo
zona = zoneinfo.ZoneInfo("America/Mexico_City")
def conectar_bd():
    cnx = psycopg2.connect(
        host="dpg-ci0cmc33cv232ebgjoog-a.oregon-postgres.render.com",
        port="5432",
        database="clima",
        user="root",
        password="8sWnIWKoQ8aO8ll8hQNLqOc5MisP5VIO",
    )
    return cnx


def my_view(request):
    # Procesa la solicitud GET
    # Puedes acceder a los parámetros de la solicitud utilizando request.GET

    # Ejemplo de respuesta JSON
    response_data = {
        "message": "¡Hola desde Django!",
        "params": dict(request.GET),
    }

    return JsonResponse(response_data)


def currentValues(request):
    conexion = conectar_bd()
    cursor = conexion.cursor()
    consulta = (
        "SELECT *"
        "FROM tesjo "
        "WHERE CONCAT(fecha, ' ', TO_CHAR(hora, 'FM00'), ':', TO_CHAR(minuto, 'FM00')) = ("
        "SELECT MAX(CONCAT(fecha, ' ', TO_CHAR(hora, 'FM00'), ':', TO_CHAR(minuto, 'FM00')))"
        " FROM tesjo"
        ");"
    )
    cursor.execute(consulta)
    datos1 = cursor.fetchall()
    if datos1:
        columnas = [column[0] for column in cursor.description]
        primera_fila = datos1[0]
        valores = dict(zip(columnas, primera_fila))

    consulta = (
        "SELECT MIN(temperatura) minTemperatura"
        " FROM tesjo "
        "WHERE fecha = CURRENT_DATE"
    )
    cursor.execute(consulta)
    datos2 = cursor.fetchall()

    consulta = (
        "SELECT MAX(temperatura) maxTemperatura"
        " FROM tesjo "
        "WHERE fecha = CURRENT_DATE"
    )
    cursor.execute(consulta)
    datos3 = cursor.fetchall()

    consulta = (
        "SELECT AVG(temperatura) avgTemperatura"
        " FROM tesjo "
        "WHERE fecha = CURRENT_DATE"
    )
    cursor.execute(consulta)
    datos4 = cursor.fetchall()
    print(datos2)
    valores["minTemperatura"] = datos2[0][0]
    valores["maxTemperatura"] = datos3[0][0]
    valores["avgTemperatura"] = round(datos4[0][0])

    return JsonResponse(valores)


def next48Values(response):
    now = datetime.now(zona)
    conexion = conectar_bd()
    contador=0
    data={}
    horaActual=now.hour
    for i in range(48):
        contador=contador+1
        hora=horaActual+contador
        if hora>23:
            now = (now+ timedelta(days=1))
            hora=hora-24
            horaActual=0
            contador=0
        if now.month==12:
            now =(now + timedelta(years=1)) 
        cursor = conexion.cursor()
        consulta = (
            "SELECT * FROM tabla_predicciones where fecha = %s and hora = %s"
        )
        print (now.strftime('%Y,%m,%d')+" "+str(hora))
        cursor.execute(consulta,(now.strftime('%Y-%m-%d'),str(hora)))
        datos1 = cursor.fetchall()
        average=0
        if datos1:
            columnas = [column[0] for column in cursor.description]
            primera_fila = datos1[0]
            valores = dict(zip(columnas, primera_fila))

        for valor in valores:
            average=average+valores["prediccion"]
        average=average/len(valores)
        average=round(average)
        data["average"+str(i+1)]=average
        data["fecha"+str(i+1)]=now.strftime('%Y-%m-%d')
        data["hora"+str(i+1)]=horaActual


    return JsonResponse(data)


