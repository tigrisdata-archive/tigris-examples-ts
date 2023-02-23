import * as fs from "fs";
import * as zlib from "zlib";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { batch } from "stream-json/utils/Batch";
import { Movie, MOVIE_INDEX_NAME } from "../src/search/models/movie";
import { Tigris } from "@tigrisdata/core";
import { SearchIndex } from "@tigrisdata/core/dist/search";
import { clearInterval } from "timers";

async function main() {
  const tigrisClient = new Tigris();

  // register index definitions
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndex(Movie);

  // load seed data
  const index = await search.getIndex<Movie>(MOVIE_INDEX_NAME);

  const dataFile = "./scripts/data/movies.json.gz";
  console.log("Seeding data from file ", dataFile);

  const inputStream = fs.createReadStream(dataFile);

  await importJSON(inputStream, index);
}

async function importJSON(
  readStream: fs.ReadStream,
  index: SearchIndex<Movie>
) {
  const loader = loadingAnimation("Loading...");

  let numDocsLoaded = 0;
  const batchSize = 100;

  const processedStream = readStream
    .pipe(zlib.createGunzip())
    .pipe(parser())
    .pipe(streamArray())
    .pipe(batch({ batchSize: batchSize }));

  for await (const docsBatch of processedStream) {
    const movies = docsBatch.map((item) => {
      return item.value as Movie;
    });
    await index.createOrReplaceMany(movies);
    numDocsLoaded += movies.length;
  }

  clearInterval(loader);
  console.log(`Seeding successful with ${numDocsLoaded} docs ...`);
}

/**
 * Create and display a loader in the console.
 *
 * @param {string} [text=""] Text to display after loader
 * @param {array.<string>} [chars=["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"]]
 * Array of characters representing loader steps
 * @param {number} [delay=100] Delay in ms between loader steps
 * @example
 * let loader = loadingAnimation("Loading…");
 *
 * // Stop loader after 1 second
 * setTimeout(() => clearInterval(loader), 1000);
 * @returns {number} An interval that can be cleared to stop the animation
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
