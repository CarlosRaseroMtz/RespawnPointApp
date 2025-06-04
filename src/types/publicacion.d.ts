import { Timestamp } from "firebase/firestore";

/**
 * Representa una publicación creada por un usuario dentro de la aplicación.
 */
export interface Publicacion {
  /** ID único de la publicación. */
  id: string;

  /** UID del usuario que creó la publicación. */
  userId: string;

  /** URL del recurso multimedia (imagen, video, etc.) asociado a la publicación. */
  mediaUrl: string;

  /** Texto opcional que acompaña la publicación. */
  contenido?: string;

  /** ID de la comunidad en la que se publicó (opcional). */
  comunidadId?: string;

  /**
   * Categoría de la publicación, como "general", "juegos", etc. (opcional).
   */
  categoria?: string;

  /** Número de comentarios asociados a la publicación (opcional). */
  commentsCount?: number;

  /** Lista de UIDs de usuarios que han dado like (opcional). */
  likes?: string[];

  /** Marca de tiempo de creación de la publicación. */
  timestamp: Timestamp;
}
/**
 * Representa una publicación creada por un usuario.
 * Incluye información sobre el autor, contenido multimedia, texto y metadatos.
 */