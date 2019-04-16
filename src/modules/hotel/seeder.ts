import { make_array_of } from "./seed";
import { Hotel } from "../../entity/Hotel";
import { Photo } from "../../entity/Photo";
import { User } from "../../entity/User";
import { createConnection } from "typeorm";
const ormconfig = require("../../../ormconfig.json");

async function savePhotos(photoEntitiesToSave: any[]) {
  return await Promise.all(
    photoEntitiesToSave.map(async (photoInfo: any) => {
      return await Photo.create(photoInfo).save();
    })
  );
}

async function saveHotels(hotelArray: any[]) {
  return Promise.all(
    hotelArray.map(async hotelInfo => {
      let { photos } = hotelInfo;

      let myPhotos = await savePhotos(photos);
      let hotel = await Hotel.create(hotelInfo);
      hotel.photos = [...myPhotos];
      return await hotel.save();
    })
  );
}

createConnection(ormconfig)
  .then(async () => {
    await saveHotels(make_array_of(25, "hotel"));

    // let hotelArray = await Hotel.find();
    // let userArray = await User.find();
    // put to more make array calls here sending in an array of users and hotels
  })
  .catch(error => console.log(error));
