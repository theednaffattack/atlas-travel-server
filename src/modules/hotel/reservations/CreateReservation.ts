import {
  Arg,
  ClassType,
  Mutation,
  // Query,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { isWithinRange } from "date-fns";
// import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

// import { Photo } from "../../entity/Photo";
// import { Hotel } from "../../entity/Hotel";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
// import { GetAlReservationsResolver } from "./ExportedResolvers";
// import { Reservation } from "../../../entity/Reservation";
// import { Between } from "typeorm";
import { Hotel } from "../../../entity/Hotel";
import { Reservation } from "../../../entity/Reservation";
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

      // const AfterDate = (date: Date) => Between(date, addYears(date, 100));
      //   const BeforeDate = (date: Date) =>
      //     Between(data.from, subYears(data.from, 100));

      //   let getHotel = await Hotel.find({
      //     relations: ["rooms"],
      //     where: { id: data.hotelId }
      //   });

      let findTheHotel: any;
      let errorsCollected: any[] = [];

      let dataCollected: any[] = [];

      try {
        findTheHotel = await Hotel.findOne({
          relations: ["rooms", "rooms.reserved"],
          // select: ["rooms"],
          where: { id: data.hotelId }
          // join: {
          //   alias: "hotel",
          //   leftJoinAndSelect: {
          //     rooms: "hotel.rooms",
          //     reserved: "rooms.reserved"
          //   }
          // }
        });

        let [getTheReservations] = findTheHotel.rooms.map(
          (hotel: any) => hotel.reserved
        );

        let process = getTheReservations.map(async (reservation: any) => {
          // console.log(index);
          // console.log(reservation);
          // let isItBetween = Between(data.from, data.to);
          // console.log("SIMPLE COMPARISION");
          let isFromInRange = isWithinRange(
            data.from,
            reservation.from,
            reservation.to
          );
          let isToInRange = isWithinRange(
            data.to,
            reservation.from,
            reservation.to
          );
          // console.log(reservation.from > data.from);
          // console.log("ISITBETWEEN?");
          // console.log(isItBetween);
          // console.log("ISFROMINRANGE?");
          // console.log(isFromInRange);
          // console.log("ISTOINRANGE?");
          // console.log(isToInRange);

          if (isFromInRange || isToInRange) {
            errorsCollected.push({
              error: "Booking error",
              message: "Room unavailable during dates selected",
              reservationFound: {
                id: reservation.id,
                from: reservation.from,
                to: reservation.to
              },
              ogData: JSON.stringify(data)
            });
          }
          if (!isFromInRange && !isToInRange) {
            dataCollected.push(
              { newReservation: await Reservation.create(data).save() },
              reservation
            );
          }

          // console.log({
          //   data: dataCollected,
          //   errors: errorsCollected
          // });

          return {
            data: dataCollected,
            errors: errorsCollected
          };
        });

        console.log(JSON.stringify(await Promise.all(process), null, 2));

        // console.log("findTheHotel");
        // console.log(findTheHotel);
        // // console.log("getTheReservations");
        // console.log(getTheReservations);
      } catch (error) {
        console.error(error);
      }

      // let findTheReservations: any = findTheHotel!.reserved;

      // let findOpenDates = await Reservation.find({
      //   relations: ["room", "user", "room.hotel"],
      //   where: {
      //     room: { hotel: data.hotelId }
      //   }
      // });

      // console.log(data);
      // console.log(AfterDate(data.from));
      console.log(entity ? "yep entity" : "nope no entity");
      // console.log(findTheHotel);
      //   return await entity.create(data).save();
    }
  }

  return BaseCreateResolver;
}
