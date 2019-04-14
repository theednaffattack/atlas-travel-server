import {
  Resolver,
  Mutation,
  Arg,
  ClassType,
  InputType,
  Field
} from "type-graphql";

import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { Product } from "../../entity/Product";

function createBaseResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    // @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    // async getAll(@Arg("first", () => Int) first: number): Promise<T[]> {
    //   return this.items.slice(0, first);
    // }

    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      // @todo: add hashing of password
      return entity.create(data).save();
    }
  }

  return BaseResolver;
}

@InputType()
class ProductInput {
  @Field()
  name: string;
}

const BaseCreateUserResolver = createBaseResolver(
  "User",
  User,
  RegisterInput,
  User
);

const BaseCreateProductResolver = createBaseResolver(
  "Product",
  Product,
  ProductInput,
  Product
);

@Resolver(() => User)
export class CreateUserResolver extends BaseCreateUserResolver {
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}

@Resolver()
export class CreateProductResolver extends BaseCreateProductResolver {
  //   @Mutation(() => User)
  //   async createUser(@Arg("data") data: RegisterInput) {
  //     // @todo: add hashing of password
  //     return User.create(data).save();
  //   }
}
// mutation Register($data: RegisterInput!){
//     register(data: $data){
//       id
//       firstName
//       lastName
//       email
//       name
//     }
//   }
