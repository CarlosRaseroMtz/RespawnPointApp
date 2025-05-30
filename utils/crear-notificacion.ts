import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../config/firebase-config";

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
      user: perfil.username || "Desconocido",
      avatar: perfil.fotoPerfil || "https://i.pravatar.cc/150?img=12",
      message: contenido,
      categoria,
      action: tipo === "seguimiento" ? "seguir" : null,
      leida: false,
      time: serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error al crear notificación:", error);
  }
};
