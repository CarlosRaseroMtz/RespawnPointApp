import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Usuario } from "../types/usuario";
import { useAuth } from "./useAuth";

/**
 * Hook personalizado que obtiene en tiempo real el perfil del usuario autenticado desde Firestore.
 *
 * Se suscribe al documento del usuario en la colección `usuarios` y actualiza automáticamente
 * el estado local al detectar cambios. También maneja errores de permisos.
 *
 * @returns {Usuario | null} Objeto con los datos del perfil o `null` si no hay usuario autenticado.
 */
export function usePerfilUsuario(): Usuario | null {
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
