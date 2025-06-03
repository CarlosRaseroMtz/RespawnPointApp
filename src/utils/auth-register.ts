import {
    createUserWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../services/config/firebase-config";

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
}) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: fullName });

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
