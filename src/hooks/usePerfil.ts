import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";


// Custom hook para obtener el perfil de un usuario por su UID
// Utiliza getDoc para obtener el documento del usuario en Firestore
export const usePerfil = (uid: string | undefined) => {
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
