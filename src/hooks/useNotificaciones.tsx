import { getAuth } from "firebase/auth";
import {
    collection,
    getFirestore,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../config/firebase-config";
import { Notificacion } from "../types/notificacion";


export function useNotificaciones(categoriaActiva: string) {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  const db = getFirestore(app);
  const auth = getAuth(app);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const itemsRef = collection(db, "notificaciones", user.uid, "items");

    const unsubscribe = onSnapshot(itemsRef, (snapshot) => {
      const notifList = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
              id: doc.id,
              ...data,
              seconds: data.time?.seconds || 0,
          } as unknown as Notificacion;
        })
        .filter((n) => n.user && n.message && n.time && n.categoria === categoriaActiva)
        .sort((a, b) => b.seconds - a.seconds);

      setNotifications(notifList);

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
