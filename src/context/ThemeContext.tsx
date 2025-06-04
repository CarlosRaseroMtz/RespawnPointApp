import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Contexto para el tema de la aplicación
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

// Hook para acceder al contexto del tema
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Cargar el tema desde AsyncStorage o usar el esquema de color del sistema
  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem("appTheme");
      if (stored === "light" || stored === "dark") setTheme(stored);
      else setTheme(Appearance.getColorScheme() === "dark" ? "dark" : "light");
    };
    loadTheme();
  }, []);

  // Función para alternar entre temas claro y oscuro
  const toggleTheme = async () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("appTheme", newTheme);
  };

  // Proveer el contexto del tema
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
