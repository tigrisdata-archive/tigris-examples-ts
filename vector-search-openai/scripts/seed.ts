import * as dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { parse } from "csv-parse";
import { clearInterval } from "timers";
import { Review, REVIEW_INDEX_NAME } from "../src/search/models/review";
import { Tigris } from "@tigrisdata/core";
import { SearchIndex } from "@tigrisdata/core";
import { createEmbedding, getOpenaiClient } from "../src/utils/openai";

async function main() {
  // setup Tigris client
  const tigrisClient = new Tigris();
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndex(Review);

  // load seed data
  const index = await search.getIndex<Review>(REVIEW_INDEX_NAME);

  const dataFile = "./scripts/data/reviews.csv";
  console.log("Seeding data from file ", dataFile);

  const inputStream = fs.createReadStream(dataFile);

  await importJSON(inputStream, index);
}

async function importJSON(
  readStream: fs.ReadStream,
  index: SearchIndex<Review>
) {
  const loader = loadingAnimation("Loading...");

  // setup OpenAI client
  const openai = getOpenaiClient();

  let numDocsLoaded = 0;
  const batchSize = 100;
  const batch: Review[] = [];

  for await (const doc of readStream.pipe(
    parse({ columns: true, cast: true })
  )) {
    if (batch.length >= batchSize) {
      await insertBatch(batch, index);

      numDocsLoaded += batch.length;
      batch.length = 0;
    } else {
      const embeddings = await createEmbedding(
        openai,
        `${doc.Summary} ${doc.Text}`
      );
      doc.vector = embeddings;

      batch.push(doc as Review);
    }
  }

  if (batch.length > 0) {
    await insertBatch(batch, index);

    numDocsLoaded += batch.length;
    batch.length = 0;
  }

  clearInterval(loader);
  console.log(`Seeding successful with ${numDocsLoaded} docs ...`);
}

async function insertBatch(batch: Review[], index: SearchIndex<Review>) {
  const docStatus = await index.createOrReplaceMany(batch);
  for (const status of docStatus) {
    if (status.error) {
      console.log(status.error);
      console.log(batch);

      throw new Error("Error creating documents");
    }
  }
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
