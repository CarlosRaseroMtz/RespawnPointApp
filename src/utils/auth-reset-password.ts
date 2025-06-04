import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/config/firebase-config";

// Función para enviar enlace de restablecimiento de contraseña
export async function sendResetLink(email: string): Promise<void> {
  if (!email) throw new Error("Falta el correo");

  return await sendPasswordResetEmail(auth, email.trim());
}
