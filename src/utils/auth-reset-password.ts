import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase-config";

export async function sendResetLink(email: string): Promise<void> {
  if (!email) throw new Error("Falta el correo");

  return await sendPasswordResetEmail(auth, email.trim());
}
