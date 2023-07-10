from django.http import HttpResponse, JsonResponse
import psycopg2
import requests
from datetime import datetime, timedelta
import pytz
import json
zona = pytz.timezone("America/Mexico_City")
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
    return HttpResponse("Esta es la API para obtener datos climatologicos del TESJo <br> Developed by AppSiDaL")


def currentValues(request):
    conexion = conectar_bd()
    now = datetime.now(zona)
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
        "WHERE fecha = %s"
    )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),))
    datos2 = cursor.fetchall()

    consulta = (
        "SELECT MAX(temperatura) maxTemperatura"
        " FROM tesjo "
        "WHERE fecha = %s"
    )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),))
    datos3 = cursor.fetchall()

    consulta = (
        "SELECT AVG(temperatura) avgTemperatura"
        " FROM tesjo "
        "WHERE fecha = %s"
    )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),))
    datos4 = cursor.fetchall()
    print(datos2)
    valores["minTemperatura"] = datos2[0][0]
    valores["maxTemperatura"] = datos3[0][0]
    valores["avgTemperatura"] = round(datos4[0][0])

    response = JsonResponse(valores)

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"

    # Devolver la respuesta
    return response


def next48Values(request):
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
            average=average+valores["temperatura"]
        average=average/len(valores)
        average=round(average)
        data["average"+str(i+1)]=average
        data["fecha"+str(i+1)]=now.strftime('%Y-%m-%d')
        data["hora"+str(i+1)]=hora

    response = JsonResponse(data)

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"

    # Devolver la respuesta
    return response


def bridge(request):
    url ='https://eu-central.aws.thinger.io:443/oauth/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data='grant_type=password&username=Rubes&password=Meca.TESJo01'
    response = requests.post(url, headers=headers,data=data)
    respuesta=response.json()

    token=respuesta['access_token']
    url = 'https://eu-central.aws.thinger.io:443/v1/users/Rubes/buckets/Variables_Meteorologicas/data'
    headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer '+token
    }


    response = requests.get(url, headers=headers)
    impresion=''
    if response.status_code == 200:
        data = response.json()
        conexion = conectar_bd()
        cursor = conexion.cursor()
        for item in data:
            timestamp = item['ts'] / 1000 
            fecha_hora = datetime.fromtimestamp(timestamp)
            fecha_hora_ajustada = fecha_hora.astimezone(zona)
            formato = "%Y-%m-%d %H:%M:%S"
            fecha_hora_formateada = fecha_hora_ajustada.strftime(formato)
            item['ts'] = fecha_hora_formateada
            timestamp = item['ts']

            fecha, hora = timestamp.split()
            fechas=fecha.split('-')
            fecha=fechas[0]+"-"+fechas[1]+"-"+fechas[2]

            hora, minuto, segundo = hora.split(':')

            validation_query= "SELECT * FROM tesjo where fecha=%s and hora=%s and minuto=%s"
            cursor.execute(validation_query,(fecha,hora,minuto))
            datos = cursor.fetchall()

            if len(datos)==0:
                insert_query = "INSERT INTO tesjo VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                cursor.execute(insert_query, (fecha,hora,minuto,item['val']['DIRECCION'],item['val']['HUMEDAD'],
                                            item['val']['LLUVIA'],item['val']['LUZ'],item['val']['PRESION'],
                                            item['val']['TEMPERATURA'],item['val']['VELOCIDAD']))
                impresion+=("<br>Se inserto un nuevo registro con el tiempo: "+fecha+" "+hora+":"+minuto)
                print("Se inserto un nuevo registro con el tiempo: "+fecha+" "+hora+":"+minuto)

                conexion.commit()
            else:
                impresion+=("<br>No se inserto nada")

        cursor.close()
        conexion.close()

    else:
        print('Error al obtener los datos:', response.text)
    
    response = HttpResponse(impresion)

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"

    # Devolver la respuesta
    return response

def todayValues(request):
    conexion = conectar_bd()
    now = datetime.now(zona)
    hora=now.hour
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
    lastResponse = cursor.fetchall()
    if lastResponse:
        columnas = [column[0] for column in cursor.description]
        primera_fila = lastResponse[0]
        valores = dict(zip(columnas, primera_fila))

    tabla="tesjo"
    horaMañana=9
    horaMedio=12
    horaTarde=16
    horaNoche=20
    print(valores["hora"])
    if valores["hora"] < horaMañana:
        tabla="tabla_predicciones"
    print(tabla)        
    consulta = (
            "SELECT * FROM "+tabla+" where fecha = %s and hora = %s limit 1"
        )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),horaMañana))
    values = cursor.fetchall()
    mañanaValues={}
    if values:
        columnas = [column[0] for column in cursor.description]
        primera_fila = values[0]
        mañanaValues = dict(zip(columnas, primera_fila))
    mañanaValues["fecha"]=now.strftime('%Y-%m-%d')
#obtener los valores para la hora de medio dia
    if valores["hora"] < horaMedio:
        tabla="tabla_predicciones"
    print(tabla)        
    consulta = (
            "SELECT * FROM "+tabla+" where fecha = %s and hora = %s limit 1"
        )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),horaMedio))
    values = cursor.fetchall()
    print(cursor.mogrify(consulta,(now.strftime('%Y-%m-%d'),horaMedio)))
    medioValues={}
    if values:
        columnas = [column[0] for column in cursor.description]
        primera_fila = values[0]
        medioValues = dict(zip(columnas, primera_fila))
    medioValues["fecha"]=now.strftime('%Y-%m-%d')
#obtener los valores para la tarde
    if valores["hora"] < horaTarde:
        tabla="tabla_predicciones"
    print(tabla)        
    consulta = (
            "SELECT * FROM "+tabla+" where fecha = %s and hora = %s limit 1"
        )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),horaTarde))
    values = cursor.fetchall()
    print(cursor.mogrify(consulta,(now.strftime('%Y-%m-%d'),horaTarde)))
    tardeValues={}
    if values:
        columnas = [column[0] for column in cursor.description]
        primera_fila = values[0]
        tardeValues = dict(zip(columnas, primera_fila))
    tardeValues["fecha"]=now.strftime('%Y-%m-%d')
#obtener los valores para la noche
    if valores["hora"] < horaNoche:
        tabla="tabla_predicciones"
    print(tabla)        
    consulta = (
            "SELECT * FROM "+tabla+" where fecha = %s and hora = %s limit 1"
        )
    cursor.execute(consulta,(now.strftime('%Y-%m-%d'),horaNoche))
    values = cursor.fetchall()
    print(cursor.mogrify(consulta,(now.strftime('%Y-%m-%d'),horaNoche)))
    nocheValues={}
    if values:
        columnas = [column[0] for column in cursor.description]
        primera_fila = values[0]
        nocheValues = dict(zip(columnas, primera_fila))
    nocheValues["fecha"]=now.strftime('%Y-%m-%d')
    objetos=[mañanaValues,medioValues,tardeValues,nocheValues]
    response = JsonResponse(objetos,safe=False)

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"

    # Devolver la respuesta
    return response

def nextRains(request):    
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
        averageDireccion=0
        averageHumedad=0
        averageLluvia=0
        averageLuz=0
        averagePresion=0
        averageTemperatura=0
        averageVelocidad=0
        if datos1:
            columnas = [column[0] for column in cursor.description]
            primera_fila = datos1[0]
            valores = dict(zip(columnas, primera_fila))

        for valor in valores:
            averageDireccion=averageDireccion+valores["direccion"]
            averageHumedad=averageHumedad+valores["humedad"]
            averageLluvia=averageLluvia+valores["lluvia"]
            averageLuz=averageLuz+valores["luz"]
            averagePresion=averagePresion+valores["presion"]
            averageTemperatura=averageTemperatura+valores["temperatura"]
            averageVelocidad=averageVelocidad+valores["velocidad"]

        averageDireccion=averageDireccion/len(valores)
        averageHumedad=averageHumedad/len(valores)
        averageLluvia=averageLluvia/len(valores)
        averageLuz=averageLuz/len(valores)
        averagePresion=averagePresion/len(valores)
        averageTemperatura=averageTemperatura/len(valores)
        averageVelocidad=averageVelocidad/len(valores)
        averageDireccion=round(averageDireccion)
        averageHumedad=round(averageHumedad)
        averageLluvia=round(averageLluvia)
        averageLuz==round(averageLuz)
        averagePresion=round(averagePresion)
        averageTemperatura=round(averageTemperatura)
        averageVelocidad=round(averageVelocidad)
        probabilidad_lluvia=0
        if averageHumedad > 80:
            probabilidad_lluvia += 30

        if averageLuz < 60:
            probabilidad_lluvia += 20

        if averagePresion < 730:
            probabilidad_lluvia += 10

        if averageTemperatura < 15:
            probabilidad_lluvia += 10

        if averageVelocidad > 5:
            probabilidad_lluvia += 30

        data["fecha"+str(i+1)]=now.strftime('%Y-%m-%d')
        data["hora"+str(i+1)]=hora
        data["averageDireccion"+str(i+1)]=averageDireccion
        data["averageHumedad"+str(i+1)]=averageHumedad
        data["averageLluvia"+str(i+1)]=averageLluvia
        data["averageLuz"+str(i+1)]=averageLuz
        data["averagePresion"+str(i+1)]=averagePresion
        data["averageTemperatura"+str(i+1)]=averageTemperatura
        data["averageVelocidad"+str(i+1)]=averageVelocidad
        data["probabilidad"+str(i+1)]=probabilidad_lluvia
    response = JsonResponse(data)

    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"

    # Devolver la respuesta
    return response