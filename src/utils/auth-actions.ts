import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, firestore } from "../services/config/firebase-config";

/**
 * Cierra la sesión del usuario autenticado y redirige a la pantalla de login.
 *
 * @param router Objeto de navegación (por ejemplo, `useRouter()` de `expo-router`).
 */
export async function cerrarSesion(router: any): Promise<void> {
  try {
    await signOut(auth);
    router.replace("/login");
  } catch (e) {
    console.error("❌ Sign-out:", e);
    Alert.alert("Error", "No se pudo cerrar sesión.");
  }
}

/**
 * Elimina la cuenta del usuario actual, incluyendo su documento en Firestore
 * y su cuenta de autenticación en Firebase Auth. Muestra una alerta de confirmación.
 *
 * @param uid UID del usuario a eliminar.
 * @param router Objeto de navegación (por ejemplo, `useRouter()` de `expo-router`).
 */
export async function eliminarCuenta(
  uid: string | undefined,
  router: any
): Promise<void> {
  if (!uid) return;

  Alert.alert(
    "¿Eliminar cuenta?",
    "Esta acción es irreversible.",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(firestore, "usuarios", uid));
            if (auth.currentUser) await deleteUser(auth.currentUser);
            Alert.alert("✅ Cuenta eliminada");
            router.replace("/login");
          } catch (e) {
            console.error("❌ Delete account:", e);
            Alert.alert("Error", "No se pudo eliminar la cuenta.");
          }
        },
      },
    ]
  );
}
