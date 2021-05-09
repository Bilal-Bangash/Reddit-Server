import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { User } from "./../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";

@InputType() //decorators input types use for arguments
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType() //object types we use for return from mutations
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Username length must be greater than 2",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Password length must be greater than 3",
          },
        ],
      };
    }
    const hashPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      //duplicate user error code is 23505
      if (error.code === "23505" || error.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }
    const validatePassword = await argon2.verify(
      user.password,
      options.password
    );
    if (!validatePassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Invalid Password",
          },
        ],
      };
    }
    return { user };
  }
}
