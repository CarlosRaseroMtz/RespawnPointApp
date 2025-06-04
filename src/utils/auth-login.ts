import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/config/firebase-config";

/**
 * Inicia sesión con correo electrónico y contraseña utilizando Firebase Auth.
 *
 * @param {string} email Correo electrónico del usuario.
 * @param {string} password Contraseña del usuario.
 * @returns {Promise<UserCredential>} Promesa que resuelve con los datos del usuario autenticado.
 * @throws {Error} Si los campos están vacíos o ocurre un error en el inicio de sesión.
 */
export async function loginWithEmail(email: string, password: string) {
  if (!email || !password) throw new Error("Campos vacíos");

  return await signInWithEmailAndPassword(auth, email, password);
}
