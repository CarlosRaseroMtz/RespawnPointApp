import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { crearNotificacion } from "../../src/utils/crear-notificacion";
import { firestore } from "../config/firebase-config";

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

