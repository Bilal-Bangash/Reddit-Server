import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
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

  // create post
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    //typescript type Promise<Post>
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  // update post
  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    //typescript type Promise<Post>

    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }
}
