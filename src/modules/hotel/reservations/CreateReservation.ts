import {
  Arg,
  ClassType,
  Mutation,
  Resolver,
  UseMiddleware
} from "type-graphql";
import { isWithinRange } from "date-fns";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
import { Hotel } from "../../../entity/Hotel";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";
import { User } from "../../../entity/User";

export function createBaseResolverToo<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseCreateResolver {
    @UseMiddleware(isAuth, logger)
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      // I need a small factory or loop that will
      // dynamically access and save secondary repositories due
      // to db relations

      let findTheHotel: any;

      let isFromInRange = (data: any, reservation: any) =>
        isWithinRange(data.dates.from, reservation.from, reservation.to);
      let isToInRange = (data: any, reservation: any) =>
        isWithinRange(data.dates.to, reservation.from, reservation.to);

      findTheHotel = await Hotel.findOne({
        relations: ["rooms", "rooms.reserved"],
        where: { id: data.hotelId }
      });

      let availableHotelRooms = findTheHotel.rooms.filter((room: any) => {
        let resMappings: Boolean[] = room.reserved.map((reservation: any) => {
          // we're returning a Boolean into the array
          // false = unavailable (reserved), true = available (no overlapping dates)
          return (
            !isFromInRange(data, reservation) && !isToInRange(data, reservation)
          );
        });

        // filter out rooms that have reservations that
        // overlap either of the requested reservation dates
        return !resMappings.includes(false);
      });
      console.log("FILTERED HOTEL ROOMS");

      console.log(`We found ${findTheHotel.rooms.length} hotel rooms!`);
      console.log(`${availableHotelRooms.length} are available to reserve.`);
      // console.log(JSON.stringify(availableHotelRooms, null, 2));

      console.log(entity ? "yep entity" : "nope no entity");

      const getRoom = await Room.findOne({
        where: { id: availableHotelRooms[0].id },
        relations: ["reserved"]
      });
      const getUser = await User.findOne({
        where: { id: data.userId }
      });

      const newReservation = await Reservation.create({
        from: data.dates.from,
        to: data.dates.to,
        user: getUser,
        room: getRoom
      }).save();

      let existingReservations = getRoom ? getRoom.reserved : [];

      let updatedRoom;

      if (getRoom && existingReservations && existingReservations.length > 0) {
        getRoom.reserved = [...existingReservations, newReservation];
        updatedRoom = await getRoom.save();
        newReservation.room = updatedRoom;
      }

      console.log(newReservation);

      return newReservation;

      // UP NEXT
      // grab a room from `availableHotelRooms` and create a reservation
      // return that reservation (signature below) to the graphql API

      // type Reservation {
      //   id: ID!
      //   from: DateTime!
      //   to: DateTime!
      //   user: User!
      //   room: Room!
      //   }
    }
  }

  return BaseCreateResolver;
}
