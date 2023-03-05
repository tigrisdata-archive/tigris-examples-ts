import { SearchField, TigrisDataTypes, TigrisSearchIndex } from "@tigrisdata/core";

export const MOVIE_INDEX_NAME = "movie";

@TigrisSearchIndex(MOVIE_INDEX_NAME)
export class Movie {
  @SearchField({ sort: true })
  title: string;

  @SearchField({ sort: true, facet: true })
  year: number;

  @SearchField({ elements: TigrisDataTypes.STRING, facet: true })
  cast: string[];

  @SearchField({ elements: TigrisDataTypes.STRING, facet: true })
  genres: string[];
}
