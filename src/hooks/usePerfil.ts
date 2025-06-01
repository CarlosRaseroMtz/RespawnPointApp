import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../config/firebase-config";

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
