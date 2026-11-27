# PulseDent Platform

**พัลส์เดนต์: อุปกรณ์อัจฉริยะสำหรับประเมินภาวะโพรงประสาทฟันตายร่วมกับแพลตฟอร์มดิจิทัล**  
*(PulseDent: Smart Dental Pulp Vitality Assessment Device and Platform)*

---

## 🌐 ลิงก์เข้าใช้งานเว็บแอปพลิเคชัน (GitHub Pages)

- **หน้าแรก (Portal เลือกโหมดการใช้งาน):**  
  👉 [https://chehlah.github.io/pulse_dent_platform/](https://chehlah.github.io/pulse_dent_platform/)
- **1. PulseDent Web App (เชื่อมต่อบอร์ด ESP32 + Firebase แบบ Real-time):**  
  👉 [https://chehlah.github.io/pulse_dent_platform/web_app/](https://chehlah.github.io/pulse_dent_platform/web_app/)
- **2. PulseDent Web Demo (โหมดสาธิตและจำลองสถานการณ์):**  
  👉 [https://chehlah.github.io/pulse_dent_platform/web_demo/](https://chehlah.github.io/pulse_dent_platform/web_demo/)

---

## 📌 ภาพรวมของระบบ

**PulseDent Platform** เป็นแพลตฟอร์มดิจิทัลที่ทำงานร่วมกับอุปกรณ์ฮาร์ดแวร์ (**ESP32**) เพื่อตรวจวัดและเปรียบเทียบค่าทางชีวภาพของฟัน ได้แก่:
- **อุณหภูมิ (Temperature / °C)**
- **สัญญาณชีพจรของฟัน (Pulse / bpm)**
- **ระดับออกซิเจนในเนื้อเยื่อฟัน (Oxygen Saturation / %)**

โดยนำค่าที่วัดได้จาก **พื้นที่อ้างอิง (Reference Tooth)** มาเปรียบเทียบกับ **พื้นที่เป้าหมาย (Target Tooth)** เพื่อคำนวณผลต่างและประเมินระดับความเสี่ยงของภาวะโพรงประสาทฟันผิดปกติในเบื้องต้น

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```text
PulseDent/
├── index.html                  # หน้า Portal หลักสำหรับเลือกเข้า Web App หรือ Web Demo
├── .nojekyll                   # ปิด Jekyll build เพื่อให้ GitHub Pages เสิร์ฟไฟล์ Static โดยตรง
├── README.md                   # เอกสารภาพรวมของโปรเจกต์
│
├── web_app/                    # เว็บแอปหลักที่เชื่อมต่อรับค่าจริงจาก ESP32 ผ่าน Firebase
│   ├── index.html              # หน้าเว็บหลัก (4 แท็บ + แผงรับสัญญาณสดจาก ESP32)
│   ├── style.css               # สไตล์ UI ของแพลตฟอร์ม
│   ├── script.js               # ลอจิกซิงก์ Firebase (SSE + Polling), ตรวจสถานะ ESP32 และประมวลผล
│   ├── tooth_01.jpg            # ภาพแผนผังฟัน 32 ซี่
│   ├── tooth_02.jpg            # ภาพอ้างอิงชนิดฟัน
│   ├── demo_landing_page.jpg   # ภาพตัวอย่างหน้าแรกของแพลตฟอร์ม
│   └── pulsedent_web_design_summary.md # เอกสารสรุปการออกแบบและการทำงานของ web_app
│
├── web_demo/                   # เว็บแอปรุ่นสาธิต (Simulation Mode ล้วน ไม่ต้องต่อฮาร์ดแวร์)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── tooth_01.jpg
│   ├── tooth_02.jpg
│   ├── demo_landing_page.jpg
│   └── pulsedent_web_design_summary.md
│
└── esp32/                      # โปรเจกต์เฟิร์มแวร์ ESP32 (PlatformIO / Arduino Framework)
    ├── platformio.ini          # ตั้งค่าบอร์ด esp32dev และ environment แยก esp32_temp (Mode 1) / esp32_pulse (Mode 2)
    ├── src/main.cpp            # เฟิร์มแวร์ชุดเดียวรองรับ 2 โมดูล (SENSOR_MODE 1=Temp, 2=Pulse), Toggle Start/Stop 2 ช่องทาง และส่งค่าขึ้น Firebase
    ├── data/firebase_initial.json # โครงสร้าง JSON เริ่มต้นสำหรับ Firebase Realtime Database (pulse-dent-01 + pulse-dent-02)
    ├── data/firebase_rules.json   # กฎความปลอดภัย (Security Rules) รองรับทั้งเซ็นเซอร์อุณหภูมิ (°C) และชีพจร (bpm)
    └── ESP32_OPERATION_SUMMARY.md # สรุปการทำงานของเฟิร์มแวร์ ESP32
```

---

## ✨ ฟีเจอร์หลักของ `web_app` (Dual ESP32 + Firebase Integration)

1. **รองรับการเชื่อมต่อบอร์ด ESP32 สูงสุด 2 โมดูลพร้อมกัน (อุณหภูมิ + สัญญาณชีพจร) ผ่าน Firebase (`#liveSensorCard`):**
   - รองรับการทำงานได้ทั้งแบบเชื่อมต่อ **1 ชนิด** (เฉพาะอุณหภูมิ หรือ เฉพาะชีพจร) และ **2 ชนิดพร้อมกัน** (อุณหภูมิ + ชีพจร) โดยแสดงป้ายสรุปชนิดเซ็นเซอร์ที่เชื่อมต่ออยู่บน Header และการ์ดสัญญาณสด
   - ซิงก์ข้อมูลจาก Path `/devices/<tempDeviceId>.json` (`pulse-dent-01`) และ `/devices/<pulseDeviceId>.json` (`pulse-dent-02`) แยกกันอิสระด้วยทั้ง **Server-Sent Events (SSE)** และ **HTTP Polling**
   - สั่ง **เริ่มการวัด (Start) / หยุดการวัด (Stop)** ได้แยกทีละโมดูลหรือกด **เริ่มวัดทั้งหมด / หยุดทั้งหมด** พร้อมกัน รวมถึงกดจากปุ่มจริงบนบอร์ด ESP32 (**GPIO 18**) ของแต่ละตัว
   - ตรวจสอบความสดของสัญญาณจาก `state/lastSeen` (Heartbeat ทุก 3 วินาที) และ `latest/timestamp` แยกแต่ละโมดูล:
     - 🟢 **Online (`Measuring` / `Standby`):** มี Heartbeat หรือข้อมูลชุดใหม่อัปเดตภายใน 6 วินาทีล่าสุด
     - 🟡 **สัญญาณไม่อัปเดต (`stale`):** ข้อมูล/Heartbeat ค้างเกิน 6–12 วินาที
     - ⚪ **Offline (`ไม่พร้อมวัด`):** ข้อมูล/Heartbeat ไม่อัปเดตเกิน 12 วินาที หรือปิดการรับค่าจาก ESP32

2. **การส่งค่าจาก ESP32 เข้าซี่ฟันบนแผนผัง (Interactive Dental Map):**
   - คลิกเลือกฟันซี่ใดก็ได้จาก 32 ซี่ (ระบบ FDI 11–48) ทั้งในโหมด **พื้นที่อ้างอิง (สีเขียว)** และ **พื้นที่เป้าหมาย (สีส้ม)**
   - เมื่อนำค่าเข้าซี่ฟัน ระบบจะอัปเดตเฉพาะพารามิเตอร์จากโมดูลที่กำลังวัดอยู่ (เช่น Temp อย่างเดียว, Pulse อย่างเดียว หรือ Temp + Pulse พร้อมกัน) และคงค่าจำลองของพารามิเตอร์ที่ไม่ได้ต่อไว้ พร้อมป้ายระบุแหล่งที่มา (`✓ ESP32 (Temp)`, `✓ ESP32 (Pulse)`, `✓ ESP32 (Temp+Pulse)`)
   - รองรับทั้งการกดปุ่ม **นำค่านี้ไปใส่ฟันที่เลือก**, ปุ่ม **ล็อกค่าฟันแล้วสลับโหมด** และการเปิดโหมด **Auto-Assign (Real-time)** ขณะกำลังวัด

3. **การคำนวณผลต่างและประเมินความเสี่ยงอัตโนมัติ:**
   - คำนวณผลต่างสัมบูรณ์ของอุณหภูมิ ชีพจร และออกซิเจนระหว่างฟันอ้างอิงกับฟันเป้าหมาย
   - แสดงผลการประเมิน (`ปกติ`, `เฝ้าระวัง`, `เสี่ยงสูง`) พร้อมบันทึกผลลงในตาราง **ประวัติการตรวจ (`localStorage`)**

4. **การตั้งค่า (Settings):**
   - ปรับตั้งค่า **Firebase Database URL**, **Device ID — อุณหภูมิ (Mode 1)**, **Device ID — ชีพจร (Mode 2)** และ **รอบดึงข้อมูล (ms)** ได้จากหน้าเว็บโดยตรง
   - เปิด/ปิดข้อมูลที่แสดง, เปิด/ปิดกลุ่มฟันที่เลือกได้ และปรับเกณฑ์ประเมินความเสี่ยง (Threshold)

---

## ⚠️ ข้อควรระวัง
ผลลัพธ์ที่แสดงบนแพลตฟอร์มนี้เป็นการประเมินเบื้องต้นเพื่อการศึกษาและสาธิตการทำงานของระบบ ควรได้รับการตรวจยืนยันโดยทันตแพทย์ผู้เชี่ยวชาญ
