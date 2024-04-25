#include <HTTPClient.h>
#include "DHTesp.h"

int pinDHT = 4;
DHTesp dht;

void setup() {
  Serial.begin(115200);
  dht.setup(pinDHT, DHTesp::DHT11);

  WiFi.begin("F_Villamizar", "Movistar2024");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a la red Wi-Fi...");
  }

  Serial.println("Conectado a la red Wi-Fi");
}

void loop() {
  TempAndHumidity data = dht.getTempAndHumidity();

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("https://flv82qmr-3000.use.devtunnels.ms/sensorData/esp32");
    http.addHeader("Content-Type", "application/json");

  String jsonData = "{\"temperature\":" + String(data.temperature, 2) + ",\"ambient\":" + String(data.humidity, 1) + ",\"place\":\"cascada\"}";

   int httpResponseCode = http.POST(jsonData);
if (httpResponseCode > 0) {
  String response = http.getString();
  Serial.println("Respuesta del servidor: " + response);
} else {
  Serial.print("Error en la solicitud al servidor: ");
  Serial.println(httpResponseCode);
}

    http.end();
    
  }

  delay(2000);
}