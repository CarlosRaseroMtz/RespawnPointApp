export interface ChatPreview {
  id: string;
  tipo: "usuario" | "grupo";
  nombre: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
}
