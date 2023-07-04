from django.http import HttpResponse, JsonResponse
import psycopg2
import requests
from datetime import datetime, timedelta
import pytz
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

def apiBridge(request):
    fecha = request.GET.get('fecha')
    hora = request.GET.get('hora')
    minuto = request.GET.get('minuto')
    direccion = request.GET.get('direccion')
    humedad = request.GET.get('humedad')
    lluvia = request.GET.get('lluvia')
    luz = request.GET.get('luz')
    presion = request.GET.get('presion')
    temperatura = request.GET.get('temperatura')
    velocidad = request.GET.get('velocidad')
    return HttpResponse('Param1: {}, Param2: {}'.format(fecha, hora))

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
