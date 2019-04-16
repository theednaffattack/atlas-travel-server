import casual from "casual";
import { Hotel } from "../../entity/Hotel";
import { User } from "../../entity/User";

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
casual.define("hotel", function() {
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

casual.define("review", async function() {
  let hotelArray = await Hotel.find();
  let userArray = await User.find();
  return {
    // id: casual.integer(0, 1000000000000000).toString(),
    value: casual.double(1, 5),
    hotelId: hotelArray[casual.integer(0, hotelArray.length - 1)],
    userId: userArray[casual.integer(0, userArray.length - 1)],
    text: casual.description,
    title: casual.title,
    date: new Date().toUTCString()
  };
});

// Pass generator key as callback
// in this case the generator we registered
export const array_of = function(times: number, genKey: string) {
  //   return new Promise(resolve => {
  const result = [];
  //  let randomImage = `https://source.unsplash.com/random/1024x${casual.integer(760, 800)}`
  for (let i = 0; i < times; ++i) {
    result.push((casual as any)[genKey]);
  }
  // resolve(result);
  return result;
  //   });
};

// generate between 1 and 20 hotels
// const array_of_hotels = array_of(Math.floor(Math.random() * 20) + 4, "hotel");
export const array_of_hotels = array_of(300, "hotel");

export const make_array_of = (num: number, entityName: string) =>
  array_of(num, entityName);

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
