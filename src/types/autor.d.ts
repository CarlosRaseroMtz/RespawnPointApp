/**
 * Representa a un autor o creador de contenido dentro de la aplicación.
 */
export interface Autor {
  /** UID único del autor (referencia a un usuario en Firebase). */
  uid: string;

  /** Nombre de usuario del autor. */
  username: string;

  /** URL de la foto de perfil o `null` si no tiene una. */
  fotoPerfil: string | null;
}
/**
 * Representa un autor con información adicional para mostrar en la UI.
 * Incluye el UID, nombre de usuario y foto de perfil.
 */