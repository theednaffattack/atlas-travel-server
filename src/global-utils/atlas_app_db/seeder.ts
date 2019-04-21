import { createConnection } from "typeorm";

const ormconfig = require("../../../ormconfig.json");

// @ts-ignore
import {
  // make_array_of,
  // array_of_reviews_with_entities,
  // udpate_hotels_with_review_entities,
  array_of_reviews_with_entities
  // array_of,
  // array_of_reviews,
  // array_of_sub_arrays
} from "./seed";
import { Hotel } from "../../entity/Hotel";
import { Photo } from "../../entity/Photo";
import { User } from "../../entity/User";
import { Review } from "../../entity/Review";

async function savePhotos(photoEntitiesToSave: any[]) {
  return await Promise.all(
    photoEntitiesToSave.map(async (photoInfo: any) => {
      return await Photo.create(photoInfo).save();
    })
  );
}

// @ts-ignore
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
// @ts-ignore
// async function saveReviews(reviewArray: any[]) {
//   return Promise.all(
//     reviewArray.map(async (reviewInfo, index) => {
//       let review = await Review.create(reviewInfo);
//       review.user = [...myPhotos];
//       review.hotel = [...myPhotos];
//       return await review.save();
//     })
//   );
// }

// @ts-ignore
async function saveUsers(userArray: any[]) {
  console.log("userArray");
  console.log(userArray);
  return Promise.all(
    userArray.map(async userInfo => {
      console.log("userInfo");
      console.log(userInfo);
      return await User.create(userInfo).save();
    })
  );
}
// @ts-ignore
async function saveReviews(reviewArray: any[]) {
  console.log("userArray");
  console.log(reviewArray);
  return Promise.all(
    reviewArray.map(async reviewInfo => {
      console.log("reviewInfo");
      console.log(reviewInfo);
      return await Review.create(reviewInfo).save();
    })
  );
}

createConnection(ormconfig)
  .then(async () => {
    // await saveHotels(make_array_of(25, "hotel"));

    // await saveUsers(make_array_of(300, "user"));
    // console.log("saveUsers: ", await saveUsers(await make_array_of(2, "user")));

    // console.log(array_of_reviews);
    // console.log(await array_of(2, "hotel"));
    // let hotelArray = await Hotel.find();
    // let userArray = await User.find();
    // put to more make array calls here sending in an array of users and hotels

    // async function MakeMyStuff() {

    // let hotelArray = await Hotel.find();
    // let userArray =

    // await saveUsers(await make_array_of(300, "user"));

    // let hotelArray = await saveHotels(await make_array_of(300, "hotel"));
    let getTheHotels = await Hotel.find({ relations: ["reviews"] });

    return await Promise.all(
      getTheHotels.map(async hotel => {
        await array_of_reviews_with_entities(450, hotel.id, 0);
      })
    );

    // await udpate_hotels_with_review_entities();

    // let realUsers = await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(User)
    //   .values(userArray)
    //   .execute();

    // let realHotels = await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Hotel)
    //   .values(hotelArray)
    //   .execute();

    // @ts-ignore
    // let reviewArray = await array_of_sub_arrays(
    //   // 300,
    //   "review",
    //   hotelArray,
    //   userArray
    // );

    // await saveReviews(await reviewArray);
    // }
  })
  .catch(error => console.log(error));
