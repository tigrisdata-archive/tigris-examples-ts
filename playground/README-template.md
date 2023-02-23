# Tigris Playground

This example sets up a playground with [Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/)
to get familiar with Tigris and try out the api

## Getting started

### 1. Download the example

Download this example:

```
npx create-tigris-app@latest --example playground
```

The above command will also take care of installing the dependencies.

```shell
✔ What is your project named? … /Users/ovaistariq/projects/myapp
✔ What is the clientId? … my_id
✔ What is the clientSecret? … *********
Creating a new app in /Users/ovaistariq/projects/myapp.

Downloading files for example basic. This might take a moment.

Initializing project with template: playground

Using npm.

Installing dependencies:
- @tigrisdata/core: 1.0.0-beta.21


added 245 packages, and audited 246 packages in 5s

35 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.

Success! Created myapp at /Users/ovaistariq/projects/myapp

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd /Users/ovaistariq/projects/myapp
  npm run dev
```

### 2. Start development server

```
npm run dev
```

Will start `nodemon` to watch all files in the `src` repository and run `src/index.ts`.
You are now up and ready to start experimenting with Tigris.

### 1. Update the data model

The first step is to extend the `user` data model:

```diff
// ./src/models/user.ts

import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("user")
export class User {
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: bigint;

  @Field()
  email: string;

  @Field()
  name: string;
+
+  @Field()
+  bio: string;
}
```

Once you've updated your data model, the development server will restart and upload
the latest schema changes to the server.

## Next steps

- Check out the [Tigris docs](https://docs.tigrisdata.com/)
- Join our [Discord server](http://discord.tigrisdata.com/) and share your
  feedback
