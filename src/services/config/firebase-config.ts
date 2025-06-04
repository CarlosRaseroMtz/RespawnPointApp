import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Configuración de Firebase para la aplicación.
 * Estos valores son públicos y provienen del panel de configuración de Firebase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyCP6EURN4Upmi_aJX5Z4fGAxaTOf2SHm9o",
  authDomain: "respawnpointapp-f3f59.firebaseapp.com",
  projectId: "respawnpointapp-f3f59",
  storageBucket: "gs://respawnpointapp-f3f59.firebasestorage.app",
  messagingSenderId: "992097770915",
  appId: "1:992097770915:web:e07fe26248c382b3b34e16",
};

/**
 * Instancia principal de Firebase inicializada con la configuración del proyecto.
 */
export const app = initializeApp(firebaseConfig);

/**
 * Instancia de autenticación de Firebase.
 * Usa el idioma del dispositivo automáticamente.
 */
export const auth = getAuth(app);
auth.useDeviceLanguage();

/**
 * Instancia de Firestore para acceder a la base de datos en tiempo real.
 */
export const firestore = getFirestore(app);

/**
 * Instancia de Firebase Storage para subir y descargar archivos multimedia.
 */
export const storage = getStorage(app);
