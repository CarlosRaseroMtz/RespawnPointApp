import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCP6EURN4Upmi_aJX5Z4fGAxaTOf2SHm9o",
  authDomain: "respawnpointapp-f3f59.firebaseapp.com",
  projectId: "respawnpointapp-f3f59",
  storageBucket: "gs://respawnpointapp-f3f59.firebasestorage.app",
  messagingSenderId: "992097770915",
  appId: "1:992097770915:web:e07fe26248c382b3b34e16"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
auth.useDeviceLanguage();

export const firestore = getFirestore(app);
export const storage = getStorage(app);
