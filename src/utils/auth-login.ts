import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/config/firebase-config";

// Función para iniciar sesión con email y contraseña
export async function loginWithEmail(email: string, password: string) {
  if (!email || !password) throw new Error("Campos vacíos");

  return await signInWithEmailAndPassword(auth, email, password);
}
