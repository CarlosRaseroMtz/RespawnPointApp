import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { Autor } from "../types/autor";
import { Publicacion } from "../types/publicacion";

/**
 * Tipo que representa una publicación combinada con los datos de su autor.
 */
interface PostConAutor extends Publicacion {
  /** Información del autor de la publicación. */
  autor: Autor;
}

/**
 * Hook personalizado para obtener el feed de publicaciones de todos los usuarios.
 *
 * Escucha en tiempo real las publicaciones desde Firestore, ordenadas por timestamp,
 * y para cada publicación obtiene los datos del autor desde la colección `usuarios`.
 *
 * @returns {PostConAutor[]} Lista de publicaciones con información del autor incluida.
 */
export function usePublicacionesFeed(): PostConAutor[] {
  const [posts, setPosts] = useState<PostConAutor[]>([]);

  useEffect(() => {
    const q = query(
      collection(firestore, "publicaciones"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const arr = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();
          console.log("📄 Post leído:", data);
          const usnap = await getDoc(doc(firestore, "usuarios", data.userId));
          console.log("👤 Autor cargado:", usnap.data());
          const autor = usnap.exists() ? usnap.data() : {};

          return {
            id: d.id,
            ...data,
            autor: {
              uid: data.userId,
              username: autor.username ?? "Player",
              fotoPerfil:
                autor.fotoPerfil ?? "../../assets/images/foto-perfil-isi.png",
            },
          } as PostConAutor;
        })
      );

      setPosts(arr);
    });

    return unsub;
  }, []);

  return posts;
}
