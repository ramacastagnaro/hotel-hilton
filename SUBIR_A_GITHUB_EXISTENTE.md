# 🚀 Guía para Subir TODO el Proyecto al Repositorio Existente

## 📋 Pasos Completos

### **1. Abrir terminal en la carpeta del proyecto**

```bash
cd e:\Proyecto-Lenguajes_IV\miapp
```

### **2. Verificar si Git ya está inicializado**

```bash
git status
```

**Si dice "not a git repository":**
```bash
git init
```

**Si ya está inicializado:**
Continúa al siguiente paso.

### **3. Verificar que .gitignore esté correcto**

Ejecuta:
```bash
type .gitignore
```

Debe contener:
```
node_modules/
hotel-backend/.env
hotel-backend/firebase-admin-key.json
hotel-web/.env.local
*.log
```

### **4. Agregar TODOS los archivos (Git ignorará los del .gitignore automáticamente)**

```bash
git add .
```

### **5. Verificar qué se va a subir**

```bash
git status
```

**✅ Deberías ver (en verde):**
- `hotel-web/src/`
- `hotel-web/public/`
- `hotel-web/package.json`
- `hotel-backend/index.js`
- `hotel-backend/package.json`
- `hotel-backend/*.sql`
- `README.md`
- etc.

**❌ NO deberías ver:**
- `hotel-backend/.env`
- `hotel-backend/firebase-admin-key.json`
- `node_modules/`

**Si ves archivos sensibles en rojo/verde, NO continues. Agrégalos al .gitignore primero.**

### **6. Hacer commit**

```bash
git commit -m "Subir proyecto completo de gestión hotelera"
```

### **7. Conectar con el repositorio existente**

**Si ya tienes el repositorio creado en GitHub:**

```bash
# Reemplaza TU_USUARIO y NOMBRE_REPO con los valores reales
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
```

**Si ya tenías un remote configurado:**
```bash
# Ver remotes actuales
git remote -v

# Si ya existe 'origin', actualízalo
git remote set-url origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
```

### **8. Verificar la rama principal**

```bash
# Ver en qué rama estás
git branch

# Si no estás en 'main', créala y cámbiate
git branch -M main
```

### **9. Subir TODO al repositorio**

```bash
git push -u origin main
```

**Si el repositorio ya tiene contenido y da error:**
```bash
# Opción 1: Forzar (⚠️ CUIDADO: Sobrescribe todo en GitHub)
git push -u origin main --force

# Opción 2: Hacer pull primero y luego push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 🔍 Verificación Final

### **En GitHub:**

1. Ve a tu repositorio en GitHub
2. Deberías ver:
   ```
   miapp/
   ├── hotel-web/
   │   ├── src/
   │   ├── public/
   │   ├── package.json
   │   └── ...
   ├── hotel-backend/
   │   ├── index.js
   │   ├── package.json
   │   ├── .env.example
   │   ├── *.sql
   │   └── ...
   ├── README.md
   ├── SETUP_RAPIDO.md
   └── .gitignore
   ```

3. **Verifica que NO estén:**
   - ❌ `hotel-backend/.env`
   - ❌ `hotel-backend/firebase-admin-key.json`
   - ❌ `node_modules/`

---

## 📝 Comandos Completos en Orden

```bash
# 1. Ir a la carpeta del proyecto
cd e:\Proyecto-Lenguajes_IV\miapp

# 2. Inicializar Git (si no está inicializado)
git init

# 3. Agregar todos los archivos
git add .

# 4. Verificar qué se va a subir
git status

# 5. Hacer commit
git commit -m "Subir proyecto completo de gestión hotelera"

# 6. Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git

# 7. Cambiar a rama main
git branch -M main

# 8. Subir todo
git push -u origin main
```

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios y quieras subirlos:

```bash
# 1. Ver qué cambió
git status

# 2. Agregar cambios
git add .

# 3. Commit
git commit -m "Descripción de los cambios"

# 4. Push
git push
```

---

## 🚨 Si Algo Sale Mal

### **Error: "remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/NOMBRE_REPO.git
```

### **Error: "failed to push some refs"**
```bash
# Opción 1: Pull primero
git pull origin main --allow-unrelated-histories
git push

# Opción 2: Force push (⚠️ CUIDADO)
git push -u origin main --force
```

### **Subiste archivos sensibles por error**
```bash
# Eliminar del repositorio (pero mantener local)
git rm --cached hotel-backend/.env
git rm --cached hotel-backend/firebase-admin-key.json
git commit -m "Remove sensitive files"
git push
```

---

## 👥 Compartir con tu Compañero

### **1. Invitarlo al repositorio:**
- GitHub → Tu repositorio → Settings → Collaborators → Add people

### **2. Enviarle el link:**
```
https://github.com/TU_USUARIO/NOMBRE_REPO
```

### **3. Enviarle por separado (WhatsApp/Email):**

**Archivo 1: Crear `hotel-backend/.env`**
```env
SUPABASE_URL=tu-url-aqui
SUPABASE_KEY=tu-key-aqui
PORT=4000
```

**Archivo 2: `hotel-backend/firebase-admin-key.json`**
(Enviar el archivo completo)

**Archivo 3: Crear `hotel-web/src/firebase.js`**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-auth-domain",
  projectId: "tu-project-id",
  storageBucket: "tu-storage-bucket",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### **4. Decirle que:**
1. Clone el repositorio
2. Lea `SETUP_RAPIDO.md`
3. Cree los archivos que le enviaste
4. Ejecute `npm install` en `hotel-web` y `hotel-backend`
5. Corra el proyecto

---

## ✅ Checklist Final

Antes de hacer `git push`:

- [ ] Verifiqué con `git status` que NO aparezcan archivos sensibles
- [ ] El `.gitignore` está configurado correctamente
- [ ] Agregué `.env.example` y `firebase.example.js`
- [ ] El `README.md` tiene instrucciones completas
- [ ] Hice commit de todos los cambios
- [ ] Tengo el link del repositorio de GitHub

---

**¡Listo para subir TODO el proyecto! 🎉**
