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
import { extent, scaleLinear } from "d3";
import Placeholder from "./assets/placeholder.png";
import Styles from "./UMAPVisual.module.css";

type UMAPVisualRenderProps<T> = {
  context: CanvasRenderingContext2D;
  /** Canvas scaled position */
  coordinates: [number, number];
  datum: T;
  index: number;
  /** UMAP calculated position, not scaled to the rendering canvas */
  position: [number, number];
};
/**
 * A sample function drawing rgba color data onto the canvas using positions:
 *    context.beginPath();
 *    const position = positions[i];
 *    const coordinates = [scaleX(position[0]), scaleY(position[1])];
 *    path({ type: "Point", coordinates });
 *    context.fillStyle = `rgba(${[
 *      datum[0] * 255,
 *      datum[1] * 255,
 *      datum[2] * 255,
 *      0.5 + 0.5 * datum[3],
 *    ]})`;
 *    context.fill();
 */
type UMAPVisualRender<T> = (context: UMAPVisualRenderProps<T>) => void;
type UMAPVisualBaseProps<T> = BaseVisualProps & {
  className?: string;
  loadingContent?: ReactNode;
  noDataContent?: ReactNode;
  params: UMAPParameters;
  renderingContent?: ReactNode;
  /** A function called for each data point to draw the element onto the canvas */
  render: UMAPVisualRender<T>;
  style?: CSSProperties;
};
export type UMAPVisualVectorsProps<T> = UMAPVisualBaseProps<T> & {
  /**
   * The actual data being displayed.
   * Vector values will be used to compute nearest neighbors.
   **/
  data: Vectors | undefined;
  /** If provided, each step in umap calculations will be compared, redrawing canvas when matching. Suggestion: 5 */
  stepModulus?: number;
};
/**
 * Typically used with systems specialized in nearest neighbor algorithms.
 * Howso Trainees may be used with this example Python code:
 *
 * distances = trainee.get_distances(features=context_features)["distances"]
 * hyperparameter_map = trainee.get_params(context_features=context_features)["hyperparameter_map"]
 * k = hyperparameter_map["k"]
 * min_dist = distances.min(axis=None) / 2
 */
export type UMAPVisualKNNProps<T> = UMAPVisualBaseProps<T> & {
  /** The actual data being displayed. **/
  data: T[] | undefined;
  knnIndices: Vectors | undefined;
  knnDistances: Vectors | undefined;
};

export type UMAPVisualProps<T> =
  | UMAPVisualVectorsProps<T>
  | UMAPVisualKNNProps<T>;
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
export const UMAPVisual = <T,>({
  className,
  data,
  isDark,
  isLoading,
  isPrint,
  loadingContent: LoadingContent = <Image />,
  noDataContent: NoDataContent = <p>No data</p>,
  params,
  renderingContent: RenderingContent = <Image />,
  style,
  render,
  ...props
}: UMAPVisualProps<T>) => {
  //   const colorScheme = getColorScheme({ isDark, isPrint });
  const instance = useMemo(() => new UMAP(params), [params]);
  const [positions, setPositions] = useState<PointCanvasProps["positions"]>([]);
  const knnIndices = "knnIndices" in props ? props.knnIndices : undefined;
  const knnDistances = "knnDistances" in props ? props.knnDistances : undefined;
  const stepModulus = "stepModulus" in props ? props.stepModulus : undefined;

  useEffect(() => {
    if (isLoading || !data?.length) {
      return;
    }

    if (knnIndices?.length && knnDistances?.length) {
      instance.setPrecomputedKNN(knnIndices, knnDistances);
    }

    // Single static display
    if (!stepModulus) {
      // @ts-expect-error
      setPositions(instance.fit(data));
    }

    // Animating display
    // TODO fitAsync()?
    // @ts-expect-error
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
        if (i % stepModulus! === 0 || i === nEpochs) {
          setPositions([...instance.getEmbedding()]);
        }
        draw();
      });
    draw();
  }, [
    setPositions,
    instance,
    stepModulus,
    isLoading,
    data,
    knnIndices,
    knnDistances,
  ]);

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
      <PointCanvas data={data} positions={positions} render={render} />
    </div>
  );
};

type LoadingProps = Pick<UMAPVisualProps<unknown>, "className" | "style"> & {
  children: ReactNode;
};
const Loading: FC<LoadingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type RenderingProps = Pick<UMAPVisualProps<unknown>, "className" | "style"> & {
  children: ReactNode;
};
const Rendering: FC<RenderingProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

type NoDataProps = Pick<UMAPVisualProps<unknown>, "className" | "style"> & {
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
  data: any[];
  positions: number[][];
  render: UMAPVisualRender<any>;
};
const PointCanvas: FC<PointCanvasProps> = ({ data, positions, render }) => {
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

const Image: FC = () => (
  <img className={Styles.placeholder} src={Placeholder} alt="" />
);
