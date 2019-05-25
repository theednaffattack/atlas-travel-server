import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

export const isAuth: MiddlewareFn<MyContext> = async (
  //@ts-ignore
  { _, __, context },
  next
) => {
  const { userId } = context.req.session!;
  // context.userId is present as well
  // not sure which way to refactor

  if (!userId) {
    throw new Error("Not authenticated");
  }
  return next();
};
