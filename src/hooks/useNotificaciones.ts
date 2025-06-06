import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../services/config/firebase-config";
import { Notificacion } from "../types/notificacion";

/**
 * Hook personalizado para obtener en tiempo real las notificaciones del usuario autenticado
 * desde Firestore, filtradas por una categoría activa.
 *
 * También marca como leídas las notificaciones que aún no lo están.
 *
 * @param {string} categoriaActiva Categoría seleccionada para filtrar las notificaciones.
 * @returns {Notificacion[]} Lista de notificaciones ordenadas por tiempo descendente.
 */
export function useNotificaciones(categoriaActiva: string): Notificacion[] {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const itemsRef = collection(db, "notificaciones", user.uid, "items");

    const unsubscribe = onSnapshot(itemsRef, async (snapshot) => {
      const notifList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
                    let avatar = data.avatar;
          if (!avatar) {
            const q = query(
              collection(db, "usuarios"),
              where("username", "==", data.user)
            );
            const res = await getDocs(q);
            if (!res.empty) {
              avatar = res.docs[0].data().fotoPerfil || avatar;
            }
          }
          return {
            id: doc.id,
            ...data,
            avatar,
            seconds: data.time?.seconds || 0,
          } as Notificacion;
        })
      );
      const filtered = notifList
        .filter(
          (n) =>
            n.message &&
            n.categoria?.toLowerCase() === categoriaActiva.toLowerCase()
        )
        .sort((a, b) => b.seconds - a.seconds);

      setNotifications(filtered);

      // Marcar como leídas
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data.leida) {
          updateDoc(doc.ref, { leida: true });
        }
      });
    });

    return () => unsubscribe();
  }, [categoriaActiva]);

  return notifications;
}
