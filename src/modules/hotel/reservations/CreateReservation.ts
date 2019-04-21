import {
  Arg,
  ClassType,
  Mutation,
  // Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { addYears } from "date-fns";
// import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

// import { Photo } from "../../entity/Photo";
// import { Hotel } from "../../entity/Hotel";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
// import { GetAlReservationsResolver } from "./ExportedResolvers";
import { Reservation } from "../../../entity/Reservation";
import { Between } from "typeorm";
// import { Hotel } from "../../../entity/Hotel";

export function createBaseResolverToo<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseCreateResolver {
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.

    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      // I need a small factory or loop that will
      // dynamically access and save secondary repositories due
      // to db relations

      const AfterDate = (date: Date) => Between(date, addYears(date, 100));
      //   const BeforeDate = (date: Date) =>
      //     Between(data.from, subYears(data.from, 100));

      //   let getHotel = await Hotel.find({
      //     relations: ["rooms"],
      //     where: { id: data.hotelId }
      //   });

      let findOpenDates = await Reservation.find({
        relations: ["room", "user", "room.hotel"],
        where: { from: AfterDate(data.from), room: { hotel: data.hotelId } }
      });

      console.log(AfterDate(data.from));
      console.log(entity ? "yep entity" : "nope no entity");
      console.log(findOpenDates);
      //   return await entity.create(data).save();
    }
  }

  return BaseCreateResolver;
}
