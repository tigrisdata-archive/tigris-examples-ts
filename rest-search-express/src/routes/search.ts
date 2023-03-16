import { Router } from "express";
import { z } from "zod";
import { Search } from "@tigrisdata/core";
import { SearchQuery } from "@tigrisdata/core/dist/search";
import middlewares from "../utils/middlewares";
import { Movie, MOVIE_INDEX_NAME } from "../search/models/movie";

const apiSchema = z.object({
  query: z.object({
    searchString: z.string({
      required_error: "Search string is required",
    }),
    page: z.coerce.number().optional(),
    size: z.coerce.number().optional(),
    orderBy: z.enum(["asc", "desc"]).optional(),
  }),
});

export default (app: Router, searchClient: Search) => {
  app.get(
    "/search",
    middlewares.validateInput(apiSchema),
    async (req, res, next) => {
      const { searchString, page, size, orderBy } = req.query;

      const index = await searchClient.getIndex<Movie>(MOVIE_INDEX_NAME);

      const request: SearchQuery<Movie> = {
        q: searchString as string,
        searchFields: ["title", "cast", "genres"],
        facets: ["genres"],
        sort: [
          {
            field: "year",
            order:
              orderBy?.toString().toLowerCase() == "asc"
                ? "$asc"
                : "$desc",
          },
        ],
        hitsPerPage: Number(size) || 10,
      };

      index
        .search(request, Number(page) || 1)
        .then((results) => {
          res.json(results);
        })
        .catch((error) => next(error));
    }
  );
};
