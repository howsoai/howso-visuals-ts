import { mean } from "d3-array";

// Kernels for density estimator
// https://en.wikipedia.org/wiki/Kernel_(statistics)
export const KERNELS = {
  epanechnikov(k: number) {
    return (v: number) => {
      return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
  },
  gaussian() {
    const p = 1 / Math.sqrt(2 * Math.PI);
    return (v: number) => {
      return p * Math.exp(Math.pow(v, 2) / -2);
    };
  },
};

export function kernelDensityEstimator(
  kernel: (v: number) => number,
  X: number[]
): (V: number[]) => number[][] {
  return (V: number[]) => {
    return X.map((x) => {
      return [x, mean(V, (v: number) => kernel(x - v)) ?? 0];
    });
  };
}
