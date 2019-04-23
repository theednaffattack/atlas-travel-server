import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Room } from "./Room";
import { User } from "./User";

@ObjectType("Reservation", { description: "The reservation model" })
@Entity()
export class Reservation extends BaseEntity {
  // @ts-ignore
  @Field(type => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // @ts-ignore
  @Field(type => Date)
  @Column()
  from: Date;

  // @ts-ignore
  @Field(type => Date)
  @Column()
  to: Date;

  // @ts-ignore
  @Field(type => User)
  // @ts-ignore
  @ManyToOne(type => User, user => user.reservation)
  user: User;

  // @ts-ignore
  @Field(type => Room)
  // @ts-ignore
  @ManyToOne(type => Room, room => room.reserved, { cascade: true })
  room: Room;
}
