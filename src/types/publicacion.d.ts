import { Timestamp } from "firebase/firestore";

export interface Publicacion {
  id: string;
  userId: string;
  mediaUrl: string;
  contenido?: string;
  comunidadId?: string;
  categoria?: string; // opcional, puede ser "general", "juegos", etc.
  commentsCount?: number; // opcional, cuenta de comentarios
  likes?: string[]; // array de UIDs que dieron like
  timestamp: Timestamp; // puedes usar Timestamp si importas de Firebase
}
