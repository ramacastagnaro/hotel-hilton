# 🚀 Guía de Configuración Rápida

## Para tu compañero que va a clonar el proyecto

### 📋 Pasos Rápidos

#### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/hotel-management-system.git
cd hotel-management-system
```

#### 2. Instalar dependencias
```bash
# Frontend
cd hotel-web
npm install

# Backend
cd ../hotel-backend
npm install
```

#### 3. Configurar Firebase (Frontend)

**a) Obtener credenciales:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Abre el proyecto existente (o pídeme acceso)
3. Project Settings → General → Your apps → Web app
4. Copia la configuración

**b) Crear archivo de configuración:**
```bash
cd hotel-web/src
cp firebase.example.js firebase.js
```

**c) Editar `firebase.js`** con las credenciales reales

#### 4. Configurar Firebase Admin (Backend)

**a) Obtener clave privada:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Guardar como `hotel-backend/firebase-admin-key.json`

⚠️ **NUNCA subas este archivo a GitHub**

#### 5. Configurar Supabase (Backend)

**a) Obtener credenciales:**
1. Ve a [Supabase](https://supabase.com/)
2. Abre el proyecto existente (o pídeme acceso)
3. Settings → API
4. Copia la URL y anon key

**b) Crear archivo .env:**
```bash
cd hotel-backend
cp .env.example .env
```

**c) Editar `.env`** con las credenciales reales:
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=tu-anon-key
PORT=4000
```

#### 6. Ejecutar el proyecto

**Terminal 1 - Backend:**
```bash
cd hotel-backend
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd hotel-web
npm start
```

---

## ✅ Verificación

Si todo está bien, deberías ver:

**Backend (Terminal 1):**
```
🚀 Servidor corriendo en http://localhost:4000
✅ Conexión a Supabase establecida
```

**Frontend (Terminal 2):**
```
Compiled successfully!
You can now view hotel-web in the browser.
  Local:            http://localhost:3000
```

---

## 🔑 Credenciales de Acceso

### Admin
- Email: `admin@thevannahhotel.com`
- Password: (pregúntame)
- URL: `http://localhost:3000/admin`

### Operador
- Email: `operador@thevannahhotel.com`
- Password: (pregúntame)
- URL: `http://localhost:3000/operador`

---

## ❓ Problemas Comunes

### "Cannot find module 'firebase-admin-key.json'"
→ Descarga la clave de Firebase Admin y colócala en `hotel-backend/`

### "Supabase connection failed"
→ Verifica las credenciales en `hotel-backend/.env`

### "Firebase auth error"
→ Verifica las credenciales en `hotel-web/src/firebase.js`

### "Port already in use"
→ Cierra otras apps que usen el puerto 3000 o 4000

---

## 📞 Contacto

Si tienes problemas, contáctame:
- WhatsApp: [Tu número]
- Email: [Tu email]

---

**¡Listo para trabajar juntos! 🎉**
