import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";

export async function loginWithEmail(email: string, password: string) {
  if (!email || !password) throw new Error("Campos vacíos");

  return await signInWithEmailAndPassword(auth, email, password);
}
