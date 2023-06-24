import requests
import datetime
import mysql.connector

def conectar_bd():
    cnx = mysql.connector.connect(user='root', password='',
                                  host='localhost', database='clima')
    return cnx


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

if response.status_code == 200:
    data = response.json()
    conexion = conectar_bd()
    cursor = conexion.cursor()

    for item in data:
        timestamp = item['ts'] / 1000  # Convertir de milisegundos a segundos
        fecha_hora = datetime.datetime.fromtimestamp(timestamp)
        formato = "%Y-%m-%d %H:%M:%S"
        fecha_hora_formateada = fecha_hora.strftime(formato)
        item['ts'] = fecha_hora_formateada
        timestamp = item['ts']

        # Separar la cadena en fecha y hora
        fecha, hora = timestamp.split()

        # Separar la hora en hora, minuto y segundo
        hora, minuto, segundo = hora.split(':')

        validation_query= "SELECT * FROM tesjo where fecha=%s and hora=%s and minuto=%s"
        cursor.execute(validation_query,(fecha,hora,minuto))
        datos = cursor.fetchall()

        if len(datos)==0:
            insert_query = "INSERT INTO tesjo VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(insert_query, (fecha,hora,minuto,item['val']['DIRECCION'],item['val']['HUMEDAD'],
                                        item['val']['LLUVIA'],item['val']['LUZ'],item['val']['PRESION'],
                                        item['val']['TEMPERATURA'],item['val']['VELOCIDAD']))
            print("Se inserto un nuevo registro con el tiempo: "+fecha+" "+hora+":"+minuto)
             # Confirmar los cambios en la base de datos
            conexion.commit()

    # Cerrar cursor y conexión
    cursor.close()
    conexion.close()
    # Manejar los datos de respuesta según sea necesario
else:
    print('Error al obtener los datos:', response.text)
