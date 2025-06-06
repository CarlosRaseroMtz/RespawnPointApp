import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../services/config/firebase-config";
import { ChatPreview } from "../types/chats";
import { useAuth } from "./useAuth";

/**
 * Hook personalizado para obtener en tiempo real los chats del usuario autenticado.
 *
 * Escucha la colección "chats" de Firestore, filtrando por los chats en los que participa
 * el usuario actual, y los ordena por `timestamp` descendente.
 *
 * Además, extrae información del otro participante desde la colección `usuarios`.
 *
 * @returns {ChatPreview[]} Lista de objetos `ChatPreview` representando los chats del usuario.
 */
export function useChats(): ChatPreview[] {
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatPreview[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "chats"),
      where("participantes", "array-contains", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, async (snap) => {
      const res = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data();

          if (data.tipo === "grupo") {
            return {
              id: d.id,
              tipo: "grupo",
              nombre: data.nombreC || "Grupo",
              avatar: data.avatarC || "https://i.pravatar.cc/150?img=1",
              lastMessage: data.lastMessage ?? "",
              timestamp:
                data.timestamp?.toDate().toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) ?? "",
            } as ChatPreview;
          }


          const otroUid = data.participantes.find(
            (uid: string) => uid !== user.uid
          );
          const otroSnap = await getDoc(doc(firestore, "usuarios", otroUid));
          const userInfo = otroSnap.exists() ? otroSnap.data() : {};

          return {
            id: d.id,
            tipo: "usuario",
            nombre: userInfo.username ?? "Usuario",
            avatar: userInfo.fotoPerfil ?? "https://i.pravatar.cc/150?img=2",
            lastMessage: data.lastMessage ?? "",
            timestamp:
              data.timestamp?.toDate().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              }) ?? "",
          }as ChatPreview;
        })
      );
      setChats(res);
    });

    return unsub;
  }, [user]);

  return chats;
}
