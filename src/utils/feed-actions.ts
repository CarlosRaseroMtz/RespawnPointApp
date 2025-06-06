import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { crearNotificacion } from "../../src/utils/crear-notificacion";
import { firestore } from "../services/config/firebase-config";

/**
 * Añade o elimina un "me gusta" de una publicación. Si es un "like" nuevo, notifica al autor.
 *
 * @param {Object} params
 * @param {string} params.postId ID de la publicación a modificar.
 * @param {string} params.userUid UID del usuario que da o quita el like.
 * @param {string[]} params.likes Lista actual de likes (UIDs).
 * @returns {Promise<void>}
 */
export async function toggleLike({
  postId,
  userUid,
  likes,
}: {
  postId: string;
  userUid: string;
  likes: string[];
}): Promise<void> {
  const ref = doc(firestore, "publicaciones", postId);
  const yaLike = likes.includes(userUid);

  await updateDoc(ref, {
    likes: yaLike ? arrayRemove(userUid) : arrayUnion(userUid),
  });

  if (!yaLike) {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const { userId } = snap.data();
      if (userId !== userUid) {
        await crearNotificacion({
          paraUid: userId,
          deUid: userUid,
          contenido: "le ha dado me gusta a tu publicación",
          tipo: "like",
        });
      }
    }
  }
}

/**
 * Agrega un comentario a una publicación y actualiza el contador de comentarios. También notifica al autor si aplica.
 *
 * @param {Object} params
 * @param {string} params.publicacionId ID de la publicación comentada.
 * @param {string} params.contenido Texto del comentario.
 * @param {string} params.autorUid UID del autor del comentario.
 * @returns {Promise<void>}
 */
export async function comentarPublicacion({
  publicacionId,
  contenido,
  autorUid,
}: {
  publicacionId: string;
  contenido: string;
  autorUid: string;
}): Promise<void> {
  const pubRef = doc(firestore, "publicaciones", publicacionId);
  const pubSnap = await getDoc(pubRef);

  if (!pubSnap.exists()) return;

  const { userId: autorOriginal } = pubSnap.data();

  await addDoc(collection(pubRef, "comentarios"), {
    userId: autorUid,
    contenido,
    timestamp: new Date(),
  });

  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(pubRef);
    if (!snap.exists()) return;

    const current = snap.data().commentsCount || 0;
    tx.update(pubRef, {
      commentsCount: current + 1,
    });
  });

  if (autorOriginal !== autorUid) {
    await crearNotificacion({
      paraUid: autorOriginal,
      deUid: autorUid,
      contenido: "comentó en tu publicación",
      tipo: "comentario",
    });
  }
}

/**
 * Alterna el estado de seguimiento entre dos usuarios. Si se comienza a seguir, envía una notificación.
 *
 * @param {Object} params
 * @param {string} params.desdeUid UID del usuario que realiza la acción.
 * @param {string} params.haciaUid UID del usuario objetivo.
 * @returns {Promise<void>}
 */
export async function toggleSeguir({
  desdeUid,
  haciaUid,
}: {
  desdeUid: string;
  haciaUid: string;
}): Promise<void> {
  if (desdeUid === haciaUid) return;

  const desdeRef = doc(firestore, "usuarios", desdeUid);
  const haciaRef = doc(firestore, "usuarios", haciaUid);

  await runTransaction(firestore, async (tx) => {
    const desdeSnap = await tx.get(desdeRef);
    const haciaSnap = await tx.get(haciaRef);

    if (!desdeSnap.exists() || !haciaSnap.exists()) return;

    const siguiendo = desdeSnap.data().siguiendo || [];
    const yaSigue = siguiendo.includes(haciaUid);

    tx.update(desdeRef, {
      siguiendo: yaSigue ? arrayRemove(haciaUid) : arrayUnion(haciaUid),
    });

    tx.update(haciaRef, {
      seguidores: yaSigue ? arrayRemove(desdeUid) : arrayUnion(desdeUid),
    });

    if (!yaSigue) {
      await crearNotificacion({
        paraUid: haciaUid,
        deUid: desdeUid,
        contenido: "empezó a seguirte",
        tipo: "seguimiento",
      });
    }
  });
}
