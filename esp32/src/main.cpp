#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// เปลี่ยนเป็น Realtime Database URL จริงของโปรเจกต์คุณ (ไม่ต้องมี / ปิดท้าย)
const char* DATABASE_URL = "https://pulsedent-02-default-rtdb.asia-southeast1.firebasedatabase.app";

// Temperature Simulation
float temperature = 36.0;
float step = 0.2;

// Wi-Fi Manager
WiFiManager wm;

void sendTemperature(float temp) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected: skip upload");
        return;
    }

    WiFiClientSecure client;
    client.setInsecure(); // สำหรับโหมดทดลอง (ข้ามการตรวจ Certificate)

    HTTPClient http;
    String url = String(DATABASE_URL) + "/devices/pulse-dent-01/latest.json";

    if (!http.begin(client, url)) {
        Serial.println("HTTPS initialization failed");
        return;
    }

    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"temperature\":" + String(temp, 2);
    json += ",\"unit\":\"C\"";
    json += ",\"status\":\"online\"";
    json += ",\"timestamp\":{\".sv\":\"timestamp\"}";
    json += "}";

    int httpCode = http.PUT(json);
    Serial.print("Firebase HTTP status: ");
    Serial.println(httpCode);

    http.end();
}

void setup() {
    Serial.begin(115200);
    delay(1000);

    Serial.println("Pulse Dent 02");
    Serial.println("Starting WiFi Manager...");

    // จำกัดเวลาพยายามเชื่อมต่อ Wi-Fi เดิม
    wm.setConnectTimeout(15);

    // เปิดหน้า Setup เมื่อเชื่อมต่อไม่ได้
    wm.setConfigPortalTimeout(180);

    bool connected = wm.autoConnect(
        "PulseDent-Setup",
        "pulsedent02"
    );

    if (connected) {
        Serial.println("WiFi Connected!");
        Serial.print("SSID: ");
        Serial.println(WiFi.SSID());
        Serial.print("IP: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println("WiFi setup timed out");
        Serial.println("Running offline...");
    }
}

void loop() {

    // จำลองอุณหภูมิ
    temperature += step;

    if (temperature >= 39.0) {
        temperature = 39.0;
        step = -0.2;
    }

    if (temperature <= 36.0) {
        temperature = 36.0;
        step = 0.2;
    }

    // แสดงข้อมูลอุณหภูมิ
    Serial.print("Temperature: ");
    Serial.print(temperature, 2);
    Serial.println(" C");

    // แสดงสถานะ Wi-Fi และส่งข้อมูลขึ้น Firebase
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi: Connected");
        sendTemperature(temperature);
    } else {
        Serial.println("WiFi: Disconnected");
    }

    Serial.println("----------------");

    delay(1000);
}
