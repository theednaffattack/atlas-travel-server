import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { captureArgsLogger, deviceSniffingLogger } from "../../config/winston";

export const logger: MiddlewareFn<MyContext> = async (
  { args, ...theRest },
  next
) => {
  let gqlQueryBody = theRest.context.req.body.query;
  captureArgsLogger.write({
    time: new Date(),
    gqlQueryBody
  });
  deviceSniffingLogger.write(theRest.context.req.headers);
  return next();
};
