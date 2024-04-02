# Howso Visuals

Provides display components for React Tailwind Flowbite applications

## Usage

To use this package in your application install it via npm.

### Prerequisites

Your home directory must contain a `.npmrc` file pointing to the Azure DevOps artifact feed:

```text
@howso:registry = https://dpbuild.jfrog.io/artifactory/api/npm/npm-virtual/
//dpbuild.jfrog.io/artifactory/api/npm/npm-virtual/:_auth=...
```

### Installation

Standard package installation makes imports available:

```bash
npm i @howso/howso-visuals
```

## Contributing

Development is done through [Storybook](https://storybook.js.org/).
You may start the UI for inspection with hot reloading using:

```bash
npm run storybook
```

## Publishing

This package is published into a private npm registery.

Documentation changes do not require a version publishing.
For functional changes, follow [SemVer](https://semver.org/)
standards updating the `package.json` and `package-lock.json`
files in your pull request.

When you are ready to publish a new verison, use the Github Release action.

### Chromatic

[Chromatic](https://www.chromatic.com/library?appId=660ae6abe1f3044afce54bba&branch=main) is used to review changes on this project.
You may [invite yourself](https://www.chromatic.com/start?inviteToken=chpi_4b32753dfe61496fab76da1667fc49f0&appId=660ae6abe1f3044afce54bba) to the project.
