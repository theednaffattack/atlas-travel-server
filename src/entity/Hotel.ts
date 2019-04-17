import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { Photo } from "./Photo";
import { Review } from "./Review";
import { Max } from "class-validator";

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

  @Field()
  @Column()
  rooms: number;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  amenities: string[];

  // @ts-ignore
  @Field(type => [Review], { nullable: true })
  @OneToMany(() => Review, review => review.hotel)
  reviews: Review[];

  @Field({ nullable: true })
  @Column({ default: 0 })
  loveCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  commentCount: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  suite: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  city: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  state: string;

  @Field({ nullable: true })
  @Max(5)
  @Column({ nullable: true })
  zipCode: string;

  @Field({ nullable: true })
  @Max(4)
  @Column({ nullable: true })
  zipCodeSuffix: number;

  @Field({ nullable: true })
  weatherIconName: string;

  @Field({ nullable: true })
  distanceKm: string;

  @Field({ nullable: true })
  temperature: string;

  @Field({ nullable: true })
  weatherDescription: string;
}
