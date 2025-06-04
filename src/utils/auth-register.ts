import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../services/config/firebase-config";

/**
 * Registra un nuevo usuario en Firebase Auth y guarda su perfil en Firestore.
 *
 * @param {Object} params Datos necesarios para el registro del usuario.
 * @param {string} params.email Correo electrónico del usuario.
 * @param {string} params.password Contraseña del usuario.
 * @param {string} params.fullName Nombre completo que se mostrará en el perfil.
 * @param {string} params.username Nombre de usuario único en la plataforma.
 * @param {string} params.platform Plataforma favorita (ej. PC, Xbox, etc.).
 * @param {string[]} params.selectedGenres Géneros de juegos favoritos.
 *
 * @returns {Promise<void>} Promesa que se resuelve cuando el registro y guardado están completos.
 *
 * @throws {Error} Si ocurre algún problema durante el proceso de registro.
 */
export async function registerUser({
  email,
  password,
  fullName,
  username,
  platform,
  selectedGenres,
}: {
  email: string;
  password: string;
  fullName: string;
  username: string;
  platform: string;
  selectedGenres: string[];
}): Promise<void> {
  // Crear usuario en Auth
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // Asignar nombre completo al perfil de Auth
  await updateProfile(user, { displayName: fullName });

  // Crear documento en Firestore con información adicional
  await setDoc(doc(firestore, "usuarios", user.uid), {
    username,
    email: user.email,
    fotoPerfil: "https://i.pravatar.cc/150?img=12",
    plataformaFav: platform,
    generoFav: selectedGenres.join(", "),
    seguidores: [],
    siguiendo: [],
    descripcion: "Nuevo jugador registrado.",
    nivel: null,
    reputacion: 1,
    rol: "jugador",
    comunidades: [],
  });
}
