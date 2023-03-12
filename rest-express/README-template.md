# REST API Example

This example shows how to implement a **REST API with TypeScript** using
[Express](https://expressjs.com/) and
[Tigris TypeScript SDK](https://docs.tigrisdata.com/typescript/).

## Getting started

### 1. Download the example

Download this example:

```
npx create-tigris-app@latest --example rest-express
```

The above command will also take care of installing the dependencies.

```shell
✔ What is your project named? … /Users/ovaistariq/projects/myapp
✔ What is the clientId? … my_id
✔ What is the clientSecret? … *********
Creating a new app in /Users/ovaistariq/projects/myapp.

Downloading files for example rest-express. This might take a moment.

Initializing project with template: rest-express

Using npm.

Installing dependencies:
- @tigrisdata/core: 1.0.0-beta.21
- express: 4.18.2


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

### 2. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:3000`. You can now run the API requests, e.g. [`http://localhost:3000/users`](http://localhost:3000/users).

## Using the REST API

You can access the REST API of the server using the following endpoints:

### `GET`

- `/users`: Fetch all users
- `/post/:id`: Fetch a single post by its `id`
- `/search?searchString={searchString}&page={page}&size={size}&orderBy={orderBy}`: Fetch all _published_ posts
  - Query Parameters
    - `searchString` (required): This filters posts by `title` or `content`
    - `size` (optional): This specifies how many posts should be returned in the result
    - `page` (optional): This specifies the page number to be returned when there are more than one page of search results
    - `orderBy` (optional): The sort order for posts in either ascending or descending order. The value can either `asc` or `desc`
- `/user/:id/drafts`: Fetch user's drafts by their `id`

### `POST`

- `/signup`: Create a new user
  - Body:
    - `email: String` (required): The email address of the user
    - `name: String` (required): The name of the user
    - `postData: Post[]` (optional): The posts of the user
- `/post`: Create a new post
  - Body:
    - `title: String` (required): The title of the post
    - `content: String` (required): The content of the post
    - `authorEmail: String` (required): The email of the user that creates the post

### `PUT`

- `/post/:id/publish`: Toggle the publish value of a post by its `id`
- `/post/:id/views`: Increases the `viewCount` of a `Post` by one `id`

### `DELETE`

- `/post/:id`: Delete a post by its `id`

## Evolving the app

Evolving the application typically requires two steps:

1. Update the data model in the application
2. Update the business logic in the application

For the following example scenario, assume you want to add a "profile" feature to the app where users can create a profile and write a short bio about themselves.

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

Once you've updated your data model, restarting the REST API server will
apply the data model changes to the database.

### 2. Update your application code

You can now update the API endpoints to use the new `bio` field in the
`user` collection.

#### 2.1 Add the API endpoint to your app

Update your `./src/routes/user.ts` file by adding a new endpoint to your
API:

```ts
// Update the profile of an existing user
app.post("/user/:id/profile", async (req, res, next) => {
  const { id } = req.params;
  const { bio } = req.body;

  let user: User;
  db.transact(async (tx) => {
    const query = { id: id };
    user = await userCollection.findOne(query, undefined, tx);

    if (user === undefined) {
      throw new APIError(
        HttpStatusCode.NOT_FOUND,
        `User with ID ${id} does not exist in the database`
      );
    }

    user.bio = bio;
    const result = await userCollection.updateOne(
      { id: user.id },
      { bio: user.bio },
      tx
    );

    if (!result?.modifiedCount) {
      throw new APIError(
        HttpStatusCode.INTERNAL_SERVER,
        `Failed to add user profile: ${result}`
      );
    }
  })
    .then(() => res.json({ user: user }))
    .catch((error) => next(error));
});
```

#### 2.2 Testing out your new endpoint

Restart your application server and test out your new endpoint.

##### `POST`

- `/user/:id/profile`: Create a new profile based on the user id
  - Body:
    - `bio: String` : The bio of the user

## Next steps

- Check out the [Tigris docs](https://docs.tigrisdata.com/)
- Join our [Discord server](http://discord.tigrisdata.com/) and share your
  feedback
