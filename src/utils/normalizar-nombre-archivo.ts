export const normalizarNombreArchivo = (nombre: string): string => {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/gi, "")
    .replace(/\s+/g, "_");
};
