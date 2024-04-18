// Fits the shape of Layout['colorway']
export type Colorway = string[];
export type NamedColor = {
  colorway: Colorway;
  "900": string;
  "800": string;
  "700": string;
  "600": string;
  "500": string;
  "400": string;
  "300": string;
  "200": string;
  "100": string;
  "50": string;
};
export type SemanticColors = {
  primary: string;
  secondary: string;
  divider: string;
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
};
