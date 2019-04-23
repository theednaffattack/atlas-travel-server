import { Query, Resolver, UseMiddleware, Arg } from "type-graphql";
import { isWithinRange } from "date-fns";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
import { Reservation } from "../../../entity/Reservation";
import { ReservationInput } from "./ReservationInput";
import { Room } from "../../../entity/Room";

@Resolver()
export class GetReservationByHotelIDAndDateFilterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => [Reservation], {
    name: `getAllReservationsByHotelIDAndDateFilter`
  })
  async getAllReservationsByHotelIDAndDateFilter(
    @Arg("data", () => ReservationInput) data: any
  ) {
    let theRoom = await Room.find({
      relations: ["hotel", "reserved", "reserved.room"],
      where: { hotel: data.hotelId }
    })
      .then(roomData =>
        roomData.map(item => {
          return item && item.reserved
            ? item.reserved.filter(reservation => {
                return (
                  isWithinRange(
                    data.dates.from,
                    reservation.from,
                    reservation.to
                  ) &&
                  isWithinRange(data.dates.to, reservation.from, reservation.to)
                );
              })[0]
            : [];
        })
      )
      .catch(error => console.error(error));
    return theRoom ? theRoom : [];
  }
}
