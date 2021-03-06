import { Resolver } from "type-graphql";
// import { Resolver, Float, Query, FieldResolver, Root, Int } from "type-graphql";

import {
  makeGetResolver,
  makeGetWithRelationsResolver
} from "./BaseGetResolver";

// import { HotelInput } from "./HotelInput";
// import { BaseListInput } from "./BaseListInput";

// import { createBaseResolver } from "./BaseCreateResolver";
import { createBaseResolverToo } from "./CreateReservation";

// import { getBaseResolver } from "./BaseHotelGetResolver";

// import { Hotel } from "../../entity/Hotel";
import { Reservation } from "../../../entity/Reservation";
import { ReservationInput } from "./ReservationInput";
// import { BaseEntity } from "typeorm";
// import { Photo } from "../../entity/Photo";
// import { Review } from "../../entity/Review";

// const BaseCreateReservationResolver = createBaseResolver(
//   "Hotel",
//   Hotel,
//   Hotel
//   // Hotel
// );

const BaseGetAllReservationsResolver = makeGetResolver(
  Reservation,
  "Reservation",
  Reservation
  //   ["photos", "reviews", "rooms"]
);

export const GetReservationsByHotelId = makeGetWithRelationsResolver(
  Reservation,
  "Reservation",
  Reservation,
  ["room", "room.reserved"]
);

// interface RandomObj {
//   [key: string]: any;
// }

// @ObjectType()
// class Errors {
//   @Field(() => String)
//   error: string;
//   @Field(() => String)
//   message: string;
//   @Field(() => Reservation)
//   reservationFound: Reservation;
//   @Field(() => String)
//   ogData: string;
// }

// @ObjectType()
// class CustomReservationReturnType {
//   @Field(() => [Reservation])
//   data: Reservation[];
//   @Field(() => [Errors])
//   errors: Errors[];
// }

const CreateReservationResolverBase = createBaseResolverToo(
  "Reservation",
  Reservation,
  ReservationInput,
  Reservation
);

@Resolver()
export class GetAllReservationsResolver extends BaseGetAllReservationsResolver {}

@Resolver()
export class CreateReservationResolver extends CreateReservationResolverBase {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}
