# Pulse Dent 02 — ขั้นตอนเชื่อม ESP32 กับ Firebase Realtime Database

**สถานะปัจจุบัน:** ESP32 เชื่อมต่อ Wi-Fi ผ่าน WiFiManager ได้แล้ว และนำเข้า JSON เริ่มต้นใน Firebase Realtime Database แล้ว  
**เป้าหมายขั้นต่อไป:** ให้ ESP32 ส่งอุณหภูมิจำลองช่วง **36.0–39.0 °C** ไปยัง Firebase ทุก **1 วินาที** จากนั้นให้ Web App บน GitHub Pages อ่านข้อมูลแบบเรียลไทม์

> เอกสารนี้เป็นแผนการพัฒนาและตัวอย่างโค้ด **ยังไม่ใช่ Firmware ที่พร้อมใช้งานทั้งหมด** จนกว่าจะกำหนด Database URL, Firebase Authentication, กฎ Security Rules และการตรวจสอบ TLS ให้ครบ

## 1. โครงสร้างโปรเจกต์

```text
PulseDent-02/
├── firmware/
│   ├── platformio.ini
│   └── src/
│       └── main.cpp
├── web/
│   ├── index.html
│   └── js/app.js
├── data/
│   └── firebase_initial.json
└── README.md
```

ไฟล์ `firebase_initial.json` เป็นเพียงข้อมูลเริ่มต้นที่ใช้ Import เข้า Firebase ไม่ใช่ไฟล์ที่ ESP32 จะเขียนอัปเดตโดยตรง

## 2. ตรวจสอบข้อมูลใน Firebase

1. เปิด [Firebase Console](https://console.firebase.google.com/)
2. เข้าโปรเจกต์ Pulse Dent 02 → **Build → Realtime Database → Data**
3. ตรวจสอบว่ามี path ดังนี้:

```text
devices/
└── pulse-dent-01/
    └── latest/
        ├── temperature: 36.8
        ├── unit: "C"
        ├── status: "offline"
        └── timestamp: 0
```

4. คัดลอก **Realtime Database URL** ของโปรเจกต์ (ไม่ใช่ URL หน้า Firebase Console) เช่น:

```text
https://YOUR-PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app
```

> URL ข้างต้นเป็นเพียงตัวอย่าง ต้องเปลี่ยนเป็น URL จริง และไม่ต้องส่งรหัสผ่านหรือ Private Key

## 3. ออกแบบข้อมูลที่ ESP32 จะส่ง

ESP32 จะอัปเดตค่า ณ ตำแหน่ง:

```text
/devices/pulse-dent-01/latest
```

ตัวอย่าง JSON สำหรับ Firebase Realtime Database REST API:

```json
{
  "temperature": 37.2,
  "unit": "C",
  "status": "online",
  "timestamp": {".sv": "timestamp"}
}
```

- `temperature`: อุณหภูมิจำลอง
- `unit`: หน่วยเซลเซียส
- `status`: สถานะที่รายงานโดยอุปกรณ์; ไม่ควรถือว่า `online` ยืนยันว่าอุปกรณ์ยังเชื่อมต่ออยู่เสมอ
- `timestamp`: เวลาเซิร์ฟเวอร์ Firebase ณ การเขียนข้อมูล ใช้ตรวจสอบความใหม่ของข้อมูล

ใช้ HTTP `PUT` ไปยัง URL `<DATABASE_URL>/devices/pulse-dent-01/latest.json` เพื่อ **อัปเดตค่า latest เดิม** ไม่สร้างรายการเพิ่มทุกวินาที หากต้องการประวัติการวัดให้เพิ่มโครงสร้าง `history` แยกในภายหลัง

## 4. ตั้งค่าความปลอดภัยก่อนส่งข้อมูล

**อย่าเปิดสิทธิ์เขียนสาธารณะ (`.write: true`) บนฐานข้อมูลจริง** ควรดำเนินการดังนี้:

1. เปิดใช้งาน Firebase Authentication แล้วกำหนดวิธียืนยันตัวตนสำหรับต้นแบบ ESP32 (เช่น บัญชีทดสอบเฉพาะอุปกรณ์)
2. ให้ ESP32 ได้รับ **Firebase ID token** จากการลงชื่อเข้าใช้ ไม่ใช้ Firebase Admin private key ในเฟิร์มแวร์
3. กำหนด Realtime Database Security Rules ให้เฉพาะ UID ที่กำหนดเขียน path ของอุปกรณ์ได้
4. ให้ Web App อ่านเฉพาะข้อมูลที่จำเป็นด้วยสิทธิ์ที่เหมาะสม
5. ตรวจสอบใบรับรอง HTTPS/TLS บน ESP32 ไม่ใช้ `setInsecure()` สำหรับระบบใช้งานจริง
6. วางแผนการต่ออายุ ID token เพราะ token มีวันหมดอายุ

**ตัวอย่างแนวคิดของ Rules** (เปลี่ยน `DEVICE_AUTH_UID` เป็น UID จริง และปรับสิทธิ์อ่านตามการออกแบบแอป):

```json
{
  "rules": {
    "devices": {
      "pulse-dent-01": {
        "latest": {
          ".read": "auth != null",
          ".write": "auth != null && auth.uid === 'DEVICE_AUTH_UID'"
        }
      }
    }
  }
}
```

> ตัวอย่างนี้ยังไม่ได้ครอบคลุมการตรวจสอบชนิด/ช่วงข้อมูลและการแยกสิทธิ์ของผู้ใช้ Web App ควรปรับปรุงก่อนใช้จริง

## 5. ตรวจสอบ `firmware/platformio.ini`

หากใช้ ESP32 Dev Module และ WiFiManager:

```ini
[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200

lib_deps =
    tzapu/WiFiManager@^2.0.17
```

`HTTPClient.h`, `WiFiClientSecure.h`, `WiFi.h` เป็นส่วนที่มีใน Arduino framework สำหรับ ESP32 โดยทั่วไป ไม่จำเป็นต้องเพิ่มไลบรารี Firebase เพียงเพื่อใช้ REST API

## 6. เพิ่มฟังก์ชันส่งข้อมูลใน `firmware/src/main.cpp`

ให้คงระบบ WiFiManager และโค้ดจำลองอุณหภูมิเดิมไว้ แล้วเพิ่มส่วนส่งข้อมูลดังตัวอย่างต่อไปนี้

```cpp
#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// เปลี่ยนเป็น Database URL จริง (ไม่ลงท้ายด้วย /)
const char* DATABASE_URL =
    "https://YOUR-PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app";

// ตัวแปรนี้ต้องได้จากกระบวนการ Firebase Authentication จริง
String firebaseIdToken = "";

// ต้องเตรียม CA certificate ที่ถูกต้องสำหรับ HTTPS endpoint
// const char* root_ca = "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----\n";

void sendTemperature(float temperature) {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi disconnected: skip upload");
        return;
    }

    if (firebaseIdToken.isEmpty()) {
        Serial.println("Firebase ID token missing: skip upload");
        return;
    }

    WiFiClientSecure client;
    // TODO: ใส่ CA certificate ที่ตรวจสอบแล้ว
    // client.setCACert(root_ca);

    HTTPClient http;
    String url = String(DATABASE_URL)
        + "/devices/pulse-dent-01/latest.json?auth="
        + firebaseIdToken;

    if (!http.begin(client, url)) {
        Serial.println("HTTPS initialization failed");
        return;
    }

    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"temperature\":" + String(temperature, 2);
    json += ",\"unit\":\"C\"";
    json += ",\"status\":\"online\"";
    json += ",\"timestamp\":{\".sv\":\"timestamp\"}";

    int httpCode = http.PUT(json);
    Serial.print("Firebase HTTP status: ");
    Serial.println(httpCode);

    // อย่าพิมพ์ URL ที่มี auth token หรือ token ลง Serial Monitor
    http.end();
}
```

**สำคัญ:** โค้ดด้านบนเป็นเพียงฟังก์ชันตัวอย่าง ยังไม่ทำงานจนกว่าจะมี ID token ที่ถูกต้องและตั้งค่าการตรวจสอบ TLS/CA certificate ให้ครบ นอกจากนี้ต้องมี logic การลงชื่อเข้าใช้และต่ออายุ token

## 7. เรียกฟังก์ชันจาก Loop ทุก 1 วินาที

กรณีใช้ loop จำลองค่าเดิมและส่งทุก 1 วินาที:

```cpp
float temperature = 36.0;
float step = 0.2;

void loop() {
    temperature += step;

    if (temperature >= 39.0) {
        temperature = 39.0;
        step = -0.2;
    }
    if (temperature <= 36.0) {
        temperature = 36.0;
        step = 0.2;
    }

    Serial.print("Temperature: ");
    Serial.println(temperature, 2);

    sendTemperature(temperature);
    delay(1000);
}
```

> ช่วงเวลาส่งจริงอาจมากกว่า 1 วินาที เพราะ `http.PUT()` ใช้เวลาทำงาน หากต้องการรอบเวลาที่แม่นยำควรเปลี่ยนจาก `delay()` เป็นการกำหนดรอบด้วย `millis()` และแยกงานเครือข่ายไม่ให้บล็อกการจำลองค่า

## 8. ทดสอบการทำงาน

1. ตั้งค่า Firebase Authentication, Rules, TLS และ Database URL ให้เรียบร้อย
2. Build และ Upload เฟิร์มแวร์ผ่าน PlatformIO
3. เปิด Serial Monitor ที่ `115200 baud`
4. ตรวจว่ามีข้อความอุณหภูมิและ HTTP status ตอบกลับ เช่น `200` สำหรับการเขียนสำเร็จ
5. เปิด Firebase Console → Realtime Database → Data
6. ตรวจว่าค่า `devices/pulse-dent-01/latest/temperature` เปลี่ยนเป็น 36.0–39.0 °C ตามอุปกรณ์
7. ตรวจว่า `timestamp` เปลี่ยนตามการอัปเดต
8. ปิด Wi-Fi ชั่วคราว แล้วตรวจว่า ESP32 ไม่ค้าง และมีวิธีกลับมาเชื่อมต่อ/ส่งข้อมูลได้

**การแปลผล HTTP เบื้องต้น:**

| HTTP status | ความหมายเบื้องต้น |
|---|---|
| 200 | เขียนข้อมูลสำเร็จ |
| 400 | URL หรือรูปแบบคำขอไม่ถูกต้อง |
| 401 | การยืนยันตัวตนไม่ถูกต้องหรือ token หมดอายุ |
| 403 | ไม่มีสิทธิ์เข้าถึงตาม Security Rules |
| ค่าติดลบ | ปัญหาการเชื่อมต่อเครือข่ายหรือ HTTPS ที่ควรตรวจสอบเพิ่มเติม |

## 9. ขั้นตอนถัดไป: Web App

หลัง ESP32 ส่งข้อมูลได้จริงแล้ว ให้ Web App บน GitHub Pages ใช้ Firebase Web SDK ฟังการเปลี่ยนแปลงของ path:

```text
/devices/pulse-dent-01/latest
```

ด้วย `onValue()` แล้วนำค่า `temperature` มาแสดงบนหน้าเว็บ พร้อมใช้ `timestamp` ประเมินว่าข้อมูลยังสดใหม่หรือไม่ ก่อนติดป้ายสถานะออนไลน์

## Checklist

- [x] ESP32 สร้างค่าอุณหภูมิจำลอง 36.0–39.0 °C
- [x] ESP32 เชื่อมต่อ Wi-Fi ได้
- [x] Import JSON เริ่มต้นเข้า Firebase แล้ว
- [ ] จด Database URL จริง
- [ ] กำหนด Authentication สำหรับ ESP32
- [ ] ตั้งค่า Security Rules ที่จำกัดการเขียน
- [ ] กำหนด TLS CA certificate และการต่ออายุ token
- [ ] เพิ่มโค้ดส่งข้อมูลใน `main.cpp`
- [ ] Upload และตรวจ HTTP status
- [ ] ตรวจค่า Realtime Database เปลี่ยนทุกวินาที
- [ ] เชื่อม Web App บน GitHub Pages

## เอกสารอ้างอิง

- [Firebase Realtime Database REST API](https://firebase.google.com/docs/database/rest/start)
- [Firebase Realtime Database Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Authentication REST API](https://firebase.google.com/docs/reference/rest/auth)
- [WiFiManager](https://github.com/tzapu/WiFiManager)
