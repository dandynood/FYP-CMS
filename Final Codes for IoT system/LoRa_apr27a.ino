 #include <SPI.h>
#include <LoRa.h>
#include <dht.h>
#include <Wire.h>
#include <BH1750.h>
#include "DHT.h"
#define dht_apin0 A0 
#define dht_apin1 A1// Analog Pin sensor is connected to

BH1750 lightMeter;
dht DHT, DHT2;

#define A_INDEX (int)'A'
#define MAX_NODE 99
#define MAX_FIELD (int) 'J' - A_INDEX
#define MAX_VALUE 99999

#define MY_NODE 01

unsigned long myValue[20];

#define LoRa_CS 10

char myPacket[15];
unsigned int nodeCnt=0;
unsigned int nodeField=0;
unsigned long nodeValue=0;
unsigned long checksum=0;
unsigned int avg_humidity=0;
unsigned int avg_temperature=0;
unsigned long avg_soilMoisture=0;


void setup() {
  pinMode(LoRa_CS, OUTPUT);
  Serial.begin(115200);
  while (!Serial);
  digitalWrite(LoRa_CS,HIGH);

  Serial.println("LoRa Sender");

  LoRa.setSPIFrequency(480000);
  if(!LoRa.begin(915E6)){
    Serial.println("Starting LoRa failed!");
    while(1);
    }

  LoRa.setSpreadingFactor(12);
  LoRa.setSignalBandwidth(250E3);
}

void sendMessage(char nodeField, unsigned long nodeValue)
{
    sprintf(myPacket, "N69%c%05u",(int)nodeField,nodeValue);

    checksum=0;
    for(int i=0;i<9;i++)
    {
     checksum+=myPacket[i]; 
    }
    checksum=checksum%10;
    checksum=checksum+(int)'a';

    sprintf(myPacket,"%s%c",myPacket,checksum);

    Serial.print("Sending packet: ");
    Serial.println(myPacket);

    
    //send packet
    LoRa.beginPacket();
    LoRa.print(myPacket);
    LoRa.endPacket();
}

void loop() {

    DHT.read11(dht_apin0);
    
    
    Serial.print("Current humidity 1 = ");
    Serial.print(DHT.humidity);
    Serial.print("%  ");
    Serial.print("temperature 1 = ");
    Serial.print(DHT.temperature); 
    Serial.println("C  ");
    
    DHT2.read11(dht_apin1);
    Serial.print("Current humidity 2 = ");
    Serial.print(DHT2.humidity);
    Serial.print("%  ");
    Serial.print("temperature 2 = ");
    Serial.print(DHT2.temperature); 
    Serial.println("C  ");

    
    avg_humidity = (DHT.humidity + DHT2.humidity)/2;
    Serial.print("Average hum = ");
    Serial.print(avg_humidity);
    Serial.println("%  ");

    avg_temperature = (DHT.temperature + DHT2.temperature)/2;
    Serial.print("Average temp = ");
    Serial.print(avg_temperature);
    Serial.println("C  ");

    //Fastest should be once every two seconds.
    
    // read the input on analog pin 0:
    int  Moisture_value_1 = analogRead(A2);
    // print out the value you read:
    Serial.print("Soil Moisture 1: ");
    Serial.println(Moisture_value_1);

    // read the input on analog pin 0:
    int Moisture_value_2= analogRead(A3);
    // print out the value you read:
    Serial.print("Soil Moisture 2: ");
    Serial.println( Moisture_value_2);

    avg_soilMoisture = (Moisture_value_1 + Moisture_value_2)/2;
    Serial.print("Avg Soil Moisture: ");
    Serial.println(avg_soilMoisture);
    avg_soilMoisture = (1023 - avg_soilMoisture)*100/1023;
    Serial.print("Avg Soil Moisture in %: ");
    Serial.print(avg_soilMoisture);
    Serial.println("%  ");

    Wire.begin();
    lightMeter.begin();
    uint16_t lux = lightMeter.readLightLevel();
    Serial.print("Light: ");
    Serial.print(lux);
    Serial.println(" lx");

    myValue[(int)'A'- A_INDEX]=12345;
    myValue[(int)'B'- A_INDEX]=12345;
    myValue[(int)'C'- A_INDEX]=12345;
    myValue[(int)'D'- A_INDEX]=12345;
    myValue[(int)'E'- A_INDEX]=12345;
    myValue[(int)'F'- A_INDEX]=12345;
    myValue[(int)'G'- A_INDEX]=12345;
    myValue[(int)'H'- A_INDEX]=12345;
    myValue[(int)'I'- A_INDEX]=12345;
    myValue[(int)'J'- A_INDEX]=12345;
    

    sendMessage('A',avg_temperature);
    delay(2000);
    sendMessage('C',avg_humidity);   
    delay(2000);
    sendMessage('E',avg_soilMoisture);
    delay(2000);
    sendMessage('I',lux);
    delay(2000);

    sendMessage('A',avg_temperature);
    delay(2000);
    sendMessage('C',avg_humidity);   
    delay(2000);
    sendMessage('E',avg_soilMoisture);
    delay(2000);
    sendMessage('I',lux);
    delay(2000);


    sendMessage('A',avg_temperature);
    delay(2000);
    sendMessage('C',avg_humidity);   
    delay(2000);
    sendMessage('E',avg_soilMoisture);
    delay(2000);
    sendMessage('I',lux);
    
    delay(2000);

    delay(60000);
    delay(60000);
    delay(60000);    
    delay(60000);
    delay(30000);
    
}
