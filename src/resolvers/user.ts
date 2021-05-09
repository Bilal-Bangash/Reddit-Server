import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import { User } from "./../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";

@InputType() //decorators
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    const hashPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashPassword,
    });
    await em.persistAndFlush(user);
    return user;
  }
}
