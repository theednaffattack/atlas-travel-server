import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";

// export interface MyContext {
//   req: Request;
//   res: Response;
//   connection?: any;
// }

export const isAuth: MiddlewareFn<MyContext> = async (
  //@ts-ignore
  { _, __, context },
  next
) => {
  console.log("isAuth Middleware context.req.session");
  // console.log(Object.keys(args));
  // console.log(Object.keys(root));
  // console.log(Object.keys(context));
  // console.log("context.userInfo, (set originally in apolloServer configs)");
  // console.log(context.userInfo);
  // console.log("context.req, args, root object keys");
  // console.log("context.req");
  // console.log(Object.keys(context.req));
  // console.log("args");
  // console.log(Object.keys(args));
  // console.log("root");
  // console.log(Object.keys(root));
  // console.log("CAN I SEE THE SESSION?");
  // console.log(context.req.session);
  // console.log("context.connection object keys");

  // if context.userInfo is present THEN they are authenticated = PROCEED
  // if context.userInfo is undefined check if there is a req.session.userId
  // present

  // @todo: refactor below
  // I'm not sure how else to achieve the results below
  // I dislike having alternate next() in two blocks inside one scope
  // A bottom-level Error (implemented this way, at least) seems stupid as well
  // if (context.userInfo) {
  //   console.log("context userInfo read");
  //   return next();
  // }

  // if (context.req.session!.userId) {
  //   console.log("req session sensed");
  //   return next();
  // }
  console.log("why is this throwing?");
  // console.log(context.userInfo);
  console.log("what is context outside?");
  // console.log(context);
  // console.log(root);
  console.log(context);

  // if (!context.userId) {
  //   console.log("what is context INSIDE if block (!context.userId)?");
  //   console.log(context);
  //   // console.log(context.userInfo);
  //   throw new Error("Not authenticated");
  // }
  return next();
};
