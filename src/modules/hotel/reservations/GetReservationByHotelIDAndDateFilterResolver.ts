import { Query, Resolver, UseMiddleware, Arg } from "type-graphql";
import { isWithinRange } from "date-fns";

import { logger } from "../../middleware/logger";
import { isAuth } from "../../middleware/isAuth";
import { Reservation } from "../../../entity/Reservation";
import { Room } from "../../../entity/Room";
import { ReservationInput } from "./ReservationInput";

@Resolver()
export class GetReservationByHotelIDAndDateFilterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => [Reservation], {
    name: `getAllReservationsByHotelIDAndDateFilter`,
    nullable: "itemsAndList"
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
                console.log(data.dates.from.toISOString());
                console.log(data.dates.to.toISOString());
                console.log(
                  isWithinRange(
                    reservation.from.toISOString(),
                    data.dates.from.toISOString(),
                    data.dates.to.toISOString()
                  )
                );
                console.log(
                  isWithinRange(
                    reservation.to.toISOString(),
                    data.dates.from.toISOString(),
                    data.dates.to.toISOString()
                  )
                );
                return (
                  isWithinRange(
                    reservation.to.toISOString(),
                    data.dates.from.toISOString(),
                    data.dates.to.toISOString()
                  ) ||
                  isWithinRange(
                    reservation.from.toISOString(),
                    data.dates.from.toISOString(),
                    data.dates.to.toISOString()
                  )
                );
              })[0]
            : [];
        })
      )
      .catch(error => console.error(error));
    return theRoom ? theRoom : ["error: no room list detected"];
  }
}
