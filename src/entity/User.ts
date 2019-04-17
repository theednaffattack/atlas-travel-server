import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";
import { Review } from "./Review";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // @ts-ignore
  @Field(type => Review, { nullable: true })
  @OneToMany(() => Review, review => review.likes)
  reviewLikes?: [];

  // @ts-ignore
  @Field(type => [Review], { nullable: true })
  @OneToMany(() => Review, review => review.user)
  reviews?: Review[];

  @Column()
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;
}
