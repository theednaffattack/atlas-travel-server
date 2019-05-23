import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => User, { nullable: true })
  // @ts-ignore
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    // if we can't find a userId on the current session
    console.log("INSIDE ME RESOLVER");
    console.log(ctx);
    // console.log(ctx && ctx.req.session);
    // console.log(Object.keys(ctx.userId));
    // if (!ctx.userId) {
    //   return undefined;
    // }
    // return User.findOne(ctx.userId);
    return User.findOne(ctx.userId);
    // if (!ctx.req.session!.userId) {
    //   return undefined;
    // }

    // return User.findOne(ctx.req.session!.userId);
  }
}
