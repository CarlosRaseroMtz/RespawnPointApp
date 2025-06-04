import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../services/config/firebase-config";
import { UsuarioPreview } from "../types/usuario";

/**
 * Busca usuarios en Firestore cuyo nombre de usuario coincida parcialmente con el texto proporcionado.
 * Excluye al usuario actual del resultado.
 *
 * @param {string} nombre Texto que se usará para buscar coincidencias en los nombres de usuario.
 * @param {string} actualUid UID del usuario actual (para excluirlo de los resultados).
 * @returns {Promise<UsuarioPreview[]>} Lista de usuarios encontrados o un mensaje informativo si no se hallan coincidencias.
 */
export async function buscarUsuarios(
  nombre: string,
  actualUid: string
): Promise<UsuarioPreview[]> {
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
