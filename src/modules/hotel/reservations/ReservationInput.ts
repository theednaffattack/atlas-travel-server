import { InputType, Field } from "type-graphql";
// import { User } from "../../../entity/User";
// import { Hotel } from "../../../entity/Hotel";

@InputType()
export class ReservationInput {
  // @ts-ignore
  @Field(type => Date)
  from: number = 0;

  // @ts-ignore
  @Field(type => Date)
  to: number = 25;

  // @ts-ignore
  @Field(type => String)
  userId: string;

  // @ts-ignore
  @Field(type => String)
  hotelId: string;
}
