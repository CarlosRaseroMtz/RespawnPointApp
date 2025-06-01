import { Timestamp } from "firebase/firestore";

export interface Publicacion {
  id: string;
  userId: string;
  mediaUrl: string;
  contenido?: string;
  comunidadId?: string;
  likes?: string[]; // array de UIDs que dieron like
  timestamp: Timestamp; // puedes usar Timestamp si importas de Firebase
}
