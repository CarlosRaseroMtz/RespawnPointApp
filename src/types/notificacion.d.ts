export type TipoNoti = "like" | "comentario" | "seguimiento" | "mensaje";

export interface Notificacion {
  seconds: any;
  id: string;
  user: string;
  avatar: string;
  message: string;
  time: any; // puedes usar Timestamp de Firebase si lo importas
  leida: boolean;
  action?: string;
  categoria?: "Usuarios" | "Comunidades" | "Torneos";
}
