import {
  Arg,
  ClassType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

import { Photo } from "../../entity/Photo";
import { Hotel } from "../../entity/Hotel";

import { logger } from "../middleware/logger";
import { isAuth } from "../middleware/isAuth";

export function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  objectTypeCls?: T
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.

    @UseMiddleware(isAuth, logger)
    // @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    // @ts-ignore
    // async getAll(@Arg("first", () => Int) skip: number = 0) {
    //   //Promise<T[]> {
    //   return await Hotel.find();
    // }
    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      // I need a small factory or loop that will
      // dynamically access and save secondary repositories due
      // to db relations

      return await entity.create(data).save();
    }
  }

  return BaseResolver;
}
