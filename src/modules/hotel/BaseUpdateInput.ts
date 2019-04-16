import { InputType, Field, Int, ID } from "type-graphql";
import { Min, Max } from "class-validator";

@InputType()
export class BaseUpdateInput {
  // @ts-ignore
  @Field(type => ID)
  id: any;

  // @ts-ignore
  @Field(type => Int, { description: "The number of stars from 1 - 5" })
  @Min(0)
  @Max(5)
  value: number = 0;
}
