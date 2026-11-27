# สรุปการทำงานของระบบ ESP32 (Pulse Dent 02)

เอกสารนี้สรุปการทำงานของเฟิร์มแวร์ ESP32 ในไฟล์ [`src/main.cpp`](src/main.cpp), การตั้งค่าโปรเจกต์ใน [`platformio.ini`](platformio.ini) และโครงสร้าง Firebase Realtime Database สำหรับระบบควบคุม Toggle Start/Stop

---

## 1. ภาพรวมของระบบ (System Overview)

บอร์ด **ESP32 (esp32dev)** ใช้ **เฟิร์มแวร์ชุดเดียวกัน (`src/main.cpp`)** สำหรับทั้ง 2 โมดูลเซ็นเซอร์ โดยเลือกโหมดผ่านค่า `#define SENSOR_MODE` (หรือเลือก Environment ใน `platformio.ini`):
- **`SENSOR_MODE = 1` (Temperature Module):**
  - `DEVICE_ID = "pulse-dent-01"`, `SENSOR_TYPE = "temperature"`, Wi-Fi AP: `PulseDent-Temp-Setup`
  - จำลองอุณหภูมิ `36.0 – 39.0 °C` (ขยับทีละ `±0.2 °C`)
- **`SENSOR_MODE = 2` (Pulse Module):**
  - `DEVICE_ID = "pulse-dent-02"`, `SENSOR_TYPE = "pulse"`, Wi-Fi AP: `PulseDent-Pulse-Setup`
  - จำลองสัญญาณชีพจร `60 – 90 bpm` (ขยับทีละ `±2 bpm`)

แต่ละบอร์ดเชื่อมต่อ Wi-Fi ด้วย **WiFiManager** และทำงานในระบบควบคุมการวัดแบบ **Toggle Start/Stop ได้ 2 ช่องทาง (Two-Way Control)** ทั้งจาก **ปุ่มกดจริงบนบอร์ด ESP32 (Push Button Module ที่ GPIO 18)** และจาก **ปุ่มบนหน้า Web App** ผ่าน **Firebase Realtime Database**:
- **การต่อสาย Push Button Module แบบ 3 ขา (Active LOW):**
  - `S` (Signal) $\rightarrow$ **GPIO 18** (`pinMode(18, INPUT_PULLUP)`)
  - `+` (VCC) $\rightarrow$ **3V3**
  - `-` (GND) $\rightarrow$ **GND**
  - ใช้ระบบ **Hardware Interrupt (`attachInterrupt` แบบ `FALLING` edge)** ร่วมกับ **Digital Debounce 50 ms** และตัวล็อกกันสัญญาณกระเพื่อมระดับ Interrupt (`ISR_LOCKOUT_MS = 200 ms`) ด้วย `millis()` ล้วน (ไม่มีการใช้ `delay()` ในโค้ด) ทำให้ตรวจจับการกดปุ่มได้ทันทีแม้บอร์ดกำลังส่งข้อมูลผ่าน HTTPS ไปยัง Firebase
- เมื่อเปิดเครื่องหรือเชื่อมต่อ Wi-Fi ใหม่ บอร์ดจะเริ่มต้นในโหมด **Standby (`isMeasuring = false`)** และรีเซ็ตคำสั่งใน Firebase (`control/command = "stop"`, `state/measuring = false`) เพื่อป้องกันคำสั่ง `start` เก่าที่ค้างอยู่ทำให้เริ่มวัดเอง
- ใช้ `millis()` แทน `delay()` ในการแบ่งรอบทำงานแบบ Non-blocking:
  1. **ตรวจจับการกดปุ่ม GPIO 18 (`onButtonFallingISR` + `handlePhysicalButton`)** ตลอดเวลาด้วย Hardware Interrupt และ Debounce 50 ms เมื่อกดปุ่มจะสลับสถานะ Start/Stop ทันที และซิงก์ทั้ง `control/command` และ `state/measuring` ขึ้น Firebase เพื่อให้หน้า Web App อัปเดตตรงกัน
  2. **อ่านคำสั่ง (`control/command`)** จาก Firebase ทุก **1 วินาที** เพื่อรับคำสั่งกรณีผู้ใช้กดปุ่มจากหน้า Web App
  3. **จำลองและส่งค่าเซ็นเซอร์ (`latest`)** ทุก **1 วินาที** เฉพาะเมื่อ `isMeasuring = true` เท่านั้น
  4. **ส่ง Heartbeat (`state/lastSeen`, `state/sensorType` และ `state/measuring`)** ทุก **3 วินาที** อย่างต่อเนื่องทั้งในโหมด Standby และ Measuring เพื่อให้ Web App ตรวจสอบสถานะ Online/Offline และชนิดเซ็นเซอร์ได้ตลอดเวลา

---

## 2. โครงสร้างข้อมูลใน Firebase Realtime Database

```text
devices/
├── pulse-dent-01/                   # Mode 1: Temperature Sensor
│   ├── control/
│   │   └── command: "stop" | "start"
│   ├── state/
│   │   ├── measuring: false | true
│   │   ├── sensorType: "temperature"
│   │   └── lastSeen: timestamp
│   └── latest/
│       ├── sensorType: "temperature"
│       ├── temperature: 36.0
│       ├── unit: "C"
│       ├── status: "online"
│       └── timestamp: timestamp
└── pulse-dent-02/                   # Mode 2: Pulse Sensor
    ├── control/
    │   └── command: "stop" | "start"
    ├── state/
    │   ├── measuring: false | true
    │   ├── sensorType: "pulse"
    │   └── lastSeen: timestamp
    └── latest/
        ├── sensorType: "pulse"
        ├── pulse: 72
        ├── unit: "bpm"
        ├── status: "online"
        └── timestamp: timestamp
```

- **Web App** เขียนคำสั่ง `"start"` หรือ `"stop"` ไปที่ `control/command`
- **ESP32** อ่าน `control/command` แล้วอัปเดตสถานะจริงกลับไปที่ `state/measuring` ทันที
- **ESP32** อัปเดต `latest/temperature` เฉพาะขณะที่ `isMeasuring == true`
- ดูโครงสร้างเริ่มต้นได้ที่ [`data/firebase_initial.json`](data/firebase_initial.json) และกฎความปลอดภัยได้ที่ [`data/firebase_rules.json`](data/firebase_rules.json)

---

## 3. แผนผังลำดับการทำงาน (Workflow Diagram)

```mermaid
flowchart TD
    A["เปิดเครื่อง ESP32 (setup)"] --> B["เริ่ม Serial Monitor (115200 baud) + ตั้งค่า GPIO 18 (INPUT_PULLUP + attachInterrupt FALLING)"]
    B --> C["WiFiManager เชื่อมต่อ Wi-Fi เดิม (Timeout 15s) หรือเปิด AP PulseDent-Setup"]
    C -->|เชื่อมต่อสำเร็จ| D["ตั้งค่าเริ่มต้น Standby: เขียน control/command = 'stop' และ state/measuring = false"]
    C -->|หมดเวลา 180s| E["รันต่อและพยายาม Reconnect อัตโนมัติทุก 5 วินาที"]
    D --> F["เข้าสู่การทำงานหลัก (loop ด้วย millis)"]
    E --> F
    F --> P["ตรวจจับปุ่มกด GPIO 18 (Hardware Interrupt ISR + Debounce 50ms)"]
    P -->|กดปุ่ม (Falling Edge)| Q["สลับสถานะ Start/Stop + ซิงก์ control/command และ state/measuring ขึ้น Firebase"]
    F --> G["ทุก 1 วินาที: อ่าน control/command จาก Firebase"]
    G -->|รับคำสั่ง 'start'| H["isMeasuring = true + ยืนยัน state/measuring = true + ส่งอุณหภูมิทันที"]
    G -->|รับคำสั่ง 'stop'| I["isMeasuring = false + ยืนยัน state/measuring = false + หยุดส่งอุณหภูมิทันที"]
    F --> J{"isMeasuring == true และครบ 1 วินาที?"}
    J -->|ใช่| K["จำลองอุณหภูมิ 36.0-39.0 °C (±0.2 °C) และ PUT ไปยัง latest.json"]
    J -->|ไม่ใช่| L["คงสถานะ Standby (ไม่จำลองและไม่ส่งอุณหภูมิ)"]
    F --> M["ทุก 3 วินาที: ส่ง Heartbeat (state/measuring และ state/lastSeen)"]
```


---

## 4. รายละเอียดการทำงานแต่ละส่วน

### 4.1 การตั้งค่าเริ่มต้นและการเชื่อมต่อ Wi-Fi (`setup()`)
1. เริ่มต้นพอร์ตสื่อสาร `Serial` ที่ความเร็ว **115200 baud**
2. ตั้งค่าขาปุ่มกด **GPIO 18** เป็น `INPUT_PULLUP` พร้อมผูก **Hardware Interrupt** (`attachInterrupt(digitalPinToInterrupt(18), onButtonFallingISR, FALLING)`) เพื่อดักจับจังหวะกดปุ่มในระดับฮาร์ดแวร์ได้ตลอดเวลา
3. เรียกใช้ไลบรารี `WiFiManager`:
   - **พยายามเชื่อมต่อ Wi-Fi เดิมอัตโนมัติ** เป็นเวลาสูงสุด **15 วินาที** (`wm.setConnectTimeout(15)`)
   - **หากเชื่อมต่อไม่ได้** บอร์ดจะปล่อยสัญญาณ Wi-Fi Access Point:
     - **ชื่อ Wi-Fi (SSID):** `PulseDent-Setup`
     - **รหัสผ่าน:** `pulsedent02`
     - **เวลาจำกัดในการตั้งค่า:** **180 วินาที (3 นาที)** (`wm.setConfigPortalTimeout(180)`)
   - หากเชื่อมต่อสำเร็จ จะแสดงชื่อ Wi-Fi (`SSID`) และ `IP Address` ออกทาง Serial Monitor
   - หากครบ 3 นาทีแล้วยังไม่ได้ตั้งค่า บอร์ดจะแสดง `Running offline (will auto-reconnect in background)...` และทำงานต่อใน `loop()` โดยไม่ค้าง

### 4.2 ระบบตรวจจับการกดปุ่มจริงบนบอร์ด (`onButtonFallingISR()` และ `handlePhysicalButton()`)
- **Hardware Interrupt (`IRAM_ATTR onButtonFallingISR`)**: ทำงานในหน่วยความจำ IRAM ทันทีที่แรงดันที่ขา GPIO 18 ตกจาก `HIGH` เป็น `LOW` (`FALLING` edge) แม้ในขณะนั้นบอร์ดจะกำลังรอ HTTPS Response จาก Firebase อยู่ พร้อมตัวล็อกกันสัญญาณกระเพื่อมเบื้องต้น (`ISR_LOCKOUT_MS = 200 ms`)
- **Digital Debounce & State Sync (`handlePhysicalButton`)**: ตรวจสอบทั้งแฟล็ก `buttonInterruptPending` จาก Interrupt และการอ่านค่า `digitalRead(18)` แบบ Debounce `50 ms` ร่วมกัน เมื่อตรวจพบการกดปุ่มจะเรียก `applyMeasurementState(!isMeasuring, true)` เพื่อสลับสถานะ Start/Stop และอัปเดตทั้ง `control/command` และ `state/measuring` บน Firebase ทันที

### 4.3 การจำลองค่าเซ็นเซอร์ (`simulateNextSensorValue()`)
- **Mode 1 (Temperature):** เริ่มต้นที่ `36.0 °C` เพิ่มทีละ `+0.2 °C` จนถึง `39.0 °C` แล้วลดลงทีละ `-0.2 °C` วนไปเรื่อย ๆ
- **Mode 2 (Pulse):** เริ่มต้นที่ `72 bpm` เพิ่มทีละ `+2 bpm` จนถึง `90 bpm` แล้วลดลงทีละ `-2 bpm` จนถึง `60 bpm` วนไปเรื่อย ๆ

### 4.4 การส่งข้อมูลไปยัง Firebase (`sendSensorData()`)
เมื่อ Wi-Fi เชื่อมต่ออยู่ (`WL_CONNECTED`) บอร์ดจะส่งข้อมูลผ่าน HTTPS (`WiFiClientSecure` + `HTTPClient`):
- **Method:** `HTTP PUT` (เขียนทับข้อมูลล่าสุดที่ตำแหน่งเดิม ไม่สร้างรายการซ้ำ)
- **Database URL:** `https://pulsedent-02-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Target Path:** `/devices/<DEVICE_ID>/latest.json` (`pulse-dent-01` สำหรับ Mode 1 หรือ `pulse-dent-02` สำหรับ Mode 2)
- **รูปแบบ JSON ที่ส่ง (Mode 1 — Temperature):**
  ```json
  {
    "sensorType": "temperature",
    "temperature": 36.20,
    "unit": "C",
    "status": "online",
    "timestamp": {".sv": "timestamp"}
  }
  ```
- **รูปแบบ JSON ที่ส่ง (Mode 2 — Pulse):**
  ```json
  {
    "sensorType": "pulse",
    "pulse": 74,
    "unit": "bpm",
    "status": "online",
    "timestamp": {".sv": "timestamp"}
  }
  ```
  *(หมายเหตุ: `{".sv": "timestamp"}` คือคำสั่งให้เซิร์ฟเวอร์ Firebase ประทับเวลาปัจจุบันแบบ Unix epoch milliseconds ให้อัตโนมัติ)*

---

## 5. ตัวอย่างผลลัพธ์ทาง Serial Monitor

เมื่อเชื่อมต่อ Wi-Fi และส่งข้อมูลเข้า Firebase สำเร็จ (`HTTP status: 200`):

```text
Pulse Dent 02
Physical Button configured on GPIO 18 (INPUT_PULLUP + Hardware Interrupt FALLING, Debounce 50 ms)
Starting WiFi Manager...
WiFi Connected!
SSID: Your_WiFi_Name
IP: 192.168.1.105
Initializing device state to Standby (stop)...
Standby initialized on Firebase (measuring: false, command: stop)
>>> [GPIO 18 Button] Measurement state changed to: MEASURING (START)
Send temperature (36.00 C) -> OK
Send temperature (36.20 C) -> OK
Heartbeat sent [mode: Measuring]
```

### ความหมายของรหัส `Firebase HTTP status`:
| รหัส (HTTP Code) | ความหมาย |
| :--- | :--- |
| **`200`** | ส่งและบันทึกข้อมูลลง Firebase สำเร็จ |
| **`400`** | รูปแบบ JSON หรือ URL ไม่ถูกต้อง |
| **`401` / `403`** | ติดสิทธิ์การเข้าถึง (ต้องตรวจสอบแท็บ **Rules** ใน Firebase Realtime Database) |
| **`-1` หรือค่าติดลบ** | เชื่อมต่ออินเทอร์เน็ตหรือเซิร์ฟเวอร์ Firebase ไม่ได้ |

---

## 6. โครงสร้างไฟล์และไลบรารีที่ใช้

- **[`platformio.ini`](platformio.ini)**
  - Board: `esp32dev` (Espressif 32, Arduino Framework)
  - Library: `tzapu/WiFiManager @ ^2.0.17`
  - Built-in Libraries: `WiFi.h`, `HTTPClient.h`, `WiFiClientSecure.h`
- **[`src/main.cpp`](src/main.cpp)** — โค้ดหลักของเฟิร์มแวร์ ESP32
- **[`data/firebase_initial.json`](data/firebase_initial.json)** — ไฟล์โครงสร้าง JSON เริ่มต้นสำหรับ Import เข้า Firebase
- **[`data/firebase_rules.json`](data/firebase_rules.json)** — กฎความปลอดภัย (Security Rules) สำหรับ Firebase Realtime Database
