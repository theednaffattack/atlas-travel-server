import { Arg, ClassType, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLInt as Int } from "graphql";
// import casual from "casual";

import { Photo } from "../../entity/Photo";
import { Hotel } from "../../entity/Hotel";

// const hotels: any = [
//   {
//     id: `${Math.random()}`,
//     photos: [],
//     name: "New York Art Museum",
//     price: "$554",
//     distanceKm: "257 km",
//     weatherIconName: "sunny",
//     temperature: "25",
//     weatherDescription: "Sunny",
//     loveCount: 4000,
//     commentCount: 766
//   },
//   {
//     id: `${Math.random()}`,
//     photos: [],
//     name: "Hotel St. Martin",
//     price: casual.integer(-1000, 1000).toString(),
//     distanceKm: "34 km",
//     weatherIconName: "cloudy",
//     temperature: "17",
//     weatherDescription: "Cloudy",
//     loveCount: 392,
//     commentCount: 85
//   }
// ];

export function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any,
  objectTypeCls?: T
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    // I should use below for dependency injection at the entity level?
    // for some reason I can't get the Typorm Repository to work. I may need
    // to think about how I'm using the connection manager.
    // constructor(
    //   private photoRepository: Repository<Photo> // dependency injection
    // ) {}
    @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(@Arg("first", () => Int) first: number) {
      console.log(first);
      //Promise<T[]> {
      return await Hotel.find();
    }

    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      let { photos } = data;

      let photoEntitiesToSave = await Promise.all(
        photos.map(async (photoInfo: any) => {
          console.log("TRYING");
          return await Photo.create(photoInfo).save();
        })
      );

      let newEntity = entity.create(data);

      newEntity.photos = [...photoEntitiesToSave];

      return await newEntity.save();
    }
  }

  return BaseResolver;
}
