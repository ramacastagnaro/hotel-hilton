# 🏨 Sistema de Gestión Hotelera - Hotel Hilton

Sistema completo de gestión hotelera con panel de administración, panel de operador y sitio web público.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Credenciales de Prueba](#credenciales-de-prueba)

---

## ✨ Características

### **Panel de Administración** (`/admin`)
- ✅ Dashboard con estadísticas en tiempo real
- ✅ CRUD completo de habitaciones
- ✅ CRUD de usuarios (operadores/admins) con Firebase Admin SDK
- ✅ Gestión de reservas
- ✅ Gráficos y estadísticas avanzadas
- ✅ Logs del sistema

### **Panel de Operador** (`/operador`)
- ✅ Dashboard con estadísticas del día
- ✅ Consulta de habitaciones con mapa interactivo
- ✅ Gestión de reservas
- ✅ Procesamiento de pagos

### **Sitio Web Público**
- ✅ Catálogo de habitaciones
- ✅ Sistema de reservas
- ✅ Autenticación de usuarios con Firebase
- ✅ Perfil de usuario
- ✅ Confirmación de pagos con ticket PDF

---

## 🛠️ Tecnologías

### **Frontend**
- React 19.1.1
- React Router v7
- TailwindCSS
- React Leaflet (mapas)
- React Helmet
- jsPDF (generación de PDFs)

### **Backend**
- Node.js
- Express
- Supabase (PostgreSQL)
- Firebase Admin SDK

### **Autenticación**
- Firebase Authentication
- Firebase Admin SDK (para operadores/admins)

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** o **yarn**
- **Git** - [Descargar](https://git-scm.com/)

También necesitarás:
- Cuenta de **Firebase** - [Crear cuenta](https://firebase.google.com/)
- Cuenta de **Supabase** - [Crear cuenta](https://supabase.com/)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/hotel-management-system.git
cd hotel-management-system
```

### 2. Instalar dependencias del Frontend

```bash
cd hotel-web
npm install
```

### 3. Instalar dependencias del Backend

```bash
cd ../hotel-backend
npm install
```

---

## ⚙️ Configuración

### **1. Configurar Firebase**

#### a) Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → **Email/Password**

#### b) Obtener credenciales del Frontend
1. En Firebase Console → Project Settings → General
2. En "Your apps" → Web app → Copiar configuración
3. Crear archivo `hotel-web/src/firebase.js` con:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### c) Obtener credenciales del Backend (Firebase Admin)
1. En Firebase Console → Project Settings → Service Accounts
2. Click en "Generate new private key"
3. Guardar el archivo JSON como `hotel-backend/firebase-admin-key.json`

⚠️ **IMPORTANTE:** Este archivo NO debe subirse a GitHub (ya está en `.gitignore`)

### **2. Configurar Supabase**

#### a) Crear proyecto en Supabase
1. Ve a [Supabase](https://supabase.com/)
2. Crea un nuevo proyecto
3. Anota la **URL** y **anon key**

#### b) Configurar archivo `.env` del Backend

Crear archivo `hotel-backend/.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-aqui
PORT=4000
```

#### c) Ejecutar scripts SQL

En Supabase SQL Editor, ejecuta en orden:

1. **Crear tabla de operadores:**
```bash
hotel-backend/create_operators_and_logs.sql
```

2. **Crear tabla de logs:**
```bash
hotel-backend/create_system_logs_table.sql
```

3. **Insertar habitaciones de ejemplo:**
```bash
hotel-backend/insert_rooms_jsonb.sql
```

4. **Insertar reservas de prueba:**
```bash
hotel-backend/insert_simple_reservations.sql
```

5. **Insertar admin y operador:**
```bash
hotel-backend/insert_admin_operator.sql
```

---

## ▶️ Ejecución

### **Opción 1: Ejecutar todo manualmente**

#### Terminal 1 - Backend
```bash
cd hotel-backend
node index.js
```

Deberías ver:
```
🚀 Servidor corriendo en http://localhost:4000
✅ Conexión a Supabase establecida
```

#### Terminal 2 - Frontend
```bash
cd hotel-web
npm start
```

Se abrirá automáticamente en `http://localhost:3000`

### **Opción 2: Usar scripts npm (si los configuras)**

Puedes crear scripts en el `package.json` raíz para ejecutar todo con un comando.

---

## 📁 Estructura del Proyecto

```
miapp/
├── hotel-web/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── Admin/        # Componentes del panel admin
│   │   │   ├── Operator/     # Componentes del panel operador
│   │   │   ├── Header/
│   │   │   └── Footer/
│   │   ├── pages/            # Páginas principales
│   │   │   ├── Admin/        # Páginas del panel admin
│   │   │   ├── Operator/     # Páginas del panel operador
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   └── ...
│   │   ├── contexts/         # Context API (AuthContext)
│   │   ├── firebase.js       # Configuración Firebase
│   │   └── App.js
│   └── package.json
│
├── hotel-backend/            # Backend Node.js
│   ├── index.js             # Servidor Express
│   ├── firebase-admin-key.json  # ⚠️ NO SUBIR A GITHUB
│   ├── .env                 # ⚠️ NO SUBIR A GITHUB
│   ├── .gitignore
│   ├── *.sql                # Scripts de base de datos
│   └── package.json
│
└── README.md                # Este archivo
```

---

## 🗄️ Base de Datos

### **Tablas en Supabase:**

#### **1. rooms** - Habitaciones
```sql
- room_id (text, PK)
- name (text)
- category (text)
- description (text)
- capacity (integer)
- price (numeric)
- images (text[])
- services (jsonb)
- tariffs (jsonb)
```

#### **2. reservations** - Reservas
```sql
- reservation_id (serial, PK)
- firebase_uid (text)
- room_id (text, FK)
- client_name (text)
- client_email (text)
- start_date (date)
- end_date (date)
- nights (integer)
- total_price (numeric)
- status (text)
- created_at (timestamp)
```

#### **3. operators** - Operadores/Admins
```sql
- operator_id (serial, PK)
- firebase_uid (text, unique)
- email (text, unique)
- name (text)
- role (text) - 'admin' o 'operador'
- created_at (timestamp)
```

#### **4. system_logs** - Logs del sistema
```sql
- log_id (serial, PK)
- action (text)
- user_id (text)
- details (text)
- created_at (timestamp)
```

---

## 🔑 Credenciales de Prueba

### **Usuarios Normales (Clientes)**
Puedes registrarte desde `/registrar` o usar:
- Email: `test@hotel.com`
- Password: `123456`

### **Operador**
- Email: `operador@thevannahhotel.com`
- Password: (la que configuraste en Firebase)
- Panel: `/operador`

### **Administrador**
- Email: `admin@thevannahhotel.com`
- Password: (la que configuraste en Firebase)
- Panel: `/admin`

---

## 🔒 Seguridad

### **Archivos que NO deben subirse a GitHub:**

✅ Ya están en `.gitignore`:
- `hotel-backend/firebase-admin-key.json`
- `hotel-backend/.env`
- `hotel-backend/node_modules/`
- `hotel-web/node_modules/`
- `hotel-web/.env.local`

### **Antes de hacer commit:**

```bash
# Verificar que los archivos sensibles NO estén en staging
git status

# Si aparecen archivos sensibles, agrégalos a .gitignore
echo "firebase-admin-key.json" >> hotel-backend/.gitignore
echo ".env" >> hotel-backend/.gitignore
```

---

## 📝 Scripts Disponibles

### **Frontend (hotel-web)**
```bash
npm start          # Inicia el servidor de desarrollo
npm run build      # Crea build de producción
npm test           # Ejecuta tests
```

### **Backend (hotel-backend)**
```bash
node index.js      # Inicia el servidor backend
```

---

## 🐛 Solución de Problemas

### **Error: "Cannot find module 'firebase-admin-key.json'"**
- Asegúrate de haber descargado la clave de Firebase Admin
- Colócala en `hotel-backend/firebase-admin-key.json`

### **Error: "Supabase connection failed"**
- Verifica que el archivo `.env` tenga las credenciales correctas
- Verifica que las tablas estén creadas en Supabase

### **Error: "Port 3000 already in use"**
- Cierra otras aplicaciones que usen el puerto 3000
- O cambia el puerto en `package.json`

### **Error: "Firebase auth error"**
- Verifica que Firebase Authentication esté habilitado
- Verifica las credenciales en `firebase.js`

---

## 👥 Colaboradores

- [Tu Nombre]
- [Nombre del Compañero]

---

## 📄 Licencia

Este proyecto es para uso educativo - Universidad [Nombre]

---

## 📞 Contacto

- Email: HiltonHoteles@gmail.com
- Ubicación: Av. Arenales 742, Salta, Argentina

---

## 🎯 Próximas Mejoras

- [ ] Implementar sistema de notificaciones
- [ ] Agregar más métodos de pago
- [ ] Dashboard con más métricas
- [ ] Exportar reportes en Excel
- [ ] Sistema de calificaciones

---

**¡Gracias por usar nuestro Sistema de Gestión Hotelera!** 🏨✨
