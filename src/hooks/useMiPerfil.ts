import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Usuario } from "../types/usuario"; // Lo crearemos en el siguiente paso
import { useAuth } from "./useAuth";


// Custom hook para obtener la información del perfil del usuario autenticado
// Escucha en tiempo real los cambios en el documento del usuario en Firestore
export function useMiPerfil() {
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
