#include <SoftwareSerial.h>
#include <ThingerESP8266.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// Crear variables para Software en serie Rx=D6/GPIO12, Tx=D7/GPIO13
SoftwareSerial DataSerial(12, 13);

// Retardo en milisegundos
unsigned long previousMillis = 0;
const long interval = 3000;

// Variables de matriz para el analisis de datos (Cantidad de sensores)
String arrData[7];

// Configuración de ThingerIO
#define USERNAME "Rubes"
#define DEVICE_ID "EMA_TesJo"
#define DEVICE_CREDENTIAL "pxj&ODk0$ix9"

// Variable PIN LED
#define LED_PIN 4 // PIN D2=GPIO4

// Variable para ThingerIO
ThingerESP8266 thing(USERNAME, DEVICE_ID, DEVICE_CREDENTIAL);

// Configuración de WiFi
//const char *ssid = "HONOR 20";
//const char *password = "1234567890";
const char *ssid = "SULY";
const char *password = "albin1517";
String serverName = "http://tesjo-appsidal.000webhostapp.com/weather/save.php";

// Proporcionar una variable para contener los valores para enviarlos a Thinger IO
int TEMPERATURA;
int HUMEDAD;
int PRESION;
int LUZ;
int VELOCIDAD;
int DIRECCION;
int LLUVIA;

void setup()
{
  Serial.begin(9600);
  DataSerial.begin(9600);
  pinMode(LED_PIN, OUTPUT);

  // Conexion a WiFi
  WiFi.begin(ssid, password);
  // Verificar la Conexion
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    digitalWrite(LED_PIN, LOW);
  }
  // Si esta conectado
  digitalWrite(LED_PIN, HIGH);
  // Conectar nodeMCU con ThingerIO
  thing.add_wifi(ssid, password);

  // Datos a enviar
  thing["Datos"] >> [](pson &out)
  {
    out["TEMPERATURA"] = TEMPERATURA;
    out["HUMEDAD"] = HUMEDAD;
    out["PRESION"] = PRESION;
    out["LUZ"] = LUZ;
    out["VELOCIDAD"] = VELOCIDAD;
    out["DIRECCION"] = DIRECCION;
    out["LLUVIA"] = LLUVIA;
  };
}

void loop()
{
  // Configuracion millis
  unsigned long currentMillis = millis(); // Leer milisegundos actuales
  if (currentMillis - previousMillis >= interval)
  {
    // Actualizar milisegundos previos
    previousMillis = currentMillis;

    // Priorizar la lectura de datos de Arduino MEGA (resultado de envio de datos)
    // Leer datos de serial
    String data = "";
    while (DataSerial.available() > 0)
    {
      data += char(DataSerial.read());
    }
    // Eliminar espacios
    data.trim();

    Serial.print(data);

    // Datos de prueba
    if (data != "")
    {
      // Formato de datos "10#29.45#89.5" = array (despues de analizar)
      // Analizar datos (datos de ruptura)
      int index = 0;
      for (int i = 0; i <= data.length(); i++)
      {
        char delimiter = '#';
        if (data[i] != delimiter)
          arrData[index] += data[i];
        else
          index++; // La variable index aumenta
      }

      // Asegurarse que los datos enviados esten completos (POT, HUM)
      if (index == 6)
      {
        // Muestra el valor del sensor en el monitor serial
        Serial.println("TEMPERATURA:  " + arrData[0]); // TEMPERATURA
        Serial.println("HUMEDAD:  " + arrData[1]);     // HUMEDAD
        Serial.println("PRESION:  " + arrData[2]);     // PRESION
        Serial.println("LUZ:  " + arrData[3]);         // LUZ
        Serial.println("VELOCIDAD:  " + arrData[4]);   // VELOCIDAD
        Serial.println("DIRECCION:  " + arrData[5]);   // DIRECCION
        Serial.println("LLUVIA:  " + arrData[6]);      // LLUVIA
      }

      // Contenido de la variable a enviar
      TEMPERATURA = arrData[0].toInt();
      HUMEDAD = arrData[1].toInt();
      PRESION = arrData[2].toInt();
      LUZ = arrData[3].toInt();
      VELOCIDAD = arrData[4].toInt();
      DIRECCION = arrData[5].toInt();
      LLUVIA = arrData[6].toInt();

      // Activar el envio de datos a ThingerIO
      thing.handle();

      arrData[0] = "";
      arrData[1] = "";
      arrData[2] = "";
      arrData[3] = "";
      arrData[4] = "";
      arrData[5] = "";
      arrData[6] = "";
    }

    // Pedir datos a Arduino Mega2560
    DataSerial.println("A");
  }

  // Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED)
  {
    WiFiClient client;
    HTTPClient http;

    String serverPath = serverName + "?TEMPERATURA="+TEMPERATURA+"&HUMEDAD="+HUMEDAD+"&PRESION="+PRESION
    +"&LUZ="+LUZ+"&VELOCIDAD="+VELOCIDAD+"&DIRECCION="+DIRECCION+"&LLUVIA="+LLUVIA;

    // Your Domain name with URL path or IP address with path
    http.begin(client, serverPath.c_str());

    // If you need Node-RED/server authentication, insert user and password below
    // http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    }
    else
    {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }

  delay(5000);
  Serial.println(arrData[23]);
  delay(1000);
}
