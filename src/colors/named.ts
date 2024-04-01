import { ColorScheme, Colorway } from "./types";

const buildColorWays = (colorSet: ColorScheme) => {
  const schemes: (keyof ColorScheme)[] = ["light", "dark"];
  schemes.forEach((scheme) => {
    colorSet[scheme].colorway = [
      colorSet[scheme]["900"],
      colorSet[scheme]["800"],
      colorSet[scheme]["700"],
      colorSet[scheme]["600"],
      colorSet[scheme]["500"],
      colorSet[scheme]["400"],
      colorSet[scheme]["300"],
      colorSet[scheme]["200"],
      colorSet[scheme]["100"],
    ];
  });
};

export const Blue: ColorScheme = {
  light: {
    "900": "#1c64f2",
    "800": "#4368e5",
    "700": "#586dd8",
    "600": "#6672cb",
    "500": "#7177bf",
    "400": "#7a7cb2",
    "300": "#8181a5",
    "200": "#878698",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#1c64f2",
    "800": "#4368e5",
    "700": "#586dd8",
    "600": "#6672cb",
    "500": "#7177bf",
    "400": "#7a7cb2",
    "300": "#8181a5",
    "200": "#878698",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Blue);

export const Gold: ColorScheme = {
  light: {
    "900": "#ffd700",
    "800": "#f2cd2f",
    "700": "#e5c344",
    "600": "#d7b953",
    "500": "#c9b061",
    "400": "#bba66c",
    "300": "#ac9d77",
    "200": "#9c9481",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#ffd700",
    "800": "#f2cd2f",
    "700": "#e5c344",
    "600": "#d7b953",
    "500": "#c9b061",
    "400": "#bba66c",
    "300": "#ac9d77",
    "200": "#9c9481",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Gold);

export const Green: ColorScheme = {
  light: {
    "900": "#56d19c",
    "800": "#61c89a",
    "700": "#6bc098",
    "600": "#72b796",
    "500": "#79ae94",
    "400": "#7fa692",
    "300": "#839d8f",
    "200": "#87948d",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#56d19c",
    "800": "#61c89a",
    "700": "#6bc098",
    "600": "#72b796",
    "500": "#79ae94",
    "400": "#7fa692",
    "300": "#839d8f",
    "200": "#87948d",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Green);

export const Pink: ColorScheme = {
  light: {
    "900": "#ea5f94",
    "800": "#df6793",
    "700": "#d46e92",
    "600": "#c97491",
    "500": "#be7a8f",
    "400": "#b27f8e",
    "300": "#a5838d",
    "200": "#99878c",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#ea5f94",
    "800": "#df6793",
    "700": "#d46e92",
    "600": "#c97491",
    "500": "#be7a8f",
    "400": "#b27f8e",
    "300": "#a5838d",
    "200": "#99878c",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Pink);

export const Orange: ColorScheme = {
  light: {
    "900": "#ffb14e",
    "800": "#f2ac57",
    "700": "#e4a760",
    "600": "#d6a368",
    "500": "#c89e70",
    "400": "#ba9977",
    "300": "#ab947e",
    "200": "#9c9085",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#ffb14e",
    "800": "#f2ac57",
    "700": "#e4a760",
    "600": "#d6a368",
    "500": "#c89e70",
    "400": "#ba9977",
    "300": "#ab947e",
    "200": "#9c9085",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Orange);

export const Purple: ColorScheme = {
  light: {
    "900": "#9061f9",
    "800": "#9267eb",
    "700": "#936ddd",
    "600": "#9472cf",
    "500": "#9378c2",
    "400": "#927db4",
    "300": "#9182a6",
    "200": "#8e8699",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#9061f9",
    "800": "#9267eb",
    "700": "#936ddd",
    "600": "#9472cf",
    "500": "#9378c2",
    "400": "#927db4",
    "300": "#9182a6",
    "200": "#8e8699",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Purple);

export const LightOrange: ColorScheme = {
  light: {
    "900": "#fa8775",
    "800": "#ed8878",
    "700": "#e0897b",
    "600": "#d38a7d",
    "500": "#c68b80",
    "400": "#b88b83",
    "300": "#aa8b86",
    "200": "#9b8b88",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#fa8775",
    "800": "#ed8878",
    "700": "#e0897b",
    "600": "#d38a7d",
    "500": "#c68b80",
    "400": "#b88b83",
    "300": "#aa8b86",
    "200": "#9b8b88",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(LightOrange);

export const Magenta: ColorScheme = {
  light: {
    "900": "#cd34b5",
    "800": "#c646b0",
    "700": "#bf54ab",
    "600": "#b760a6",
    "500": "#af6aa0",
    "400": "#a7749b",
    "300": "#9e7c96",
    "200": "#958490",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#cd34b5",
    "800": "#c646b0",
    "700": "#bf54ab",
    "600": "#b760a6",
    "500": "#af6aa0",
    "400": "#a7749b",
    "300": "#9e7c96",
    "200": "#958490",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Magenta);

export const Gray: ColorScheme = {
  light: {
    "900": "#d5d5dc",
    "800": "#cbcbd2",
    "700": "#c2c2c7",
    "600": "#b9b9bd",
    "500": "#afafb3",
    "400": "#a6a6a9",
    "300": "#9d9d9f",
    "200": "#949495",
    "100": "#8b8b8b",
    colorway: [],
  },
  dark: {
    "900": "#d5d5dc",
    "800": "#cbcbd2",
    "700": "#c2c2c7",
    "600": "#b9b9bd",
    "500": "#afafb3",
    "400": "#a6a6a9",
    "300": "#9d9d9f",
    "200": "#949495",
    "100": "#8b8b8b",
    colorway: [],
  },
};
buildColorWays(Gray);
// I'm British: https://www.youtube.com/watch?v=FkF_XpA5P48&pp=ygUfcHJvZmVzc29yIGVsZW1lbnRhbCBJJ20gYnJpdGlzaA%3D%3D
export const Grey = Gray;

// Semantic colors
export const SemanticColors = {
  primary: Blue,
  secondary: Gold,
  divider: Gray,
};

const buildDiscreteColorWay = (scheme: keyof ColorScheme) => {
  const shades = ["900", "700", "500"];
  return shades.reduce((colorway, shade) => {
    return [
      Blue,
      Gold,
      Green,
      Pink,
      Orange,
      Purple,
      LightOrange,
      Magenta,
      Gray,
    ].reduce((colorway, color) => {
      // @ts-expect-error
      colorway.push(color[scheme][shade]);
      return colorway;
    }, colorway);
  }, [] as Colorway);
};

export const Discrete: { light: Colorway; dark: Colorway } = {
  light: buildDiscreteColorWay("light"),
  dark: buildDiscreteColorWay("dark"),
};

export const Divergent1: Colorway = [
  "#ea5f94",
  "#ef7fa6",
  "#f29db8",
  "#f3b9ca",
  "#f3d5dd",
  "#f1f1f1",
  "#d4d2f2",
  "#b5b5f3",
  "#9299f3",
  "#687ef3",
  "#1c64f2",
];

export const Divergent2: Colorway = [
  "#9061f9",
  "#a87ef8",
  "#bd9af7",
  "#d0b7f6",
  "#e1d3f3",
  "#f1f1f1",
  "#d5ebdf",
  "#b9e5ce",
  "#9cdfbd",
  "#7cd8ad",
  "#56d19c",
];
