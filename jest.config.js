module.exports = {
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  collectCoverage: false, // See package.json script
  collectCoverageFrom: [
    "<rootDir>/src/**/*.{ts,js,vue}",
    "!<rootDir>/src/**.stories.{ts.js}",
    "!<rootDir>/node_modules/",
  ],
  coverageReporters: ["text", "cobertura"],
  testEnvironment: "jsdom",
};
