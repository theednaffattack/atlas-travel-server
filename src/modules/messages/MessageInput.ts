import { Field, ObjectType, ArgsType } from "type-graphql";
// import { Photo } from "src/entity/Photo";
// import { Photo } from "../../entity/Photo";

@ArgsType()
export class MessageInput {
  // @ts-ignore
  @Field(type => String)
  message: string;
}

@ObjectType()
export class MessageOutput {
  @Field()
  message: string;
}
