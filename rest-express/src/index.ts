import express from "express";
import { Tigris } from "@tigrisdata/core";
import middlewares from "./utils/middlewares";
import post from "./routes/post";
import search from "./routes/search";
import signup from "./routes/signup";
import user from "./routes/user";

async function startServer() {
  const port = process.env.PORT || 3000;

  // set up the database client
  const tigrisClient = new Tigris();
  const dbClient = tigrisClient.getDatabase();

  const app = express();

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  post(app, dbClient);
  search(app, dbClient);
  signup(app, dbClient);
  user(app, dbClient);

  // Setup error-handling middleware
  app.use(middlewares.handleErrors);

  app.listen(port, () =>
    console.log(`
🚀 Server ready at: http://localhost:${port} ⭐️`)
  );
}

startServer();
