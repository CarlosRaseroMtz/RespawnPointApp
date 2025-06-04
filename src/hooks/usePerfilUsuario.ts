import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Usuario } from "../types/usuario"; // Asegúrate de tenerlo creado
import { useAuth } from "./useAuth";


// Custom hook para obtener el perfil del usuario autenticado
// Escucha en tiempo real los cambios en el documento del usuario en Firestore
export function usePerfilUsuario() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const ref = doc(firestore, "usuarios", user.uid);

    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setPerfil({ id: snap.id, ...snap.data() } as Usuario);
        }
      },
      (e) => {
        if (e.code === "permission-denied") {
          console.warn("⛔ Permiso denegado");
        } else {
          console.error("❌ Listener:", e);
        }
      }
    );

    return unsub;
  }, [user?.uid]);

  return perfil;
}
