import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, JSX, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

/**
 * Tipos de tema disponibles.
 */
type Theme = "light" | "dark";

/**
 * Estructura del contexto de tema.
 */
interface ThemeContextType {
  /** Tema actual de la aplicación. */
  theme: Theme;
  /** Función para alternar entre temas claro y oscuro. */
  toggleTheme: () => void;
}

/**
 * Contexto para el tema de la aplicación.
 * Ofrece acceso al tema actual y una función para cambiarlo.
 */
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

/**
 * Hook personalizado para acceder al contexto del tema.
 *
 * @returns {ThemeContextType} El contexto de tema actual.
 */
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

/**
 * Proveedor del contexto de tema.
 * Determina el tema inicial desde AsyncStorage o la preferencia del sistema,
 * y permite alternar entre temas claro y oscuro.
 *
 * @param props.children Elementos hijos que recibirán el contexto del tema.
 * @returns {JSX.Element} Componente proveedor con el contexto aplicado.
 */
export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [theme, setTheme] = useState<Theme>("light");

  // Cargar el tema desde almacenamiento o usar el del sistema
  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem("appTheme");
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setTheme(systemTheme === "dark" ? "dark" : "light");
      }
    };
    loadTheme();
  }, []);

  /**
   * Alterna entre tema claro y oscuro, y lo guarda en AsyncStorage.
   */
  const toggleTheme = async () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
