import requests
import datetime

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
    for item in data:
        timestamp = item['ts'] / 1000 
        fecha_hora = datetime.datetime.fromtimestamp(timestamp)
        formato = "%Y-%m-%d %H:%M:%S"
        fecha_hora_formateada = fecha_hora.strftime(formato)
        item['ts'] = fecha_hora_formateada
        timestamp = item['ts']

        fecha, hora = timestamp.split()
        fechas=fecha.split('-')
        fecha=fechas[0]+"-"+fechas[1]+"-"+fechas[2]

        hora, minuto, segundo = hora.split(':')

        url = 'https://tesjo-clima-api.onrender.com/api/apiBridge'
        payload = {'fecha': fecha, 'hora': hora,'minuto':minuto,'direccion':item['val']['DIRECCION'],'humedad':item['val']['HUMEDAD'],
                                        'lluvia':item['val']['LLUVIA'],'luz':item['val']['LUZ'],'presion':item['val']['PRESION'],
                                        'temperatura':item['val']['TEMPERATURA'],'velocidad':item['val']['VELOCIDAD']}

        response = requests.get(url, params=payload)

        if response.status_code == 200:
            data = "ingresado correctamente"
            print(data)
        else:
            print('Error:', response.status_code)


else:
    print('Error al obtener los datos:', response.text)
