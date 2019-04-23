import { InputType, Field } from "type-graphql";
import { addDays } from "date-fns";
import { IsReservationAvailable } from "./isReservationAvailable";

@InputType()
export class DateInput {
  // @ts-ignore
  @Field(type => Date)
  from: Date = new Date();

  // @ts-ignore
  @Field(type => Date)
  to: Date = addDays(new Date(), 14);

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
