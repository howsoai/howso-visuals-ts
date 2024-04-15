type Range = { min: number; max: number };
export const scaleValue = (value: number, fromRange: Range, toRange: Range) => {
  const { min: fromMin, max: fromMax } = fromRange;
  const { min: toMin, max: toMax } = toRange;
  // Determine how wide the ranges are
  const fromSize = fromMax - fromMin;
  const toSize = toMax - toMin;
  // Get the percentage of the original range `value` represents, ignoring the minimum value
  const fromPercent = (value - fromMin) / fromSize;
  // Get the corresponding percentage of the new range, plus its minimum value
  const result = fromPercent * toSize + toMin;
  return result;
};
