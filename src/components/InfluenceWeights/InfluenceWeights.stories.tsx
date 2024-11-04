import type { Meta, StoryObj } from "@storybook/react";
import type { ScatterData } from "plotly.js";
import { isDarkBackground } from "../../../.storybook/utils";
import { ChartColors, DiscreteColorway } from "../../colors";
import { InfluenceWeights } from "./InfluenceWeights";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof InfluenceWeights> = {
  component: InfluenceWeights,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {
    style: {
      height: "90vh",
      width: "90vw",
      // overflow: "hidden",
    },
  },
  render: (args, context) => {
    return <InfluenceWeights {...args} isDark={isDarkBackground(context)} />;
  },
};

export default meta;
type Story = StoryObj<typeof InfluenceWeights>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const AgeAndCholesterol: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    featureX: "age",
    featureY: "chol",
    idFeatures: ["age", "chol", "class"],
    influenceCases: [
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 264,
        ".session_training_index": 298,
        age: 45,
        ".influence_weight": 0.5645133348066479,
        class: 1,
      },
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        chol: 219,
        ".session_training_index": 109,
        age: 39,
        ".influence_weight": 0.26548661040784065,
        class: 0,
      },
      {
        ".session": "b83205cf-bc84-453e-bb6e-472c151c6a62",
        chol: 239,
        ".session_training_index": 152,
        age: 47,
        ".influence_weight": 0.9548661040784065,
        class: 1,
      },
    ],
    predictionCase: {
      age: 50,
      chol: 262,
      class: 1,
    },
  },
};

export const AgeAndCholesterolGroupedByClassification: Story = {
  args: {
    ...AgeAndCholesterol.args,
    getInfluenceDataGroups: (data) => {
      if (!AgeAndCholesterol.args?.influenceCases) {
        throw new Error("AgeAndCholesterol.args?.influenceCases is undefined");
      }
      // We'd like to separate the data into two groups, based on the classification
      const classesIndexes = AgeAndCholesterol.args.influenceCases.reduce(
        (classes, ic, index) => {
          classes[ic.class] ||= [];
          classes[ic.class].push(index);
          return classes;
        },
        {} as Record<number, number[]>
      );

      return Object.entries(classesIndexes).map(([classification, indexes]) => {
        const isIndexInIndex = (_: unknown, index: number) =>
          indexes.includes(index);

        const isPositiveClassification = classification === "1";
        const groupData: Partial<ScatterData> = {
          ...data,
          // @ts-expect-error It works
          x: data.x!.filter(isIndexInIndex),
          // @ts-expect-error It works
          y: data.y!.filter(isIndexInIndex),
          // @ts-expect-error It works
          text: data.text!.filter(isIndexInIndex),
          marker: {
            ...data.marker,
            // @ts-expect-error It works
            size: data.marker!.size!.filter(isIndexInIndex),
            color: isPositiveClassification
              ? ChartColors["Green"]["500"]
              : ChartColors["Red"]["500"],
          },
          name: isPositiveClassification ? "Positive" : "Negative",
        };

        return groupData;
      });
    },
  },
};

export const MealAndBloodSugar: Story = {
  args: {
    featureX: "meal",
    featureY: "blood_sugar",
    idFeatures: ["meal", "blood_sugar", "class"],
    influenceCases: [
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        meal: "Steak and potatoes",
        ".session_training_index": 298,
        blood_sugar: 45,
        ".influence_weight": 0.5645133348066479,
        class: 1,
      },
      {
        ".session": "3028ea6e-de18-41cf-8579-07eb0304059d",
        meal: "Sushi",
        ".session_training_index": 109,
        blood_sugar: 39,
        ".influence_weight": 0.26548661040784065,
        class: 0,
      },
      {
        ".session": "b83205cf-bc84-453e-bb6e-472c151c6a62",
        meal: "Omelette du Fromage", // https://www.youtube.com/watch?v=2kArCRjT29w
        ".session_training_index": 152,
        blood_sugar: 47,
        ".influence_weight": 0.9548661040784065,
        class: 1,
      },
    ],
    predictionCase: {
      meal: "Grilled cheese",
      blood_sugar: 32,
      class: 1,
    },
  },
};

export const VehicleClassification: Story = {
  args: {
    featureX: "Year",
    featureY: "PassengerVolume",
    idFeatures: ["VehicleClass", "Make", "Model", "Year"],
    getInfluenceDataGroups: (data) => {
      if (!VehicleClassification.args?.influenceCases) {
        throw new Error(
          "VehicleClassification.args?.influenceCases is undefined"
        );
      }
      // We'd like to separate the data into many groups, based on the classification
      const classesIndexes = VehicleClassification.args.influenceCases.reduce(
        (classes, ic, index) => {
          classes[ic.VehicleClass] ||= [];
          classes[ic.VehicleClass].push(index);
          return classes;
        },
        {} as Record<number, number[]>
      );

      return Object.entries(classesIndexes).map(
        ([classification, indexes], index) => {
          const isIndexInIndex = (_: unknown, index: number) =>
            indexes.includes(index);

          const groupData: Partial<ScatterData> = {
            ...data,
            // @ts-expect-error It works
            x: data.x!.filter(isIndexInIndex),
            // @ts-expect-error It works
            y: data.y!.filter(isIndexInIndex),
            // @ts-expect-error It works
            text: data.text!.filter(isIndexInIndex),
            marker: {
              ...data.marker,
              // @ts-expect-error It works
              size: data.marker!.size!.filter(isIndexInIndex),
              // Offset by one to avoid the semantic primary color at lead
              color: DiscreteColorway[index + 1],
            },
            name: classification,
          };

          return groupData;
        }
      );
    },
    influenceCases: [
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 110,
        VehicleClass: "Compact Cars",
        HighwayMPG: 99,
        Model: "Focus Electric",
        ".session_training_index": 15509,
        DriveType: "Front-Wheel Drive",
        Year: 2015,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.1396171347886864,
        PassengerVolume: 90,
      },
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 110,
        VehicleClass: "Compact Cars",
        HighwayMPG: 99,
        Model: "Focus Electric",
        ".session_training_index": 16121,
        DriveType: "Front-Wheel Drive",
        Year: 2016,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.1396171347886864,
        PassengerVolume: 91,
      },
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 110,
        VehicleClass: "Compact Cars",
        HighwayMPG: 99,
        Model: "Focus Electric",
        ".session_training_index": 14242,
        DriveType: "Front-Wheel Drive",
        Year: 2014,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.1322688645366503,
        PassengerVolume: 90,
      },
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 110,
        VehicleClass: "Compact Cars",
        HighwayMPG: 99,
        Model: "Focus Electric",
        ".session_training_index": 13459,
        DriveType: "Front-Wheel Drive",
        Year: 2013,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.12565542130981777,
        PassengerVolume: 90,
      },
      {
        FuelType: "Electricity",
        Make: "Tesla",
        CityMPG: 118,
        VehicleClass: "Midsize Cars",
        HighwayMPG: 107,
        Model: "Model 3 Performance AWD",
        ".session_training_index": 19860,
        DriveType: "All-Wheel Drive",
        Year: 2021,
        LuggageVolume: 15,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.11967182981887406,
        PassengerVolume: 97,
      },
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 110,
        VehicleClass: "Compact Cars",
        HighwayMPG: 99,
        Model: "Focus Electric",
        ".session_training_index": 12906,
        DriveType: "Front-Wheel Drive",
        Year: 2012,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.11967182981887406,
        PassengerVolume: 90,
      },
      {
        FuelType: "Electricity",
        Make: "Tesla",
        CityMPG: 118,
        VehicleClass: "Midsize Cars",
        HighwayMPG: 107,
        Model: "Model 3 Long Range Performance AWD (20in)",
        ".session_training_index": 19205,
        DriveType: "All-Wheel Drive",
        Year: 2020,
        LuggageVolume: 15,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.11423220119074344,
        PassengerVolume: 97,
      },
      {
        FuelType: "Electricity",
        Make: "Ford",
        CityMPG: 118,
        VehicleClass: "Compact Cars",
        HighwayMPG: 96,
        Model: "Focus Electric",
        ".session_training_index": 17688,
        DriveType: "Front-Wheel Drive",
        Year: 2018,
        LuggageVolume: 14,
        ".session": "68d7b7d4-9e41-4a74-b873-66ee73d3ecdd",
        ".influence_weight": 0.10926558374766762,
        PassengerVolume: 91,
      },
    ],
    predictionCase: {
      Year: 2023,
      Make: "Howso",
      Model: "AI Coupe",
      DriveType: "Front-Wheel Drive",
      FuelType: "Electricity",
      HighwayMPG: 105,
      CityMPG: 112,
      PassengerVolume: 90,
      LuggageVolume: 14,
    },
  },
};
