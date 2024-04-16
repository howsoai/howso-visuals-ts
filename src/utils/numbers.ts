/**
 * Round to specified number of digits.
 * @param x The number to round.
 * @param digits The number of decimal places.
 * @returns The rounded number.
 */
export function roundTo(x: number, digits = 0): number {
  const p = Math.pow(10, digits);
  const n = x * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}

/**
 * Safely calculate the min/max of values (ignores NaN).
 */
function _safeMinMax(
  fn: typeof Math.min | typeof Math.max,
  values: number[]
): number {
  const targets: number[] = [];
  for (const x of values) {
    if (isNA(x)) continue;
    targets.push(x);
  }
  if (targets.length == 0 && values.length > 0) return NaN;
  return fn(...targets);
}

/**
 * Calculate maximum of values ignoring NaN.
 * @param values The values to get maximum of.
 * @returns The maximum value. Or NaN if all values were NaN.
 */
export const safeMax = (...values: number[]) => _safeMinMax(Math.max, values);

/**
 * Calculate minimum of values ignoring NaN.
 * @param values The values to get minimum of.
 * @returns The minimum value. Or NaN if all values were NaN.
 */
export const safeMin = (...values: number[]) => _safeMinMax(Math.min, values);

/**
 * Check if value is NaN, undefined or null.
 * @param x The value to check.
 * @returns If value is NA.
 */
export function isNA(x: unknown): x is null | undefined {
  if (x == null || Number.isNaN(x)) return true;
  return false;
}

/**
 * Return a default value when a value is NA.
 * Otherwise, returns same value.
 * @param x The value to check.
 * @param defaultValue The value return when NA.
 * @returns The value, or defaultValue when NA.
 */
export function parseNA(
  x: number | null | undefined,
  defaultValue = 0
): number {
  if (isNA(x)) return defaultValue;
  return x;
}

/**
 * Sort array such that the largest value is in the middle and other values are
 * in descending order as you go away from the middle.
 * @param arr Array to sort.
 * @param accessor A function to choose the value to sort by for each element.
 * @returns A new sorted array.
 */
export function sortPyramid<T, U extends number>(
  arr: T[],
  accessor: (datum: T) => U | undefined | null
): T[] {
  const newArr: T[] = [];
  const valueOf = accessor ?? ((datum: U | undefined | null) => datum);

  if (Array.isArray(arr) && arr.length) {
    const copy = [...arr]; // Don't mutate original
    // Sort assenting
    copy.sort((a, b) => {
      const x = valueOf(a);
      const y = valueOf(b);
      if (x == null) return -1;
      if (y == null) return 1;
      return x - y;
    });

    // Keep popping largest item and alternate inserting before/after
    while (copy.length) {
      if (copy.length % 2 == 0) {
        newArr.push(copy.pop() as T);
      } else {
        newArr.unshift(copy.pop() as T);
      }
    }
  }

  return newArr;
}
