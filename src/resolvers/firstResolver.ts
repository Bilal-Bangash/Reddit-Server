import { Query, Resolver } from "type-graphql";

@Resolver()
export class StarterResolver {
  @Query(() => String)
  starter() {
    return "first resolver test run successfully";
  }
}
