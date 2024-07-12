import { CSSProperties, FC, ReactNode, useEffect, useState } from "react";
import { BaseVisualProps } from "../BaseVisual";
import { useScreenDimensions } from "@/hooks";
import { extent, scaleLinear } from "d3";
import Placeholder from "./assets/placeholder.png";
import Styles from "./UMAP2D.module.css";

export type UMAP2DProps<T> = BaseVisualProps &
  UMAP2DCanvasProps<T> & {
    className?: string;
    loadingContent?: ReactNode;
    noDataContent?: ReactNode;
    renderingContent?: ReactNode;
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
  isDark,
  isLoading,
  isPrint,
  loadingContent: LoadingContent = <Image />,
  noDataContent: NoDataContent = <p>No data</p>,
  positions,
  renderingContent: RenderingContent = <Image />,
  style,
  render,
}: UMAP2DProps<T>) => {
  //   const colorScheme = getColorScheme({ isDark, isPrint });

  if (isLoading) {
    return <Loading>{LoadingContent}</Loading>;
  }

  if ((data?.length || 0) && !positions.length) {
    return <Rendering>{RenderingContent}</Rendering>;
  }

  if (!data?.length) {
    return <NoData>{NoDataContent}</NoData>;
  }

  return (
    <div className={className} style={style}>
      <UMAP2DCanvas<T> data={data} positions={positions} render={render} />
    </div>
  );
};

type LoadingProps = Pick<UMAP2DProps<unknown>, "className" | "style"> & {
  children: ReactNode;
};
const Loading: FC<LoadingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type RenderingProps = Pick<UMAP2DProps<unknown>, "className" | "style"> & {
  children: ReactNode;
};
const Rendering: FC<RenderingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type NoDataProps = Pick<UMAP2DProps<unknown>, "className" | "style"> & {
  children: ReactNode;
};
const NoData: FC<NoDataProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const Image: FC = () => (
  <img className={Styles.placeholder} src={Placeholder} alt="" />
);

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

export type UMAP2DCanvasProps<T> = {
  data: T[];
  positions: [number, number][];
  render: UMAP2DCanvasRender<T>;
};
export const UMAP2DCanvas = <T,>({
  data,
  positions,
  render,
}: UMAP2DCanvasProps<T>): ReactNode => {
  const dimensions = useScreenDimensions();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const height = canvas?.parentElement?.clientHeight;
    const width = canvas?.parentElement?.clientWidth;
    if (
      !canvas ||
      !dimensions.deferred.height ||
      !dimensions.deferred.width ||
      !height ||
      !width
    ) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("canvas 2d context unavailable");
    }
    context.reset();
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
  }, [canvas, dimensions.deferred, data, positions, render]);

  return <canvas ref={setCanvas} />;
};
