import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Define dimensiones cortas y largas según la orientación del dispositivo
const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

// Dimensiones base para dispositivos de referencia (iPhone X / 5")
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Escala horizontal basada en el ancho del dispositivo.
 *
 * @param {number} size Tamaño base que se quiere escalar (por ejemplo: fuente, padding, etc.).
 * @returns {number} Tamaño escalado proporcionalmente al ancho del dispositivo.
 *
 * @example
 * const fontSize = scale(14); // Escala 14 para adaptarlo al ancho del dispositivo
 */
export const scale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((shortDimension / guidelineBaseWidth) * size)
  );

/**
 * Escala vertical basada en la altura del dispositivo.
 *
 * @param {number} size Tamaño base vertical que se quiere escalar (por ejemplo: altura de botón).
 * @returns {number} Tamaño escalado proporcionalmente a la altura del dispositivo.
 *
 * @example
 * const buttonHeight = verticalScale(40); // Escala 40 para adaptarlo a la altura
 */
export const verticalScale = (size: number): number =>
  Math.round(
    PixelRatio.roundToNearestPixel((longDimension / guidelineBaseHeight) * size)
  );
