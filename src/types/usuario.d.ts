export interface Usuario {
  id: string;
  username: string;
  email?: string;
  fotoPerfil?: string;
  plataformaFav?: string;
  generoFav?: string;
  descripcion?: string;
  seguidores?: string[];  // array de UIDs
  siguiendo?: string[];   // array de UIDs
  rol?: "admin" | "moderador" | "jugador";
  reputacion?: number;
  nivel?: number;
  comunidades?: string[];
}

export interface UsuarioPreview {
  id: string;
  username: string;
  fotoPerfil?: string;
}
