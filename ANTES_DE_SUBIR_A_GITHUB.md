# ⚠️ CHECKLIST ANTES DE SUBIR A GITHUB

## 🔒 Archivos Sensibles - NO SUBIR

Verifica que estos archivos **NO** estén en tu commit:

### ❌ Backend
- [ ] `hotel-backend/.env`
- [ ] `hotel-backend/firebase-admin-key.json`
- [ ] `hotel-backend/node_modules/`

### ❌ Frontend
- [ ] `hotel-web/.env`
- [ ] `hotel-web/.env.local`
- [ ] `hotel-web/node_modules/`
- [ ] `hotel-web/src/firebase.js` (si tiene credenciales reales)

---

## ✅ Archivos que SÍ debes subir

### ✅ Backend
- [x] `hotel-backend/.env.example`
- [x] `hotel-backend/.gitignore`
- [x] `hotel-backend/index.js`
- [x] `hotel-backend/package.json`
- [x] `hotel-backend/*.sql` (scripts de BD)
- [x] `hotel-backend/INSTRUCCIONES_FIREBASE_ADMIN.md`

### ✅ Frontend
- [x] `hotel-web/src/firebase.example.js`
- [x] `hotel-web/.gitignore`
- [x] `hotel-web/package.json`
- [x] `hotel-web/src/` (todos los archivos excepto firebase.js con credenciales)
- [x] `hotel-web/public/`

### ✅ Raíz
- [x] `README.md`
- [x] `SETUP_RAPIDO.md`
- [x] `.gitignore`

---

## 🔍 Verificación Antes de Commit

### Paso 1: Verificar archivos en staging
```bash
git status
```

### Paso 2: Si ves archivos sensibles, NO los agregues
```bash
# ❌ NO HAGAS ESTO si ves archivos sensibles
git add .

# ✅ HAZ ESTO: Agrega archivos específicos
git add hotel-web/src/components/
git add hotel-backend/index.js
# etc...
```

### Paso 3: Verificar .gitignore
```bash
# Verifica que .gitignore contenga:
cat .gitignore
```

Debe incluir:
```
node_modules/
.env
firebase-admin-key.json
*.log
```

---

## 📝 Comandos para Subir a GitHub

### Primera vez (crear repositorio)

```bash
# 1. Inicializar git (si no está inicializado)
git init

# 2. Agregar archivos (SOLO los seguros)
git add README.md
git add SETUP_RAPIDO.md
git add .gitignore
git add hotel-web/package.json
git add hotel-web/src/
git add hotel-backend/package.json
git add hotel-backend/index.js
git add hotel-backend/*.sql
# ... etc

# 3. Hacer commit
git commit -m "Initial commit: Sistema de Gestión Hotelera completo"

# 4. Crear repositorio en GitHub
# Ve a https://github.com/new
# Crea un repositorio (público o privado)

# 5. Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/hotel-management-system.git

# 6. Subir
git branch -M main
git push -u origin main
```

### Actualizaciones posteriores

```bash
# 1. Ver cambios
git status

# 2. Agregar cambios
git add archivo1.js archivo2.js

# 3. Commit
git commit -m "Descripción de los cambios"

# 4. Push
git push
```

---

## 🚨 Si Subiste Archivos Sensibles por Error

### Eliminar del repositorio (pero mantener local)
```bash
# Eliminar del repositorio pero mantener en local
git rm --cached hotel-backend/.env
git rm --cached hotel-backend/firebase-admin-key.json

# Commit
git commit -m "Remove sensitive files"

# Push
git push
```

### Si ya están en el historial de Git
```bash
# ⚠️ CUIDADO: Esto reescribe el historial
# Solo usa si es absolutamente necesario

# Opción 1: Usar BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/

# Opción 2: Crear nuevo repositorio limpio
# (más seguro si el repo es nuevo)
```

---

## ✅ Checklist Final

Antes de hacer `git push`:

- [ ] Verifiqué que `.env` NO esté en staging
- [ ] Verifiqué que `firebase-admin-key.json` NO esté en staging
- [ ] Verifiqué que `node_modules/` NO esté en staging
- [ ] Agregué `.env.example` con valores de ejemplo
- [ ] Agregué `firebase.example.js` con valores de ejemplo
- [ ] El README.md tiene instrucciones claras
- [ ] Probé que el `.gitignore` funcione correctamente

---

## 📧 Compartir con tu Compañero

Una vez subido a GitHub:

1. **Invítalo al repositorio:**
   - GitHub → Settings → Collaborators → Add people

2. **Compártele por separado (NO por GitHub):**
   - Archivo `firebase-admin-key.json`
   - Contenido del archivo `.env`
   - Credenciales de Firebase para `firebase.js`
   - Credenciales de admin/operador

3. **Envíale el link:**
   - `https://github.com/TU_USUARIO/hotel-management-system`
   - Dile que lea `SETUP_RAPIDO.md`

---

## 🎯 Buenas Prácticas

### Commits
```bash
# ✅ Buenos commits
git commit -m "Fix: Corregir error en AdminReservations"
git commit -m "Feature: Agregar sistema de logs"
git commit -m "Update: Mejorar diseño del logo"

# ❌ Malos commits
git commit -m "cambios"
git commit -m "fix"
git commit -m "asdf"
```

### Branches (opcional pero recomendado)
```bash
# Crear branch para nueva feature
git checkout -b feature/nueva-funcionalidad

# Trabajar en la branch
git add .
git commit -m "Feature: Nueva funcionalidad"

# Volver a main y mergear
git checkout main
git merge feature/nueva-funcionalidad
```

---

**¡Listo para colaborar! 🚀**
