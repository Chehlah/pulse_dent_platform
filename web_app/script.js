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

const DEVICE_CHANNELS = ["temp", "pulse"];

const CHANNEL_META = {
  temp: {
    key: "temp",
    labelTh: "อุณหภูมิ",
    shortLabel: "Temp",
    modeNumber: 1,
    defaultUnit: "°C",
    expectedType: "temperature"
  },
  pulse: {
    key: "pulse",
    labelTh: "สัญญาณชีพจร",
    shortLabel: "Pulse",
    modeNumber: 2,
    defaultUnit: "bpm",
    expectedType: "pulse"
  }
};

function createDeviceChannelState(channelKey) {
  return {
    key: channelKey,
    reportedType: "",
    status: "connecting", // "online" | "stale" | "offline" | "connecting"
    measuring: false,
    pendingCommand: null, // "start" | "stop" | null
    commandError: "",
    lastSeen: 0,
    lastHeartbeatAt: 0,
    payload: null, // { temperature, pulse, oxygen, unit, status, sensorType, timestamp }
    lastReceivedAt: 0,
    errorMessage: ""
  };
}

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
    tempDeviceId: "pulse-dent-01",
    pulseDeviceId: "pulse-dent-02",
    pollIntervalMs: 1000
  }
};

const state = {
  mode: "target",
  referenceTooth: "17",
  targetTooth: "23",
  scenario: "high",
  toothData: structuredClone(baseToothData),
  toothSources: {}, // toothId -> { mode: "live" | "captured", sensors: ["temp" | "pulse"] }
  settings: loadSettings(),
  history: loadHistory(),
  live: {
    enabled: true,
    autoAssign: false, // true: คลิกฟันซี่ไหน ค่าจาก ESP32 วิ่งเข้าซี่นั้นทันที, false: รอกดปุ่มส่งค่าเข้าซี่ฟัน
    streamingTooth: "23",
    devices: {
      temp: createDeviceChannelState("temp"),
      pulse: createDeviceChannelState("pulse")
    }
  }
};

const firebaseHandles = {
  temp: { eventSource: null, pollTimer: null, commandTimeoutTimer: null },
  pulse: { eventSource: null, pollTimer: null, commandTimeoutTimer: null }
};
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
      if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
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
    if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
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
        <label for="fbTempDeviceId">Device ID — อุณหภูมิ (Mode 1)</label>
        <input id="fbTempDeviceId" type="text" value="${escapeAttr(fb.tempDeviceId)}" placeholder="pulse-dent-01">
      </div>
      <div class="threshold-field">
        <label for="fbPulseDeviceId">Device ID — ชีพจร (Mode 2)</label>
        <input id="fbPulseDeviceId" type="text" value="${escapeAttr(fb.pulseDeviceId)}" placeholder="pulse-dent-02">
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
      const rawTempDevice = els.firebaseSettings.querySelector("#fbTempDeviceId").value.trim();
      const rawPulseDevice = els.firebaseSettings.querySelector("#fbPulseDeviceId").value.trim();
      const rawInterval = Math.max(500, Number(els.firebaseSettings.querySelector("#fbPollInterval").value) || 1000);

      state.settings.firebase = {
        databaseUrl: rawUrl || defaultSettings.firebase.databaseUrl,
        tempDeviceId: rawTempDevice,
        pulseDeviceId: rawPulseDevice,
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

  const prevStreaming = state.live.streamingTooth;
  if (prevStreaming && prevStreaming !== toothId && state.toothSources[prevStreaming]?.mode === "live") {
    state.toothSources[prevStreaming] = {
      ...state.toothSources[prevStreaming],
      mode: "captured"
    };
  }

  if (state.mode === "reference") {
    state.referenceTooth = toothId;
  } else {
    state.targetTooth = toothId;
  }

  state.live.streamingTooth = toothId;

  if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
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
  if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
    applyLivePayloadToTooth(state.live.streamingTooth, "live");
  }

  if (shouldRender) updateUI();
}

// ==========================================
// Firebase Realtime Database Sync (Dual ESP32: Temp + Pulse)
// ==========================================

const STALE_TIMEOUT_MS = 6000;    // เกิน 6 วินาทีที่ Heartbeat/ค่าไม่อัปเดต -> สัญญาณไม่อัปเดต (stale)
const OFFLINE_TIMEOUT_MS = 12000; // เกิน 12 วินาทีที่ Heartbeat/ค่าไม่อัปเดต -> ESP32 ออฟไลน์ (offline)
const COMMAND_TIMEOUT_MS = 8000;  // เกิน 8 วินาทีที่ ESP32 ไม่ยืนยัน state/measuring -> คำสั่งหมดเวลา

function getDeviceIdForChannel(channelKey) {
  const fb = state.settings.firebase || defaultSettings.firebase;
  if (channelKey === "temp") {
    return String(fb.tempDeviceId || "").trim();
  }
  return String(fb.pulseDeviceId || "").trim();
}

function getFirebaseDeviceBaseUrl(channelKey) {
  const fb = state.settings.firebase || defaultSettings.firebase;
  const baseUrl = (fb.databaseUrl || defaultSettings.firebase.databaseUrl).replace(/\/+$/, "");
  const deviceId = getDeviceIdForChannel(channelKey);
  if (!deviceId) return "";
  return `${baseUrl}/devices/${encodeURIComponent(deviceId)}`;
}

function getFirebaseEndpointUrl(channelKey) {
  const base = getFirebaseDeviceBaseUrl(channelKey);
  return base ? `${base}.json` : "";
}

function getFirebaseControlCommandUrl(channelKey) {
  const base = getFirebaseDeviceBaseUrl(channelKey);
  return base ? `${base}/control/command.json` : "";
}

function isChannelOnline(channelKey) {
  const dev = state.live.devices[channelKey];
  return state.live.enabled && Boolean(dev) && dev.status === "online";
}

function isChannelMeasuringWithData(channelKey) {
  const dev = state.live.devices[channelKey];
  if (!isChannelOnline(channelKey) || !dev.measuring || !dev.payload) return false;
  if (channelKey === "temp") return Number.isFinite(dev.payload.temperature);
  if (channelKey === "pulse") return Number.isFinite(dev.payload.pulse);
  return false;
}

function getOnlineChannels() {
  return DEVICE_CHANNELS.filter((ch) => isChannelOnline(ch));
}

function getMeasuringChannelsWithData() {
  return DEVICE_CHANNELS.filter((ch) => isChannelMeasuringWithData(ch));
}

function hasAnyMeasuringWithData() {
  return getMeasuringChannelsWithData().length > 0;
}

function evaluateChannelConnectionStatus(channelKey) {
  const dev = state.live.devices[channelKey];
  if (!state.live.enabled || !getDeviceIdForChannel(channelKey)) {
    dev.status = "offline";
    return;
  }

  const lastActiveAt = Math.max(dev.lastHeartbeatAt || 0, dev.lastReceivedAt || 0);
  if (!lastActiveAt) {
    dev.status = dev.errorMessage ? "offline" : "connecting";
    return;
  }

  const ageMs = Date.now() - lastActiveAt;
  if (ageMs <= STALE_TIMEOUT_MS) {
    dev.status = "online";
  } else if (ageMs <= OFFLINE_TIMEOUT_MS) {
    dev.status = "stale";
  } else {
    dev.status = "offline";
  }
}

function clearChannelCommandTimeout(channelKey) {
  const handle = firebaseHandles[channelKey];
  if (handle.commandTimeoutTimer) {
    clearTimeout(handle.commandTimeoutTimer);
    handle.commandTimeoutTimer = null;
  }
}

async function sendToggleMeasurementCommand(channelKey, forcedTargetState = null) {
  const dev = state.live.devices[channelKey];
  if (!isChannelOnline(channelKey)) return;
  if (dev.pendingCommand) return;

  const targetMeasuring = forcedTargetState !== null ? Boolean(forcedTargetState) : !dev.measuring;
  if (targetMeasuring === dev.measuring) return;

  const commandStr = targetMeasuring ? "start" : "stop";
  const endpointUrl = getFirebaseControlCommandUrl(channelKey);
  if (!endpointUrl) return;

  dev.pendingCommand = commandStr;
  dev.commandError = "";
  updateUI();

  clearChannelCommandTimeout(channelKey);
  firebaseHandles[channelKey].commandTimeoutTimer = setTimeout(() => {
    if (dev.pendingCommand === commandStr) {
      dev.pendingCommand = null;
      dev.commandError = `คำสั่ง "${commandStr === "start" ? "เริ่มการวัด" : "หยุดการวัด"}" หมดเวลา (ไม่ตอบกลับภายใน ${COMMAND_TIMEOUT_MS / 1000} วินาที)`;
      updateUI();
    }
  }, COMMAND_TIMEOUT_MS);

  try {
    const response = await fetch(endpointUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commandStr)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    fetchFirebaseDevice(channelKey, getFirebaseEndpointUrl(channelKey));
  } catch (err) {
    clearChannelCommandTimeout(channelKey);
    dev.pendingCommand = null;
    dev.commandError = `ส่งคำสั่งไม่สำเร็จ (${err.message || "เครือข่ายขัดข้อง"})`;
    updateUI();
  }
}

function sendBatchMeasurementCommand(targetMeasuring) {
  getOnlineChannels().forEach((channelKey) => {
    sendToggleMeasurementCommand(channelKey, targetMeasuring);
  });
}

function startFirebaseSync() {
  stopFirebaseSync();

  if (!state.live.enabled) {
    DEVICE_CHANNELS.forEach((ch) => {
      state.live.devices[ch].status = "offline";
      state.live.devices[ch].measuring = false;
      state.live.devices[ch].pendingCommand = null;
    });
    updateUI();
    return;
  }

  const intervalMs = Math.max(500, Number(state.settings.firebase?.pollIntervalMs) || 1000);

  DEVICE_CHANNELS.forEach((channelKey) => {
    const dev = state.live.devices[channelKey];
    const endpoint = getFirebaseEndpointUrl(channelKey);

    dev.lastReceivedAt = 0;
    dev.lastHeartbeatAt = 0;
    dev.pendingCommand = null;
    dev.commandError = "";
    dev.errorMessage = "";

    if (!endpoint) {
      dev.status = "offline";
      dev.errorMessage = "ไม่ได้ระบุ Device ID";
      return;
    }

    dev.status = "connecting";

    // ดึงค่าครั้งแรกทันทีด้วย fetch
    fetchFirebaseDevice(channelKey, endpoint);

    // เปิด Server-Sent Events (SSE) สำหรับอุปกรณ์นี้
    if (typeof EventSource !== "undefined") {
      try {
        const es = new EventSource(endpoint);
        const onSseEvent = (event) => {
          try {
            const packet = JSON.parse(event.data);
            if (packet && packet.path !== undefined) {
              handleSsePacket(channelKey, packet.path, packet.data);
            }
          } catch {
            // fallback to polling
          }
        };
        es.addEventListener("put", onSseEvent);
        es.addEventListener("patch", onSseEvent);
        es.onerror = () => {
          // หาก SSE ขัดข้อง ระบบยังมี polling ทำงานคู่ขนาน
        };
        firebaseHandles[channelKey].eventSource = es;
      } catch {
        firebaseHandles[channelKey].eventSource = null;
      }
    }

    // ตั้งเวลา Polling สำรอง
    firebaseHandles[channelKey].pollTimer = setInterval(() => {
      if (state.live.enabled) {
        fetchFirebaseDevice(channelKey, endpoint);
      }
    }, intervalMs);
  });

  // ตรวจสอบสถานะ stale/offline ของทุกอุปกรณ์ทุก 1 วินาที
  staleCheckTimer = setInterval(() => {
    if (!state.live.enabled) return;
    let changed = false;
    DEVICE_CHANNELS.forEach((ch) => {
      const prevStatus = state.live.devices[ch].status;
      evaluateChannelConnectionStatus(ch);
      if (state.live.devices[ch].status !== prevStatus) {
        changed = true;
      }
    });
    if (changed) {
      updateUI();
    }
  }, 1000);

  updateUI();
}

function stopFirebaseSync() {
  DEVICE_CHANNELS.forEach((ch) => {
    clearChannelCommandTimeout(ch);
    if (firebaseHandles[ch].eventSource) {
      firebaseHandles[ch].eventSource.close();
      firebaseHandles[ch].eventSource = null;
    }
    if (firebaseHandles[ch].pollTimer) {
      clearInterval(firebaseHandles[ch].pollTimer);
      firebaseHandles[ch].pollTimer = null;
    }
  });
  if (staleCheckTimer) {
    clearInterval(staleCheckTimer);
    staleCheckTimer = null;
  }
}

async function fetchFirebaseDevice(channelKey, endpoint) {
  if (!endpoint) return;
  const dev = state.live.devices[channelKey];
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && typeof data === "object") {
      handleIncomingDeviceSnapshot(channelKey, data);
    } else {
      dev.status = "offline";
      dev.errorMessage = "ยังไม่มีข้อมูลจาก ESP32 ใน Firebase";
      updateUI();
    }
  } catch (err) {
    dev.errorMessage = err.message || "เชื่อมต่อ Firebase ไม่สำเร็จ";
    evaluateChannelConnectionStatus(channelKey);
    const lastActiveAt = Math.max(dev.lastHeartbeatAt || 0, dev.lastReceivedAt || 0);
    if (!lastActiveAt || Date.now() - lastActiveAt > STALE_TIMEOUT_MS) {
      dev.status = "offline";
    }
    updateUI();
  }
}

function handleSsePacket(channelKey, path, data) {
  const dev = state.live.devices[channelKey];
  if (!path || path === "/") {
    if (data && typeof data === "object") {
      handleIncomingDeviceSnapshot(channelKey, data);
    }
    return;
  }

  if (path === "/state" && data && typeof data === "object") {
    handleIncomingStateData(channelKey, data);
  } else if (path === "/state/measuring") {
    handleIncomingStateData(channelKey, { measuring: Boolean(data), lastSeen: dev.lastSeen, sensorType: dev.reportedType });
  } else if (path === "/state/lastSeen") {
    handleIncomingStateData(channelKey, { measuring: dev.measuring, lastSeen: Number(data), sensorType: dev.reportedType });
  } else if (path === "/state/sensorType") {
    handleIncomingStateData(channelKey, { measuring: dev.measuring, lastSeen: dev.lastSeen, sensorType: String(data || "") });
  } else if (path === "/latest" && data && typeof data === "object") {
    handleIncomingLatestData(channelKey, data);
  }
}

function handleIncomingDeviceSnapshot(channelKey, snapshot) {
  if (snapshot.state && typeof snapshot.state === "object") {
    handleIncomingStateData(channelKey, snapshot.state);
  }
  if (snapshot.latest && typeof snapshot.latest === "object") {
    handleIncomingLatestData(channelKey, snapshot.latest);
  } else if (snapshot.temperature !== undefined || snapshot.temp !== undefined || snapshot.pulse !== undefined) {
    handleIncomingLatestData(channelKey, snapshot);
  }
}

function handleIncomingStateData(channelKey, stateObj) {
  const dev = state.live.devices[channelKey];
  const prevStatus = dev.status;
  const prevMeasuring = dev.measuring;
  const prevPending = dev.pendingCommand;
  const prevType = dev.reportedType;

  if (typeof stateObj.sensorType === "string" && stateObj.sensorType.trim()) {
    dev.reportedType = stateObj.sensorType.trim().toLowerCase();
  }

  if (typeof stateObj.measuring === "boolean") {
    dev.measuring = stateObj.measuring;

    if (
      (dev.pendingCommand === "start" && dev.measuring === true) ||
      (dev.pendingCommand === "stop" && dev.measuring === false)
    ) {
      clearChannelCommandTimeout(channelKey);
      dev.pendingCommand = null;
      dev.commandError = "";
    }
  }

  const incomingLastSeen = typeof stateObj.lastSeen === "number" && stateObj.lastSeen > 0 ? stateObj.lastSeen : null;
  if (incomingLastSeen !== null) {
    const isFirstSeen = !dev.lastSeen;
    const isNewHeartbeat = isFirstSeen || incomingLastSeen !== dev.lastSeen;
    dev.lastSeen = incomingLastSeen;

    if (isFirstSeen) {
      const serverAgeMs = Date.now() - incomingLastSeen;
      dev.lastHeartbeatAt = serverAgeMs > STALE_TIMEOUT_MS ? incomingLastSeen : Date.now();
    } else if (isNewHeartbeat) {
      dev.lastHeartbeatAt = Date.now();
    }
  }

  dev.errorMessage = "";
  evaluateChannelConnectionStatus(channelKey);

  if (
    dev.status !== prevStatus ||
    dev.measuring !== prevMeasuring ||
    dev.pendingCommand !== prevPending ||
    dev.reportedType !== prevType
  ) {
    updateUI();
  }
}

function handleIncomingLatestData(channelKey, raw) {
  const dev = state.live.devices[channelKey];
  const rawTemp = raw.temperature ?? raw.temp;
  const hasTemp = rawTemp !== undefined && rawTemp !== null && Number.isFinite(Number(rawTemp));
  const hasPulse = raw.pulse !== undefined && raw.pulse !== null && Number.isFinite(Number(raw.pulse));
  const hasOxygen = raw.oxygen !== undefined && raw.oxygen !== null && Number.isFinite(Number(raw.oxygen));

  if (!hasTemp && !hasPulse) return;

  if (typeof raw.sensorType === "string" && raw.sensorType.trim()) {
    dev.reportedType = raw.sensorType.trim().toLowerCase();
  }

  const incomingTimestamp = typeof raw.timestamp === "number" && raw.timestamp > 0 ? raw.timestamp : null;
  const prevPayload = dev.payload;
  const isFirstFetch = !prevPayload;
  const isNewPacket =
    isFirstFetch ||
    (incomingTimestamp !== null && incomingTimestamp !== prevPayload.timestamp) ||
    (incomingTimestamp === null && (
      (hasTemp && Number(rawTemp) !== prevPayload.temperature) ||
      (hasPulse && Number(raw.pulse) !== prevPayload.pulse)
    ));

  if (isFirstFetch) {
    if (incomingTimestamp !== null) {
      const serverAgeMs = Date.now() - incomingTimestamp;
      dev.lastReceivedAt = serverAgeMs > STALE_TIMEOUT_MS ? incomingTimestamp : Date.now();
    } else {
      dev.lastReceivedAt = Date.now();
    }
  } else if (isNewPacket) {
    dev.lastReceivedAt = Date.now();
  }

  const prevStatus = dev.status;
  dev.payload = {
    temperature: hasTemp ? Number(rawTemp) : null,
    pulse: hasPulse ? Number(raw.pulse) : null,
    oxygen: hasOxygen ? Number(raw.oxygen) : null,
    unit: raw.unit || (channelKey === "temp" ? "C" : "bpm"),
    status: raw.status || "online",
    sensorType: dev.reportedType || CHANNEL_META[channelKey].expectedType,
    timestamp: incomingTimestamp ?? (prevPayload?.timestamp || Date.now())
  };

  dev.errorMessage = "";
  evaluateChannelConnectionStatus(channelKey);

  // อัปเดตค่าเข้าซี่ฟันอัตโนมัติเฉพาะเมื่อ ESP32 Online และอยู่ในสถานะ Measuring เท่านั้น
  if (state.live.enabled && state.live.autoAssign && dev.status === "online" && dev.measuring && isNewPacket) {
    const activeTooth = getSelectedToothForMode();
    state.live.streamingTooth = activeTooth;
    applyLivePayloadToTooth(activeTooth, "live");
  }

  if (isNewPacket || dev.status !== prevStatus) {
    updateUI();
  }
}

function applyLivePayloadToTooth(toothId, sourceType = "live") {
  if (!toothId) return;

  const existing = state.toothData[toothId] || baseToothData[toothId] || { temp: 36.2, pulse: 76, oxygen: 85 };
  let nextTemp = existing.temp;
  let nextPulse = existing.pulse;
  let nextOxygen = existing.oxygen;
  const appliedSensors = [];

  if (isChannelMeasuringWithData("temp")) {
    const p = state.live.devices.temp.payload;
    if (p && p.temperature !== null) {
      nextTemp = Number(p.temperature.toFixed(1));
      appliedSensors.push("temp");
    }
    if (p && p.oxygen !== null) {
      nextOxygen = p.oxygen;
    }
  }

  if (isChannelMeasuringWithData("pulse")) {
    const p = state.live.devices.pulse.payload;
    if (p && p.pulse !== null) {
      nextPulse = Math.round(p.pulse);
      appliedSensors.push("pulse");
    }
    if (p && p.oxygen !== null) {
      nextOxygen = p.oxygen;
    }
  }

  if (!appliedSensors.length) return;

  state.toothData[toothId] = {
    temp: nextTemp,
    pulse: nextPulse,
    oxygen: nextOxygen
  };

  const prevSensors = state.toothSources[toothId]?.sensors || [];
  const mergedSensors = Array.from(new Set([...prevSensors, ...appliedSensors]));
  state.toothSources[toothId] = {
    mode: sourceType,
    sensors: mergedSensors
  };
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

  const onlineChannels = getOnlineChannels();
  if (onlineChannels.length > 0) {
    const tempDev = state.live.devices.temp;
    const pulseDev = state.live.devices.pulse;
    const sensorNames = onlineChannels.map((ch) => CHANNEL_META[ch].shortLabel).join(" + ");
    const readingParts = [];

    if (isChannelOnline("temp")) {
      readingParts.push(
        isChannelMeasuringWithData("temp")
          ? `${formatNumber(tempDev.payload.temperature)} °C`
          : "--.-- °C"
      );
    }
    if (isChannelOnline("pulse")) {
      readingParts.push(
        isChannelMeasuringWithData("pulse")
          ? `${Math.round(pulseDev.payload.pulse)} bpm`
          : "-- bpm"
      );
    }

    const anyMeasuring = onlineChannels.some((ch) => state.live.devices[ch].measuring);
    const modeText = anyMeasuring ? "Measuring" : "Standby";
    els.headerStatusText.textContent = `ESP32 (${sensorNames}): Online · ${modeText} (${readingParts.join(" · ")})`;
    return;
  }

  const statuses = DEVICE_CHANNELS.map((ch) => state.live.devices[ch].status);
  if (statuses.includes("stale")) {
    els.headerStatusDot.classList.add("stale");
    els.headerStatusText.textContent = "ESP32 สัญญาณไม่อัปเดต";
  } else if (statuses.includes("connecting")) {
    els.headerStatusDot.classList.add("stale");
    els.headerStatusText.textContent = "กำลังเชื่อมต่อ Firebase...";
  } else {
    els.headerStatusDot.classList.add("offline");
    els.headerStatusText.textContent = "ESP32: Offline · ไม่พร้อมวัด";
  }
}

function updateToothButtons() {
  const activeSelectedTooth = getSelectedToothForMode();
  const anyLiveStreaming = state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData();

  els.toothLayer.querySelectorAll(".tooth-button").forEach((button) => {
    const id = button.dataset.tooth;
    const tooth = getTooth(id);
    const hidden = !state.settings.enabledGroups[tooth.group];
    const isStreaming = anyLiveStreaming && id === activeSelectedTooth;
    const isEspAssigned = Boolean(state.toothSources[id]?.sensors?.length);

    button.classList.toggle("reference", id === state.referenceTooth);
    button.classList.toggle("target", id === state.targetTooth);
    button.classList.toggle("live-streaming", isStreaming);
    button.classList.toggle("esp-assigned", isEspAssigned);
    button.classList.toggle("hidden-group", hidden);
    button.classList.toggle("show-fdi", state.settings.showFdi);
    button.setAttribute("aria-disabled", hidden ? "true" : "false");
  });
}

function renderDeviceModuleCard(channelKey) {
  const meta = CHANNEL_META[channelKey];
  const dev = state.live.devices[channelKey];
  const deviceId = getDeviceIdForChannel(channelKey) || "ยังไม่กำหนด";
  const isOnline = isChannelOnline(channelKey);
  const isMeasuring = isOnline && dev.measuring;
  const hasData = isChannelMeasuringWithData(channelKey);
  const pendingCmd = dev.pendingCommand;

  let connPillClass = "offline";
  let connPillText = "Offline";
  if (state.live.enabled) {
    if (dev.status === "online") {
      connPillClass = "online";
      connPillText = "Online";
    } else if (dev.status === "stale") {
      connPillClass = "stale";
      connPillText = "สัญญาณไม่อัปเดต";
    } else if (dev.status === "connecting") {
      connPillClass = "stale";
      connPillText = "กำลังเชื่อมต่อ...";
    }
  } else {
    connPillText = "ปิดใช้งาน";
  }

  let measurePillClass = "standby";
  let measurePillText = "ไม่พร้อมวัด";
  if (isOnline) {
    if (pendingCmd === "start") {
      measurePillClass = "pending";
      measurePillText = "กำลังเริ่ม...";
    } else if (pendingCmd === "stop") {
      measurePillClass = "pending";
      measurePillText = "กำลังหยุด...";
    } else if (dev.measuring) {
      measurePillClass = "measuring";
      measurePillText = "Measuring";
    } else {
      measurePillClass = "standby";
      measurePillText = "Standby";
    }
  }

  let valueDisplay = channelKey === "temp" ? "--.-- °C" : "-- bpm";
  if (hasData) {
    if (channelKey === "temp") {
      valueDisplay = `${dev.payload.temperature.toFixed(2)} °${dev.payload.unit || "C"}`;
    } else {
      valueDisplay = `${Math.round(dev.payload.pulse)} ${dev.payload.unit || "bpm"}`;
    }
  }

  const lastUpdateTs = isMeasuring
    ? dev.payload?.timestamp
    : (dev.lastSeen || dev.payload?.timestamp);
  const timeDisplay = lastUpdateTs
    ? new Date(lastUpdateTs).toLocaleTimeString("th-TH")
    : "ยังไม่มีข้อมูล";

  let toggleBtnLabel = "เริ่มการวัด";
  let toggleBtnClass = "measure-toggle-btn start";
  if (pendingCmd === "start") {
    toggleBtnLabel = "กำลังเริ่ม...";
    toggleBtnClass = "measure-toggle-btn pending";
  } else if (pendingCmd === "stop") {
    toggleBtnLabel = "กำลังหยุด...";
    toggleBtnClass = "measure-toggle-btn pending";
  } else if (isMeasuring) {
    toggleBtnLabel = "หยุดการวัด";
    toggleBtnClass = "measure-toggle-btn stop";
  }
  const isToggleDisabled = !isOnline || Boolean(pendingCmd);

  const cardStateClass = isMeasuring ? "measuring" : (isOnline ? "online" : "");
  const valueClass = `live-temp-value ${channelKey === "pulse" ? "pulse-value" : ""} ${hasData ? "" : "standby-value"}`;
  const errorHtml = dev.commandError
    ? `<div class="command-error-banner" role="alert">${escapeAttr(dev.commandError)}</div>`
    : "";

  return `
    <div class="device-module-card ${cardStateClass}">
      <div class="device-module-head">
        <span class="device-module-name">
          ${meta.labelTh} (Mode ${meta.modeNumber})
        </span>
        <span class="device-module-id">${escapeAttr(deviceId)}</span>
      </div>
      <div class="device-module-pills">
        <span class="live-pill ${connPillClass}">Connection: ${connPillText}</span>
        <span class="live-pill ${measurePillClass}">${measurePillText}</span>
      </div>
      ${errorHtml}
      <div class="device-module-reading">
        <span class="${valueClass}">${valueDisplay}</span>
        <button
          class="${toggleBtnClass}"
          type="button"
          data-toggle-channel="${channelKey}"
          ${isToggleDisabled ? "disabled" : ""}
        >
          ${toggleBtnLabel}
        </button>
      </div>
      <div class="live-sub-metrics">
        <span>ซิงก์ล่าสุด: <strong>${timeDisplay}</strong></span>
      </div>
    </div>
  `;
}

function updateLiveSensorCard() {
  if (!els.liveSensorCard) return;

  const activeToothId = getSelectedToothForMode();
  const activeTooth = getTooth(activeToothId);
  const modeLabel = state.mode === "reference" ? "พื้นที่อ้างอิง (สีเขียว)" : "พื้นที่เป้าหมาย (สีส้ม)";

  const onlineChannels = getOnlineChannels();
  const measuringChannels = getMeasuringChannelsWithData();
  const canApplyLiveData = measuringChannels.length > 0;

  // ป้ายสรุปว่าเชื่อมต่อกับเซ็นเซอร์แบบใดอยู่ (1 ชนิด หรือ 2 ชนิดพร้อมกัน)
  let summaryPillClass = "offline";
  let summaryPillText = "ยังไม่พบอุปกรณ์ออนไลน์";
  if (!state.live.enabled) {
    summaryPillText = "ปิดรับค่า ESP32 (โหมดจำลอง)";
  } else if (onlineChannels.length === 2) {
    summaryPillClass = "dual";
    summaryPillText = "เชื่อมต่อ 2 ชนิด: อุณหภูมิ + ชีพจร";
  } else if (onlineChannels.length === 1) {
    summaryPillClass = "";
    const ch = onlineChannels[0];
    summaryPillText = `เชื่อมต่อ 1 ชนิด: ${CHANNEL_META[ch].labelTh}`;
  }

  // แถบควบคุมพร้อมกัน 2 ตัว (แสดงเมื่อเชื่อมต่อพร้อมกัน 2 โมดูล)
  const bothOnline = onlineChannels.length === 2;
  const anyNotMeasuring = onlineChannels.some((ch) => !state.live.devices[ch].measuring);
  const anyMeasuring = onlineChannels.some((ch) => state.live.devices[ch].measuring);
  const anyPending = onlineChannels.some((ch) => Boolean(state.live.devices[ch].pendingCommand));

  const batchBarHtml = bothOnline
    ? `
      <div class="live-batch-bar">
        <span><strong>ควบคุมพร้อมกัน 2 โมดูล</strong> (อุณหภูมิ + ชีพจร)</span>
        <div class="live-batch-actions">
          <button class="primary-button small" id="startAllModulesBtn" type="button" ${!anyNotMeasuring || anyPending ? "disabled" : ""}>เริ่มวัดทั้งหมด</button>
          <button class="secondary-button small" id="stopAllModulesBtn" type="button" ${!anyMeasuring || anyPending ? "disabled" : ""}>หยุดทั้งหมด</button>
        </div>
      </div>
    `
    : "";

  const activeSensorDesc = measuringChannels.length
    ? `กำลังรับค่าสด: ${measuringChannels.map((ch) => CHANNEL_META[ch].labelTh).join(" + ")} (${measuringChannels.length} ชนิด) — ค่าที่ไม่ได้ส่งจาก ESP32 จะคงค่าจำลองของซี่ฟันไว้`
    : (onlineChannels.length
        ? "อุปกรณ์อยู่ในโหมด Standby กดปุ่ม 'เริ่มการวัด' บนเว็บ หรือกดปุ่มที่บอร์ด ESP32 (GPIO 18) ของโมดูลที่ต้องการ"
        : "ESP32 ออฟไลน์หรือไม่พร้อมวัด ปุ่มเริ่มการวัดจะเปิดใช้งานเมื่อโมดูลอุณหภูมิหรือชีพจรออนไลน์");

  els.liveSensorCard.className = `live-sensor-card ${state.live.enabled ? "" : "disabled"}`;
  els.liveSensorCard.innerHTML = `
    <div class="live-sensor-header">
      <div class="live-sensor-title">
        <h3>สัญญาณจากอุปกรณ์ ESP32 (Firebase)</h3>
        <span class="live-summary-pill ${summaryPillClass}">${summaryPillText}</span>
      </div>
      <label class="live-toggle-wrap" for="toggleLiveFirebase">
        <input id="toggleLiveFirebase" type="checkbox" ${state.live.enabled ? "checked" : ""}>
        <span>เปิดรับค่าจาก ESP32</span>
      </label>
    </div>

    <div class="live-sensor-body">
      ${batchBarHtml}
      <div class="dual-device-grid">
        ${renderDeviceModuleCard("temp")}
        ${renderDeviceModuleCard("pulse")}
      </div>

      <div class="live-route-box">
        <div class="live-route-target">
          <span>ซี่ฟันที่เลือกบนแผนผัง (${modeLabel}):</span>
          <strong>FDI ${activeTooth.id} (${activeTooth.nameTh})</strong>
        </div>
        <small style="color:var(--muted);">${activeSensorDesc}</small>
      </div>
    </div>

    <div class="live-sensor-controls">
      <div class="live-mode-options">
        <label for="toggleAutoAssign">
          <input id="toggleAutoAssign" type="checkbox" ${state.live.autoAssign ? "checked" : ""} ${state.live.enabled ? "" : "disabled"}>
          <span>ส่งค่าสดเข้าฟันซี่ที่คลิกเลือกอัตโนมัติขณะกำลังวัด (Real-time)</span>
        </label>
      </div>
      <div class="live-action-buttons">
        <button class="primary-button small" id="assignToSelectedToothBtn" type="button" ${!canApplyLiveData ? "disabled" : ""}>
          นำค่านี้ไปใส่ฟัน ${activeTooth.id} (${state.mode === "reference" ? "อ้างอิง" : "เป้าหมาย"})
        </button>
        <button class="secondary-button small" id="lockAndSwitchModeBtn" type="button" ${!canApplyLiveData ? "disabled" : ""}>
          ล็อกค่าฟัน ${activeTooth.id} แล้วสลับไปเลือก${state.mode === "reference" ? "เป้าหมาย" : "อ้างอิง"}
        </button>
      </div>
    </div>
  `;

  els.liveSensorCard.querySelectorAll("[data-toggle-channel]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendToggleMeasurementCommand(btn.dataset.toggleChannel);
    });
  });

  const startAllBtn = els.liveSensorCard.querySelector("#startAllModulesBtn");
  if (startAllBtn) {
    startAllBtn.addEventListener("click", () => sendBatchMeasurementCommand(true));
  }
  const stopAllBtn = els.liveSensorCard.querySelector("#stopAllModulesBtn");
  if (stopAllBtn) {
    stopAllBtn.addEventListener("click", () => sendBatchMeasurementCommand(false));
  }

  els.liveSensorCard.querySelector("#toggleLiveFirebase").addEventListener("change", (e) => {
    state.live.enabled = e.target.checked;
    if (state.live.enabled) {
      startFirebaseSync();
    } else {
      stopFirebaseSync();
      DEVICE_CHANNELS.forEach((ch) => {
        state.live.devices[ch].status = "offline";
        state.live.devices[ch].measuring = false;
        state.live.devices[ch].pendingCommand = null;
      });
      updateUI();
    }
  });

  els.liveSensorCard.querySelector("#toggleAutoAssign").addEventListener("change", (e) => {
    state.live.autoAssign = e.target.checked;
    if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
      applyLivePayloadToTooth(getSelectedToothForMode(), "live");
    }
    updateUI();
  });

  els.liveSensorCard.querySelector("#assignToSelectedToothBtn").addEventListener("click", () => {
    if (!canApplyLiveData) return;
    const targetId = getSelectedToothForMode();
    applyLivePayloadToTooth(targetId, state.live.autoAssign ? "live" : "captured");
    updateUI();
  });

  els.liveSensorCard.querySelector("#lockAndSwitchModeBtn").addEventListener("click", () => {
    if (!canApplyLiveData) return;
    const currentId = getSelectedToothForMode();
    applyLivePayloadToTooth(currentId, "captured");
    const nextMode = state.mode === "reference" ? "target" : "reference";
    setMode(nextMode);
    state.live.streamingTooth = getSelectedToothForMode();
    if (state.live.enabled && state.live.autoAssign && hasAnyMeasuringWithData()) {
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
  const measuringChannels = getMeasuringChannelsWithData();
  const isLiveStreaming = state.live.enabled && state.live.autoAssign && measuringChannels.length > 0 && toothId === activeSelectedTooth;

  if (isLiveStreaming) {
    const label = measuringChannels.map((ch) => CHANNEL_META[ch].shortLabel).join("+");
    return `<span class="source-badge live">● สด ESP32 (${label})</span>`;
  }

  const source = state.toothSources[toothId];
  if (source?.sensors?.length) {
    const label = source.sensors.map((ch) => CHANNEL_META[ch].shortLabel).join("+");
    return `<span class="source-badge captured">✓ ESP32 (${label})</span>`;
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

  const savedFb = saved.firebase || {};
  const migratedTempId = savedFb.tempDeviceId !== undefined
    ? savedFb.tempDeviceId
    : (savedFb.deviceId || defaultSettings.firebase.tempDeviceId);

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
      ...savedFb,
      tempDeviceId: migratedTempId
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
