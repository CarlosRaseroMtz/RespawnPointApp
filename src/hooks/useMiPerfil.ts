import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Usuario } from "../types/usuario";
import { useAuth } from "./useAuth";

/**
 * Hook personalizado para obtener la información del perfil
 * del usuario autenticado en tiempo real desde Firestore.
 *
 * Escucha automáticamente los cambios en el documento del usuario dentro de
 * la colección `usuarios`, y actualiza el estado con los datos.
 *
 * @returns {Usuario | null} Objeto con la información del usuario o `null` si no hay sesión iniciada.
 */
export function useMiPerfil(): Usuario | null {
  const { user } = useAuth();
  const [info, setInfo] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = onSnapshot(
      doc(firestore, "usuarios", user.uid),
      (s) => {
        if (s.exists()) {
          setInfo({ id: s.id, ...s.data() } as Usuario);
        }
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return info;
}
