import {
  Field,
  PrimaryKey,
  SearchField,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("post")
export class Post {
  @PrimaryKey(TigrisDataTypes.UUID, { order: 1, autoGenerate: true })
  id?: string;

  @Field({ timestamp: "createdAt" })
  createdAt?: Date;

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

  @Field(TigrisDataTypes.UUID)
  authorId: string;
}
