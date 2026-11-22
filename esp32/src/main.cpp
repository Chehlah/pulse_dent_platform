#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// เปลี่ยนเป็น Realtime Database URL จริงของโปรเจกต์คุณ (ไม่ต้องมี / ปิดท้าย)
const char* DATABASE_URL = "https://pulsedent-02-default-rtdb.asia-southeast1.firebasedatabase.app";
const char* DEVICE_ID = "pulse-dent-01";

// หากเปิดใช้ Firebase Authentication ให้กำหนด ID Token ที่ได้รับจากการล็อกอินที่นี่ (ห้ามฝัง Admin Secret ในโค้ด)
String firebaseIdToken = "";

// ตั้งค่า Push Button Module แบบ 3 ขา (Active LOW: S -> GPIO 18, + -> 3V3, - -> GND)
// ใช้ทั้ง Hardware Interrupt (FALLING edge) และ Digital Debounce เพื่อให้กดติดทันทีแม้กำลังส่ง HTTPS
const int BUTTON_PIN = 18;
const unsigned long DEBOUNCE_DELAY_MS = 50;
const unsigned long ISR_LOCKOUT_MS    = 200; // ป้องกันสัญญาณกระเพื่อม (Bounce) ในระดับ Interrupt
int lastButtonReading = HIGH;
int stableButtonState = HIGH;
unsigned long lastDebounceTime = 0;

volatile bool buttonInterruptPending = false;
volatile unsigned long lastIsrTriggerMillis = 0;
unsigned long lastAppliedToggleMillis = 0;

void IRAM_ATTR onButtonFallingISR() {
    unsigned long now = millis();
    if (now - lastIsrTriggerMillis >= ISR_LOCKOUT_MS) {
        lastIsrTriggerMillis = now;
        buttonInterruptPending = true;
    }
}

// สถานะการวัดและตัวแปรจำลองอุณหภูมิ (36.0 - 39.0 C, ขยับทีละ +-0.2 C)
bool isMeasuring = false;
bool isStartupInitialized = false;
bool pendingButtonCommandSync = false; // ใช้กรณีเปลี่ยนสถานะด้วยปุ่มตอน Wi-Fi ยังไม่พร้อม หรือต้องการซิงก์ซ้ำ
float temperature = 36.0;
float step = 0.2;

// การกำหนดรอบเวลาด้วย millis() แทน delay()
const unsigned long MEASURE_INTERVAL_MS   = 1000; // จำลองและส่งอุณหภูมิทุก 1 วินาที (เมื่อ isMeasuring = true)
const unsigned long COMMAND_POLL_MS       = 1000; // อ่านคำสั่ง Start/Stop จาก Firebase ทุก 1 วินาที
const unsigned long HEARTBEAT_INTERVAL_MS = 3000; // ส่ง Heartbeat (lastSeen) ทุก 3 วินาที
const unsigned long WIFI_RETRY_MS         = 5000; // ตรวจสอบและกู้คืน Wi-Fi ทุก 5 วินาทีเมื่อหลุด

unsigned long lastMeasureMillis   = 0;
unsigned long lastCommandMillis   = 0;
unsigned long lastHeartbeatMillis = 0;
unsigned long lastWiFiRetryMillis = 0;
bool wasWiFiConnected = false;

// Wi-Fi Manager
WiFiManager wm;

String buildFirebaseUrl(const String& subPath) {
    String url = String(DATABASE_URL) + "/devices/" + String(DEVICE_ID) + "/" + subPath + ".json";
    if (!firebaseIdToken.isEmpty()) {
        url += "?auth=" + firebaseIdToken;
    }
    return url;
}

bool firebasePutJson(const String& subPath, const String& jsonPayload) {
    if (WiFi.status() != WL_CONNECTED) {
        return false;
    }

    WiFiClientSecure client;
    client.setInsecure(); // สำหรับโหมดทดลอง (ข้ามการตรวจ Certificate)

    HTTPClient http;
    String url = buildFirebaseUrl(subPath);

    if (!http.begin(client, url)) {
        Serial.println("HTTPS initialization failed");
        return false;
    }

    http.addHeader("Content-Type", "application/json");
    int httpCode = http.PUT(jsonPayload);
    http.end();

    if (httpCode <= 0 || httpCode >= 400) {
        Serial.print("Firebase PUT [");
        Serial.print(subPath);
        Serial.print("] failed, HTTP status: ");
        Serial.println(httpCode);
        return false;
    }
    return true;
}

String firebaseGetRaw(const String& subPath, int* outHttpCode = nullptr) {
    if (WiFi.status() != WL_CONNECTED) {
        if (outHttpCode) *outHttpCode = -1;
        return "";
    }

    WiFiClientSecure client;
    client.setInsecure();

    HTTPClient http;
    String url = buildFirebaseUrl(subPath);

    if (!http.begin(client, url)) {
        if (outHttpCode) *outHttpCode = -1;
        return "";
    }

    int httpCode = http.GET();
    if (outHttpCode) *outHttpCode = httpCode;

    String payload = "";
    if (httpCode == 200) {
        payload = http.getString();
    }
    http.end();
    return payload;
}

// ส่งค่าอุณหภูมิไปยัง latest (เรียกเฉพาะเมื่อ isMeasuring = true)
void sendTemperature(float temp) {
    String json = "{";
    json += "\"temperature\":" + String(temp, 2);
    json += ",\"unit\":\"C\"";
    json += ",\"status\":\"online\"";
    json += ",\"timestamp\":{\".sv\":\"timestamp\"}";
    json += "}";

    bool ok = firebasePutJson("latest", json);
    Serial.print("Send temperature (");
    Serial.print(temp, 2);
    Serial.print(" C) -> ");
    Serial.println(ok ? "OK" : "FAILED");
}

// ส่งสถานะการวัดจริง (state/measuring) และ Heartbeat (state/lastSeen)
bool syncDeviceState() {
    String json = "{";
    json += "\"measuring\":";
    json += (isMeasuring ? "true" : "false");
    json += ",\"lastSeen\":{\".sv\":\"timestamp\"}";
    json += "}";

    return firebasePutJson("state", json);
}

// ซิงก์คำสั่ง control/command บน Firebase ให้ตรงกับสถานะปัจจุบัน (ใช้เมื่อกดปุ่มจริงบนบอร์ด ESP32)
bool syncControlCommandToFirebase(bool measuringState) {
    String cmdJson = measuringState ? "{\"command\":\"start\"}" : "{\"command\":\"stop\"}";
    return firebasePutJson("control", cmdJson);
}

// ฟังก์ชันกลางสำหรับเปลี่ยนสถานะการวัด (รองรับทั้งการกดปุ่มบนบอร์ด GPIO 18 และคำสั่งจาก Web App)
void applyMeasurementState(bool newState, bool triggeredByPhysicalButton) {
    isMeasuring = newState;
    unsigned long now = millis();

    Serial.print(">>> [");
    Serial.print(triggeredByPhysicalButton ? "GPIO 18 Button" : "Web App / Firebase");
    Serial.print("] Measurement state changed to: ");
    Serial.println(isMeasuring ? "MEASURING (START)" : "STANDBY (STOP)");

    if (WiFi.status() == WL_CONNECTED) {
        if (triggeredByPhysicalButton) {
            // เมื่อกดปุ่มจากบอร์ด ต้องอัปเดต control/command บน Firebase ด้วย
            // เพื่อไม่ให้รอบ pollControlCommand() ถัดไปอ่านค่าคำสั่งเก่ากลับมาทับ
            bool cmdSynced = syncControlCommandToFirebase(isMeasuring);
            pendingButtonCommandSync = !cmdSynced;
        } else {
            pendingButtonCommandSync = false;
        }

        // ยืนยันสถานะจริงไปที่ state/measuring และอัปเดต lastSeen ทันที
        syncDeviceState();
        lastHeartbeatMillis = now;
        lastCommandMillis   = now;

        // หากเริ่มวัด ให้ส่งค่าอุณหภูมิชุดแรกทันที
        if (isMeasuring) {
            sendTemperature(temperature);
            lastMeasureMillis = now;
        }
    } else if (triggeredByPhysicalButton) {
        pendingButtonCommandSync = true;
    }
}

// ตรวจจับการกดปุ่ม Push Button (GPIO 18, Active LOW) ด้วย Hardware Interrupt ร่วมกับ Debounce 50 ms แบบไม่ใช้ delay()
void handlePhysicalButton() {
    unsigned long now = millis();
    bool triggerToggle = false;

    // 1. ตรวจสอบสัญญาณจาก Hardware Interrupt (ดักจับการกดปุ่มได้แม้เกิดระหว่างรอ HTTPS Request)
    if (buttonInterruptPending) {
        noInterrupts();
        buttonInterruptPending = false;
        interrupts();

        if (now - lastAppliedToggleMillis >= ISR_LOCKOUT_MS) {
            triggerToggle = true;
            // อัปเดตสถานะ Polling ให้ตรงกันเพื่อไม่ให้ทริกเกอร์ซ้ำเมื่อปล่อยหรือกดค้าง
            lastButtonReading = digitalRead(BUTTON_PIN);
            stableButtonState = LOW;
            lastDebounceTime  = now;
        }
    }

    // 2. ตรวจสอบสถานะขาด้วย Polling Debounce 50 ms ควบคู่กันเพื่อความแม่นยำของสถานะปุ่ม
    int reading = digitalRead(BUTTON_PIN);

    if (reading != lastButtonReading) {
        lastDebounceTime = now;
        lastButtonReading = reading;
    }

    if ((now - lastDebounceTime) >= DEBOUNCE_DELAY_MS) {
        if (reading != stableButtonState) {
            stableButtonState = reading;

            // Active LOW: เมื่อกดปุ่มลง (Falling Edge -> LOW) และยังไม่ถูกทริกเกอร์โดย ISR ในรอบเดียวกัน
            if (stableButtonState == LOW && (now - lastAppliedToggleMillis >= ISR_LOCKOUT_MS)) {
                triggerToggle = true;
            }
        }
    }

    if (triggerToggle) {
        lastAppliedToggleMillis = now;
        applyMeasurementState(!isMeasuring, true);
    }
}

// เมื่อ ESP32 เริ่มทำงานใหม่หรือกู้คืนการเชื่อมต่อครั้งแรก ให้เริ่มจาก Standby เสมอ
// และรีเซ็ต control/command เป็น "stop" เพื่อป้องกันคำสั่ง Start เก่าที่ค้างใน Firebase ทำให้เริ่มวัดเอง
void initializeStandbyOnFirebase() {
    if (WiFi.status() != WL_CONNECTED) return;

    Serial.println("Initializing device state to Standby (stop)...");
    isMeasuring = false;
    pendingButtonCommandSync = false;

    bool cmdOk = syncControlCommandToFirebase(false);
    bool stateOk = syncDeviceState();

    if (cmdOk && stateOk) {
        isStartupInitialized = true;
        Serial.println("Standby initialized on Firebase (measuring: false, command: stop)");
    } else {
        Serial.println("Standby initialization incomplete, will retry...");
    }
}

// อ่านคำสั่ง Start/Stop จาก control/command
void pollControlCommand() {
    if (!isStartupInitialized) {
        initializeStandbyOnFirebase();
        return;
    }

    // หากเพิ่งกดปุ่มบนบอร์ดแล้วยังซิงก์ control/command ไม่สำเร็จ ให้ซิงก์ขึ้นไปก่อนอ่าน
    if (pendingButtonCommandSync) {
        if (syncControlCommandToFirebase(isMeasuring)) {
            pendingButtonCommandSync = false;
        }
        return;
    }

    int httpCode = 0;
    String raw = firebaseGetRaw("control/command", &httpCode);
    if (httpCode != 200) {
        return;
    }

    raw.trim();
    raw.toLowerCase();

    bool wantStart = (raw == "\"start\"" || raw.indexOf("\"start\"") >= 0);
    bool wantStop  = (raw == "\"stop\""  || raw.indexOf("\"stop\"") >= 0 || raw == "null");

    if (wantStart && !isMeasuring) {
        applyMeasurementState(true, false);
    } else if (wantStop && isMeasuring) {
        applyMeasurementState(false, false);
    }
}

void simulateNextTemperature() {
    temperature += step;

    if (temperature >= 39.0) {
        temperature = 39.0;
        step = -0.2;
    }

    if (temperature <= 36.0) {
        temperature = 36.0;
        step = 0.2;
    }
}

void setup() {
    Serial.begin(115200);

    // ตั้งค่าขา Push Button Module (GPIO 18, Active LOW) ด้วย INPUT_PULLUP และผูก Hardware Interrupt
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    lastButtonReading = digitalRead(BUTTON_PIN);
    stableButtonState = lastButtonReading;
    lastDebounceTime  = millis();
    attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), onButtonFallingISR, FALLING);

    Serial.println("Pulse Dent 02");
    Serial.println("Physical Button configured on GPIO 18 (INPUT_PULLUP + Hardware Interrupt FALLING, Debounce 50 ms)");
    Serial.println("Starting WiFi Manager...");

    WiFi.mode(WIFI_STA);
    WiFi.setAutoReconnect(true);

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
        wasWiFiConnected = true;

        // เริ่มต้นในโหมด Standby และล้างคำสั่ง Start ที่อาจค้างอยู่บน Firebase
        initializeStandbyOnFirebase();
    } else {
        Serial.println("WiFi setup timed out");
        Serial.println("Running offline (will auto-reconnect in background)...");
    }

    unsigned long now = millis();
    lastMeasureMillis   = now;
    lastCommandMillis   = now;
    lastHeartbeatMillis = now;
    lastWiFiRetryMillis = now;
}

void loop() {
    // 0. ตรวจสอบการกดปุ่มจริงบนบอร์ด ESP32 (GPIO 18, Debounce 50 ms) ในทุกรอบของ loop
    handlePhysicalButton();

    unsigned long now = millis();

    // 1. ตรวจสอบสถานะ Wi-Fi และการกู้คืนการเชื่อมต่อเมื่อ Wi-Fi หลุด
    if (WiFi.status() != WL_CONNECTED) {
        if (wasWiFiConnected) {
            Serial.println("WiFi connection lost! Entering Standby while reconnecting...");
            wasWiFiConnected = false;
            // เมื่อ Wi-Fi หลุด ให้กลับสู่โหมด Standby และรีเซ็ตสถานะเมื่อเชื่อมต่อใหม่
            isMeasuring = false;
            isStartupInitialized = false;
            pendingButtonCommandSync = false;
        }
        if (now - lastWiFiRetryMillis >= WIFI_RETRY_MS) {
            lastWiFiRetryMillis = now;
            Serial.println("WiFi: Disconnected -> attempting reconnect...");
            WiFi.reconnect();
        }
        return;
    }

    // เมื่อ Wi-Fi กลับมาเชื่อมต่อใหม่สำเร็จ
    if (!wasWiFiConnected) {
        wasWiFiConnected = true;
        Serial.print("WiFi Reconnected! IP: ");
        Serial.println(WiFi.localIP());
        initializeStandbyOnFirebase();
    }

    // 2. อ่านคำสั่ง Start/Stop จาก Firebase เป็นระยะ
    if (now - lastCommandMillis >= COMMAND_POLL_MS) {
        lastCommandMillis = now;
        pollControlCommand();
        handlePhysicalButton(); // ตรวจปุ่มกดซ้ำทันทีหลังจบ HTTP request
    }

    // 3. จำลองและส่งอุณหภูมิทุก 1 วินาที เฉพาะเมื่อ isMeasuring = true เท่านั้น
    now = millis();
    if (isMeasuring && (now - lastMeasureMillis >= MEASURE_INTERVAL_MS)) {
        lastMeasureMillis = now;
        simulateNextTemperature();
        sendTemperature(temperature);
        handlePhysicalButton(); // ตรวจปุ่มกดซ้ำทันทีหลังจบ HTTP request
    }

    // 4. ส่ง Heartbeat (state/lastSeen และ state/measuring) ต่อเนื่องแม้ในโหมด Standby
    now = millis();
    if (now - lastHeartbeatMillis >= HEARTBEAT_INTERVAL_MS) {
        lastHeartbeatMillis = now;
        if (!isStartupInitialized) {
            initializeStandbyOnFirebase();
        } else {
            bool hbOk = syncDeviceState();
            if (hbOk) {
                Serial.print("Heartbeat sent [mode: ");
                Serial.print(isMeasuring ? "Measuring" : "Standby");
                Serial.println("]");
            }
        }
        handlePhysicalButton();
    }
}

