// hooks/useMarcarMensajesLeidos.ts
import { collection, getDocs, getFirestore, writeBatch } from "firebase/firestore";
import { useCallback } from "react";

/**
 * Hook personalizado para marcar como leídos los mensajes de un chat en Firestore.
 *
 * Este hook actualiza todos los mensajes de un chat específico agregando el UID del usuario
 * al array `leidoPor` si aún no lo contiene.
 *
 * @returns {{ marcarMensajesComoLeidos: (chatId: string, uid: string) => Promise<void> }}
 *   Función para ejecutar la acción de marcado.
 */
export function useMarcarMensajesLeidos(): {
  marcarMensajesComoLeidos: (chatId: string, uid: string) => Promise<void>;
} {
  /**
   * Marca como leídos todos los mensajes de un chat para un usuario específico.
   *
   * @param chatId ID del chat cuyos mensajes se quieren marcar.
   * @param uid UID del usuario que ha leído los mensajes.
   * @returns {Promise<void>} Promesa que se resuelve cuando la operación ha sido completada.
   */
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
