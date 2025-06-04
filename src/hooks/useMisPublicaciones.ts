import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Publicacion } from "../types/publicacion"; // Lo creamos en el siguiente paso
import { useAuth } from "./useAuth";

// Custom hook para obtener las publicaciones del usuario autenticado
// Escucha en tiempo real los cambios en la colección "publicaciones"
export function useMisPublicaciones() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Publicacion[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(firestore, "publicaciones"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const result: Publicacion[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Publicacion, "id">),
      }));

      setPosts(result);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return posts;
}
