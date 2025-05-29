import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../config/firebase-config";

export type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

interface CrearNotificacionParams {
  paraUid: string;
  deUid: string;
  deNombre: string;
  avatar?: string;
  contenido: string;
  tipo: TipoNoti;
}

export const crearNotificacion = async ({
  paraUid,
  deUid,
  deNombre,
  avatar,
  contenido,
  tipo,
}: CrearNotificacionParams) => {
  if (!paraUid || !deUid || !deNombre || !contenido || !tipo) {
    console.warn("❌ No se ha creado notificación: faltan campos.");
    return;
  }

  try {
    const ref = collection(firestore, "notificaciones", paraUid, "items");
    await addDoc(ref, {
      deUid,
      deNombre,
      avatar: avatar || "https://i.pravatar.cc/150?img=12",
      contenido,
      tipo,
      leido: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
  }
};
