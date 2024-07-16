import { FC, ReactNode } from "react";
import { BaseVisualProps } from "../BaseVisual";
import { getColorScheme } from "@/colors";
import Styles from "./Legend.module.css";

type LegendItem = {
  label: ReactNode;
  visual: ReactNode;
};
export type LegendProps = Pick<BaseVisualProps, "isDark" | "isPrint"> & {
  items: LegendItem[];
};
/** An HTML based legend for use in visualizations that are not handled by Plotly */
export const Legend: FC<LegendProps> = ({ items, isDark, isPrint }) => {
  const colorScheme = getColorScheme({ isDark, isPrint });

  return (
    <div className={Styles.container}>
      {items.map(({ label, visual }) => (
        <div className={Styles.item}>
          <div className={Styles.visual}>{visual}</div>
          <div className={Styles.label}>{label}</div>
        </div>
      ))}
    </div>
  );
};
