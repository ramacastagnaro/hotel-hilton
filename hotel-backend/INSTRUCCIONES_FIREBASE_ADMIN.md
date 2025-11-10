    # Configurar Firebase Admin SDK

## Paso 1: Obtener credenciales de Firebase

1. Ve a **Firebase Console**: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Haz clic en el **ícono de engranaje** ⚙️ → **Project Settings**
4. Ve a la pestaña **Service Accounts**
5. Haz clic en **Generate New Private Key**
6. Se descargará un archivo JSON (ejemplo: `proyecto-abc123-firebase-adminsdk-xyz.json`)
7. **Guarda ese archivo en la carpeta `hotel-backend`** con el nombre: `firebase-admin-key.json`

## Paso 2: Agregar a .gitignore

Asegúrate de que el archivo `.gitignore` incluya:
```
firebase-admin-key.json
```

## Paso 3: Reiniciar el servidor

Una vez que tengas el archivo `firebase-admin-key.json` en la carpeta `hotel-backend`:
1. Detén el servidor (Ctrl + C)
2. Ejecuta: `node index.js`
3. Deberías ver: `✅ Firebase Admin inicializado`

## ¡Listo!

Ahora cuando crees un usuario en el panel Admin, se creará automáticamente en Firebase Authentication.
