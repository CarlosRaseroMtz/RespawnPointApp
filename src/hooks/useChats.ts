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
import { firestore } from "../config/firebase-config";
import { ChatPreview } from "../types/chats";
import { useAuth } from "./useAuth";

export function useChats() {
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
                    const otroUid = data.participantes.find((uid: string) => uid !== user.uid);
                    const otroSnap = await getDoc(doc(firestore, "usuarios", otroUid));
                    const userInfo = otroSnap.exists() ? otroSnap.data() : {};

                    return {
                        id: d.id,
                        tipo: data.tipo ?? "usuario",
                        nombre: userInfo.username ?? "Usuario",
                        avatar: userInfo.fotoPerfil ?? "https://i.pravatar.cc/150?img=2",
                        lastMessage: data.lastMessage ?? "",
                        timestamp:
                            data.timestamp?.toDate().toLocaleTimeString("es-ES", {
                                hour: "2-digit",
                                minute: "2-digit",
                            }) ?? "",
                    };
                })
            );
            setChats(res);
        });

        return unsub;
    }, [user]);

    return chats;
}
