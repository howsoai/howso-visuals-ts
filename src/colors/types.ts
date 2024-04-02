export type ColorShade = `#${string}`;
// Fits the shape of Layout['colorway']
export type Colorway = ColorShade[];
export type Color = {
  colorway: Colorway;
  "900": ColorShade;
  "800": ColorShade;
  "700": ColorShade;
  "600": ColorShade;
  "500": ColorShade;
  "400": ColorShade;
  "300": ColorShade;
  "200": ColorShade;
  "100": ColorShade;
};
export type ColorScheme = { light: Color; dark: Color };
