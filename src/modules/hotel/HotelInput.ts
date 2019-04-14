import { Field, InputType } from "type-graphql";
// import { Photo } from "src/entity/Photo";
import { Photo } from "../../entity/Photo";

@InputType()
export class PhotoInput {
  @Field()
  uri: string;
  @Field()
  name: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  isPublished?: boolean;
}

@InputType()
export class HotelInput {
  @Field()
  name: string;

  @Field(() => PhotoInput, { nullable: true })
  photos: Photo[];

  @Field()
  price: string;

  @Field({ nullable: true })
  loveCount: number;

  @Field({ nullable: true })
  commentCount: number;

  @Field({ nullable: true })
  weatherIconName: string;

  @Field({ nullable: true })
  distanceKm: string;

  @Field({ nullable: true })
  temperature: string;

  @Field({ nullable: true })
  weatherDescription: string;
}
