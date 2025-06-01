import { getAuth } from "firebase/auth";
import {
    collection,
    getFirestore,
    onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export function useUnreadCounters(uid: string | undefined) {
  const [unreadNotis, setUnreadNotis] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    if (!uid) return;

    const db = getFirestore();
    const user = getAuth().currentUser;
    if (!user) return;

    // 🔔 Listener notificaciones
    const notiRef = collection(db, "notificaciones", uid, "items");
    const unsubNotis = onSnapshot(notiRef, (snap) => {
      const count = snap.docs.filter((doc) => !doc.data().leida).length;
      setUnreadNotis(count);
    });

    // 💬 Listener chats
    const chatsRef = collection(db, "chats");
    const unsubChats = onSnapshot(chatsRef, (chatsSnap) => {
      let total = 0;
      let completados = 0;

      chatsSnap.docs.forEach((chatDoc) => {
        const mensajesRef = collection(chatDoc.ref, "mensajes");

        const unsubMensajes = onSnapshot(mensajesRef, (msgSnap) => {
          const hayNoLeidos = msgSnap.docs.some((msg) => {
            const data = msg.data();
            return (
              !data.leidoPor?.includes(uid) &&
              data.userId !== uid
            );
          });

          if (hayNoLeidos) total++;

          completados++;
          if (completados === chatsSnap.docs.length) {
            setUnreadChats(total);
          }
        });

        // no almacenamos unsubMensajes para simplificar aquí
      });
    });

    return () => {
      unsubNotis();
      unsubChats();
    };
  }, [uid]);

  return { unreadNotis, unreadChats };
}
