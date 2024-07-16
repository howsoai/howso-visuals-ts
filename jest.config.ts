import type { Config } from "jest";

const config: Config = {
  collectCoverage: false, // See package.json script
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,js,vue}",
    "!<rootDir>/src/**.stories.{ts.js}",
    "!<rootDir>/node_modules/",
  ],
  coverageReporters: ["text", "cobertura"],
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^d3$": "<rootDir>/node_modules/d3/dist/d3.min.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  testEnvironment: "jsdom",
};

export default config;
