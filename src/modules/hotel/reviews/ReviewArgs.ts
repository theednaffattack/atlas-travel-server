import { Min, Max } from "class-validator";
import { ArgsType } from "type-graphql";

@ArgsType()
class GetReviewsArgs {
  @Field(type => Int, { defaultValue: 0 })
  @Min(0)
  skip: number;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take = 25;

  @Field({ nullable: true })
  title?: string;

  // helpers - index calculations
  startIndex = skip;
  endIndex = skip + take;
}
