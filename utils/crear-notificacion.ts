import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../config/firebase-config";

type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

export const crearNotificacion = async ({
  paraUid,
  deUid,
  deNombre,
  avatar,
  contenido,
  tipo,
}: {
  paraUid: string;
  deUid: string;
  deNombre: string;
  avatar?: string;
  contenido: string;
  tipo: TipoNoti;
}) => {
  try {
    if (!paraUid || !deUid || !deNombre || !contenido || !tipo) {
      throw new Error("Faltan campos obligatorios para la notificación.");
    }

    await addDoc(collection(firestore, "notificaciones", paraUid, "items"), {
      deUid,
      deNombre,
      avatar: avatar || "https://i.pravatar.cc/150?img=12", // por defecto
      contenido,
      tipo,
      leido: false,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
  }
};
