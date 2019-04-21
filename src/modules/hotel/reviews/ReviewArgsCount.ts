import { Field, ArgsType } from "type-graphql";

@ArgsType()
export class GetReviewsArgs {
  // @ts-ignore
  @Field(type => String)
  ID: string;
}
