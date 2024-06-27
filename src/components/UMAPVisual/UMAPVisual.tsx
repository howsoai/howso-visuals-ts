import {
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BaseVisualProps } from "../BaseVisual";
import { useScreenDimensions } from "@/hooks";
import { UMAP } from "umap-js";
import type { UMAPParameters, Vectors } from "umap-js/dist/umap";
import { extent, scaleLinear, geoPath } from "d3";
import Placeholder from "./assets/placeholder.png";
import Styles from "./UMAPVisual.module.css";

export type UMAPVisualProps = BaseVisualProps & {
  className?: string;
  data: Vectors | undefined;
  loadingContent?: ReactNode;
  noDataContent?: ReactNode;
  /** Any changes to this prop will cause a new instance. Be sure you memoize these. */
  params: UMAPParameters;
  renderingContent?: ReactNode;
  /** If provided, each step in umap calculations will be compared, redrawing canvas when matching. Suggestion: 5 */
  stepModulus?: number;
  style?: CSSProperties;
};
/**
 * Calculates the 2d positions of data using UMap and draws them to a 2D Canvas.
 * Canvas dimensions are 100% by the container div targeted by className and style parameters.
 *
 * Possible performance options:
 *   Compute the UMAP in a web worker.
 *   Pass the canvas control to an off screen web worker: https://macarthur.me/posts/animate-canvas-in-a-worker
 *   Packing method for workers: https://www.npmjs.com/package/rollup-plugin-web-worker-loader
 *
 * It might actually make sense to extract the UMAP and position functionality entirely into utilities.
 *
 * TODO animated using epochs?
 **/
export const UMAPVisual: FC<UMAPVisualProps> = ({
  className,
  data,
  isDark,
  isLoading,
  isPrint,
  loadingContent: LoadingContent = <Image />,
  noDataContent: NoDataContent = <p>No data</p>,
  params,
  renderingContent: RenderingContent = <Image />,
  stepModulus,
  style,
}) => {
  //   const colorScheme = getColorScheme({ isDark, isPrint });
  const instance = useMemo(() => new UMAP(params), [params]);
  const [positions, setPositions] = useState<PointCanvasProps["positions"]>([]);
  useEffect(() => {
    if (isLoading || !data) {
      return;
    }

    // Single static display
    if (!stepModulus) {
      setPositions(instance.fit(data));
      return;
    }

    // Animating display
    const nEpochs = instance.initializeFit(data!);
    let i = 0;
    const draw = () =>
      // TODO this is kind of a poor man's web worker solution. Would be better off passing canvas context offScreen to a worker.
      requestAnimationFrame(() => {
        if (i >= nEpochs) {
          return;
        }

        i++;
        instance.step();
        if (i % stepModulus === 0 || i === nEpochs) {
          setPositions([...instance.getEmbedding()]);
        }
        draw();
      });
    draw();
  }, [setPositions, instance, stepModulus, isLoading, data]);

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
      <PointCanvas data={data} positions={positions} />
    </div>
  );
};

type LoadingProps = Pick<UMAPVisualProps, "className" | "style"> & {
  children: ReactNode;
};
const Loading: FC<LoadingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type RenderingProps = Pick<UMAPVisualProps, "className" | "style"> & {
  children: ReactNode;
};
const Rendering: FC<RenderingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type NoDataProps = Pick<UMAPVisualProps, "className" | "style"> & {
  children: ReactNode;
};
const NoData: FC<NoDataProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type PointCanvasProps = {
  data: Vectors;
  positions: number[][];
};
const PointCanvas: FC<PointCanvasProps> = ({ data, positions }) => {
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

    const path = geoPath().context(context);

    data.forEach((datum, i) => {
      context.beginPath();
      const position = positions[i];
      const coordinates = [scaleX(position[0]), scaleY(position[1])];
      path({ type: "Point", coordinates });
      context.fillStyle = `rgba(${[
        datum[0] * 255,
        datum[1] * 255,
        datum[2] * 255,
        0.5 + 0.5 * datum[3],
      ]})`;
      context.fill();
    });
  }, [canvas, dimensions.deferred, data, positions]);

  return <canvas ref={setCanvas} />;
};

const Image: FC = () => (
  <img className={Styles.placeholder} src={Placeholder} />
);
