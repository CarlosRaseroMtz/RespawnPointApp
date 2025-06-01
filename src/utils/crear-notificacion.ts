import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../src/config/firebase-config";

export type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

interface CrearNotificacionParams {
  paraUid: string;
  deUid: string;
  contenido: string;
  tipo: TipoNoti;
}

export const crearNotificacion = async ({
  paraUid,
  deUid,
  contenido,
  tipo,
}: CrearNotificacionParams) => {
  if (!paraUid || !deUid || !contenido || !tipo) {
    console.warn("❌ No se ha creado notificación: faltan campos.");
    return;
  }

  try {
    // 🔍 Cargar datos reales del emisor
    const perfilSnap = await getDoc(doc(firestore, "usuarios", deUid));
    const perfil = perfilSnap.exists() ? perfilSnap.data() : {};

    console.log("📦 Perfil cargado para notificación:", {
      username: perfil.username,
      fotoPerfil: perfil.fotoPerfil,
    });

    const categoria = ["like", "comentario", "mensaje", "seguimiento"].includes(tipo)
      ? "Usuarios"
      : "Comunidades";

    await addDoc(collection(firestore, "notificaciones", paraUid, "items"), {
      user: perfil.username || null,
      avatar: perfil.fotoPerfil || null,
      message: contenido,
      tipo,
      categoria,
      leida: false,
      time: serverTimestamp(),
    });

  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
  }
};
