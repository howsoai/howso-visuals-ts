import type { ComponentProps, FC, ReactNode } from "react";
import Styles from "./VisualWithLegend.module.css";
import classNames from "classnames";

export type VisualWithLegendProps = ComponentProps<"div"> & {
  legend: ReactNode;
};
export const VisualWithLegend: FC<VisualWithLegendProps> = ({
  children,
  className,
  legend,
  ...props
}) => {
  return (
    <div {...props} className={classNames(Styles.root, className)}>
      <div className={Styles.container}>
        <div className={Styles.visual}>{children}</div>
        <aside className={Styles.legend}>{legend}</aside>
      </div>
    </div>
  );
};
