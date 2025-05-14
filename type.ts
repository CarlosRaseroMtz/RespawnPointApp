// Tipos base de React Native y React
import { Timestamp } from 'firebase/firestore';
import { ReactNode, RefObject } from 'react';
import { TextInputProps, TextStyle, TouchableOpacityProps, ViewStyle } from 'react-native';

// Usuario gamer
export type UserType = {
  uid: string;
  username: string;
  email: string;
  photoURL?: string;
  plataformaFavorita?: string;
  generoFavorito?: string;
  reputacion: number;
  nivel?: number;
  rol: 'usuario' | 'moderador' | 'admin';
  comunidades: string[];
  createdAt: Timestamp;
};

// 📝 Publicación en el feed
export type PostType = {
  id: string;
  userId: string;
  contenido: string;
  mediaUrl?: string;
  likes: string[];              // IDs de usuarios
  timestamp: Date;
  comunidadId?: string;
};

// 💬 Comentario
export type CommentType = {
  id: string;
  publicacionId: string;
  userId: string;
  contenido: string;
  timestamp: Date;
};

// 👥 Comunidad
export type CommunityType = {
  id: string;
  nombre: string;
  plataforma: string;
  miembros: string[];
};

// 📩 Notificación
export type NotificationType = {
  id: string;
  userId: string;
  mensaje: string;
  leida: boolean;
  timestamp: Timestamp;
};

// 💬 Chat y mensajes
export type ChatType = {
  chatId: string;
  tipo: 'privado' | 'grupo';
  participantes: string[];
  notifydate: Timestamp;
};

export type MessageType = {
  autorId: string;
  contenido: string;
  timestamp: Timestamp;
  leidoPor: string[];
};


export type TournamentType = {
  id: string;
  titulo: string;
  juego: string;
  fecha: Timestamp;
  participantes: string[];
};


// 🧾 Prop para botones personalizados
export interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: ReactNode;
}

// 🧾 Prop para inputs personalizados
export interface InputProps extends TextInputProps {
  icon?: ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: RefObject<any>;
}

// 🧾 Resultado estándar de funciones (por ejemplo, login o registro)
export type ResponseType = {
  success: boolean;
  msg?: string;
  data?: any;
};
