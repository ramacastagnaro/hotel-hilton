import cors from 'cors';
import express from 'express';
import { ALLOWED_ORIGINS, PORT, REQUIRE_AUTH } from './config/env.js';
// Side-effect import: initializes Firebase Admin on boot.
import './lib/firebaseAdmin.js';
import { supabase } from './lib/supabaseClient.js';
import { requireAuth } from './middleware/auth.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import logsRoutes from './routes/logs.routes.js';
import operatorRoutes from './routes/operator.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import roomsRoutes from './routes/rooms.routes.js';

const app = express();

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

// Connectivity probe.
app.get('/', async (req, res) => {
  const { count, error } = await supabase
    .from('rooms')
    .select('*', { count: 'exact', head: true });

  if (error) throw error;
  res.send(
    `✅ ¡Conexión a Supabase exitosa! Habitaciones en la BD: ${count}`
  );
});

// Public API
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/logs', logsRoutes);

// Admin / operator API surface. The guard is a warn-only passthrough while
// REQUIRE_AUTH is not 'true' (spec AUTH-5 keeps the default off during rollout).
// The read-only `demo` role may read both surfaces but never mutate them.
app.use(
  '/api/admin',
  requireAuth({ roles: ['admin'], readOnlyRoles: ['demo'] }),
  adminRoutes
);
app.use(
  '/api/operator',
  requireAuth({ roles: ['operador'], readOnlyRoles: ['demo'] }),
  operatorRoutes
);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en el puerto ${PORT}`);
  console.log(
    `🔐 REQUIRE_AUTH=${REQUIRE_AUTH ? 'activado' : 'desactivado (passthrough)'}`
  );
});
