import {
  Resolver,
  Float,
  Query,
  FieldResolver,
  Root,
  Int,
  InputType,
  UseMiddleware,
  Arg,
  Field,
  ID
} from "type-graphql";

import { HotelInput } from "./HotelInput";
import { BaseListInput } from "./BaseListInput";
import { createBaseResolver } from "./BaseHotelResolver";
import { getBaseResolver } from "./BaseHotelGetAllResolver";

import { Hotel } from "../../entity/Hotel";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../../modules/middleware/logger";
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
  ["photos", "reviews", "rooms"]
);

@InputType()
export class HotelGetInput {
  // @ts-ignore
  @Field(type => ID)
  hotelId: string;
}

@Resolver(() => Hotel)
export class CreateHotelResolver extends BaseCreateHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}
@Resolver(() => Hotel)
export class GetAllHotelResolver extends BaseGetAllHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}

@Resolver(() => Hotel)
export class GetHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }

  @UseMiddleware(isAuth, logger)
  @Query(() => Hotel, { name: "getHotelByID" })
  async getHotelByID(@Arg("data", () => HotelGetInput) data: HotelGetInput) {
    console.log(data);
  }
}

interface RandomMappingWithIndexSignature {
  // stringProp: string;
  // numberProp: number;

  [key: string]: number;
}

@Resolver(() => Hotel)
export class HotelCountReviewsResolver extends BaseGetAllHotelResolver {
  @Query(() => Int)
  @FieldResolver(() => Int)
  // @ts-ignore
  async reviewCount(@Root() hotel: Hotel) {
    return hotel.reviews.length;
  }
}

@Resolver(() => Hotel)
export class HotelAvgRatingResolver extends BaseGetAllHotelResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
  @Query(() => Float)
  @FieldResolver(() => Float)
  // @ts-ignore
  async averageRating(@Root() hotel: Hotel) {
    const oneHotel = await Hotel.findOne({
      where: { id: "064ad970-37a4-4224-8956-360fe5e6a8f6" },
      relations: ["reviews"]
    });
    if (oneHotel) {
      console.log(oneHotel.reviews.length);

      //@ts-ignore
      const sum = function(items: any[], prop: string) {
        //@ts-ignore
        return oneHotel.reviews.reduce(function(
          accumulator: any,
          currentValue: RandomMappingWithIndexSignature
          // currentIndex
        ) {
          const makeANumber: any = currentValue[prop];

          const numberToReturn =
            parseFloat(accumulator) + parseFloat(makeANumber);

          return numberToReturn;
        }, 0);
        // Without this initial value `0` the reduce func breaks
      };

      const preliminaryAvgRating =
        sum(oneHotel.reviews, "value") / oneHotel.reviews.length;
      // console.log(sum(hotel.reviews, "value"));
      return Math.floor(preliminaryAvgRating * 10) / 10; // ? ratingsSum / hotel.reviews.length : null;
    }
    return 0.01;
  }
}
