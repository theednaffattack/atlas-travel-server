const ormconfig = require("../../../ormconfig.json");
import { createConnection } from "typeorm";

import { make_array_of } from "./seed";
import { Room } from "../../entity/Room";
import { Hotel } from "../../entity/Hotel";
import { Reservation } from "../../entity/Reservation";

// async function saveRooms(photoEntitiesToSave: any[]) {
//   return await Promise.all(
//     photoEntitiesToSave.map(async (photoInfo: any) => {
//       return await Room.create(photoInfo).save();
//     })
//   );
// }

interface GetArgs {
  skip: number;
  take: number;
}

// interface FakeHotel {
//   id: string;
// }

// interface ISomeObject {
//   [key: string]: string;
// }

async function saveRelation(relation: Reservation[], entity: any) {
  return await Promise.all(
    relation.map(async (relatedItem: any) => {
      return await entity.create(relatedItem).save();
    })
  );
}

createConnection(ormconfig)
  .then(async () => {
    const getHotels = async ({ skip, take }: GetArgs) => {
      return await Hotel.find({ skip, take, select: ["id"] });
      //   try {
      //     return await Hotel.find({ skip, take, select: ["id"] })
      //       .then()
      //       .catch();
      //   } catch (error) {
      //     console.error(error);
      //     return "Nooooo";
      //   }
    };

    const mySkip = 61;
    const myTake = 20;

    // const realSkip = 0;
    // const realTake = 300;

    const rooms = await make_array_of(myTake, "room");

    const bunchaHotels = await getHotels({ skip: mySkip, take: myTake });

    // @ts-ignore
    const transformed = rooms.map(async (room: any, index: number) => {
      console.log("BEFORE HOTEL");
      console.log(room);
      let newRoom = Room.create(room);
      // @ts-ignore
      newRoom.hotel = bunchaHotels[0];
      newRoom.roomNumber = (index + 1).toString();
      console.log("WITH HOTEL");
      console.log(newRoom);

      let { reserved } = newRoom;

      if (reserved) {
        let myReservations = await saveRelation(reserved, Reservation);
        newRoom.reserved = [...myReservations];
      }

      return await newRoom.save();
    });
  })
  .catch(error => console.error(error));
