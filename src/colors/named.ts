import { Colorway, NamedColor } from "./types";

export const Blue: NamedColor = {
  "900": "#003880",
  "800": "#004CAD",
  "700": "#005DD6",
  "600": "#006EF8",
  "500": "#258CF7",
  "400": "#6CA7F8",
  "300": "#99BFFA",
  "200": "#BFD6FC",
  "100": "#E6EEFE",
  "50": "#F8FAFF",
  colorway: [],
};
buildColorWay(Blue);

export const Gold: NamedColor = {
  "900": "#443706",
  "800": "#5c4a08",
  "700": "#735d0a",
  "600": "#886e0B",
  "500": "#a8870E",
  "400": "#c7a111",
  "300": "#e4B813",
  "200": "#fbd133",
  "100": "#Fdeeb3",
  "50": "#fffae9",
  colorway: [],
};
buildColorWay(Gold);

export const Green: NamedColor = {
  "900": "#03412D",
  "800": "#04583d",
  "700": "#046d4c",
  "600": "#11805D",
  "500": "#419A7E",
  "400": "#6eb29c",
  "300": "#96c7b7",
  "200": "#bcdbd1",
  "100": "#e4f1ec",
  "50": "#f7fbf9",
  colorway: [],
};
buildColorWay(Green);

export const Pink: NamedColor = {
  "900": "#6e1900",
  "800": "#922300",
  "700": "#b52b00",
  "600": "#d73100",
  "500": "#f05645",
  "400": "#f7837c",
  "300": "#faa7a5",
  "200": "#fcc8c8",
  "100": "#fee9e9",
  "50": "#fff8f9",
  colorway: [],
};
buildColorWay(Pink);

export const Orange: NamedColor = {
  "900": "#582c12",
  "800": "#783c19",
  "700": "#854b1f",
  "600": "#b15825",
  "500": "#d96c2d",
  "400": "#e88f58",
  "300": "#efaf8a",
  "200": "#f5cdb5",
  "100": "#fbebe1",
  "50": "#fef9f6",
  colorway: [],
};
buildColorWay(Orange);

export const Teal: NamedColor = {
  "900": "#033f45",
  "800": "#03555d",
  "700": "#046a74",
  "600": "#057d89",
  "500": "#1299a7",
  "400": "#4eb3bd",
  "300": "#80c9d0",
  "200": "#afdde1",
  "100": "#dff1f3",
  "50": "#f5fbfb",
  colorway: [],
};
buildColorWay(Teal);

export const Purple: NamedColor = {
  "900": "#452085",
  "800": "#5d2bb2",
  "700": "#7335de",
  "600": "#8849f3",
  "500": "#a170f6",
  "400": "#b892f8",
  "300": "#cbb0fa",
  "200": "#decdfc",
  "100": "#f2ebfe",
  "50": "#fbf9ff",
  colorway: [],
};
buildColorWay(Purple);

export const Red: NamedColor = {
  "900": "#711212",
  "800": "#971818",
  "700": "#ba1e1e",
  "600": "#db2323",
  "500": "#e85d5d",
  "400": "#ee8888",
  "300": "#f3aaaa",
  "200": "#f7caca",
  "100": "#fce9e9",
  "50": "#fef9f9",
  colorway: [],
};
buildColorWay(Red);

export const Gray: NamedColor = {
  "900": "#303943",
  "800": "#424d5b",
  "700": "#526172",
  "600": "#617388",
  "500": "#7d8c9f",
  "400": "#9aa6b5",
  "300": "#b5bec8",
  "200": "#d0d5dc",
  "100": "#eceef1",
  "50": "#f9fafb",
  colorway: [],
};
buildColorWay(Gray);
// I'm British: https://www.youtube.com/watch?v=FkF_XpA5P48&pp=ygUfcHJvZmVzc29yIGVsZW1lbnRhbCBJJ20gYnJpdGlzaA%3D%3D
export const Grey = Gray;

// Named colors
export const ChartColors = {
  Blue,
  Gold,
  Green,
  Pink,
  Orange,
  Teal,
  Purple,
  Red,
  Gray,
  Grey,
};

export const DiscreteColorway: Colorway = buildDiscreteColorWay(
  Object.values(ChartColors)
);

export const Divergent1Colorway: Colorway = [
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

export const Divergent2Colorway: Colorway = [
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

function buildColorWay(namedColor: NamedColor) {
  namedColor.colorway = [
    namedColor["900"],
    namedColor["800"],
    namedColor["700"],
    namedColor["600"],
    namedColor["500"],
    namedColor["400"],
    namedColor["300"],
    namedColor["200"],
    namedColor["100"],
  ];
}

function buildDiscreteColorWay(namedColors: NamedColor[]) {
  const shades = ["900", "700", "500", "300"];
  return shades.reduce((colorway, shade) => {
    return namedColors.reduce((colorway, color) => {
      // @ts-expect-error
      colorway.push(color[shade]);
      return colorway;
    }, colorway);
  }, [] as Colorway);
}
