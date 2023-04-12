import express from "express";
import { Tigris } from "@tigrisdata/core";
import middlewares from "./utils/middlewares";
import search from "./routes/search";
import { getOpenaiClient } from "../src/utils/openai";

async function startServer() {
  const port = process.env.PORT || 3000;

  // set up the search client
  const tigrisClient = new Tigris();
  const searchClient = tigrisClient.getSearch();

  // setup OpenAI client
  const openai = getOpenaiClient();

  const app = express();

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  search(app, searchClient, openai);

  // Setup error-handling middleware
  app.use(middlewares.handleErrors);

  app.listen(port, () =>
    console.log(`
🚀 Server ready at: http://localhost:${port} ⭐️`)
  );
}

startServer();
