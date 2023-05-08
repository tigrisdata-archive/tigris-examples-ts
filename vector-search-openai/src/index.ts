import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import { VectorDocumentStore } from "@tigrisdata/vector";
import middlewares from "./utils/middlewares";
import search from "./routes/search";
import { getOpenaiClient } from "../src/utils/openai";

async function startServer() {
  const port = process.env.PORT || 3000;

  // set up the Tigris client
  const vectorDocStore = new VectorDocumentStore({
    connection: {
      serverUrl: process.env.TIGRIS_URI,
      projectName: process.env.TIGRIS_PROJECT,
      clientId: process.env.TIGRIS_CLIENT_ID,
      clientSecret: process.env.TIGRIS_CLIENT_SECRET,
    },
    indexName: "reviews",
    numDimensions: 1536, // 1536 floats total for ada-002
  });

  // setup OpenAI client
  const openai = getOpenaiClient();

  const app = express();

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  search(app, vectorDocStore, openai);

  // Setup error-handling middleware
  app.use(middlewares.handleErrors);

  app.listen(port, () =>
    console.log(`
🚀 Server ready at: http://localhost:${port} ⭐️`)
  );
}

startServer();
