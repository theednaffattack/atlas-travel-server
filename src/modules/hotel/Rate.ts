import { ObjectType, Field, Int } from "type-graphql";
import { User } from "../../entity/User";

@ObjectType()
export class Rate {
  // @ts-ignore
  @Field(type => Int)
  value: number;

  @Field()
  date: Date;

  user: User;
}
