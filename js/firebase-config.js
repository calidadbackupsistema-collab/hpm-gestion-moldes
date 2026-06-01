// ============================================================
// FIREBASE CONFIGURATION - Hyundai Polytech Mexico v2.0
// ============================================================
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAi-OwGl7or8Dr0imFOxhUHOomDLaz5ncE",
  authDomain:        "hyundai-polytech-moldes.firebaseapp.com",
  projectId:         "hyundai-polytech-moldes",
  storageBucket:     "hyundai-polytech-moldes.firebasestorage.app",
  messagingSenderId: "614472533252",
  appId:             "1:614472533252:web:94f50f92280d3ef4dbbc51"
};

const DEPT_PASSWORDS = {
  procesos:      "proc2024hpm",
  calidad:       "cal2024hpm",
  produccion:    "prod2024hpm",
  mantenimiento: "mto2024hpm",
  admin:         "admin2024hpm"
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

// ============================================================
// UTILIDADES COMPARTIDAS - Hyundai Polytech Mexico
// ============================================================

const Utils = {

  // Generar ID único para molde
  generateMoldId: () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HPM-${timestamp}-${random}`;
  },

  // Generar datos para QR — apunta al portal del molde (selector de 3 modos)
  generateQRData: (moldId) => {
    const baseUrl = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
    return `${baseUrl}molde.html?id=${moldId}`;
  },

  // Formatear fecha
  formatDate: (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  },

  formatDateShort: (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
  },

  // Verificar contraseña de departamento
  verifyDept: (dept, password) => {
    return window.HPM_CONFIG.passwords[dept] === password;
  },

  // Mostrar toast notification
  showToast: (message, type = 'info') => {
    const existing = document.getElementById('hpm-toast');
    if (existing) existing.remove();
    const colors = { success: '#1D9E75', error: '#E24B4A', warning: '#EF9F27', info: '#378ADD' };
    const toast = document.createElement('div');
    toast.id = 'hpm-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: ${colors[type]}; color: white; padding: 12px 20px;
      border-radius: 10px; font-size: 14px; font-weight: 500;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2); max-width: 320px;
      animation: slideIn 0.3s ease; font-family: 'Barlow', sans-serif;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3500);
  },

  // Exportar tabla a Excel usando SheetJS
  exportToExcel: (data, filename, sheetName = 'Datos') => {
    if (typeof XLSX === 'undefined') {
      Utils.showToast('Librería Excel no disponible', 'error');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0,10)}.xlsx`);
    Utils.showToast('Archivo Excel generado exitosamente', 'success');
  },

  // Confirmar acción
  confirm: (message) => window.confirm(message),

  // Obtener turno actual
  getCurrentShift: () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'Matutino (6:00-14:00)';
    if (hour >= 14 && hour < 22) return 'Vespertino (14:00-22:00)';
    return 'Nocturno (22:00-6:00)';
  },

  // Calcular porcentaje de vida útil
  lifePercent: (currentShots, maxShots) => {
    if (!maxShots || maxShots === 0) return 0;
    return Math.min(Math.round((currentShots / maxShots) * 100), 100);
  },

  // Clase CSS para estado de vida
  lifeClass: (percent) => {
    if (percent >= 90) return 'danger';
    if (percent >= 70) return 'warning';
    return 'good';
  },

  // Sanitizar entrada de texto
  sanitize: (str) => {
    if (!str) return '';
    return String(str).replace(/[<>\"']/g, '').trim().substring(0, 500);
  },

  // Número con separadores de miles
  formatNumber: (n) => {
    return Number(n || 0).toLocaleString('es-MX');
  }
};

window.Utils = Utils;
