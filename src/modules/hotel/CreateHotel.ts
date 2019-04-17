import { Resolver } from "type-graphql";

import { HotelInput } from "./HotelInput";
import { BaseListInput } from "./BaseListInput";
import { createBaseResolver } from "./BaseHotelResolver";
import { getBaseResolver } from "./BaseHotelGetResolver";

import { Hotel } from "../../entity/Hotel";
// import { Photo } from "../../entity/Photo";
// import { Review } from "../../entity/Review";

const BaseCreateHotelResolver = createBaseResolver(
  "Hotel",
  Hotel,
  HotelInput,
  Hotel
  // Hotel
);

const BaseGetAllHotelResolver = getBaseResolver(
  "Hotel",
  // Hotel,
  BaseListInput,
  Hotel,
  Hotel,
  "photos",
  "reviews"
);

@Resolver()
export class CreateHotelResolver extends BaseCreateHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}
@Resolver()
export class GetAllHotelResolver extends BaseGetAllHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}
