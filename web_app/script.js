const STORAGE_KEYS = {
  history: "pulsedent-history",
  settings: "pulsedent-settings"
};

const groupLabels = {
  central: { th: "ฟันตัดกลาง", en: "central incisors" },
  lateral: { th: "ฟันตัดข้าง", en: "lateral incisors" },
  canine: { th: "ฟันเขี้ยว", en: "canines / cuspides" },
  firstPremolar: { th: "ฟันกรามน้อยซี่ที่หนึ่ง", en: "first premolars" },
  secondPremolar: { th: "ฟันกรามน้อยซี่ที่สอง", en: "second premolars" },
  firstMolar: { th: "ฟันกรามซี่ที่หนึ่ง", en: "first molars" },
  secondMolar: { th: "ฟันกรามซี่ที่สอง", en: "second molars" },
  thirdMolar: { th: "ฟันกรามซี่ที่สาม", en: "third molars" }
};

const toothMeta = [
  { id: "18", group: "thirdMolar", arch: "ฟันบนขวา", x: 13.9, y: 44.1, s: 8.3 },
  { id: "17", group: "secondMolar", arch: "ฟันบนขวา", x: 16.0, y: 36.6, s: 8.6 },
  { id: "16", group: "firstMolar", arch: "ฟันบนขวา", x: 18.4, y: 28.4, s: 9.0 },
  { id: "15", group: "secondPremolar", arch: "ฟันบนขวา", x: 21.3, y: 20.7, s: 7.5 },
  { id: "14", group: "firstPremolar", arch: "ฟันบนขวา", x: 25.1, y: 15.1, s: 7.2 },
  { id: "13", group: "canine", arch: "ฟันบนขวา", x: 29.8, y: 9.5, s: 7.0 },
  { id: "12", group: "lateral", arch: "ฟันบนขวา", x: 36.4, y: 6.7, s: 6.8 },
  { id: "11", group: "central", arch: "ฟันบนขวา", x: 44.6, y: 5.2, s: 7.4 },
  { id: "21", group: "central", arch: "ฟันบนซ้าย", x: 54.5, y: 5.2, s: 7.4 },
  { id: "22", group: "lateral", arch: "ฟันบนซ้าย", x: 62.8, y: 6.7, s: 6.8 },
  { id: "23", group: "canine", arch: "ฟันบนซ้าย", x: 69.4, y: 9.5, s: 7.0 },
  { id: "24", group: "firstPremolar", arch: "ฟันบนซ้าย", x: 74.0, y: 15.1, s: 7.2 },
  { id: "25", group: "secondPremolar", arch: "ฟันบนซ้าย", x: 77.9, y: 20.7, s: 7.5 },
  { id: "26", group: "firstMolar", arch: "ฟันบนซ้าย", x: 80.7, y: 28.4, s: 9.0 },
  { id: "27", group: "secondMolar", arch: "ฟันบนซ้าย", x: 83.2, y: 36.6, s: 8.6 },
  { id: "28", group: "thirdMolar", arch: "ฟันบนซ้าย", x: 85.2, y: 44.1, s: 8.3 },
  { id: "38", group: "thirdMolar", arch: "ฟันล่างซ้าย", x: 84.5, y: 59.2, s: 8.6 },
  { id: "37", group: "secondMolar", arch: "ฟันล่างซ้าย", x: 81.5, y: 67.6, s: 9.0 },
  { id: "36", group: "firstMolar", arch: "ฟันล่างซ้าย", x: 77.7, y: 76.4, s: 9.1 },
  { id: "35", group: "secondPremolar", arch: "ฟันล่างซ้าย", x: 74.3, y: 83.5, s: 7.3 },
  { id: "34", group: "firstPremolar", arch: "ฟันล่างซ้าย", x: 71.1, y: 88.9, s: 6.8 },
  { id: "33", group: "canine", arch: "ฟันล่างซ้าย", x: 65.8, y: 92.8, s: 6.6 },
  { id: "32", group: "lateral", arch: "ฟันล่างซ้าย", x: 59.4, y: 94.8, s: 6.2 },
  { id: "31", group: "central", arch: "ฟันล่างซ้าย", x: 52.8, y: 95.2, s: 5.8 },
  { id: "41", group: "central", arch: "ฟันล่างขวา", x: 46.4, y: 95.2, s: 5.8 },
  { id: "42", group: "lateral", arch: "ฟันล่างขวา", x: 39.8, y: 94.8, s: 6.2 },
  { id: "43", group: "canine", arch: "ฟันล่างขวา", x: 33.4, y: 92.7, s: 6.6 },
  { id: "44", group: "firstPremolar", arch: "ฟันล่างขวา", x: 28.1, y: 88.9, s: 6.8 },
  { id: "45", group: "secondPremolar", arch: "ฟันล่างขวา", x: 24.9, y: 83.5, s: 7.3 },
  { id: "46", group: "firstMolar", arch: "ฟันล่างขวา", x: 21.5, y: 76.4, s: 9.1 },
  { id: "47", group: "secondMolar", arch: "ฟันล่างขวา", x: 17.7, y: 67.6, s: 9.0 },
  { id: "48", group: "thirdMolar", arch: "ฟันล่างขวา", x: 14.6, y: 59.2, s: 8.6 }
].map((tooth) => ({
  ...tooth,
  nameTh: groupLabels[tooth.group].th,
  nameEn: groupLabels[tooth.group].en
}));

const baseToothData = {
  "11": { temp: 36.4, pulse: 76, oxygen: 86 },
  "12": { temp: 36.2, pulse: 78, oxygen: 85 },
  "13": { temp: 36.1, pulse: 75, oxygen: 84 },
  "14": { temp: 36.0, pulse: 74, oxygen: 84 },
  "15": { temp: 36.2, pulse: 76, oxygen: 85 },
  "16": { temp: 36.5, pulse: 79, oxygen: 87 },
  "17": { temp: 36.3, pulse: 78, oxygen: 85 },
  "18": { temp: 36.1, pulse: 75, oxygen: 83 },
  "21": { temp: 36.3, pulse: 77, oxygen: 85 },
  "22": { temp: 35.9, pulse: 72, oxygen: 82 },
  "23": { temp: 28.0, pulse: 0, oxygen: 0 },
  "24": { temp: 35.8, pulse: 70, oxygen: 80 },
  "25": { temp: 36.0, pulse: 73, oxygen: 82 },
  "26": { temp: 36.4, pulse: 77, oxygen: 86 },
  "27": { temp: 36.1, pulse: 75, oxygen: 84 },
  "28": { temp: 36.0, pulse: 74, oxygen: 83 },
  "31": { temp: 36.2, pulse: 76, oxygen: 84 },
  "32": { temp: 36.1, pulse: 75, oxygen: 83 },
  "33": { temp: 36.0, pulse: 74, oxygen: 82 },
  "34": { temp: 36.2, pulse: 76, oxygen: 85 },
  "35": { temp: 36.3, pulse: 77, oxygen: 86 },
  "36": { temp: 36.5, pulse: 79, oxygen: 87 },
  "37": { temp: 36.4, pulse: 78, oxygen: 86 },
  "38": { temp: 36.1, pulse: 75, oxygen: 83 },
  "41": { temp: 36.2, pulse: 76, oxygen: 84 },
  "42": { temp: 36.1, pulse: 75, oxygen: 83 },
  "43": { temp: 36.0, pulse: 74, oxygen: 82 },
  "44": { temp: 36.2, pulse: 76, oxygen: 85 },
  "45": { temp: 36.3, pulse: 77, oxygen: 86 },
  "46": { temp: 36.5, pulse: 79, oxygen: 87 },
  "47": { temp: 36.4, pulse: 78, oxygen: 86 },
  "48": { temp: 36.1, pulse: 75, oxygen: 83 }
};

const scenarios = {
  normal: {
    label: "ฟันปกติ",
    detail: "ค่าพื้นที่เป้าหมายใกล้เคียงกับพื้นที่อ้างอิง",
    tooth: { temp: 36.2, pulse: 76, oxygen: 84 },
    target: "22"
  },
  watch: {
    label: "เฝ้าระวัง",
    detail: "อุณหภูมิและออกซิเจนต่างจากพื้นที่อ้างอิงระดับกลาง",
    tooth: { temp: 33.8, pulse: 64, oxygen: 61 },
    target: "24"
  },
  high: {
    label: "เสี่ยงสูง",
    detail: "ค่าสัญญาณชีพจรหรือออกซิเจนลดลงชัดเจน",
    tooth: { temp: 28.0, pulse: 0, oxygen: 0 },
    target: "23"
  },
  necrosis: {
    label: "แนวโน้มโพรงประสาทฟันตาย",
    detail: "ค่าตอบสนองต่ำมาก ควรตรวจยืนยันโดยทันตแพทย์",
    tooth: { temp: 27.6, pulse: 0, oxygen: 0 },
    target: "36"
  },
  failed: {
    label: "วัดไม่สำเร็จ",
    detail: "ระบบแสดงค่าเป้าหมายว่างเพื่อสาธิตกรณีอุปกรณ์อ่านค่าไม่ได้",
    tooth: null,
    target: "34"
  },
  noise: {
    label: "สัญญาณรบกวน",
    detail: "ค่าชีพจรแกว่งและออกซิเจนต่ำกว่าปกติเล็กน้อย",
    tooth: { temp: 35.1, pulse: 42, oxygen: 58 },
    target: "45"
  }
};

const defaultSettings = {
  showTemp: true,
  showPulse: true,
  showOxygen: true,
  showFdi: true,
  showToothName: true,
  showArch: true,
  batteryLevel: 67,
  enabledGroups: Object.fromEntries(Object.keys(groupLabels).map((key) => [key, true])),
  thresholds: {
    tempWarn: 2,
    tempHigh: 5,
    oxygenWarn: 20,
    oxygenHigh: 50,
    pulseLow: 1
  },
  firebase: {
    databaseUrl: "https://pulsedent-02-default-rtdb.asia-southeast1.firebasedatabase.app",
    deviceId: "pulse-dent-01",
    pollIntervalMs: 1000
  }
};

const state = {
  mode: "target",
  referenceTooth: "17",
  targetTooth: "23",
  scenario: "high",
  toothData: structuredClone(baseToothData),
  toothSources: {}, // toothId -> "live" | "captured" | "mock"
  settings: loadSettings(),
  history: loadHistory(),
  live: {
    enabled: true,
    autoAssign: true, // true: คลิกฟันซี่ไหน ค่าจาก ESP32 วิ่งเข้าซี่นั้นทันที, false: รอกดปุ่มส่งค่าเข้าซี่ฟัน
    streamingTooth: "23", // ซี่ฟันที่กำลังรับค่าสดจาก ESP32
    status: "connecting", // "online" | "stale" | "offline" | "connecting"
    payload: null, // { temperature, pulse, oxygen, unit, status, timestamp }
    lastReceivedAt: 0,
    errorMessage: ""
  }
};

let firebaseEventSource = null;
let firebasePollTimer = null;
let staleCheckTimer = null;

const els = {
  toothLayer: document.querySelector("#toothLayer"),
  liveSensorCard: document.querySelector("#liveSensorCard"),
  referenceCard: document.querySelector("#referenceCard"),
  targetCard: document.querySelector("#targetCard"),
  differenceCard: document.querySelector("#differenceCard"),
  riskCard: document.querySelector("#riskCard"),
  scenarioBadge: document.querySelector("#scenarioBadge"),
  simulationStatus: document.querySelector("#simulationStatus"),
  scenarioGrid: document.querySelector("#scenarioGrid"),
  historyBody: document.querySelector("#historyBody"),
  displaySettings: document.querySelector("#displaySettings"),
  groupSettings: document.querySelector("#groupSettings"),
  thresholdSettings: document.querySelector("#thresholdSettings"),
  firebaseSettings: document.querySelector("#firebaseSettings"),
  batteryStatus: document.querySelector("#batteryStatus"),
  batteryText: document.querySelector("#batteryText"),
  headerStatusDot: document.querySelector("#headerStatusDot"),
  headerStatusText: document.querySelector("#headerStatusText")
};

function init() {
  applyScenario(state.scenario, false);
  setMode(state.mode);
  renderTeeth();
  renderScenarios();
  renderSettings();
  renderHistory();
  bindEvents();
  updateUI();
  startFirebaseSync();
}

function bindEvents() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      setMode(button.dataset.mode);
      if (state.live.enabled && state.live.autoAssign && state.live.status === "online") {
        state.live.streamingTooth = getSelectedToothForMode();
        applyLivePayloadToTooth(state.live.streamingTooth, "live");
      }
      updateUI();
    });
  });

  document.querySelector("#resetButton").addEventListener("click", () => {
    state.referenceTooth = "17";
    state.targetTooth = scenarios[state.scenario].target;
    state.toothData = structuredClone(baseToothData);
    state.toothSources = {};
    applyScenario(state.scenario, false);
    state.live.streamingTooth = getSelectedToothForMode();
    if (state.live.enabled && state.live.autoAssign && state.live.status === "online" && state.live.payload) {
      applyLivePayloadToTooth(state.live.streamingTooth, "live");
    }
    updateUI();
  });

  document.querySelector("#saveButton").addEventListener("click", saveRecord);
  document.querySelector("#clearHistoryButton").addEventListener("click", clearHistory);
  document.querySelector("#resetSettingsButton").addEventListener("click", resetSettings);
}

function getSelectedToothForMode() {
  return state.mode === "reference" ? state.referenceTooth : state.targetTooth;
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === tabId);
  });
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
}

function renderTeeth() {
  els.toothLayer.innerHTML = toothMeta.map((tooth) => `
    <button
      class="tooth-button"
      type="button"
      data-tooth="${tooth.id}"
      style="left:${tooth.x}%; top:${tooth.y}%; --size:${tooth.s}%;"
      aria-label="เลือกฟัน ${tooth.id} ${tooth.nameTh}"
      title="${tooth.id} ${tooth.nameTh} (${tooth.nameEn})"
    >
      <span class="tooth-label">${tooth.id}</span>
    </button>
  `).join("");

  els.toothLayer.querySelectorAll(".tooth-button").forEach((button) => {
    button.addEventListener("click", () => selectTooth(button.dataset.tooth));
  });
}

function renderScenarios() {
  els.scenarioGrid.innerHTML = Object.entries(scenarios).map(([key, scenario]) => `
    <button class="scenario-card" type="button" data-scenario="${key}">
      <strong>${scenario.label}</strong>
      <span>${scenario.detail}</span>
    </button>
  `).join("");

  els.scenarioGrid.querySelectorAll(".scenario-card").forEach((button) => {
    button.addEventListener("click", () => {
      applyScenario(button.dataset.scenario);
      switchTab("dashboard");
    });
  });
}

function renderSettings() {
  const displayRows = [
    ["showTemp", "อุณหภูมิ", "temperature / °C"],
    ["showPulse", "สัญญาณชีพจรของฟัน", "pulse / bpm"],
    ["showOxygen", "ออกซิเจนในเนื้อเยื่อฟัน", "oxygen / %"],
    ["showFdi", "หมายเลขฟัน FDI", "แสดงเลขบนแผนผัง"],
    ["showToothName", "ชื่อชนิดฟัน", "อ้างอิงจาก tooth_02.jpg"],
    ["showArch", "ตำแหน่งขากรรไกร", "ฟันบนซ้าย ขวา ล่างซ้าย ขวา"]
  ];

  els.displaySettings.innerHTML = `
    ${displayRows.map(([key, label, detail]) => checkboxRow(key, label, detail, state.settings[key])).join("")}
    ${numberSettingRow("batteryLevel", "แบตเตอรี่อุปกรณ์", "ตัวเลขที่แสดงบน header", "%", state.settings.batteryLevel)}
  `;

  els.groupSettings.innerHTML = Object.entries(groupLabels).map(([key, label]) => (
    checkboxRow(`group-${key}`, label.th, label.en, state.settings.enabledGroups[key])
  )).join("");

  const thresholdRows = [
    ["tempWarn", "ผลต่างอุณหภูมิระดับเฝ้าระวัง", "°C"],
    ["tempHigh", "ผลต่างอุณหภูมิระดับเสี่ยงสูง", "°C"],
    ["oxygenWarn", "ผลต่างออกซิเจนระดับเฝ้าระวัง", "%"],
    ["oxygenHigh", "ผลต่างออกซิเจนระดับเสี่ยงสูง", "%"],
    ["pulseLow", "ชีพจรต่ำผิดปกติ", "bpm"]
  ];

  els.thresholdSettings.innerHTML = thresholdRows.map(([key, label, unit]) => `
    <div class="threshold-field">
      <label for="${key}">${label}</label>
      <input id="${key}" type="number" step="0.1" min="0" value="${state.settings.thresholds[key]}" data-threshold="${key}" aria-label="${label} (${unit})">
    </div>
  `).join("");

  if (els.firebaseSettings) {
    const fb = state.settings.firebase || defaultSettings.firebase;
    els.firebaseSettings.innerHTML = `
      <div class="threshold-field">
        <label for="fbDatabaseUrl">Firebase Database URL</label>
        <input id="fbDatabaseUrl" type="url" value="${escapeAttr(fb.databaseUrl)}" placeholder="https://pulsedent-02-default-rtdb.asia-southeast1.firebasedatabase.app">
      </div>
      <div class="threshold-field">
        <label for="fbDeviceId">Device ID (ESP32)</label>
        <input id="fbDeviceId" type="text" value="${escapeAttr(fb.deviceId)}" placeholder="pulse-dent-01">
      </div>
      <div class="threshold-field">
        <label for="fbPollInterval">รอบดึงข้อมูล (ms)</label>
        <input id="fbPollInterval" type="number" min="500" max="10000" step="100" value="${Number(fb.pollIntervalMs) || 1000}">
      </div>
      <button class="primary-button" id="saveFirebaseConfigButton" type="button">บันทึกและเชื่อมต่อใหม่</button>
    `;

    const saveFbBtn = els.firebaseSettings.querySelector("#saveFirebaseConfigButton");
    saveFbBtn.addEventListener("click", () => {
      const rawUrl = els.firebaseSettings.querySelector("#fbDatabaseUrl").value.trim().replace(/\/+$/, "");
      const rawDevice = els.firebaseSettings.querySelector("#fbDeviceId").value.trim() || "pulse-dent-01";
      const rawInterval = Math.max(500, Number(els.firebaseSettings.querySelector("#fbPollInterval").value) || 1000);

      state.settings.firebase = {
        databaseUrl: rawUrl || defaultSettings.firebase.databaseUrl,
        deviceId: rawDevice,
        pollIntervalMs: rawInterval
      };
      persistSettings();
      startFirebaseSync();
      switchTab("dashboard");
    });
  }

  els.displaySettings.querySelectorAll("input[data-setting]").forEach((input) => {
    input.addEventListener("change", () => {
      state.settings[input.dataset.setting] = input.checked;
      persistSettings();
      updateUI();
    });
  });

  els.displaySettings.querySelectorAll("input[data-number-setting]").forEach((input) => {
    input.addEventListener("input", () => {
      const value = clampBatteryLevel(input.value);
      state.settings[input.dataset.numberSetting] = value;
      input.value = value;
      persistSettings();
      updateUI();
    });
  });

  els.groupSettings.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", () => {
      state.settings.enabledGroups[input.dataset.group] = input.checked;
      persistSettings();
      updateUI();
    });
  });

  els.thresholdSettings.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      state.settings.thresholds[input.dataset.threshold] = Number(input.value);
      persistSettings();
      updateUI();
    });
  });
}

function checkboxRow(key, label, detail, checked) {
  const isGroup = key.startsWith("group-");
  const dataAttr = isGroup
    ? `data-group="${key.replace("group-", "")}"`
    : `data-setting="${key}"`;

  return `
    <div class="check-row">
      <label for="${key}">
        ${label}
        <small>${detail}</small>
      </label>
      <input id="${key}" type="checkbox" ${checked ? "checked" : ""} ${dataAttr}>
    </div>
  `;
}

function numberSettingRow(key, label, detail, unit, value) {
  return `
    <div class="number-row">
      <label for="${key}">
        ${label}
        <small>${detail}</small>
      </label>
      <div class="number-control">
        <input id="${key}" type="number" min="0" max="100" step="1" value="${clampBatteryLevel(value)}" data-number-setting="${key}" aria-label="${label} (${unit})">
        <span>${unit}</span>
      </div>
    </div>
  `;
}

function selectTooth(toothId) {
  const tooth = getTooth(toothId);
  if (!state.settings.enabledGroups[tooth.group]) return;

  // ถ้าซี่เดิมกำลังรับค่าสดอยู่ แล้วผู้ใช้คลิกย้ายไปซี่อื่น ให้เปลี่ยนสถานะซี่เดิมเป็น "ล็อกค่าจาก ESP32 แล้ว"
  const prevStreaming = state.live.streamingTooth;
  if (prevStreaming && prevStreaming !== toothId && state.toothSources[prevStreaming] === "live") {
    state.toothSources[prevStreaming] = "captured";
  }

  if (state.mode === "reference") {
    state.referenceTooth = toothId;
  } else {
    state.targetTooth = toothId;
  }

  state.live.streamingTooth = toothId;

  if (state.live.enabled && state.live.autoAssign && state.live.status === "online" && state.live.payload) {
    applyLivePayloadToTooth(toothId, "live");
  }

  updateUI();
}

function applyScenario(key, shouldRender = true) {
  const scenario = scenarios[key];
  state.scenario = key;
  state.toothData = structuredClone(baseToothData);
  state.toothSources = {};
  state.targetTooth = scenario.target;

  if (scenario.tooth) {
    state.toothData[scenario.target] = structuredClone(scenario.tooth);
  } else {
    delete state.toothData[scenario.target];
  }

  state.live.streamingTooth = getSelectedToothForMode();
  if (state.live.enabled && state.live.autoAssign && state.live.status === "online" && state.live.payload) {
    applyLivePayloadToTooth(state.live.streamingTooth, "live");
  }

  if (shouldRender) updateUI();
}

// ==========================================
// Firebase Realtime Database Sync (ESP32)
// ==========================================

const STALE_TIMEOUT_MS = 6000;   // เกิน 6 วินาทีที่ค่าไม่อัปเดต -> สัญญาณไม่อัปเดต (stale)
const OFFLINE_TIMEOUT_MS = 15000; // เกิน 15 วินาทีที่ค่าไม่อัปเดต -> ESP32 ออฟไลน์ (offline)

function getFirebaseEndpointUrl() {
  const fb = state.settings.firebase || defaultSettings.firebase;
  const baseUrl = (fb.databaseUrl || defaultSettings.firebase.databaseUrl).replace(/\/+$/, "");
  const deviceId = encodeURIComponent((fb.deviceId || defaultSettings.firebase.deviceId).trim());
  return `${baseUrl}/devices/${deviceId}/latest.json`;
}

function evaluateConnectionStatus() {
  if (!state.live.enabled) {
    state.live.status = "offline";
    return;
  }
  if (!state.live.lastReceivedAt) {
    state.live.status = state.live.errorMessage ? "offline" : "connecting";
    return;
  }

  const ageMs = Date.now() - state.live.lastReceivedAt;
  if (ageMs <= STALE_TIMEOUT_MS) {
    state.live.status = "online";
  } else if (ageMs <= OFFLINE_TIMEOUT_MS) {
    state.live.status = "stale";
  } else {
    state.live.status = "offline";
  }
}

function startFirebaseSync() {
  stopFirebaseSync();

  if (!state.live.enabled) {
    state.live.status = "offline";
    updateUI();
    return;
  }

  state.live.status = "connecting";
  state.live.lastReceivedAt = 0;
  state.live.errorMessage = "";
  updateUI();

  const endpoint = getFirebaseEndpointUrl();

  // ดึงค่าครั้งแรกทันทีด้วย fetch
  fetchFirebaseLatest(endpoint);

  // พยายามเปิด Server-Sent Events (SSE) กับ Firebase REST Streaming ก่อนเพื่อให้ค่าอัปเดตแบบ Real-time ทันทีที่ ESP32 PUT
  if (typeof EventSource !== "undefined") {
    try {
      firebaseEventSource = new EventSource(endpoint);
      firebaseEventSource.addEventListener("put", (event) => {
        try {
          const packet = JSON.parse(event.data);
          if (packet && packet.data) {
            handleIncomingFirebaseData(packet.data);
          }
        } catch {
          // fallback to polling
        }
      });
      firebaseEventSource.onerror = () => {
        // หาก SSE ขัดข้อง ระบบยังมี polling ทำงานคู่ขนาน
      };
    } catch {
      firebaseEventSource = null;
    }
  }

  // ตั้งเวลา Polling สำรองตามค่า pollIntervalMs (ค่าเริ่มต้น 1000 ms ตามรอบส่งของ ESP32)
  const intervalMs = Math.max(500, Number(state.settings.firebase?.pollIntervalMs) || 1000);
  firebasePollTimer = setInterval(() => {
    if (state.live.enabled) {
      fetchFirebaseLatest(endpoint);
    }
  }, intervalMs);

  // ตรวจสอบว่าข้อมูลค้างหรือ ESP32 ออฟไลน์หรือไม่ทุก 1 วินาที
  staleCheckTimer = setInterval(() => {
    if (!state.live.enabled) return;
    const prevStatus = state.live.status;
    evaluateConnectionStatus();
    if (state.live.status !== prevStatus) {
      updateUI();
    }
  }, 1000);
}

function stopFirebaseSync() {
  if (firebaseEventSource) {
    firebaseEventSource.close();
    firebaseEventSource = null;
  }
  if (firebasePollTimer) {
    clearInterval(firebasePollTimer);
    firebasePollTimer = null;
  }
  if (staleCheckTimer) {
    clearInterval(staleCheckTimer);
    staleCheckTimer = null;
  }
}

async function fetchFirebaseLatest(endpoint) {
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && typeof data === "object") {
      handleIncomingFirebaseData(data);
    } else {
      state.live.status = "offline";
      state.live.errorMessage = "ยังไม่มีข้อมูลจาก ESP32 ใน Firebase";
      updateUI();
    }
  } catch (err) {
    state.live.errorMessage = err.message || "เชื่อมต่อ Firebase ไม่สำเร็จ";
    evaluateConnectionStatus();
    if (!state.live.lastReceivedAt || Date.now() - state.live.lastReceivedAt > STALE_TIMEOUT_MS) {
      state.live.status = "offline";
    }
    updateUI();
  }
}

function handleIncomingFirebaseData(raw) {
  const temp = Number(raw.temperature ?? raw.temp);
  if (!Number.isFinite(temp)) return;

  const hasPulse = raw.pulse !== undefined && Number.isFinite(Number(raw.pulse));
  const hasOxygen = raw.oxygen !== undefined && Number.isFinite(Number(raw.oxygen));
  const incomingTimestamp = typeof raw.timestamp === "number" && raw.timestamp > 0 ? raw.timestamp : null;

  const prevPayload = state.live.payload;
  const isFirstFetch = !prevPayload;
  const isNewPacket =
    isFirstFetch ||
    (incomingTimestamp !== null && incomingTimestamp !== prevPayload.timestamp) ||
    (incomingTimestamp === null && temp !== prevPayload.temperature);

  if (isFirstFetch) {
    if (incomingTimestamp !== null) {
      // โหลดครั้งแรก: ตรวจอายุข้อมูลจาก timestamp ของ Firebase Server
      // หากเวลาเครื่องผู้ใช้คลาดเคลื่อนไปในอนาคตเล็กน้อย ให้ไม่ติดลบ แต่ถ้าข้อมูลเก่าค้างใน Firebase จะเห็นอายุจริงทันที
      const serverAgeMs = Date.now() - incomingTimestamp;
      state.live.lastReceivedAt = serverAgeMs > STALE_TIMEOUT_MS ? incomingTimestamp : Date.now();
    } else {
      state.live.lastReceivedAt = Date.now();
    }
  } else if (isNewPacket) {
    // เมื่อมี packet ใหม่จาก ESP32 (timestamp หรือค่าเปลี่ยน) ให้ถือว่าเพิ่งได้รับข้อมูลสด ณ ตอนนี้
    state.live.lastReceivedAt = Date.now();
  }

  const prevStatus = state.live.status;
  state.live.payload = {
    temperature: temp,
    pulse: hasPulse ? Number(raw.pulse) : null,
    oxygen: hasOxygen ? Number(raw.oxygen) : null,
    unit: raw.unit || "C",
    status: raw.status || "online",
    timestamp: incomingTimestamp ?? (prevPayload?.timestamp || Date.now())
  };

  state.live.errorMessage = "";
  evaluateConnectionStatus();

  if (state.live.enabled && state.live.autoAssign && state.live.status === "online" && isNewPacket) {
    const activeTooth = getSelectedToothForMode();
    state.live.streamingTooth = activeTooth;
    applyLivePayloadToTooth(activeTooth, "live");
  }

  if (isNewPacket || state.live.status !== prevStatus) {
    updateUI();
  }
}

function applyLivePayloadToTooth(toothId, sourceType = "live") {
  if (!toothId || !state.live.payload) return;

  const existing = state.toothData[toothId] || baseToothData[toothId] || { temp: 36.2, pulse: 76, oxygen: 85 };
  const payload = state.live.payload;

  state.toothData[toothId] = {
    temp: Number(payload.temperature.toFixed(1)),
    pulse: payload.pulse !== null ? payload.pulse : existing.pulse,
    oxygen: payload.oxygen !== null ? payload.oxygen : existing.oxygen
  };
  state.toothSources[toothId] = sourceType;
}

// ==========================================
// UI Rendering
// ==========================================

function updateUI() {
  updateHeaderStatus();
  updateToothButtons();
  updateLiveSensorCard();
  updateCards();
  updateScenarioVisuals();
}

function updateHeaderStatus() {
  if (!els.headerStatusDot || !els.headerStatusText) return;

  els.headerStatusDot.classList.remove("stale", "offline");

  if (!state.live.enabled) {
    els.headerStatusDot.classList.add("offline");
    els.headerStatusText.textContent = "โหมดจำลอง (ปิดรับค่า ESP32)";
    return;
  }

  if (state.live.status === "online") {
    els.headerStatusText.textContent = `ESP32 เชื่อมต่อสำเร็จ (${formatNumber(state.live.payload?.temperature ?? 0)} °C)`;
  } else if (state.live.status === "stale") {
    els.headerStatusDot.classList.add("stale");
    els.headerStatusText.textContent = "ESP32 สัญญาณไม่อัปเดต";
  } else if (state.live.status === "connecting") {
    els.headerStatusDot.classList.add("stale");
    els.headerStatusText.textContent = "กำลังเชื่อมต่อ Firebase...";
  } else {
    els.headerStatusDot.classList.add("offline");
    els.headerStatusText.textContent = state.live.payload
      ? "ESP32 ออฟไลน์ (ข้อมูลไม่อัปเดต)"
      : "ESP32 ออฟไลน์ (ใช้ค่าจำลอง)";
  }
}

function updateToothButtons() {
  const activeSelectedTooth = getSelectedToothForMode();
  els.toothLayer.querySelectorAll(".tooth-button").forEach((button) => {
    const id = button.dataset.tooth;
    const tooth = getTooth(id);
    const hidden = !state.settings.enabledGroups[tooth.group];
    const isStreaming = state.live.enabled && state.live.autoAssign && state.live.status === "online" && id === activeSelectedTooth;
    const isEspAssigned = state.toothSources[id] === "live" || state.toothSources[id] === "captured";

    button.classList.toggle("reference", id === state.referenceTooth);
    button.classList.toggle("target", id === state.targetTooth);
    button.classList.toggle("live-streaming", isStreaming);
    button.classList.toggle("esp-assigned", isEspAssigned);
    button.classList.toggle("hidden-group", hidden);
    button.classList.toggle("show-fdi", state.settings.showFdi);
    button.setAttribute("aria-disabled", hidden ? "true" : "false");
  });
}

function updateLiveSensorCard() {
  if (!els.liveSensorCard) return;

  const activeToothId = getSelectedToothForMode();
  const activeTooth = getTooth(activeToothId);
  const modeLabel = state.mode === "reference" ? "พื้นที่อ้างอิง (สีเขียว)" : "พื้นที่เป้าหมาย (สีส้ม)";
  const payload = state.live.payload;

  let pillClass = "offline";
  let pillText = "โหมดจำลอง";
  if (state.live.enabled) {
    if (state.live.status === "online") {
      pillClass = "online";
      pillText = "รับค่าสดจาก ESP32";
    } else if (state.live.status === "stale") {
      pillClass = "stale";
      pillText = "รอข้อมูลใหม่จาก ESP32";
    } else if (state.live.status === "connecting") {
      pillClass = "stale";
      pillText = "กำลังเชื่อมต่อ Firebase...";
    } else {
      pillClass = "offline";
      pillText = payload ? "ESP32 ออฟไลน์ (แสดงค่าล่าสุดที่ค้างอยู่)" : "ไม่พบสัญญาณจาก ESP32";
    }
  }

  const tempDisplay = payload ? `${ payload.temperature.toFixed(2) } °${ payload.unit || "C" }` : "--.-- °C";
  const timeDisplay = payload?.timestamp
    ? new Date(payload.timestamp).toLocaleTimeString("th-TH")
    : "ยังไม่มีข้อมูล";

  const extraMetrics = [];
  if (payload?.pulse !== null && payload?.pulse !== undefined) {
    extraMetrics.push(`ชีพจร: ${formatNumber(payload.pulse)} bpm`);
  } else {
    extraMetrics.push(`ชีพจร: ใช้ค่าจำลองของซี่ฟัน`);
  }
  if (payload?.oxygen !== null && payload?.oxygen !== undefined) {
    extraMetrics.push(`ออกซิเจน: ${formatNumber(payload.oxygen)} %`);
  } else {
    extraMetrics.push(`ออกซิเจน: ใช้ค่าจำลองของซี่ฟัน`);
  }

  els.liveSensorCard.className = `live-sensor-card ${state.live.enabled ? "" : "disabled"}`;
  els.liveSensorCard.innerHTML = `
    <div class="live-sensor-header">
      <div class="live-sensor-title">
        <h3>สัญญาณจากอุปกรณ์ ESP32 (Firebase)</h3>
        <span class="live-pill ${pillClass}">${pillText}</span>
      </div>
      <label class="live-toggle-wrap" for="toggleLiveFirebase">
        <input id="toggleLiveFirebase" type="checkbox" ${state.live.enabled ? "checked" : ""}>
        <span>เปิดรับค่าจาก ESP32</span>
      </label>
    </div>

    <div class="live-sensor-body">
      <div class="live-reading-box">
        <div>
          <small class="eyebrow" style="color:var(--muted);display:block;">ค่าล่าสุดจากเซ็นเซอร์</small>
          <span class="live-temp-value">${tempDisplay}</span>
        </div>
        <div class="live-sub-metrics">
          <span>อัปเดต: <strong>${timeDisplay}</strong></span>
          <span>${extraMetrics.join(" · ")}</span>
        </div>
      </div>

      <div class="live-route-box">
        <div class="live-route-target">
          <span>ซี่ฟันที่เลือกบนแผนผัง (${modeLabel}):</span>
          <strong>FDI ${activeTooth.id} (${activeTooth.nameTh})</strong>
        </div>
        <small style="color:var(--muted);">
          คลิกปุ่มฟันซี่ใดก็ได้บนแผนผังด้านซ้าย เพื่อนำค่าจาก ESP32 ไปแสดงผลที่ฟันซี่นั้น
        </small>
      </div>
    </div>

    <div class="live-sensor-controls">
      <div class="live-mode-options">
        <label for="toggleAutoAssign">
          <input id="toggleAutoAssign" type="checkbox" ${state.live.autoAssign ? "checked" : ""} ${state.live.enabled ? "" : "disabled"}>
          <span>ส่งค่าสดเข้าฟันซี่ที่คลิกเลือกอัตโนมัติ (Real-time)</span>
        </label>
      </div>
      <div class="live-action-buttons">
        <button class="primary-button small" id="assignToSelectedToothBtn" type="button" ${!payload ? "disabled" : ""}>
          นำค่านี้ไปใส่ฟัน ${activeTooth.id} (${state.mode === "reference" ? "อ้างอิง" : "เป้าหมาย"})
        </button>
        <button class="secondary-button small" id="lockAndSwitchModeBtn" type="button" ${!payload ? "disabled" : ""}>
          ล็อกค่าฟัน ${activeTooth.id} แล้วสลับไปเลือก${state.mode === "reference" ? "เป้าหมาย" : "อ้างอิง"}
        </button>
      </div>
    </div>
  `;

  els.liveSensorCard.querySelector("#toggleLiveFirebase").addEventListener("change", (e) => {
    state.live.enabled = e.target.checked;
    if (state.live.enabled) {
      startFirebaseSync();
    } else {
      stopFirebaseSync();
      state.live.status = "offline";
      updateUI();
    }
  });

  els.liveSensorCard.querySelector("#toggleAutoAssign").addEventListener("change", (e) => {
    state.live.autoAssign = e.target.checked;
    if (state.live.enabled && state.live.autoAssign && state.live.status === "online" && state.live.payload) {
      applyLivePayloadToTooth(getSelectedToothForMode(), "live");
    }
    updateUI();
  });

  els.liveSensorCard.querySelector("#assignToSelectedToothBtn").addEventListener("click", () => {
    const targetId = getSelectedToothForMode();
    applyLivePayloadToTooth(targetId, state.live.autoAssign && state.live.status === "online" ? "live" : "captured");
    updateUI();
  });

  els.liveSensorCard.querySelector("#lockAndSwitchModeBtn").addEventListener("click", () => {
    const currentId = getSelectedToothForMode();
    applyLivePayloadToTooth(currentId, "captured");
    const nextMode = state.mode === "reference" ? "target" : "reference";
    setMode(nextMode);
    state.live.streamingTooth = getSelectedToothForMode();
    if (state.live.enabled && state.live.autoAssign && state.live.status === "online") {
      applyLivePayloadToTooth(state.live.streamingTooth, "live");
    }
    updateUI();
  });
}

function updateCards() {
  const reference = getMeasurement(state.referenceTooth);
  const target = getMeasurement(state.targetTooth);
  const risk = reference && target ? evaluateRisk(reference, target) : null;

  els.referenceCard.innerHTML = measurementCard("พื้นที่อ้างอิง", state.referenceTooth, reference, "reference");
  els.targetCard.innerHTML = measurementCard("พื้นที่เป้าหมาย", state.targetTooth, target, "target");
  els.differenceCard.innerHTML = differenceCard(reference, target, risk);
  els.riskCard.className = `risk-card wide ${risk ? risk.className : ""}`;
  els.riskCard.innerHTML = riskCard(risk);
}

function updateScenarioVisuals() {
  const reference = getMeasurement(state.referenceTooth);
  const target = getMeasurement(state.targetTooth);
  const risk = reference && target ? evaluateRisk(reference, target) : null;
  const scenario = scenarios[state.scenario];
  const batteryLevel = `${clampBatteryLevel(state.settings.batteryLevel)}%`;

  els.scenarioBadge.textContent = risk ? risk.level : scenario.label;
  els.simulationStatus.textContent = scenario.label;
  els.batteryText.textContent = batteryLevel;
  els.batteryStatus.style.setProperty("--battery-level", batteryLevel);

  els.scenarioGrid.querySelectorAll(".scenario-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.scenario === state.scenario);
  });
}

function measurementCard(title, toothId, data, role) {
  if (!toothId) return emptyCard(title);

  const tooth = getTooth(toothId);
  const roleText = role === "reference" ? "Reference" : "Target";
  const badgeHtml = getSourceBadgeHtml(toothId);

  if (!data) {
    return `
      <div class="card-title">
        <h3>${title}</h3>
        <div style="display:flex;align-items:center;gap:6px;">
          ${badgeHtml}
          <small>${roleText}</small>
        </div>
      </div>
      ${toothHeader(tooth)}
      <div class="empty-state">ไม่พบค่าสัญญาณ</div>
    `;
  }

  return `
    <div class="card-title">
      <h3>${title}</h3>
      <div style="display:flex;align-items:center;gap:6px;">
        ${badgeHtml}
        <small>${roleText}</small>
      </div>
    </div>
    ${toothHeader(tooth)}
    ${valueList(data)}
  `;
}

function getSourceBadgeHtml(toothId) {
  const activeSelectedTooth = getSelectedToothForMode();
  const isLiveStreaming = state.live.enabled && state.live.autoAssign && state.live.status === "online" && toothId === activeSelectedTooth;

  if (isLiveStreaming) {
    return `<span class="source-badge live">● ค่าสด ESP32</span>`;
  }
  if (state.toothSources[toothId] === "captured" || state.toothSources[toothId] === "live") {
    return `<span class="source-badge captured">✓ ค่าจาก ESP32</span>`;
  }
  return `<span class="source-badge mock">ค่าจำลอง</span>`;
}

function emptyCard(title) {
  return `
    <div class="card-title">
      <h3>${title}</h3>
    </div>
    <div class="empty-state">ยังไม่เลือกฟัน</div>
  `;
}

function toothHeader(tooth) {
  const parts = [];
  if (state.settings.showFdi) parts.push(`FDI ${tooth.id}`);
  if (state.settings.showToothName) parts.push(`${tooth.nameTh} (${tooth.nameEn})`);
  if (state.settings.showArch) parts.push(tooth.arch);
  return parts.length ? `<p class="tooth-meta">${parts.join(" · ")}</p>` : "";
}

function valueList(data) {
  const rows = [];
  if (state.settings.showTemp) rows.push(["อุณหภูมิ", `${formatNumber(data.temp)} °C`]);
  if (state.settings.showPulse) rows.push(["สัญญาณชีพจรของฟัน", `${formatNumber(data.pulse)} bpm`]);
  if (state.settings.showOxygen) rows.push(["ออกซิเจนในเนื้อเยื่อฟัน", `${formatNumber(data.oxygen)} %`]);

  if (!rows.length) return `<div class="empty-state">ซ่อนค่าจากการตั้งค่า</div>`;

  return `
    <dl class="value-list">
      ${rows.map(([label, value]) => `
        <div class="value-row">
          <dt>${label}</dt>
          <dd>${value}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function differenceCard(reference, target, risk) {
  if (!reference || !target || !risk) {
    return `
      <div class="card-title">
        <h3>ค่าผลต่าง</h3>
        <small>Difference</small>
      </div>
      <div class="empty-state">รอข้อมูลอ้างอิงและเป้าหมาย</div>
    `;
  }

  return `
    <div class="card-title">
      <h3>ค่าผลต่างและการประเมินความเสี่ยง</h3>
      <small>Computed</small>
    </div>
    ${valueList({
      temp: risk.diffTemp,
      pulse: risk.diffPulse,
      oxygen: risk.diffOxygen
    })}
  `;
}

function riskCard(risk) {
  if (!risk) {
    return `
      <div class="card-title">
        <h3>สรุปผล</h3>
      </div>
      <div class="empty-state">ยังไม่พร้อมประเมิน</div>
    `;
  }

  return `
    <div class="card-title">
      <h3>สรุปผล</h3>
      <span class="risk-level ${risk.className}">${risk.level}</span>
    </div>
    <p class="risk-message">${risk.message}</p>
    <p class="risk-note">ผลลัพธ์นี้เป็นการประเมินเบื้องต้น ควรตรวจยืนยันโดยทันตแพทย์</p>
  `;
}

function evaluateRisk(reference, target) {
  const diffTemp = Math.abs(reference.temp - target.temp);
  const diffPulse = Math.abs(reference.pulse - target.pulse);
  const diffOxygen = Math.abs(reference.oxygen - target.oxygen);
  const thresholds = state.settings.thresholds;

  if (diffTemp > thresholds.tempHigh || target.pulse < thresholds.pulseLow || diffOxygen > thresholds.oxygenHigh) {
    return {
      level: "เสี่ยงสูง",
      className: "risk-high",
      message: "มีแนวโน้มภาวะโพรงประสาทฟันผิดปกติ ควรตรวจยืนยันโดยทันตแพทย์",
      diffTemp,
      diffPulse,
      diffOxygen
    };
  }

  if (diffTemp >= thresholds.tempWarn || diffOxygen >= thresholds.oxygenWarn) {
    return {
      level: "เฝ้าระวัง",
      className: "risk-warning",
      message: "พบความแตกต่างจากพื้นที่อ้างอิง ควรตรวจซ้ำ",
      diffTemp,
      diffPulse,
      diffOxygen
    };
  }

  return {
    level: "ปกติ",
    className: "risk-normal",
    message: "ไม่พบความผิดปกติจากค่าที่ตรวจวัด",
    diffTemp,
    diffPulse,
    diffOxygen
  };
}

function saveRecord() {
  const reference = getMeasurement(state.referenceTooth);
  const target = getMeasurement(state.targetTooth);
  if (!reference || !target) return;

  const risk = evaluateRisk(reference, target);
  const now = new Date();
  const record = {
    date: now.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" }),
    patient: "Demo Patient",
    reference: describeTooth(state.referenceTooth),
    target: describeTooth(state.targetTooth),
    diffTemp: `${formatNumber(risk.diffTemp)} °C`,
    diffPulse: `${formatNumber(risk.diffPulse)} bpm`,
    diffOxygen: `${formatNumber(risk.diffOxygen)} %`,
    result: risk.level
  };

  state.history.unshift(record);
  state.history = state.history.slice(0, 20);
  persistHistory();
  renderHistory();
  switchTab("history");
}

function renderHistory() {
  if (!state.history.length) {
    els.historyBody.innerHTML = `
      <tr>
        <td colspan="8">ยังไม่มีประวัติการตรวจจำลอง</td>
      </tr>
    `;
    return;
  }

  els.historyBody.innerHTML = state.history.map((record) => `
    <tr>
      <td>${record.date}</td>
      <td>${record.patient}</td>
      <td>${record.reference}</td>
      <td>${record.target}</td>
      <td>${record.diffTemp}</td>
      <td>${record.diffPulse}</td>
      <td>${record.diffOxygen}</td>
      <td>${record.result}</td>
    </tr>
  `).join("");
}

function clearHistory() {
  state.history = [];
  persistHistory();
  renderHistory();
}

function resetSettings() {
  state.settings = structuredClone(defaultSettings);
  persistSettings();
  renderSettings();
  startFirebaseSync();
  updateUI();
}

function getTooth(id) {
  return toothMeta.find((tooth) => tooth.id === id);
}

function getMeasurement(id) {
  return state.toothData[id] || null;
}

function describeTooth(id) {
  const tooth = getTooth(id);
  return `${id} ${tooth.nameTh}`;
}

function formatNumber(value) {
  return Number.isInteger(value) ? value.toString() : Number(value).toFixed(1);
}

function escapeAttr(str) {
  return String(str || "").replace(/"/g, "&quot;");
}

function clampBatteryLevel(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return defaultSettings.batteryLevel;
  return Math.min(100, Math.max(0, Math.round(number)));
}

function loadSettings() {
  const saved = readJson(STORAGE_KEYS.settings);
  if (!saved) return structuredClone(defaultSettings);
  return {
    ...structuredClone(defaultSettings),
    ...saved,
    enabledGroups: {
      ...defaultSettings.enabledGroups,
      ...(saved.enabledGroups || {})
    },
    thresholds: {
      ...defaultSettings.thresholds,
      ...(saved.thresholds || {})
    },
    firebase: {
      ...defaultSettings.firebase,
      ...(saved.firebase || {})
    }
  };
}

function loadHistory() {
  return readJson(STORAGE_KEYS.history) || [
    {
      date: "28 มิ.ย. 2569 09:30",
      patient: "Demo Patient",
      reference: "17 ฟันกรามซี่ที่สอง",
      target: "23 ฟันเขี้ยว",
      diffTemp: "8.3 °C",
      diffPulse: "78 bpm",
      diffOxygen: "85 %",
      result: "เสี่ยงสูง"
    }
  ];
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function persistSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
}

function persistHistory() {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
}

init();
