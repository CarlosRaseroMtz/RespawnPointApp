import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Publicacion } from "../types/publicacion";
import { useAuth } from "./useAuth";

/**
 * Hook personalizado para obtener en tiempo real las publicaciones
 * creadas por el usuario autenticado desde Firestore.
 *
 * Escucha la colección `publicaciones` y filtra por `userId` igual al UID del usuario actual.
 * Los resultados se ordenan por `timestamp` descendente.
 *
 * @returns {Publicacion[]} Lista de objetos `Publicacion` creados por el usuario.
 */
export function useMisPublicaciones(): Publicacion[] {
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
