import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

// Custom hook para obtener contadores de notificaciones y chats no leídos
export function useUnreadCounters(uid: string | undefined) {
  const [unreadNotis, setUnreadNotis] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  // 📌 Guardamos listeners de mensajes para luego cancelarlos
  const mensajesUnsubsRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    if (!uid) return;

    const db = getFirestore();

    // 🔔 Notificaciones no leídas
    const notiRef = collection(db, "notificaciones", uid, "items");
    const unsubNotis = onSnapshot(notiRef, (snap) => {
      const count = snap.docs.filter((doc) => !doc.data().leida).length;
      setUnreadNotis(count);
    });

    // 💬 Chats del usuario
    const chatsRef = query(collection(db, "chats"), where("participantes", "array-contains", uid));
    const unsubChats = onSnapshot(chatsRef, (chatsSnap) => {
      // 🧼 Limpia todos los listeners anteriores de mensajes
      mensajesUnsubsRef.current.forEach((unsub) => unsub());
      mensajesUnsubsRef.current.clear();

      let totalNoLeidos = 0;
      let procesados = 0;

      if (chatsSnap.empty) {
        setUnreadChats(0);
        return;
      }

      chatsSnap.docs.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const mensajesRef = collection(chatDoc.ref, "mensajes");

        const unsubMensajes = onSnapshot(mensajesRef, (msgSnap) => {
          const hayNoLeidos = msgSnap.docs.some((msg) => {
            const data = msg.data();
            return data.userId !== uid && !data.leidoPor?.includes(uid);
          });

          // Actualiza el contador por cada cambio en mensajes
          if (hayNoLeidos) {
            mensajesUnsubsRef.current.set(chatId, unsubMensajes);
            totalNoLeidos++;
          } else {
            mensajesUnsubsRef.current.set(chatId, unsubMensajes);
          }

          procesados++;
          if (procesados === chatsSnap.docs.length) {
            setUnreadChats(totalNoLeidos);
          }
        });
      });
    });

    return () => {
      unsubNotis();
      unsubChats();
      // Limpia todos los listeners de mensajes al desmontar
      mensajesUnsubsRef.current.forEach((unsub) => unsub());
      mensajesUnsubsRef.current.clear();
    };
  }, [uid]);

  return { unreadNotis, unreadChats };
}
