import { Router } from "express";
import { z } from "zod";
import { OpenAIApi } from "openai";
import { Search, SearchQuery } from "@tigrisdata/core";
import middlewares from "../utils/middlewares";
import { Review, REVIEW_INDEX_NAME } from "../search/models/review";
import { createEmbedding } from "../utils/openai";

const apiSchema = z.object({
  query: z.object({
    searchString: z.string({
      required_error: "Search string is required",
    }),
    page: z.coerce.number().optional(),
    size: z.coerce.number().optional(),
  }),
});

const searchApi = (app: Router, searchClient: Search, openai: OpenAIApi) => {
  app.get(
    "/search",
    middlewares.validateInput(apiSchema),
    async (req, res, next) => {
      const { searchString, page, size } = req.query;

      const index = await searchClient.getIndex<Review>(REVIEW_INDEX_NAME);
      const embeddings = await createEmbedding(openai, searchString as string);

      const request: SearchQuery<Review> = {
        vectorQuery: {
          vector: embeddings,
        },
        facets: ["ProductId", "Score"],
        hitsPerPage: Number(size) || 10,
      };

      index
        .search(request, Number(page) || 1)
        .then((results) => {
          const docs = [];
          for (const hit of results.hits) {
            docs.push({
              Id: hit.document.Id,
              ProductId: hit.document.ProductId,
              UserId: hit.document.UserId,
              ProfileName: hit.document.ProfileName,
              Score: hit.document.Score,
              Summary: hit.document.Summary,
              Text: hit.document.Text,
              VectorDistance: hit.meta.textMatch.vectorDistance,
            });
          }
          res.json(docs);
        })
        .catch((error) => next(error));
    }
  );
};

export default searchApi;
