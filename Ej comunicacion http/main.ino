//Final

//Codigo Comunicacion bidireccional Usando ESP8266 y Servidor LOCAL.
//AppSiDaL

//Incluimos cabeceras necesarias WIFI permite conectarse a una red inalambrica.
//DHT es el encabezado para el sensor de humedad y temperatura.
//HTTPCLient permite usar el ESP8266 en modo cliente
//WebServer permite leer datos de una pagina web usando el metodo get en este ejemplo.
#include <ESP8266WiFi.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>

//Variables para la conexion a wifi ssid y pass
const char* ssid = "VAMSI INALAMBRICO 7121647128";
const char* password = "@TR87M55aaX4";
//Direcciones a conectarse, en este caso como es local se refiere a la direccion ip de nuestro ordenador con XAMPP.
//Usamos dos debido a que uno recibe mientras otro envia.
const char* host1= "http://192.168.0.105:8080/prueba2/Getstatus.php";
const char* host= "192.168.0.105";
//Inicializamos http de tipo HTTPClient.
 HTTPClient http;
 //Variables para el modulo DHT, usamos el GPIO 0 del microcontrolador.
 //El GPIO 0 de igual forma permite usar el microcontrolador en bootloader, para grabar programas en memoria flash.
#define DHTTYPE DHT11
#define DHTPIN 0
DHT dht(DHTPIN,DHTTYPE, 27);

//Variables para humedad y temperatura de tipo flotante.
float temperatura;
float humedad;
void setup() {
//Esta parte del programa se ejecuta una vez y permite configurar el microcontrolador.
//Iniciamos el serial en 115200 baudios.
Serial.begin(115200);
//De igual forma el sensor dht usando la cabecera incluida previamente.
dht.begin();
//GPIO 2 en modo output.
  pinMode(2,OUTPUT);
  Serial.println();
//Nos conectamos a la red WIFI.
  Serial.printf("Connecting to %s ", ssid);
  WiFi.begin(ssid, password);
//Mientras el estado de nuestro wifi es distinto a conectado.
  while (WiFi.status() != WL_CONNECTED)
  {
//Esperamos medio segundo e imprimimos "."
    delay(500);
    Serial.print(".");
  }
//Una vez conectado lo indicamos e imprimimos la direccion IP de nuestro microcontrolador.
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
//Esta parte del programa se ejecuta continuamente.
//Iniciamos la variable de tipo HTTPClient con el host indicado, en este caso es la direccion completa con
//el puerto preindicado y las direccion del archivo que va a imprimir el status del LED.
  http.begin(host1);
//Esta variable permite saber el estado de la conexion con el host, para que funcione correctamente
//esta variable deberia devolver 200.
  int httpCode=http.GET();
      Serial.println(httpCode);
//La variable payload obtiene continuamente el cuerpo de la pagina usando el metodo get.
  String payload=http.getString();
  Serial.print(payload);
//Si la string payload es igual a "1"
  if(payload == "1")
  {
//Definimos el GPIO 2 en HIGH o prendido
    digitalWrite(2,HIGH);
    Serial.println("Led encendido");
    }
//Si no lo apagamos
   else if (payload == "0")
   {
    digitalWrite(2,LOW);
    }
Esperamos medio segundo y finalizamos la conexion HTTP
  delay(500);
   http.end();
//Wifi Client para el envio de variables
WiFiClient client;
//Nos conectamos esta vez a la direccion ip del ordenador
  Serial.printf("\n[Connecting to %s ... ", host);
  //Usamos la direccion ip mas el puerto, en mi caso es el 8080, pero normalmente es el 80
  if (client.connect(host, 8080))
  {
//Si esta conectado hacemos la lectura de la humedad y temperatura usando la cabecera dht.
    Serial.println("connected]");
temperatura =dht.readTemperature();
humedad=dht.readHumidity();
//Enviamos una peticion HTML usando el metodo get para mandar las variables en el encabezado de la pagina
    Serial.println("[Sending a request]");
//En esta misma peticion especificamos la ruta de nuestro servidor y finalmente cerramos la conexion.
    client.print(String("GET /pruebas_local/?Temp=") + temperatura + "&Hum="+humedad+ " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n" +
                 "\r\n"
                );

    Serial.println("[Response:]");
//Esto permite leer el cuerpo de la pagina HTML para revisar que tipos de datos se estan enviando
    while (client.connected())
    {
      // Si existen datos disponibles
      if (client.available())
      {
        String line = client.readStringUntil('\n');
        Serial.println(line);
      }
    }
    // Una vez el servidor envia todos los datos requeridos se desconecta y el programa continua
    client.stop();
    Serial.println("\n[Disconnected]");
  }
  else
  {
    Serial.println("connection failed!]");
    client.stop();
  }
  delay(5000);
}
