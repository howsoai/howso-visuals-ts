import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import { BaseVisualProps } from "../BaseVisual";
import { useScreenDimensions } from "@/hooks";
import { UMAP as UMAPVisual } from "umap-js";
import type { UMAPParameters, Vectors } from "umap-js/dist/umap";
import { extent, scaleLinear, geoPath } from "d3";

export type UMAPProps = BaseVisualProps & {
  className?: string;
  data: Vectors;
  /** Any changes to this prop will cause a new instance. Be sure you memoize these. */
  params: UMAPParameters;
  style?: CSSProperties;
  seed?: number;
};
/**
 * Calculates the 2d positions of data using UMap and draws them to a 2D Canvas.
 * Canvas dimensions are 100% by the container div targeted by className and style parameters.
 **/
export const UMAP: FC<UMAPProps> = ({
  className,
  data,
  isDark,
  isPrint,
  params,
  seed = Math.round(Math.random() * 100),
  style,
}) => {
  //   const colorScheme = getColorScheme({ isDark, isPrint });

  const instance = useMemo(() => new UMAPVisual(params), [params]);
  const positions = instance.fit(data);

  return (
    <div className={className} style={style}>
      <PointCanvas data={data} positions={positions} />
    </div>
  );
};

type PointCanvasProps = Pick<UMAPProps, "data"> & {
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

    // Generators.observe part of obserable framework... probably need to write my own worker here instead.
    //   const positions = Generators.observe(
    //     worker(
    //       fit,
    //       { data, show_dynamic, config },
    //       `
    //   const window = {};
    //   importScripts("https://unpkg.com/umap-js@1.3.3/lib/umap-js.js");
    //   importScripts("https://unpkg.com/d3-random@2");
    //   const UMAP = window.UMAP;
    //   Math.random = d3.randomLcg(${seed});
    //       `
    //     )
    //   );

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

    console.info(
      "domainX",
      domainX,
      "domainY",
      domainY,
      //   "scaleX",
      //   scaleX,
      //   "scaleY",
      //   scaleY,
      "height",
      canvas.height,
      "width",
      canvas.width
    );

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
