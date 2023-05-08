import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { parse } from "csv-parse";
import { clearInterval } from "timers";
import { VectorDocumentStore, Document } from "@tigrisdata/vector";
import { createEmbeddings, getOpenaiClient } from "../src/utils/openai";
import { OpenAIApi } from "openai";

interface Review {
  Id: string;
  ProductId: string;
  UserId: string;
  ProfileName: string;
  HelpfulnessNumerator: number;
  HelpfulnessDenominator: number;
  Score: number;
  Time: number;
  Summary: string;
  Text: string;
}

const BATCH_SIZE = 100;

async function main() {
  // setup Tigris client
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

  // load seed data
  const dataFile = "./scripts/data/reviews.csv";
  console.log("Seeding data from file ", dataFile);

  const inputStream = fs.createReadStream(dataFile);
  await importJSON(inputStream, vectorDocStore);
}

async function importJSON(
  readStream: fs.ReadStream,
  store: VectorDocumentStore
) {
  const loader = loadingAnimation("Loading...");

  // setup OpenAI client
  const openai = getOpenaiClient();

  let numDocsLoaded = 0;

  const ids: string[] = [];
  const documents: Document[] = [];
  const contents: string[] = [];
  for await (let doc of readStream.pipe(parse({ columns: true, cast: true }))) {
    doc = doc as Review;

    ids.push(`${doc.Id}`);
    documents.push({
      content: doc.Text,
      metadata: {
        ProductId: doc.ProductId,
        UserId: doc.UserId,
        ProfileName: doc.ProfileName,
        HelpfulnessNumerator: doc.HelpfulnessNumerator,
        HelpfulnessDenominator: doc.HelpfulnessDenominator,
        Score: doc.Score,
        Time: doc.Time,
        Summary: doc.Summary,
      },
    });

    contents.push(`${doc.Summary} ${doc.Text}`);

    if (documents.length >= BATCH_SIZE) {
      await storeDocuments(ids, documents, contents, store, openai);

      numDocsLoaded += documents.length;
      ids.length = 0;
      documents.length = 0;
      contents.length = 0;
    }
  }

  if (documents.length >= BATCH_SIZE) {
    await storeDocuments(ids, documents, contents, store, openai);

    numDocsLoaded += documents.length;
    ids.length = 0;
    documents.length = 0;
    contents.length = 0;
  }

  clearInterval(loader);
  console.log(`Seeding successful with ${numDocsLoaded} docs ...`);
}

async function storeDocuments(
  ids: string[],
  documents: Document[],
  contents: string[],
  store: VectorDocumentStore,
  openai: OpenAIApi
) {
  const embeddingsResponse = await createEmbeddings(openai, contents);
  const embeddings = embeddingsResponse.data.map((e) => e.embedding);

  await store.addDocumentsWithVectors({
    ids,
    embeddings,
    documents,
  });
}

/**
 * Create and display a loader in the console.
 *
 * @example
 * let loader = loadingAnimation("Loading…");
 *
 * // Stop loader after 1 second
 * setTimeout(() => clearInterval(loader), 1000);
 */
function loadingAnimation(
  text = "",
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"],
  delay = 100
) {
  let x = 0;

  return setInterval(function () {
    process.stdout.write("\r" + chars[x++] + " " + text);
    x = x % chars.length;
  }, delay);
}

main()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
