/**
 * Tipos de notificación disponibles en la aplicación.
 * 
 * - `"like"`: Cuando alguien da me gusta a una publicación.
 * - `"comentario"`: Cuando alguien comenta en una publicación.
 * - `"seguimiento"`: Cuando alguien empieza a seguir al usuario.
 * - `"mensaje"`: Cuando se recibe un mensaje directo.
 */
export type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

/**
 * Representa una notificación individual mostrada al usuario.
 */
export interface Notificacion {
  /** Timestamp en segundos, usado para ordenamiento. */
  seconds: any;

  /** ID único de la notificación. */
  id: string;

  /** Nombre de usuario del emisor de la notificación. */
  user: string;

  /** URL del avatar del emisor. */
  avatar: string;

  /** Contenido del mensaje o descripción de la notificación. */
  message: string;

  /** Objeto de tiempo (puede ser un `Timestamp` de Firebase). */
  time: any;

  /** Tipo de notificación (like, comentario, etc.). */
  tipo: TipoNoti;

  /** Indica si la notificación ha sido leída. */
  leida: boolean;

  /** Acción asociada a la notificación (opcional). */
  action?: string;

  /** Categoría de la notificación (opcional). */
  categoria?: "Usuarios" | "Comunidades" | "Torneos";
}
/**
 * Representa una notificación individual mostrada al usuario.
 * Incluye información sobre el emisor, contenido, tipo y estado de lectura.
 */