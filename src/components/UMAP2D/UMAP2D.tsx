import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { type BaseVisualProps } from "../BaseVisual";
import { useScreenDimensions } from "@/hooks";
import { extent, scaleLinear } from "d3";
import { VisualWithLegend } from "../VisualWithLegend";

export type UMAP2DProps<T> = BaseVisualProps & {
  className?: string;
  data: T[] | undefined;
  /** Content to display in the loading state */
  loading?: ReactNode;
  /**
   * Content to display as a legend alongside the visualization.
   * @see Legend
   **/
  legend: ReactNode;
  /** Content to display when the data is not loading and has no data */
  noData?: ReactNode;
  positions: [number, number][] | undefined;
  render: UMAP2DCanvasRender<T>;
  style?: CSSProperties;
};
/**
 * Canvas dimensions are 100% the container div targeted by className and style parameters.
 *
 * Possible performance options:
 *   Pass the canvas control to an off screen web worker: https://macarthur.me/posts/animate-canvas-in-a-worker
 *   Packing method for workers: https://www.npmjs.com/package/rollup-plugin-web-worker-loader
 **/
export const UMAP2D = <T,>({
  className,
  data,
  isLoading,
  legend,
  loading: LoadingContent = <p>Loading</p>,
  noData: NoDataContent = <p>No data</p>,
  positions,
  style,
  render,
}: UMAP2DProps<T>) => {
  //   const colorScheme = getColorScheme({ isDark, isPrint });

  if (isLoading) {
    return (
      <VisualWithLegend className={className} style={style} legend={legend}>
        {LoadingContent}
      </VisualWithLegend>
    );
  }

  if (!data?.length || !positions?.length) {
    return (
      <VisualWithLegend className={className} style={style} legend={legend}>
        {NoDataContent}
      </VisualWithLegend>
    );
  }

  return (
    <VisualWithLegend className={className} style={style} legend={legend}>
      <UMAP2DCanvas<T> data={data} positions={positions} render={render} />
    </VisualWithLegend>
  );
};

export type UMAP2DCanvasRendererProps<T> = {
  context: CanvasRenderingContext2D;
  /** Canvas scaled position */
  coordinates: [number, number];
  datum: T;
  index: number;
  /** UMAP calculated position, not scaled to the rendering canvas */
  position: [number, number];
};
/**
 * A sample render method:
 * const renderer: UMAPVisualProps<Iris>["render"] = ({
 *   context,
 *   coordinates,
 *   datum,
 * }) => {
 *   const path = geoPath().context(context);
 *   context.beginPath();
 *   path({ type: "Point", coordinates });
 *   context.fillStyle = DiscreteColorway[datum.target]; // Assuming .target is an integer smaller than 8
 *   context.fill();
 * };
 */
export type UMAP2DCanvasRender<T> = (
  context: UMAP2DCanvasRendererProps<T>
) => void;

type UMAP2DCanvasProps<T> = {
  data: T[];
  positions: [number, number][];
  render: UMAP2DCanvasRender<T>;
};
const UMAP2DCanvas = <T,>({
  data,
  positions,
  render,
}: UMAP2DCanvasProps<T>): ReactNode => {
  const dimensions = useScreenDimensions();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvas || !dimensions.deferred.height || !dimensions.deferred.width) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("canvas 2d context unavailable");
    }
    canvas.height = 0;
    canvas.width = 0;
    context.reset();

    requestAnimationFrame(() => {
      const height = canvas!.parentElement!.clientHeight;
      const width = canvas!.parentElement!.clientWidth;

      canvas.height = height;
      canvas.width = width;
      const margin = 10;

      const domainX = extent(positions.map((d) => d[0])) as [number, number];
      const domainY = extent(positions.map((d) => d[1])) as [number, number];

      const scaleX = scaleLinear()
        .domain(domainX)
        .nice()
        .range([margin, canvas.width - margin]);
      const scaleY = scaleLinear()
        .domain(domainY)
        .nice()
        .range([margin, canvas.height - margin]);

      data.forEach((datum, index) => {
        const position = positions[index] as [number, number];
        const coordinates = [scaleX(position[0]), scaleY(position[1])] as [
          number,
          number
        ];
        render({
          context,
          coordinates,
          datum,
          index,
          position,
        });
      });
    });
  }, [canvas, dimensions.deferred, data, positions, render]);

  return <canvas ref={setCanvas} />;
};
