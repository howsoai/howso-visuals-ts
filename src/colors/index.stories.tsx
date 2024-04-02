import type { Meta, StoryObj } from "@storybook/react";
import { FC } from "react";
import {
  Blue,
  Gold,
  Gray,
  Green,
  LightOrange,
  Magenta,
  Orange,
  Pink,
  Purple,
  getTextColor,
  Colorway,
  Discrete,
  Divergent1,
  Divergent2,
} from ".";
import Styles from "./index.stories.module.css";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta = {
  title: "Colors/Index",
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const Named: Story = {
  render: () => (
    <div className={Styles.namedSets}>
      <section className={[Styles.namedSet, Styles.setLight].join(" ")}>
        <ColorwayWithLabel label="Blue" colorway={Blue.light.colorway} />
        <ColorwayWithLabel label="Gold" colorway={Gold.light.colorway} />
        <ColorwayWithLabel label="Green" colorway={Green.light.colorway} />
        <ColorwayWithLabel label="Pink" colorway={Pink.light.colorway} />
        <ColorwayWithLabel label="Orange" colorway={Orange.light.colorway} />
        <ColorwayWithLabel label="Purple" colorway={Purple.light.colorway} />
        <ColorwayWithLabel
          label="LightOrange"
          colorway={LightOrange.light.colorway}
        />
        <ColorwayWithLabel label="Magenta" colorway={Magenta.light.colorway} />
        <ColorwayWithLabel label="Gray" colorway={Gray.light.colorway} />
      </section>
      <section className={[Styles.namedSet, Styles.setDark].join(" ")}>
        <ColorwayWithLabel label="Blue" colorway={Blue.dark.colorway} />
        <ColorwayWithLabel label="Gold" colorway={Gold.dark.colorway} />
        <ColorwayWithLabel label="Green" colorway={Green.dark.colorway} />
        <ColorwayWithLabel label="Pink" colorway={Pink.dark.colorway} />
        <ColorwayWithLabel label="Orange" colorway={Orange.dark.colorway} />
        <ColorwayWithLabel label="Purple" colorway={Purple.dark.colorway} />
        <ColorwayWithLabel
          label="LightOrange"
          colorway={LightOrange.dark.colorway}
        />
        <ColorwayWithLabel label="Magenta" colorway={Magenta.dark.colorway} />
        <ColorwayWithLabel label="Gray" colorway={Gray.dark.colorway} />
      </section>
    </div>
  ),
};

export const DiscreteStory: Story = {
  name: "Discrete",
  render: () => (
    <div style={{ maxWidth: "122ch" }}>
      <section className={[Styles.namedSet, Styles.setLight].join(" ")}>
        <ColorwayWithLabel label="Light" colorway={Discrete.light} />
      </section>
      <section className={[Styles.namedSet, Styles.setDark].join(" ")}>
        <ColorwayWithLabel label="Dark" colorway={Discrete.dark} />
      </section>
    </div>
  ),
};

export const DivergentStory: Story = {
  name: "Divergent",
  render: () => (
    <div>
      <section className={[Styles.namedSet, Styles.setLight].join(" ")}>
        <ColorwayWithLabel label="Divergent1" colorway={Divergent1} />
        <ColorwayWithLabel label="Divergent2" colorway={Divergent2} />
      </section>
      <section className={[Styles.namedSet, Styles.setDark].join(" ")}>
        <ColorwayWithLabel label="Divergent1" colorway={Divergent1} />
        <ColorwayWithLabel label="Divergent2" colorway={Divergent2} />
      </section>
    </div>
  ),
};

type ColorwayWithLabelProps = { label: string; colorway: Colorway };
const ColorwayWithLabel: FC<ColorwayWithLabelProps> = ({ label, colorway }) => (
  <div className={Styles.colorwayWithLabel}>
    <div className={Styles.colorwayLabel}>{label}</div>
    <div className={Styles.colorway}>
      {colorway.map((color) => (
        <div
          key={color}
          className={Styles.colorwayItem}
          style={{ backgroundColor: color, color: getTextColor(color) }}
        >
          {color}
        </div>
      ))}
    </div>
  </div>
);
