import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Hotel } from "./Hotel";
import { Reservation } from "./Reservation";

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  roomNumber: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  beds: number;

  @Field()
  @Column()
  maxOccupancy: number;

  @Field()
  @Column()
  costPerNight: number;

  // @ts-ignore
  @Field(type => [Reservation], { nullable: true })
  @OneToMany(() => Reservation, reservation => reservation.room)
  reserved?: Reservation[];

  // @ts-ignore
  @Field(type => Hotel)
  @ManyToOne(() => Hotel, hotel => hotel.rooms, { cascade: true })
  hotel: Hotel;
}
