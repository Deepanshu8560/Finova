
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;


export const isFirebaseConfigured = Boolean(
  apiKey && apiKey !== 'your_api_key_here' &&
  authDomain &&
  projectId
);

let app, auth, db;

if (isFirebaseConfigured) {
  // Only initialise if we haven't already (Vite HMR-safe)
  app = getApps().length ? getApps()[0] : initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  // Provide null stubs - hooks check isFirebaseConfigured before using them
  app = null;
  auth = null;
  db = null;
}

export { app, auth, db };
