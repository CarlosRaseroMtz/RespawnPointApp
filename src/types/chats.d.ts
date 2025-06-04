/**
 * Representa un resumen de un chat en la lista de conversaciones.
 * Incluye los datos necesarios para mostrar el preview de un chat.
 */
export interface ChatPreview {
  /** ID único del chat. */
  id: string;

  /** Tipo de chat: puede ser individual (`usuario`) o grupal (`grupo`). */
  tipo: "usuario" | "grupo";

  /** Nombre del participante o del grupo. */
  nombre: string;

  /** URL del avatar del usuario o grupo. */
  avatar: string;

  /** Último mensaje enviado o recibido en el chat. */
  lastMessage: string;

  /** Hora o fecha del último mensaje, en formato string legible. */
  timestamp: string;
}
/**
 * Representa un chat con información básica para mostrar en la lista de chats.
 * Incluye el ID, tipo, nombre, avatar, último mensaje y timestamp.
 */