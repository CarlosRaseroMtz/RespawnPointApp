import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { app } from "../services/config/firebase-config";
import { Notificacion } from "../types/notificacion";


// Custom hook para obtener las notificaciones del usuario autenticado
// Escucha en tiempo real los cambios en la colección "notificaciones"
export function useNotificaciones(categoriaActiva: string) {
  const [notifications, setNotifications] = useState<Notificacion[]>([]);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const user = auth.currentUser;

  // Efecto para suscribirse a los cambios en la colección "notificaciones"
  // Filtra las notificaciones por categoría y marca como leídas
  useEffect(() => {
    
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
        .filter((n) => n.message && n.categoria?.toLowerCase() === categoriaActiva)
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
