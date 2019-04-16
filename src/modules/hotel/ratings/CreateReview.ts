import { Resolver } from "type-graphql";

import { Review } from "../../../entity/Review";
// import { BaseUpdateInput } from "../BaseUpdateInput";
import { BaseReviewInput } from "../BaseReviewInput";

import { createBaseResolver } from "../BaseCRUDResolver";
// import { createBaseResolver as createUpdateResolver } from "../BaseUpdateResolver";

const BaseCreateReviewsResolver = createBaseResolver(
  "Review",
  Review,
  BaseReviewInput,
  Review,
  Review
);

// const BaseUpdateReviewsResolver = createUpdateResolver(
//   "Review",
//   Review,
//   BaseUpdateInput,
//   Review,
//   "update"
// );

@Resolver()
export class CreateReviewsResolver extends BaseCreateReviewsResolver {
  // we can still create additional resolvers
  // example
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}

// @Resolver()
// export class UpdateReviewsResolver extends BaseUpdateReviewsResolver {
//   // we can still create additional resolvers
//   // example
//   //   @Mutation(() => User)
//   //   async createUser(@Arg("data") data: RegisterInput) {
//   //     // @todo: add hashing of password
//   //     return User.create(data).save();
//   //   }
// }
