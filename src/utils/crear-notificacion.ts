import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../services/config/firebase-config";

/**
 * Tipos de notificaciones disponibles.
 */
export type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

/**
 * Parámetros requeridos para crear una notificación.
 */
interface CrearNotificacionParams {
  /** UID del usuario que recibirá la notificación. */
  paraUid: string;

  /** UID del usuario que genera la notificación. */
  deUid: string;

  /** Contenido o mensaje de la notificación. */
  contenido: string;

  /** Tipo de la notificación (like, comentario, seguimiento o mensaje). */
  tipo: TipoNoti;
}

/**
 * Crea una notificación en la subcolección `notificaciones/{paraUid}/items` de Firestore.
 * Obtiene los datos del usuario emisor (`deUid`) y añade los metadatos correspondientes.
 *
 * @param {CrearNotificacionParams} params Objeto con los campos necesarios para la notificación.
 * @returns {Promise<void>} Promesa que se resuelve al completar la operación o se ignora si faltan campos.
 */
export const crearNotificacion = async ({
  paraUid,
  deUid,
  contenido,
  tipo,
}: CrearNotificacionParams): Promise<void> => {
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
