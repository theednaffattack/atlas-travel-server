import { Resolver } from "type-graphql";

import { Hotel } from "../../entity/Hotel";
import { HotelInput } from "./HotelInput";
import { createBaseResolver } from "./BaseHotelResolver";
const BaseCreateHotelResolver = createBaseResolver(
  "Hotel",
  Hotel,
  HotelInput,
  Hotel,
  Hotel
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
