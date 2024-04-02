/** Returns the contrasting text color for a given color. White or Black */
export const getTextColor = (hex: `#${string}`, factorAlpha = false) => {
  const [r, g, b, a] = hex
    .replace(
      /^#?(?:(?:(..)(..)(..)(..)?)|(?:(.)(.)(.)(.)?))$/,
      "$1$5$5$2$6$6$3$7$7$4$8$8"
    )
    .match(/(..)/g)!
    .map((rgb) => parseInt("0x" + rgb));
  return (~~(r * 299) + ~~(g * 587) + ~~(b * 114)) / 1000 >= 128 ||
    (!!(~(128 / a) + 1) && factorAlpha)
    ? "#000"
    : "#FFF";
};
