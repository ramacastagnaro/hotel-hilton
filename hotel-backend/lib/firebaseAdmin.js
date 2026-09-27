// Firebase Admin bootstrap and token helpers.
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { FIREBASE_ADMIN_KEY_PATH } from '../config/env.js';
import { serviceUnavailable } from '../utils/envelope.js';

let initialized = false;

try {
  const serviceAccount = JSON.parse(
    readFileSync(FIREBASE_ADMIN_KEY_PATH, 'utf8')
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
  console.log('✅ Firebase Admin inicializado correctamente');
} catch (err) {
  console.error('⚠️ No se pudo inicializar Firebase Admin:', err.message);
  console.error(
    '   Asegúrate de tener el archivo firebase-admin-key.json o define FIREBASE_ADMIN_KEY_PATH'
  );
}

export const firebaseAdmin = admin;

export const isFirebaseAdminReady = () => initialized;

/**
 * Verify a Firebase ID token. Throws `503` when Firebase Admin is not ready
 * and lets `verifyIdToken` errors bubble up for the caller to translate.
 */
export async function verifyIdToken(idToken) {
  if (!initialized) {
    throw serviceUnavailable('Firebase Admin no está inicializado');
  }
  return admin.auth().verifyIdToken(idToken);
}

/**
 * Extract a bearer token from an Express request, or `null` when absent.
 */
export function extractBearerToken(req) {
  const header = req?.headers?.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}
