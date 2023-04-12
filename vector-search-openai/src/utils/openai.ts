import { Configuration, OpenAIApi } from "openai";
import { Review } from "search/models/review";

const MODEL = "text-embedding-ada-002";

const getOpenaiClient = (): OpenAIApi => {
  // setup OpenAI client
  const config = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
  });
  return new OpenAIApi(config);
};

const createEmbedding = async (
  openai: OpenAIApi,
  input: string
): Promise<number[]> => {
  const embeddings = await openai.createEmbedding({
    model: MODEL,
    input: input,
  });
  return embeddings.data.data[0]?.embedding;
};

export { getOpenaiClient, createEmbedding };
