// src/utils/verificarMensajesAntiguos.ts
import { collectionGroup, getDocs } from "firebase/firestore";
import { firestore } from "../services/config/firebase-config";

/**
 * Verifica en Firestore si existen mensajes antiguos que usan el campo `texto` en lugar de `contenido`.
 * Útil para detectar datos que necesitan migración en la colección `mensajes`.
 *
 * @returns {Promise<void>} Promesa que se resuelve al terminar la verificación.
 *
 * @example
 * await verificarMensajesAntiguos();
 */
export const verificarMensajesAntiguos = async (): Promise<void> => {
  console.log("🔍 Verificando mensajes antiguos...");

  const snap = await getDocs(collectionGroup(firestore, "mensajes"));

  let encontrados = 0;

  snap.forEach((doc) => {
    const data = doc.data();
    if (data.texto && !data.contenido) {
      console.log(`⚠️ Mensaje antiguo: ${doc.id} →`, data);
      encontrados++;
    }
  });

  if (encontrados === 0) {
    console.log("✅ Todos los mensajes usan 'contenido'.");
  } else {
    console.warn(`🔴 Encontrados ${encontrados} mensajes antiguos.`);
  }
};
