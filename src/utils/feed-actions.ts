import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    runTransaction,
    updateDoc
} from "firebase/firestore";
import { crearNotificacion } from "../../src/utils/crear-notificacion";
import { firestore } from "../services/config/firebase-config";

// ────────────────────────────────
// 1. LIKE / UNLIKE PUBLICACIÓN
// ────────────────────────────────
export async function toggleLike({
  postId,
  userUid,
  likes,
}: {
  postId: string;
  userUid: string;
  likes: string[];
}) {
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

// ────────────────────────────────
// 2. COMENTAR PUBLICACIÓN
// ────────────────────────────────

export async function comentarPublicacion({
  publicacionId,
  contenido,
  autorUid,
}: {
  publicacionId: string;
  contenido: string;
  autorUid: string;
}) {
  const pubRef = doc(firestore, "publicaciones", publicacionId);
  const pubSnap = await getDoc(pubRef);

  if (!pubSnap.exists()) return;

  const { userId: autorOriginal } = pubSnap.data();

  // 1. Guardar el comentario en la subcolección correcta
  await addDoc(collection(pubRef, "comentarios"), {
    userId: autorUid,
    contenido,
    timestamp: new Date(),
  });

  // 2. Incrementar el contador de comentarios con seguridad
  await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(pubRef);
    if (!snap.exists()) return;

    const current = snap.data().commentsCount || 0;
    tx.update(pubRef, {
      commentsCount: current + 1,
    });
  });

  // 3. Notificar si el autor no es uno mismo
  if (autorOriginal !== autorUid) {
    await crearNotificacion({
      paraUid: autorOriginal,
      deUid: autorUid,
      contenido: `comentó en tu publicación`,
      tipo: "comentario",
    });
  }
}



// ────────────────────────────────
// 3. SEGUIR / DEJAR DE SEGUIR
// ────────────────────────────────
export async function toggleSeguir({
  desdeUid,
  haciaUid,
}: {
  desdeUid: string;
  haciaUid: string;
}) {
  if (desdeUid === haciaUid) return;

  const desdeRef = doc(firestore, "usuarios", desdeUid);
  const haciaRef = doc(firestore, "usuarios", haciaUid);

  await runTransaction(firestore, async (tx) => {
    const desdeSnap = await tx.get(desdeRef);
    const haciaSnap = await tx.get(haciaRef);

    if (!desdeSnap.exists() || !haciaSnap.exists()) return;

    const seguidos = desdeSnap.data().seguidos || [];
    const yaSigue = seguidos.includes(haciaUid);

    tx.update(desdeRef, {
      seguidos: yaSigue ? arrayRemove(haciaUid) : arrayUnion(haciaUid),
    });

    tx.update(haciaRef, {
      seguidores: yaSigue ? arrayRemove(desdeUid) : arrayUnion(desdeUid),
    });

    if (!yaSigue) {
      await crearNotificacion({
        paraUid: haciaUid,
        deUid: desdeUid,
        contenido: `empezó a seguirte`,
        tipo: "seguimiento",
      });
    }
  });
}
