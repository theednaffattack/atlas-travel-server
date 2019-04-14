import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne
} from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { PhotoMetadata } from "./PhotoMetadat";
import { Hotel } from "./Hotel";

@ObjectType()
@Entity()
export class Photo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  uri: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ default: false, nullable: true })
  isPublished: boolean;

  @OneToOne(() => PhotoMetadata, metadata => metadata.photo, { cascade: true })
  metadata: PhotoMetadata;

  @ManyToOne(() => Hotel, hotel => hotel.photos)
  hotel: Hotel;
}
