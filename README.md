# seventeen-track

[![Build status](https://github.com/mderazon/seventeen-track-js/actions/workflows/node.js.yml/badge.svg)](https://github.com/mderazon/seventeen-track-js/actions) [![npm version](https://badge.fury.io/js/seventeen-track.svg)](https://badge.fury.io/js/seventeen-track) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> track packages with 17track.net

This repository provides an **unofficial SDK** for interacting with 17track.net from Node.js or Google Apps Scripts. **This project is not affiliated with 17track** and may break in the future as the API evolves.

## Usage Example

Below is a basic usage example:

```ts
import { Client } from "seventeen-track";

const client = new Client();

// Log in with your credentials.
const loggedIn = await client.profile.login(
  "your-email@example.com",
  "your-password"
);
if (!loggedIn) {
  throw new Error("Login failed");
}
console.log(`Logged in as: ${client.profile.accountId}`);

// Fetch summary data.
const summary = await client.profile.summary();
console.log("Summary:", summary);

// Retrieve packages.
const packages = await client.profile.packages();
console.log("Packages:", packages);
```

### API

```ts
login(email: string, password: string): Promise<boolean>
```

Logs in a user with their credentials and stores the account ID if successful.

```ts
packages(packageState?: number | string, showArchived?: boolean, tz?: string): Promise<Package[]>
```

Retrieves a list of packages, allowing optional filtering by state and archived status.

```ts
summary(showArchived?: boolean): Promise<Record<string, number>>
```

Fetches aggregate summary information about packages, optionally including archived ones.

```ts
addPackage(trackingNumber: string, friendlyName?: string): Promise<void>
```

Adds a package by its tracking number and sets a friendly name if provided.

```ts
setFriendlyName(internalId: string, friendlyName: string): Promise<void>
```

Updates the friendly name for a package identified by its internal ID.

```ts
archivePackage(trackingNumber: string): Promise<void>
```

Archives a package based on its tracking number.

```ts
deletePackage(trackingNumber: string): Promise<void>
```

Deletes a package using its tracking number.

### Package

A package object contains the following properties:

| Field              | Type   | Description                                      |
| ------------------ | ------ | ------------------------------------------------ |
| id                 | string | Unique identifier for the package.               |
| destinationCountry | number | Code for the destination country.                |
| friendlyName       | string | User-friendly name for the package.              |
| infoText           | string | Additional information about the package status. |
| location           | string | Current location of the package.                 |
| timestamp          | string | Timestamp of the current status.                 |
| tz                 | string | Timezone of the timestamp.                       |
| originCountry      | number | Code for the origin country.                     |
| packageType        | number | Identifier for the type of package.              |
| status             | number | Numeric status code of the package.              |
| trackingNumber     | string | Tracking number for the package.                 |

## Supported Environments

This library is designed to work in both Node.js / other environments that support native `fetch` **and** in Google Apps Script (GAS), which uses `UrlFetchApp.fetch`.

In GAS, the library can be especially useful to fetch tracking numbers directly from Gmail emails and add them to 17track via the API.

When used in a web environment, the 17track server's strict CORS policies block requests from unauthorized domains.

### Building for Google Apps Script

To build for GAS, run:

```sh
npm run build-gas
```

This command uses Rollup (with ts2gas) to convert the TypeScript files to GAS-compatible JavaScript. The output file (`index.gs`) is placed in the `dist-gas` folder.

For more information about targeting GAS, see [here](https://github.com/google/clasp/blob/master/docs/typescript.md).

### Deploying to GAS

To use the library in your GAS project, simply copy the `index.gs` file from the `dist-gas` folder into your GAS project.

For more details on integrating libraries in GAS, refer to the [Google Apps Script Libraries documentation](https://developers.google.com/apps-script/guides/libraries).

## Development

### Running Tests

To run the test suite, execute the following command:

The tests use the tsx framework and will run any integration tests available in the test directory.

### Debug Logs

For verbose debug information during development, use the NODE_DEBUG environment variable:

```sh
NODE_DEBUG=seventeen-track npm test
```

This will enable logging for the `seventeen-track` debug namespace.

### Local Environment

For local development, create a `.env` file at the project root with your test credentials:

```sh
TEST_USER_EMAIL=your_email@example.com
TEST_USER_PASSWORD=your_password
```

## Acknowledgments

This project was inspired by [pyseventeentrack](https://github.com/shaiu/pyseventeentrack).

## License

This project is licensed under the [MIT License](./LICENSE).
