import { Router } from "express";
import { z } from "zod";
import { OpenAIApi } from "openai";
import middlewares from "../utils/middlewares";
import { createEmbedding } from "../utils/openai";
import { VectorDocumentStore } from "@tigrisdata/vector";

const apiSchema = z.object({
  query: z.object({
    searchString: z.string({
      required_error: "Search string is required",
    }),
    k: z.coerce.number().optional(),
  }),
});

const searchApi = (
  app: Router,
  vectorStore: VectorDocumentStore,
  openai: OpenAIApi
) => {
  app.get(
    "/search",
    middlewares.validateInput(apiSchema),
    async (req, res, next) => {
      const { searchString, k } = req.query;

      try {
        const embeddings = await createEmbedding(
          openai,
          searchString as string
        );

        const results = await vectorStore.similaritySearchVectorWithScore({
          query: embeddings,
          k: Number(k) || 10,
        });

        res.json(results);
      } catch (error) {
        next(error);
      }
    }
  );
};

export default searchApi;
