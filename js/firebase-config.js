// ============================================================
// FIREBASE CONFIGURATION - Hyundai Polytech Mexico v2.0
// ============================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAi-OwGl7or8Dr0imFOxhUHOomDLaz5ncE",
  authDomain: "hyundai-polytech-moldes.firebaseapp.com",
  projectId: "hyundai-polytech-moldes",
  storageBucket: "hyundai-polytech-moldes.firebasestorage.app",
  messagingSenderId: "614472533252",
  appId: "1:614472533252:web:94f50f92280d3ef4dbbc51"
};

const DEPT_PASSWORDS = {
  procesos:      "Mf2026",
  calidad:       "Calidad3508",
  produccion:    "Pro2026",
  mantenimiento: "Mol2026",
  admin:         "Noteladigo"
};

const ALARM_TYPES = {
  dano:       { label: "Daño en Molde",            color: "#E24B4A", icon: "ti-alert-triangle" },
  urgente:    { label: "Mantenimiento Urgente",     color: "#EF9F27", icon: "ti-tool" },
  vida:       { label: "Tiempo de Vida Expirado",   color: "#D4537E", icon: "ti-clock-off" },
  obsoleto:   { label: "Molde Obsoleto",            color: "#888780", icon: "ti-trash" },
  otro:       { label: "Otro",                      color: "#7F77DD", icon: "ti-info-circle" }
};

const RACK_ZONES = {
  activos: { label: "Zona Activos", color: "#1D9E75" },
  scrap:   { label: "Zona Scrap",   color: "#E24B4A" }
};

const MOLD_STATUS = {
  bueno:    { label: "Buenas Condiciones", color: "#1D9E75", icon: "ti-circle-check" },
  alarma:   { label: "Con Alarma",         color: "#EF9F27", icon: "ti-alert-triangle" },
  mto:      { label: "En Mantenimiento",   color: "#378ADD", icon: "ti-tool" },
  scrap:    { label: "Scrap",              color: "#E24B4A", icon: "ti-trash" },
  obsoleto: { label: "Obsoleto",           color: "#888780", icon: "ti-archive" }
};

// Umbrales de mantenimiento preventivo (en shots)
const MTO_THRESHOLDS = {
  inspeccion:   { shots: 50000,  label: "Inspección General",      color: "#378ADD" },
  preventivo1:  { shots: 100000, label: "Preventivo Nivel 1",       color: "#1D9E75" },
  preventivo2:  { shots: 250000, label: "Preventivo Nivel 2",       color: "#EF9F27" },
  mayor:        { shots: 500000, label: "Mantenimiento Mayor",       color: "#E24B4A" }
};

// Tipos de mantenimiento
const MTO_TYPES = {
  preventivo: { label: "Preventivo", color: "#1D9E75", icon: "ti-calendar-check" },
  reactivo:   { label: "Reactivo",   color: "#E24B4A", icon: "ti-tool" },
  predictivo: { label: "Predictivo", color: "#378ADD", icon: "ti-chart-line" },
  mayor:      { label: "Mayor",      color: "#EF9F27", icon: "ti-settings" }
};

window.HPM_CONFIG = {
  firebase: FIREBASE_CONFIG,
  passwords: DEPT_PASSWORDS,
  alarmTypes: ALARM_TYPES,
  rackZones: RACK_ZONES,
  moldStatus: MOLD_STATUS,
  mtoThresholds: MTO_THRESHOLDS,
  mtoTypes: MTO_TYPES,
  appVersion: "2.0.0",
  company: "Hyundai Polytech Mexico",
  plant: "Planta Saltillo"
};
