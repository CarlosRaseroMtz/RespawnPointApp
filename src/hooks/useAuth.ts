import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/config/firebase-config";

// Custom hook para manejar la autenticación de Firebase
// Utiliza onAuthStateChanged para escuchar cambios en el estado de autenticación
export function useAuth() {
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
