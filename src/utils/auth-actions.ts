import { deleteUser, signOut } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, firestore } from "../services/config/firebase-config";

// Funciones para manejar acciones de autenticación
export async function cerrarSesion(router: any) {
  try {
    await signOut(auth);
    router.replace("/login");
  } catch (e) {
    console.error("❌ Sign-out:", e);
    Alert.alert("Error", "No se pudo cerrar sesión.");
  }
}

// Función para eliminar la cuenta del usuario
export async function eliminarCuenta(uid: string | undefined, router: any) {
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
