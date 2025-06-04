/**
 * Representa un usuario completo registrado en la aplicación.
 */
export interface Usuario {
  /** ID único del usuario (UID de Firebase). */
  id: string;

  /** Nombre de usuario visible públicamente. */
  username: string;

  /** Correo electrónico del usuario (opcional). */
  email?: string;

  /** URL de la foto de perfil del usuario (opcional). */
  fotoPerfil?: string;

  /** Plataforma de juego favorita del usuario (opcional). */
  plataformaFav?: string;

  /** Género de juego favorito del usuario (opcional). */
  generoFav?: string;

  /** Descripción breve o biografía del usuario (opcional). */
  descripcion?: string;

  /** Lista de UIDs de usuarios que siguen a este usuario (opcional). */
  seguidores?: string[];

  /** Lista de UIDs de usuarios que este usuario sigue (opcional). */
  siguiendo?: string[];

  /** Rol asignado al usuario: admin, moderador o jugador (opcional). */
  rol?: "admin" | "moderador" | "jugador";

  /** Reputación del usuario, representada como un número (opcional). */
  reputacion?: number;

  /** Nivel del usuario en la app, si aplica (opcional). */
  nivel?: number;

  /** IDs de comunidades a las que pertenece el usuario (opcional). */
  comunidades?: string[];
}

/**
 * Representación simplificada de un usuario.
 * Usada para mostrar previews en listas, chats o tarjetas de perfil.
 */
export interface UsuarioPreview {
  /** ID único del usuario. */
  id: string;

  /** Nombre de usuario. */
  username: string;

  /** URL de la foto de perfil (opcional). */
  fotoPerfil?: string;
}
/**
 * Representa un usuario completo registrado en la aplicación.
 * Incluye información básica, preferencias y relaciones con otros usuarios.
 */