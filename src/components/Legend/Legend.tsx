import type { ComponentProps, FC, ReactNode } from "react";
import Styles from "./Legend.module.css";
import classNames from "classnames";

type LegendItem = {
  label: ReactNode;
  visual: ReactNode;
};
export type LegendProps = {
  items: LegendItem[];
};
/** An HTML based legend for use in visualizations that are not handled by Plotly */
export const LegendComponent: FC<LegendProps> = ({ items }) => {
  return (
    <div className={Styles.container}>
      {items.map(({ label, visual }, index) => (
        <div key={index} className={Styles.item}>
          <div className={Styles.visual}>{visual}</div>
          <div className={Styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
};

const Circle: FC<ComponentProps<"div">> = (props) => (
  <div {...props} className={classNames(Styles.circle, props.className)} />
);

const Line: FC<ComponentProps<"div">> = (props) => (
  <div {...props} className={classNames(Styles.line, props.className)} />
);

export const Legend = Object.assign(LegendComponent, {
  Circle,
  Line,
});
