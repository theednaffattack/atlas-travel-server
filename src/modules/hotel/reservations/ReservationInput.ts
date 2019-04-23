import { InputType, Field } from "type-graphql";
import { IsReservationAvailable } from "./isReservationAvailable";
// import { User } from "../../../entity/User";
// import { Hotel } from "../../../entity/Hotel";

@InputType()
export class DateInput {
  // @ts-ignore
  @Field(type => Date)
  from: number = 0;

  // @ts-ignore
  @Field(type => Date)
  to: number = 25;

  // @ts-ignore
  @Field(type => String)
  hotelId: string;
}

@InputType()
export class ReservationInput {
  // @ts-ignore
  @Field(type => DateInput)
  @IsReservationAvailable({
    message: "no reservations available during dates given"
  })
  dates: object;
  // @ts-ignore
  @Field(type => String)
  userId: string;

  // @ts-ignore
  @Field(type => String)
  hotelId: string;
}
