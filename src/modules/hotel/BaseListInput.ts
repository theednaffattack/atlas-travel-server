import { Field, InputType, Int } from "type-graphql";
import { Min, Max } from "class-validator";

@InputType()
export class BaseListInput {
  // @ts-ignore
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  // @ts-ignore
  @Field(type => Int)
  @Min(1)
  @Max(50)
  take: number = 25;

  // // @ts-ignore
  // @Field(type => Int)
  // @Min(1)
  // @Max(50)
  // low: string;

  // // @ts-ignore
  // @Field(type => Int)
  // @Min(1)
  // @Max(50)
  // high: string;
}
