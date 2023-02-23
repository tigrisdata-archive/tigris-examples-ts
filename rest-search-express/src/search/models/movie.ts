import { IndexField, TigrisDataTypes, TigrisIndex } from "@tigrisdata/core";

export const MOVIE_INDEX_NAME = "movie";

@TigrisIndex(MOVIE_INDEX_NAME)
export class Movie {
  @IndexField({ sort: true })
  title: string;

  @IndexField({ sort: true, facet: true })
  year: number;

  @IndexField({ elements: TigrisDataTypes.STRING, facet: true })
  cast: string[];

  @IndexField({ elements: TigrisDataTypes.STRING, facet: true })
  genres: string[];
}
