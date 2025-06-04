import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/config/firebase-config";

/**
 * Hook personalizado para manejar la autenticación de Firebase.
 *
 * Escucha los cambios en el estado de autenticación usando `onAuthStateChanged`
 * y proporciona el usuario actual junto con el estado de carga.
 *
 * @returns {{ user: User | null, loading: boolean }} Objeto con el usuario autenticado (si existe) y un indicador de carga.
 */
export function useAuth(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Efecto para suscribirse a los cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}
