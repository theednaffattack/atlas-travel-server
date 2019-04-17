import casual from "casual";
import { Review } from "../../entity/Review";
import { Hotel } from "../../entity/Hotel";
import { User } from "../../entity/User";
// import { Hotel } from "../../entity/Hotel";
// import { User } from "../../entity/User";
// import bcrypt from "bcryptjs";
// import { Hotel } from "src/entity/Hotel";
// import { Review } from "../../entity/Review";

// const museum_photo = "../../static/images/discover/cards/ny_art_museum.png";
// const hotel_photo = "../../static/images/discover/cards/hotel_table.png";

casual.define("midPrice", function() {
  return casual.integer(250, 800).toString();
});

// Pass generator as callback
var array_of_unsplash = function(times: any) {
  var result = [];
  //  let randomImage = `https://source.unsplash.com/random/1024x${casual.integer(760, 800)}`
  for (var i = 0; i < times; ++i) {
    result.push({
      uri: `https://source.unsplash.com/random/1024x${casual.integer(
        760,
        800
      )}`,
      name: `random-${i}`
    });
  }

  return result;
};

// define a fake data generator
casual.define("hotel", async function() {
  let getPhotos = array_of_unsplash(Math.floor(Math.random() * 6) + 1);
  return {
    // id: casual.integer(0, 1000000000000000).toString(),
    photos: getPhotos,
    address: casual.address1,
    suite: casual.address2,
    city: casual.city,
    rooms: casual.integer(25, 150),
    state: casual.state_abbr,
    zipCode: casual.zip,
    zipCodeSuffix: casual.integer(1000, 9999),
    name: `Hotel ${casual.last_name}`,
    price: casual.integer(250, 800).toString(),
    weatherIconName: casual.random_element(["sunny", "cloudy", "rain"]),
    distanceKm: `${casual.integer(1, 30)}Km`,
    temperature: `${casual.integer(15, 25)}°`,
    weatherDescription: casual.random_element(["Sunny", "Cloudy", "Rain"]),
    loveCount: casual.integer(3, 900),
    commentCount: casual.integer(4, 30)
  };
});

type ReviewKinda = {
  value: number;
  hotelId: string | null;
  userId: string | null;
  text: string;
  title: string;
  date: string;
};

casual.define("review", async function(): Promise<ReviewKinda> {
  return {
    // id: casual.integer(0, 1000000000000000).toString(),
    value: casual.double(1, 5),
    hotelId: null,
    userId: null,
    text: casual.description,
    title: casual.title,
    date: new Date().toUTCString()
  };
});

casual.define("user", async function() {
  return {
    // id: casual.integer(0, 1000000000000000).toString(),
    password: `testLoad`,
    firstName: casual.first_name,
    lastName: casual.last_name,
    email: casual.email,
    confirmed: true
  };
});

export const array_of_reviews_with_entities = async function(
  times: number,
  hotelId: string,
  skip?: number
) {
  const queryObject = {
    skip: skip ? skip : 0,
    take: times
  };
  const lottaUsers = await User.find(queryObject);
  const result = [];
  //  let randomImage = `https://source.unsplash.com/random/1024x${casual.integer(760, 800)}`
  for (let i = 0; i < times; ++i) {
    result.push(
      await Review.create({
        // id: casual.integer(0, 1000000000000000).toString(),
        value: casual.double(1, 5),
        hotel: await Hotel.findOne({ where: { id: hotelId } }),
        user: lottaUsers[i],
        text: casual.description,
        title: casual.title,
        date: new Date().toUTCString()
      }).save()
    );
  }
  // resolve(result);
  return await Promise.all(result);
};

export const udpate_hotels_with_review_entities = async function() {
  const allReviews = await Review.find({ relations: ["hotel", "user"] });
  // loop over them and insert them into the correct hotel
  // console.log(allReviews);
  allReviews.map(async review => {
    // console.log(review);
    let theHotel = await Hotel.findOne({
      where: { id: review.hotel.id },
      relations: ["reviews"]
    });
    // console.log(theHotel[0]);
    if (theHotel) {
      theHotel.reviews.push(review);
      await theHotel.save();
      return;
    }

    console.error("Error:\nCould not find the hotel in the DB");
  });
};

export const udpate_users_with_review_entities = async function() {};

// Pass generator key as callback
// in this case the generator we registered
export const array_of = async function(times: number, genKey: string) {
  //   return new Promise(resolve => {
  const result = [];
  //  let randomImage = `https://source.unsplash.com/random/1024x${casual.integer(760, 800)}`
  for (let i = 0; i < times; ++i) {
    result.push((casual as any)[genKey]);
  }
  // resolve(result);
  return await Promise.all(result);
  //   });
};

// Pass generator key as callback
// in this case the generator we registered
export const array_of_sub_arrays = async function(
  // times: number,
  genKey: string,
  arrayOfIds1: any[],
  arrayOfIds2: any[]
) {
  //   return new Promise(resolve => {
  console.log(genKey);
  // let bunchaUsers = arrayOfIds2.slice(0, times);
  const result: any[] = [];

  // hotels
  await arrayOfIds1.map(async hotel => {
    console.log("HOTEL");
    console.log(hotel);
    // bunchaUsers.map(async user => {

    let saveHotel = await Hotel.findOne({ where: { id: hotel.id } });

    await arrayOfIds2.map(async user => {
      let saveUser = await User.findOne({ where: { id: user.id } });
      let newReview = await Review.create({
        // id: casual.integer(0, 1000000000000000).toString(),
        value: casual.double(1, 5),
        hotel: hotel.id, // await Hotel.findOne({ where: { id: hotel.id } }),
        user: user.id, // await User.findOne({ where: { id: user.id } }),
        text: casual.description,
        title: casual.title,
        date: new Date().toUTCString()
      }).save();

      if (saveHotel && saveUser) {
        if (saveHotel.reviews) {
          saveHotel.reviews.push(newReview);
          await saveHotel.save();
        }
        if (saveUser.reviews) {
          saveUser.reviews.push(newReview);
          await saveUser.save();
          console.log("SHOULD BE DONE");
        }
        console.log("SAVE HOTEL & SAVE USER APPEAR TO BE UNDEFINED");

        return;
      }
    });
    return;
    // });
  });
  //  let randomImage = `https://source.unsplash.com/random/1024x${casual.integer(760, 800)}`
  // for (let i = 0; i < times; ++i) {
  //   result.push(await (casual as any)[genKey](arrayOfIds1, arrayOfIds2, i));
  // }
  // resolve(result);
  return await Promise.all(result);
  //   });
};

// generate between 1 and 20 hotels
// const array_of_hotels = array_of(Math.floor(Math.random() * 20) + 4, "hotel");
export const array_of_hotels = array_of(300, "hotel");

export const array_of_users = array_of(300, "user");

// export const array_of_reviews = array_of_sub_arrays(
//   300,
//   "review",
//   array_of_hotels,
//   array_of_users
// );

export const make_array_of = (
  num: number,
  entityName: string
  // hotelArray?: any[],
  // userArray?: any[]
) => array_of(num, entityName);

// console.log(array_of_hotels);

// export const cardInfo: {
//   id: number;
//   photos: string[];
//   name: string;
//   price: string;
//   imageURI: string;
//   weatherIconName: string;
//   distanceKm: string;
//   temperature: string;
//   weatherDescription: string;
//   loveCount: number;
//   commentCount: number;
// }[] = array_of_hotels;
