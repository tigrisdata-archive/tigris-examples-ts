# REST API Example

This example shows how to implement a **Search API with TypeScript** using
[Express](https://expressjs.com/) and
[Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/).

## Getting started

### 1. Download the example

Download this example:

```
npx create-tigris-app@latest --example rest-search-express
```

The above command will also take care of installing the dependencies.

```shell
✔ What is your project named? … /Users/ovaistariq/projects/mysearchapp
✔ What is the clientId? … my_id
✔ What is the clientSecret? … *********
Creating a new app in /Users/ovaistariq/projects/mysearchapp.

Downloading files for example rest-search-express. This might take a moment.

Initializing project with template: rest-search-express

Using npm.

Installing dependencies:
- @tigrisdata/core: 1.0.0-beta.21
- express: 4.18.2


added 245 packages, and audited 246 packages in 5s

35 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
Initialized a git repository.

Success! Created mysearchapp at /Users/ovaistariq/projects/mysearchapp

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd /Users/ovaistariq/projects/mysearchapp
  npm run dev
```

### 2. Seed the search index

```shell
npm run seed
```

This will populate the search index using the data from
[scripts/data/movies.json.gz](scripts/data/movies.json.gz).

### 3. Start the REST Search API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API
requests, e.g.
[http://localhost:3000/api/users](http://localhost:3000/api/users).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/api/search?searchString={searchString}&page={page}&size={size}&orderBy={orderBy}`: Fetch all movies
  - Query Parameters
    - `searchString` (required): This searches moves by `title`, `cast` or
      `genre`
    - `size` (optional): This specifies how many movies should be returned in
      the result
    - `page` (optional): This specifies the page number to be returned when
      there are more than one page of search results
    - `orderBy` (optional): The sort order for results in either ascending or
      descending order. The value can either `asc` or `desc`

## Evolving the app

Evolving the application typically requires two steps:

1. Update the search model in the application
2. Update the business logic in the application

For the following example scenario, assume you want to add a new field to
the index `tags`.

### Update the search model

The first step is to extend the `movie` search model:

```diff
// ./src/search/models/movie.ts

import { IndexField, TigrisDataTypes, TigrisIndex } from "@tigrisdata/core";

export const MOVIE_INDEX_NAME = "movie";

@TigrisIndex(MOVIE_INDEX_NAME)
export class Movie {
  @IndexField({ sort: true })
  title: string;

  @IndexField({ sort: true, facet: true })
  year: number;

  @IndexField({ elements: TigrisDataTypes.STRING, facet: true })
  cast: string[];

  @IndexField({ elements: TigrisDataTypes.STRING, facet: true })
  genre: string[];
+
+  @IndexField({ elements: TigrisDataTypes.STRING, facet: true })
+  tags: string[];
}
```

Once you've updated your search model, restarting the REST API server will
apply the search model changes to the database.

## Next steps

- Check out the [Tigris docs](https://docs.tigrisdata.com/)
- Join our [Discord server](http://discord.tigrisdata.com/) and share your
  feedback
