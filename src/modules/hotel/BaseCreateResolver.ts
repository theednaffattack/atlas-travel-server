import {
  Arg,
  ClassType,
  Mutation,
  //   Query,
  Resolver,
  UseMiddleware,
  Query
} from "type-graphql";
// import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

import { Hotel } from "../../entity/Hotel";
import { BaseListInput } from "./BaseListInput";

import { logger } from "../middleware/logger";
import { isAuth } from "../middleware/isAuth";

export function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  objectTypeCls?: T, // only for queries?
  fieldToUpdate?: string,
  valueToUpdate?: string
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.

    @UseMiddleware(isAuth, logger)
    @Query(() => [objectTypeCls], { name: `getAll${suffix}`, nullable: true })
    async getAll(): Promise<any> {
      return await entity.find();
    }
    // the query below is bad, i need to somehow work in the ID by extending the
    // Args
    @Query(() => [objectTypeCls], { name: `get${suffix}`, nullable: true })
    async get(
      @Arg("data", () => inputType)
      data: BaseListInput
    ): Promise<any> {
      return await Hotel.find({ skip: data.skip, take: data.take });
    }

    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any): Promise<any> {
      return await entity.create(data).save();
    }

    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `update${suffix}` })
    async update(@Arg("data", () => inputType) data: any): Promise<any> {
      entity.find(data);
      entity[fieldToUpdate!] = valueToUpdate;
      return await entity.save();
    }
  }

  return BaseResolver;
}
