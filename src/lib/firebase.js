/**
 * Firebase configuration with graceful no-key fallback.
 *
 * Add the following vars to a .env.local file to enable real Firebase:
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 *
 * Without them the app runs in mock-auth mode (useAuth.js handles that).
 */
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey      = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain  = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId   = import.meta.env.VITE_FIREBASE_PROJECT_ID;

/**
 * True only when all required env vars are present and not placeholder values.
 */
export const isFirebaseConfigured = Boolean(
  apiKey && apiKey !== 'your_api_key_here' &&
  authDomain &&
  projectId
);

let app, auth, db;

if (isFirebaseConfigured) {
  // Only initialise if we haven't already (Vite HMR-safe)
  app  = getApps().length ? getApps()[0] : initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  });
  auth = getAuth(app);
  db   = getFirestore(app);
} else {
  // Provide null stubs — hooks check isFirebaseConfigured before using them
  app  = null;
  auth = null;
  db   = null;
}

export { app, auth, db };
