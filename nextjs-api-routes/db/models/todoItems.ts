import {
  Field,
  PrimaryKey,
  SearchField,
  TigrisCollection,
  TigrisDataTypes,
} from "@tigrisdata/core";

@TigrisCollection("todoItems")
export class TodoItem {
  @PrimaryKey(TigrisDataTypes.INT32, { order: 1, autoGenerate: true })
  id!: number;

  @SearchField()
  @Field()
  text!: string;

  @Field({ default: false })
  completed!: boolean;
}
