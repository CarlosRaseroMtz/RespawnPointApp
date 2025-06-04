import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

/**
 * Hook personalizado para contar en tiempo real:
 * - Notificaciones no leídas
 * - Chats con mensajes no leídos
 *
 * Escucha la colección de notificaciones del usuario y cada subcolección de mensajes
 * dentro de los chats en los que participa.
 *
 * @param {string | undefined} uid UID del usuario autenticado.
 * @returns {{ unreadNotis: number; unreadChats: number }} Contadores de notificaciones y chats no leídos.
 */
export function useUnreadCounters(uid: string | undefined): {
  unreadNotis: number;
  unreadChats: number;
} {
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
    const chatsRef = query(
      collection(db, "chats"),
      where("participantes", "array-contains", uid)
    );

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

          mensajesUnsubsRef.current.set(chatId, unsubMensajes);

          if (hayNoLeidos) {
            totalNoLeidos++;
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
      mensajesUnsubsRef.current.forEach((unsub) => unsub());
      mensajesUnsubsRef.current.clear();
    };
  }, [uid]);

  return { unreadNotis, unreadChats };
}
