import { buildSchema } from "type-graphql";
import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

// import { createRedisConnection, redis } from "../../redis";
// import * as Redis from "ioredis";

import { ChangePasswordResolver } from "../../modules/user/ChangePassword";
import { ConfirmUserResolver } from "../../modules/user/ConfirmUser";
import { ForgotPasswordResolver } from "../../modules/user/ForgotPassword";
import { LoginResolver } from "../../modules/user/Login";
import { LogoutResolver } from "../../modules/user/Logout";
import { MeResolver } from "../../modules/user/Me";
import { RegisterResolver } from "../../modules/user/Register";
import {
  CreateUserResolver,
  CreateProductResolver
} from "../../modules/user/CreateUser";
import { ProfilePictureResolver } from "../../modules/user/ProfilePictureUpload";
import {
  CreateHotelResolver,
  GetAllHotelResolver,
  HotelAvgRatingResolver,
  HotelCountReviewsResolver
} from "../../modules/hotel/CreateHotel";

import { CreateReviewsResolver } from "../../modules/hotel/reviews/CreateReview";
// @ts-ignore
import { MessageResolver } from "../../modules/messages/SendMessages";
import {
  GetAllReservationsResolver,
  CreateReservationResolver
} from "../../modules/hotel/reservations/ExportedResolvers";
import { GetReservationByHotelIDAndDateFilterResolver } from "../../modules/hotel/reservations/GetReservationByHotelIDAndDateFilterResolver";

// const pubsub = new RedisPubSub();
// const myRedisPubSub = getConfiguredRedisPubSub();
const pubsubOptions = {
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string),
  retry_strategy: (options: any) => {
    // reconnect after
    return Math.max(options.attempt * 100, 3000);
  }
};

console.log("pubsubOptions".toUpperCase());
console.log(pubsubOptions);

export const pubSub = new RedisPubSub({
  // ..., // I need to determine what the other options are

  publisher: new Redis(pubsubOptions),
  subscriber: new Redis(pubsubOptions)
});

// const schema = await buildSchema({
//   resolvers: [__dirname + "/**/*.resolver.ts"],
//   pubSub: myRedisPubSub
// });

export const createSchema = () =>
  buildSchema({
    pubSub,

    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      CreateHotelResolver,
      CreateProductResolver,
      CreateReservationResolver,
      CreateReviewsResolver,
      CreateUserResolver,
      ForgotPasswordResolver,
      GetAllHotelResolver,
      GetAllReservationsResolver,
      GetReservationByHotelIDAndDateFilterResolver,
      HotelAvgRatingResolver,
      HotelCountReviewsResolver,
      LoginResolver,
      LogoutResolver,
      MessageResolver,
      MeResolver,
      ProfilePictureResolver,
      RegisterResolver
    ],
    authChecker: ({ context: { req } }) => {
      // I can read context here
      // cehck permission vs what's in the db "roles" argument
      // that comes from `@Authorized`, eg,. ["ADMIN", "MODERATOR"]
      return !!req.session.userId;
    }
  });
