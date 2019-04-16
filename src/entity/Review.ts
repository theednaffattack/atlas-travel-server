import { ObjectType, Field, Float, ID } from "type-graphql";
import {
  ManyToOne,
  // OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity
} from "typeorm";

import { User } from "./User";
import { Hotel } from "./Hotel";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @ts-ignore
  @Field(type => Float)
  @Column("decimal", { precision: 2, scale: 1 })
  value: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  text: string;

  // @ts-ignore
  @Field(type => User)
  @ManyToOne(() => User, user => user.reviewLikes, { cascade: true })
  likes: User;

  // @ts-ignore
  @Field(type => Date)
  @Column()
  date: Date;

  // @ts-ignore
  @Field(type => User)
  @ManyToOne(() => User, user => user.reviews, { cascade: true })
  user: User;

  // @ts-ignore
  @Field(type => Hotel)
  @ManyToOne(() => Hotel, hotel => hotel.reviews, { cascade: true })
  hotel: Hotel;
}
