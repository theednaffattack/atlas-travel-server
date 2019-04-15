import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Photo } from "./Photo";
import { Rate } from "../modules/hotel/Rate";

@ObjectType()
@Entity()
export class Hotel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => Photo, { nullable: true })
  @OneToMany(() => Photo, photo => photo.hotel)
  photos?: Photo[];

  @Field()
  @Column()
  price: string;

  // @ts-ignore
  @Field(type => [Rate], { nullable: true })
  ratings?: Rate[];

  @Field({ nullable: true })
  @Column({ default: 0 })
  loveCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
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
