# 📋 Sistema de Gestión de Moldes — Hyundai Polytech Mexico

## Archivos del Sistema

```
hyundai-moldes/
├── dashboard.html        ← Panel principal de gestión
├── checklist.html        ← Checklist de molde (se abre desde QR)
├── js/
│   ├── firebase-config.js  ← Configuración de Firebase y contraseñas
│   └── utils.js            ← Utilidades compartidas
└── README.md
```

---

## 🔥 CONFIGURACIÓN DE FIREBASE

### Paso 1 — Crear proyecto en Firebase
1. Ve a https://console.firebase.google.com
2. Clic en **"Agregar proyecto"**
3. Nombre: `hyundai-polytech-moldes`
4. Activa **Google Analytics** (opcional)

### Paso 2 — Activar Firestore
1. En el menú izquierdo → **Firestore Database**
2. Clic **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"** (luego configura reglas)
4. Elige la región más cercana (e.g. `us-central1`)

### Paso 3 — Obtener credenciales
1. Clic en el ícono ⚙️ → **Configuración del proyecto**
2. Baja a **"Tus apps"** → clic `</>`  (Web)
3. Nombre la app: `HPM Dashboard`
4. Copia el objeto `firebaseConfig`

### Paso 4 — Actualizar `js/firebase-config.js`
Reemplaza los valores en la sección `FIREBASE_CONFIG`:
```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...TU_API_KEY",
  authDomain:        "hyundai-polytech-moldes.firebaseapp.com",
  projectId:         "hyundai-polytech-moldes",
  storageBucket:     "hyundai-polytech-moldes.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abc123..."
};
```

### Paso 5 — Cambiar contraseñas de departamentos
En `js/firebase-config.js`, actualiza las contraseñas:
```javascript
const DEPT_PASSWORDS = {
  procesos:   "TU_CONTRASEÑA_PROCESOS",
  calidad:    "TU_CONTRASEÑA_CALIDAD",
  produccion: "TU_CONTRASEÑA_PRODUCCION",
  admin:      "TU_CONTRASEÑA_ADMIN"
};
```
> ⚠️ **IMPORTANTE**: En producción, usar autenticación Firebase con usuarios reales en lugar de contraseñas en texto plano.

---

## 🛡️ REGLAS DE SEGURIDAD DE FIRESTORE

Ve a **Firestore → Reglas** y pega esto:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo lectura pública para moldes (para QR scanning)
    match /moldes/{moldId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Alarmas, shots y checklists — acceso autenticado
    match /alarmas/{doc} { allow read, write: if true; }
    match /shots/{doc}   { allow read, write: if true; }
    match /checklists/{doc} { allow read, write: if true; }
  }
}
```

---

## 🌐 DESPLIEGUE EN FIREBASE HOSTING

Para acceso desde cualquier PC o celular con URL pública:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting en la carpeta del proyecto
firebase init hosting

# Configuración:
# - Public directory: . (punto, la carpeta actual)
# - Single-page app: NO
# - Overwrite index.html: NO

# Despliega
firebase deploy --only hosting
```

Tu sistema estará en: `https://hyundai-polytech-moldes.web.app`

---

## 📱 USO DEL SISTEMA

### Dashboard (`dashboard.html`)
| Sección | Función |
|---------|---------|
| **Dashboard** | KPIs, alertas activas, resumen general |
| **Lista Maestra** | Todos los moldes, búsqueda y filtros |
| **Alarmas** | Centro de alarmas con resolución |
| **Rack / Zonas** | Vista visual del rack (Activos y Scrap) |
| **Registro de Shots** | Historial de tiros por turno |

### Checklist (`checklist.html?id=MOL-ID`)
- Se accede escaneando el QR de cada molde
- Permite detonar 5 tipos de alarmas
- 12 ítems de inspección visual y mecánica
- Exporta reporte a Excel al instante

### Exportación a Excel
- **Dashboard**: KPIs + alarmas por tipo
- **Lista Maestra**: todos los datos de moldes
- **Alarmas**: historial completo con resoluciones
- **Shots**: registro de producción por turno
- **Checklist**: reporte individual del molde

---

## 🗂️ ESTRUCTURA DE FIRESTORE

### Colección `moldes`
```json
{
  "id": "HPM-1A2B3C4D-XY12",
  "code": "MOL-001",
  "name": "Bumper Delantero HM1",
  "partNumber": "87611-4L000",
  "material": "PP+EPDM",
  "weight": 2400,
  "maxShots": 500000,
  "currentShots": 320000,
  "zone": "activos",
  "rackPosition": "A-01",
  "supplier": "Tooling Korea",
  "status": "bueno",
  "qrId": "HPM-1A2B3C4D-XY12",
  "notes": "...",
  "createdAt": "Timestamp"
}
```

### Colección `alarmas`
```json
{
  "moldId": "HPM-1A2B3C4D-XY12",
  "moldCode": "MOL-001",
  "type": "dano | urgente | vida | obsoleto | otro",
  "cause": "Descripción de la causa",
  "registeredBy": "Nombre",
  "department": "procesos | calidad | produccion",
  "status": "activa | resuelta",
  "correctiveActions": "...",
  "createdAt": "Timestamp",
  "resolvedAt": "Timestamp"
}
```

### Colección `shots`
```json
{
  "moldId": "HPM-1A2B3C4D-XY12",
  "shots": 450,
  "ok": 440,
  "rejected": 10,
  "department": "procesos | calidad | produccion",
  "operator": "Nombre completo",
  "shift": "Matutino (6:00-14:00)",
  "notes": "...",
  "createdAt": "Timestamp"
}
```

### Colección `checklists`
```json
{
  "moldId": "HPM-1A2B3C4D-XY12",
  "inspectedBy": "Nombre",
  "department": "...",
  "results": { "c01": "ok", "c02": "bad", ... },
  "itemsFailed": ["Guías y columnas"],
  "failCount": 1,
  "observations": "...",
  "shift": "Matutino",
  "createdAt": "Timestamp"
}
```

---

## 📲 IMPRIMIR CÓDIGOS QR

Desde el Dashboard:
1. Ir a **Lista Maestra**
2. Clic en el ícono 🔲 de cualquier molde
3. Se abre ventana de impresión automáticamente

O desde el **Detalle del Molde** → botón **"Imprimir QR"**

Cada QR apunta a:
```
https://tu-dominio.web.app/checklist.html?id=HPM-XXXXXX-XXXX
```

---

## ⚠️ NOTAS IMPORTANTES

- El ID del molde (y su QR) se genera automáticamente al crear el molde y **nunca puede ser modificado**
- Las contraseñas departamentales están en `js/firebase-config.js` — cámbialas antes de producción
- El sistema funciona en modo **Demo** si Firebase no está configurado
- Compatible con Chrome, Safari, Firefox — PC y móvil
- Para soporte: configurar Firebase Auth para mayor seguridad

---

*Sistema desarrollado para Hyundai Polytech Mexico — Planta Saltillo*
*Versión 1.0.0*
