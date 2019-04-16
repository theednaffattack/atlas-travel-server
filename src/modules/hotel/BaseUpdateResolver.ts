import {
  Arg,
  ClassType,
  Mutation,
  Resolver,
  UseMiddleware
} from "type-graphql";
// import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

// import { Hotel } from "../../entity/Hotel";
// import { BaseListInput } from "./BaseListInput";

import { logger } from "../middleware/logger";
import { isAuth } from "../middleware/isAuth";

export function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  propertyName?: string
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.

    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `update${suffix}` })
    async update(@Arg("data", () => inputType) data: any): Promise<any> {
      const { value } = data;
      const dataObj = entity.findOne(value);
      dataObj[propertyName!] = value;
      return await dataObj.save();
    }
  }

  return BaseResolver;
}
