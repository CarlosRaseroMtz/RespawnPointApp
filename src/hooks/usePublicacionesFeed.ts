import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../config/firebase-config";
import { Autor } from "../types/autor";
import { Publicacion } from "../types/publicacion";

interface PostConAutor extends Publicacion {
  autor: Autor;
}

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
          const usnap = await getDoc(doc(firestore, "usuarios", data.userId));
          const autor = usnap.exists() ? usnap.data() : {};

          return {
            id: d.id,
            ...data,
            autor: {
              uid: data.userId,
              username: autor.username ?? "Player",
              fotoPerfil: autor.fotoPerfil ?? null,
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
