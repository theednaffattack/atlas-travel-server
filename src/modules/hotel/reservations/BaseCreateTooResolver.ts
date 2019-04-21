import {
  ClassType,
  //   Mutation,
  Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
// import casual from "casual";

// import { Photo } from "../../../entity/Photo";
// import { Hotel } from "../../../entity/Hotel";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
// import { Reservation } from "../../../entity/Reservation";

// interface queryObj {
//   relations: any[] | null | undefined;
// }

export function makeCreateResolver<T extends ClassType>(
  objectTypeCls: T,
  suffix: string,
  entity: any
  //   relations: string[]
) {
  @Resolver({ isAbstract: true })
  abstract class BaseFindResolver {
    constructor(
      // constructor injection of a service
      private readonly Entity: any = entity
    ) {}
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.

    @UseMiddleware(isAuth, logger)
    @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll() {
      //   const dbQuery: queryObj = {
      //     // relations: [...relations]
      //   };

      return await entity.find();
    }

    @Query(() => [objectTypeCls], { name: `getAllToo${suffix}` })
    async getAllToo() {
      return await this.Entity.find();
    }
  }

  return BaseFindResolver;
}
