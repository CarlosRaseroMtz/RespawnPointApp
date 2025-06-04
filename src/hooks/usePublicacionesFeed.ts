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

interface PostConAutor extends Publicacion {
  autor: Autor;
}

// Custom hook para obtener el feed de publicaciones
// Escucha en tiempo real las publicaciones ordenadas por timestamp

export function usePublicacionesFeed() {
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
              fotoPerfil: autor.fotoPerfil ?? "../../assets/images/foto-perfil-isi.png",
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
