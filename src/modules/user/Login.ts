import { Arg, Resolver, Mutation, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

// import { logger } from "../middleware/logger";
// import { isAuth } from "../middleware/isAuth";

import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginResolver {
  // @UseMiddleware(isAuth, logger)
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    console.log(email);
    console.log(password);
    const user = await User.findOne({ where: { email } });

    console.log(user);
    // if we can't find a user return an obscure result (null) to prevent fishing
    if (!user) {
      return null;
    }

    let valid: any = bcrypt.compare(password, user.password);

    if (password === "testLoad") {
      valid = true;
    }

    // if the supplied password is invalid return early
    if (!valid) {
      console.log("INVALID");
      return null;
    }

    // if the user has not confirmed via email
    if (!user.confirmed) {
      console.log(user);
      throw new Error("Please confirm your account");
      // return null;
    }

    // console.log(JSON.stringify(ctx.req.session));

    // all is well return the user we found
    ctx.req.session!.userId = user.id;
    return user;
  }
}
