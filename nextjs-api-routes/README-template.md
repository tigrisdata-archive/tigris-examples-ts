# Fullstack example with Next.js (REST API)

This example shows how to implement a fullstack app in TypeScript with
[Next.js](https://nextjs.org/) using [React](https://reactjs.org/) and
[Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/).

## Getting started

### 1. Download the example

Download this example:

```
npx create-tigris-app@latest --example nextjs-api-routes
```

The above command will also take care of installing the dependencies.

```shell
✔ What is your project named? … mytodo
✔ What is the clientId? … my_client_id
✔ What is the clientSecret? … ****************
Creating a new app in /Users/ovaistariq/projects/mytodo.

Downloading files for example nextjs-api-routes. This might take a moment.


Initializing project with template: nextjs-api-routes

Using npm.

Installing dependencies:
- @next/font: ^13.0.6
- @tigrisdata/core: 1.0.0-dev.1
- next: ^13.0.6
- react: ^18.2.0
- react-dom: ^18.2.0


added 302 packages, and audited 303 packages in 10s

88 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.


Success! Created mytodo at /Users/ovaistariq/projects/mytodo

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd /Users/ovaistariq/projects/mytodo
  npm run dev
```

### 2. Start the app

```
npm run dev
```

The app is now running, navigate to http://localhost:3000/ in your browser to explore its UI.

## Next.js API routes

All the Next.js API routes are defined under `pages/api/`. We have three
files exposing endpoints:

#### [`pages/api/items/index.ts`](pages/api/items/index.ts)

- `GET /api/items` to get an array of to-do items as Array<TodoItem>
- `POST /api/items` to add an item to the list

#### [`/pages/api/items/search.ts`](/pages/api/items/search.ts)

- `GET /api/items/search?q=query` to find and return items matching the given query

#### [`pages/api/item/[id].ts`](pages/api/item/[id].ts)

- `GET /api/item/{id}` to fetch an item
- `PUT /api/item/{id}` to update the given item
- `DELETE /api/item/[id]` to delete an item

<details>
<summary>Expand for a code walkthrough</summary>

## 👀 Code walkthrough

### 📂 File structure

```text
├── package.json
├── lib
│   ├── tigris.ts
├── models
│   └── todoItems.ts
└── pages
    ├── index.tsx
    └── api
        ├── item
        │   ├── [id].ts
        └── items
            ├── index.ts
            └── search.ts
```

### 🪢 Data model definition

[models/todoItems.ts](db/models/todoItems.ts) - The to-do list app
has a single collection `todoItems` that stores the to-do items in the
database. The collection gets automatically created by the
[setup script](setup.ts).

### 🌐 Connecting to Tigris

[lib/tigris.ts](lib/tigris.ts) - Centralizes the Tigris client creation.
This is beneficial for serverless environments like Vercel Serverless
Functions, Netlify Functions, and AWS Lambda. It allows reusing the client
across requests.

</details>

## Evolving the app

Evolving the application typically requires three steps:

1. Update the data model in the application
2. Update your server-side application code
3. Build new UI features in React

For the following example scenario, assume you want to add a "category"
feature to the app where users can add a category when adding a todo item.

### 1. Update the data model

The first step is to extend the `todoItems` data model:

```diff
// ./models/todoItems.ts

import {
  Field,
  PrimaryKey,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("todoItems")
export class TodoItem {
  @PrimaryKey(TigrisDataTypes.INT32, { order: 1, autoGenerate: true })
  id!: number;

  @Field()
  text!: string;

  @Field({ default: false })
  completed!: boolean;
+
+  @Field()
+  category!: string;
}
```

Once you've updated your data model, restarting the App will
apply the data model changes to the database.

### 2. Update your server-side application code

Next update the Next.js API routes to use the new `category` field in the
data model.

### 3. Build new UI features in React

Once you have updated the API routes, you can start updating the UI
component in React.

## Next steps

- Check out the [Tigris docs](https://docs.tigrisdata.com/)
- Join our [Discord server](http://discord.tigrisdata.com/) and share your
  feedback
