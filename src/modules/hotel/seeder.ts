import { make_array_of } from "./seed";
import { Hotel } from "../../entity/Hotel";
import { Photo } from "../../entity/Photo";
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
    await saveHotels(make_array_of(25));
  })
  .catch(error => console.log(error));
