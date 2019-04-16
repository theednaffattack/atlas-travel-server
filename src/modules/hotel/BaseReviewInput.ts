import { InputType, Field, Float, ID } from "type-graphql";

@InputType()
export class BaseReviewInput {
  // @ts-ignore
  @Field(type => Float)
  value: number;

  // @ts-ignore
  @Field(type => String)
  title: string;

  // @ts-ignore
  @Field(type => String)
  text: string;

  // @ts-ignore
  @Field(type => ID)
  hotelId: any;

  // @ts-ignore
  @Field(type => ID)
  userId: any;

  // @ts-ignore
  @Field(type => Date, { defaultValue: Date.now() })
  date: Date;
}
