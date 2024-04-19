import type { Meta, StoryObj } from "@storybook/react";
import { FC } from "react";
import {
  Blue,
  Gold,
  Gray,
  Green,
  Teal,
  Red,
  Orange,
  Pink,
  Purple,
  Colorway,
  DiscreteColorway,
  Divergent1Colorway,
  Divergent2Colorway,
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
      <section className={[Styles.namedSet].join(" ")}>
        <ColorwayWithLabel label="Blue" colorway={Blue.colorway} />
        <ColorwayWithLabel label="Gold" colorway={Gold.colorway} />
        <ColorwayWithLabel label="Green" colorway={Green.colorway} />
        <ColorwayWithLabel label="Pink" colorway={Pink.colorway} />
        <ColorwayWithLabel label="Teal" colorway={Teal.colorway} />
        <ColorwayWithLabel label="Orange" colorway={Orange.colorway} />
        <ColorwayWithLabel label="Purple" colorway={Purple.colorway} />
        <ColorwayWithLabel label="Red" colorway={Red.colorway} />
        <ColorwayWithLabel label="Gray" colorway={Gray.colorway} />
      </section>
    </div>
  ),
};

export const DiscreteStory: Story = {
  name: "Discrete",
  render: () => (
    <div style={{ maxWidth: "122ch" }}>
      <section className={[Styles.namedSet].join(" ")}>
        <ColorwayWithLabel label="Light" colorway={DiscreteColorway} />
      </section>
    </div>
  ),
};

export const DivergentStory: Story = {
  name: "Divergent",
  render: () => (
    <div>
      <section className={[Styles.namedSet].join(" ")}>
        <ColorwayWithLabel label="Divergent1" colorway={Divergent1Colorway} />
        <ColorwayWithLabel label="Divergent2" colorway={Divergent2Colorway} />
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
          style={{
            backgroundColor: color,
            color: "#fff",
          }}
        >
          {color}
        </div>
      ))}
    </div>
  </div>
);
