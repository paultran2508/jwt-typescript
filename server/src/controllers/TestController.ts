import { User } from "./../entities/postgres/User";
import { Context } from "./../core/types/context";
import { checkAuth } from "../middleware/checkAuth";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

@Resolver()
export class TestController {
  @Query((_return) => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() { user, req }: Context): Promise<string> {

    console.log(req.cookies)
    const existingUser = await User.findOne(user.userId);

    return "hello  " + existingUser?.username;
  }
}
