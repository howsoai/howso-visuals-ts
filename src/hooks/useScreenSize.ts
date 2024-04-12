import { useMediaQuery } from ".";

export const useScreenSize = (
  screenSizes: ScreenSizes = _screenSizes
): ScreenSize => {
  const isSmUp = useIsSmUp(screenSizes);
  const isMdUp = useIsMdUp(screenSizes);
  const isLgUp = useIsLgUp(screenSizes);
  const isXlUp = useIsXlUp(screenSizes);
  const is2XlUp = useIs2xlUp(screenSizes);

  switch (true) {
    case is2XlUp:
      return "2xl";
    case isXlUp:
      return "xl";
    case isLgUp:
      return "lg";
    case isMdUp:
      return "md";
    case isSmUp:
      return "sm";
    default:
      return "xs";
  }
};

export const useIsSmUp = (screenSizes: ScreenSizes = _screenSizes): boolean =>
  useMediaQuery(`'min-width: ${screenSizes.sm}'`);

export const useIsMdUp = (screenSizes: ScreenSizes = _screenSizes): boolean =>
  useMediaQuery(`'min-width: ${screenSizes.md}'`);

export const useIsLgUp = (screenSizes: ScreenSizes = _screenSizes): boolean =>
  useMediaQuery(`'min-width: ${screenSizes.lg}'`);

export const useIsXlUp = (screenSizes: ScreenSizes = _screenSizes): boolean =>
  useMediaQuery(`'min-width: ${screenSizes.xl}'`);

export const useIs2xlUp = (screenSizes: ScreenSizes = _screenSizes): boolean =>
  useMediaQuery(`'min-width: ${screenSizes["2xl"]}'`);

//  Based roughly on: https://tailwindcss.com/docs/screens
export type PixelSize = `${number}px`;
export const screenSizes = {
  xs: "0px" as PixelSize,
  sm: "640px" as PixelSize,
  md: "768px" as PixelSize,
  lg: "1024px" as PixelSize,
  xl: "1280px" as PixelSize,
  "2xl": "1536px" as PixelSize,
};
// Just an alias to allow defaults in functions
const _screenSizes = screenSizes;
export type ScreenSize = keyof typeof screenSizes;
export type ScreenSizes = Record<ScreenSize, PixelSize>;
