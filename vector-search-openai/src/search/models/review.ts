import {
  SearchField,
  TigrisDataTypes,
  TigrisSearchIndex,
} from "@tigrisdata/core";

export const REVIEW_INDEX_NAME = "reviews";

@TigrisSearchIndex(REVIEW_INDEX_NAME)
export class Review {
  @SearchField(TigrisDataTypes.INT64)
  Id: string;

  @SearchField({ sort: true, facet: true })
  ProductId: string;

  @SearchField()
  UserId: string;

  @SearchField()
  ProfileName: string;

  @SearchField(TigrisDataTypes.INT64)
  HelpfulnessNumerator: number;

  @SearchField(TigrisDataTypes.INT64)
  HelpfulnessDenominator: number;

  @SearchField(TigrisDataTypes.INT64, { sort: true, facet: true })
  Score: number;

  @SearchField(TigrisDataTypes.INT64, { sort: true })
  Time: number;

  @SearchField()
  Summary: string;

  @SearchField()
  Text: string;

  // 1536 floats total for ada-002
  @SearchField({ dimensions: 1536 })
  vector: number[];
}
