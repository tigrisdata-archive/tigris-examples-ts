import {
  Field,
  PrimaryKey,
  SearchField,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("post")
export class Post {
  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: bigint; // int64 values do not fit into the regular number type, we recommend using bigint or string

  @Field({ timestamp: "createdAt" })
  createdAt?: Date;

  @SearchField()
  @Field({ timestamp: "updatedAt" })
  updatedAt?: Date;

  @SearchField()
  @Field()
  title: string;

  @SearchField()
  @Field()
  content?: string;

  @SearchField()
  @Field({ default: false })
  published?: boolean;

  @Field(TigrisDataTypes.INT32, { default: 0 })
  viewCount?: number;

  @Field(TigrisDataTypes.INT64)
  authorId: bigint;
}
