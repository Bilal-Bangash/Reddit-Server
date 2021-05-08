import { Arg, Ctx, Int, Query, Resolver } from "type-graphql";
import { MyContext } from "src/types";
import { Post } from "./../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post]) //graphql type
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    //typescript type Promise<Post []>
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    //typescript type Promise<Post []>
    return em.findOne(Post, { id });
  }
}
