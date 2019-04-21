import { Resolver } from "type-graphql";
// import { Resolver, Float, Query, FieldResolver, Root, Int } from "type-graphql";

import { makeGetResolver } from "./BaseGetResolver";

// import { HotelInput } from "./HotelInput";
// import { BaseListInput } from "./BaseListInput";

// import { createBaseResolver } from "./BaseCreateResolver";
import { createBaseResolverToo } from "./CreateReservation";

// import { getBaseResolver } from "./BaseHotelGetResolver";

// import { Hotel } from "../../entity/Hotel";
import { Reservation } from "../../../entity/Reservation";
import { ReservationInput } from "./ReservationInput";
// import { Photo } from "../../entity/Photo";
// import { Review } from "../../entity/Review";

// const BaseCreateReservationResolver = createBaseResolver(
//   "Hotel",
//   Hotel,
//   Hotel
//   // Hotel
// );

const BaseGetAllHotelResolver = makeGetResolver(
  Reservation,
  "Reservation",
  Reservation
  //   ["photos", "reviews", "rooms"]
);

const CreateReservationResolverBase = createBaseResolverToo(
  "Reservation",
  Reservation,
  ReservationInput,
  Reservation
);

@Resolver()
export class GetAlReservationsResolver extends BaseGetAllHotelResolver {}

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
