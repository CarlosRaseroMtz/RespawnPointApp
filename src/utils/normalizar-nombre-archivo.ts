/**
 * Normaliza un nombre de archivo eliminando acentos, caracteres especiales
 * y reemplazando espacios por guiones bajos.
 *
 * @param {string} nombre Nombre original del archivo.
 * @returns {string} Nombre normalizado del archivo.
 *
 * @example
 * // Devuelve 'mi_archivo.txt'
 * normalizarNombreArchivo("mí árchivo.txt");
 */
export const normalizarNombreArchivo = (nombre: string): string => {
  return nombre
    .normalize("NFD")                           // Descompone caracteres con acento
    .replace(/[\u0300-\u036f]/g, "")            // Elimina los acentos
    .replace(/[^\w\s.-]/gi, "")                 // Elimina símbolos no válidos
    .replace(/\s+/g, "_");                      // Reemplaza espacios por guiones bajos
};
