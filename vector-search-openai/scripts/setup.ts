import { Tigris } from "@tigrisdata/core";
import { Review } from "../src/search/models/review";

async function main() {
  // setup client
  const tigrisClient = new Tigris();

  // register index definitions
  const search = tigrisClient.getSearch();
  await search.createOrUpdateIndex(Review);
}

main()
  .then(async () => {
    console.log("Setup complete ...");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
