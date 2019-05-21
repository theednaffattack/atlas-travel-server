// import { PubSubEngine } from "graphql-subscriptions";

import {
  Mutation,
  Publisher,
  PubSub,
  Subscription,
  Root,
  Args,
  Resolver,
  ResolverFilterData
} from "type-graphql";

// import { MessageInput, MessageOutput } from "./MessageInput";
import { MessageInput } from "./MessageInput";
import { Message } from "../../entity/Message";
import { User } from "../../entity/User";
import { MessageSubType, MessagePayload } from "./message.type";

@Resolver()
export class MessageResolver {
  // @ts-ignore
  @Subscription(type => MessageSubType, {
    topics: "MESSAGES",

    filter: ({
      payload,
      args
    }: ResolverFilterData<MessagePayload, MessageInput>) => {
      console.log("INSIDE SUBSCRIPTIONS FILTER");
      console.log(payload);
      console.log(args);
      //   return payload.recipeId === args.recipeId;
      return true;
    }
    // filter: ({ payload, args }) => args.priorities.includes(payload.priority),
  })
  newMessage(
    @Root() messagePayload: MessagePayload,
    // @ts-ignore
    @Args(type => MessageInput) input: MessageInput
  ): MessageSubType {
    // do some stuff
    console.log("I'M TYING TO UPDATE THE SUBSCRIPTION");

    console.log(messagePayload);
    // console.log(input);
    return {
      ...messagePayload,
      createdAt: new Date()
    };
  }

  // @ts-ignore
  @Mutation(type => Boolean)
  async addNewMessage(
    // @ts-ignore
    @PubSub("MESSAGES") publish: Publisher<NotificationPayload>,
    // @ts-ignore
    @Args(type => MessageInput) input: MessageInput
  ): Promise<boolean> {
    // Promise<boolean>

    const receiver = await User.findOne({
      where: {
        id: "00a33f72-4a23-4753-a607-d98aaaed69f9"
      }
    });

    // "00a33f72-4a23-4753-a607-d98aaaed69f9"
    // "00840864-fa70-4b19-968a-0421b77b2074"

    const fullMessageInput = {
      createdAt: new Date(),
      updatedAt: new Date(),
      message: input.message,
      sentBy: "00840864-fa70-4b19-968a-0421b77b2074", // (Jamey.Cassin@Eloise.org: Aisha Stanton) //SENDING User,
      user: receiver // (Reinger_Keaton@yahoo.com: Candelario Johnson) THE USER BEING SENT TO
    };

    const newMessage = await Message.create(fullMessageInput).save();

    console.log(newMessage);
    // here we can trigger subscriptions topics
    await publish(newMessage);

    // this should return a boolean? Not sure if that's just the example
    // best practice
    // return true;
    return true;
  }
}
