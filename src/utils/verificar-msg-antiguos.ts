// src/utils/verificarMensajesAntiguos.ts
import { collectionGroup, getDocs } from "firebase/firestore";
import { firestore } from "../services/config/firebase-config";

// Verifica si hay mensajes antiguos que usan el campo "texto" en lugar de "contenido"
export const verificarMensajesAntiguos = async () => {
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
