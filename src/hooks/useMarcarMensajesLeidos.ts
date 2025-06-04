// hooks/useMarcarMensajesLeidos.ts
import { collection, getDocs, getFirestore, writeBatch } from "firebase/firestore";
import { useCallback } from "react";

// Custom hook para marcar mensajes como leídos en un chat específico
// Utiliza Firestore para actualizar los mensajes y agregar el UID del usuario que los ha leído
export function useMarcarMensajesLeidos() {
  const marcarMensajesComoLeidos = useCallback(async (chatId: string, uid: string) => {
    const db = getFirestore();
    const mensajesRef = collection(db, "chats", chatId, "mensajes");

    const mensajesSnap = await getDocs(mensajesRef);
    const batch = writeBatch(db);

    mensajesSnap.docs.forEach((doc) => {
      const data = doc.data();
      const leidoPor = data.leidoPor || [];

      if (!leidoPor.includes(uid)) {
        batch.update(doc.ref, {
          leidoPor: [...leidoPor, uid],
        });
      }
    });

    await batch.commit();
  }, []);

  return { marcarMensajesComoLeidos };
}
