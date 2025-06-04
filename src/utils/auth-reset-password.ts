import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/config/firebase-config";

/**
 * Envía un enlace de restablecimiento de contraseña al correo indicado.
 *
 * @param {string} email Correo electrónico del usuario que desea restablecer su contraseña.
 * @returns {Promise<void>} Promesa que se resuelve si el envío fue exitoso.
 * @throws {Error} Si no se proporciona un correo o si ocurre un error durante el envío.
 */
export async function sendResetLink(email: string): Promise<void> {
  if (!email) throw new Error("Falta el correo");

  return await sendPasswordResetEmail(auth, email.trim());
}
