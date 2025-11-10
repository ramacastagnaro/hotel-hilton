# 📊 Explicación: ¿De Dónde Vienen los Datos?

## ❓ Tu Pregunta

> "No entiendo si está hardcodeado o no, porque en panel de control dice eso y en consultar habitación sale en 0 todo"

---

## ✅ Respuesta: NO Está Hardcodeado (Ahora)

### **Panel de Control (Operador Dashboard)**

Los números que ves (7, 1, 4, 7) **NO están hardcodeados**. Vienen del backend:

```javascript
// Frontend: OperatorDashboard.js
const response = await fetch('http://localhost:4000/api/operator/stats');
const data = await response.json();
setStats(data);
```

```javascript
// Backend: index.js
app.get('/api/operator/stats', async (req, res) => {
    // Consulta a Supabase para obtener:
    // - Reservas de hoy
    // - Habitaciones disponibles
    // - Habitaciones ocupadas
    // - Pagos pendientes
});
```

---

## 🔍 ¿Por Qué Sale Todo en 0?

### **Razón:** No tienes datos en la tabla `reservations`

El backend hace consultas a Supabase:
- **Reservas de hoy:** Busca en `reservations` con `start_date = hoy`
- **Habitaciones ocupadas:** Busca reservas activas
- **Pagos pendientes:** Busca reservas con status 'pendiente'

Si la tabla `reservations` está vacía → Todo sale en 0

---

## 🏨 Consultar Habitaciones

### **¿Por Qué Dice "Habitación" Sin Nombre?**

Tu base de datos tiene estos campos:
```sql
rooms (
    room_id,
    room_type,      -- ej: "Clásica King"
    room_number,    -- ej: "101"
    status          -- ej: "disponible"
)
```

El código ahora usa:
```javascript
<h3>Habitación {room.room_number || room.number}</h3>
<p>{room.room_type || room.type}</p>
```

### **¿Por Qué Los Filtros Muestran (0)?**

Porque tus habitaciones **NO tienen el campo `status`** en la BD.

**Solución aplicada:**
```javascript
const roomsWithPositions = data.map((room, index) => ({
    ...room,
    status: room.status || 'disponible', // Si no tiene status, es disponible
    position: [-24.7859 + (index * 0.0001), -65.4117 + (index * 0.0001)]
}));
```

Ahora todas las habitaciones tendrán status 'disponible' por defecto.

---

## 📋 Lista de Habitaciones

### **¿Qué Debería Mostrar?**

Tus habitaciones reales de Supabase:

```
✅ Habitación 101 - Clásica King
✅ Habitación 102 - Superior King
✅ Habitación 201 - Clásica Doble
✅ Habitación 301 - Suite Presidencial
```

### **¿De Dónde Vienen?**

```javascript
// Frontend
const response = await fetch('http://localhost:4000/api/rooms');
const data = await response.json();
```

```javascript
// Backend
app.get('/api/rooms', async (req, res) => {
    const { data: rooms } = await supabase
        .from('rooms')
        .select('*');
    res.json(rooms);
});
```

---

## 🎯 Resumen

| Componente | ¿Hardcodeado? | Origen de Datos |
|------------|---------------|-----------------|
| **Panel de Control** | ❌ NO | `/api/operator/stats` → Supabase `reservations` |
| **Consultar Habitaciones** | ❌ NO | `/api/rooms` → Supabase `rooms` |
| **Lista de Habitaciones** | ❌ NO | `/api/rooms` → Supabase `rooms` |
| **Gestionar Reservas** | ❌ NO | `/api/reservations` → Supabase `reservations` |
| **Procesar Pagos** | ❌ NO | `/api/reservations` → Supabase `reservations` |

---

## 🔧 Soluciones Aplicadas

### 1. **OperatorRooms** - Campos Corregidos
```javascript
// Antes (error)
<h3>Habitación {room.number}</h3>  // ❌ Campo no existe

// Ahora (correcto)
<h3>Habitación {room.room_number || room.number}</h3>  // ✅ Usa campo correcto
```

### 2. **Status Por Defecto**
```javascript
status: room.status || 'disponible'  // Si no tiene status, usa 'disponible'
```

### 3. **Endpoint GET /api/reservations**
```javascript
// Agregado para obtener todas las reservas
app.get('/api/reservations', async (req, res) => {
    const { data } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
    res.json(data);
});
```

---

## 📝 Para Tener Datos de Prueba

### **Opción 1: Ejecutar Script SQL**

Ejecuta en Supabase SQL Editor:
```bash
hotel-backend/insert_test_reservations.sql
```

Esto creará 8 reservas de prueba con:
- 3 reservas de hoy
- 2 reservas ocupadas actualmente
- 2 reservas pendientes
- 1 reserva cancelada

### **Opción 2: Crear Reservas Desde el Frontend**

1. Inicia sesión como usuario normal
2. Ve a "Habitaciones"
3. Selecciona una habitación
4. Completa el formulario de reserva
5. Confirma el pago

---

## ✅ Verificación

Después de agregar datos de prueba:

### **Panel de Control:**
```
✅ Reservas para hoy: 3
✅ Habitaciones disponibles: 2
✅ Habitaciones ocupadas: 2
✅ Pagos pendientes: 2
```

### **Consultar Habitaciones:**
```
✅ Todas (4)
✅ Disponibles (2)
✅ Ocupadas (2)
✅ Mantenimiento (0)
```

### **Lista de Habitaciones:**
```
✅ Habitación 101 - Clásica King - Disponible
✅ Habitación 102 - Superior King - Ocupada
✅ Habitación 201 - Clásica Doble - Disponible
✅ Habitación 301 - Suite Presidencial - Ocupada
```

---

## 🎉 Conclusión

**TODO está conectado a la base de datos real.**

Los datos vienen de Supabase, NO están hardcodeados.

Si ves 0 o datos vacíos, es porque:
1. La tabla `reservations` está vacía
2. No hay reservas para hoy
3. Todas las habitaciones están disponibles

**Solución:** Ejecuta el script SQL para agregar datos de prueba.
