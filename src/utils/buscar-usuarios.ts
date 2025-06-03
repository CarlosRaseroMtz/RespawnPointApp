import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/config/firebase-config";
import { UsuarioPreview } from "../types/usuario";

export async function buscarUsuarios(nombre: string, actualUid: string): Promise<UsuarioPreview[]> {
  const snap = await getDocs(collection(firestore, "usuarios"));

  const encontrados = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as UsuarioPreview[];

  const filtrados = encontrados.filter(
    (u) =>
      u.username?.toLowerCase().includes(nombre.toLowerCase()) &&
      u.id !== actualUid
  );

  return filtrados.length
    ? filtrados
    : [{ id: "no-results", username: "No se encontraron usuarios" }];
}
