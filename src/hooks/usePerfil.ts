import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";

/**
 * Hook personalizado para obtener el perfil de un usuario por su UID desde Firestore.
 *
 * Realiza una única consulta a la colección `usuarios` usando `getDoc`.
 *
 * @param {string | undefined} uid UID del usuario cuyo perfil se desea obtener.
 * @returns {any | null} Objeto con la información del usuario, o `null` si no existe o no se ha cargado.
 */
export const usePerfil = (uid: string | undefined): any | null => {
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    if (!uid) return;

    const fetch = async () => {
      try {
        const ref = doc(firestore, "usuarios", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setPerfil(snap.data());
      } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
      }
    };

    fetch();
  }, [uid]);

  return perfil;
};
