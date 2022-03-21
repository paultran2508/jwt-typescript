import { Context } from './../core/types/context';
import { createToken, sendRefreshToken } from "./../core/utils/auth";
import { User } from "./../entities/postgres/User";
import { UserResult } from "./types/UserResult";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { RegisterInput } from "./types/RegisterInput";
import argon2 from "argon2";
import { LoginInput } from "./types/LoginInput";

@Resolver()
export class UserController {
  @Query((_return) => [User])
  async users(
    @Ctx() { }: Context
  ): Promise<User[]> {
    // console.log(req.cookies)
    return await User.find();
  }

  @Mutation((_return) => UserResult)
  async register(
    @Arg("registerInput") { email, password, username }: RegisterInput
  ): Promise<UserResult> {
    try {
      const existingUser = await User.findOne({ email });

      if (existingUser)
        return {
          code: 402,
          message: "Email already exits",
          success: false,
        };
      if (password.length < 6)
        return {
          code: 402,
          message: "password less than 6 characters",
          success: false,
        };
      if (
        !email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      )
        return {
          code: 402,
          message: "Email format incorrect",
          success: false,
        };
      const newUser = await User.create({
        email,
        password: await argon2.hash(password),
        username: username
          ? username
          : email.substring(0, email.lastIndexOf("@")),
      }).save();

      return {
        code: 200,
        message: "Register success fully",
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        message: "Interval error server",
        success: false,
      };
    }
  }

  @Mutation((_return) => UserResult)
  async login(
    @Arg("loginInput") { email, password }: LoginInput,
    @Ctx() { res }: Context
  ): Promise<UserResult> {
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return {
          code: 400,
          message: "Email notfound ",
          success: false,
        };

      if (await argon2.verify(existingUser.password, password as string)) {

        sendRefreshToken(res, existingUser)
        return {
          code: 200,
          message: "Login in successfully",
          success: true,
          user: existingUser,
          accessToken: createToken('accessToken', existingUser),
        };
      }
      return {
        code: 400,
        message: "Password not match",
        success: false,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        message: "Interval error server",
        success: false,
      };
    }
  }

  @Mutation(_return => UserResult)
  async logout(
    @Arg('userId', _type => ID) userId: number,
    @Ctx() { res }: Context
  ): Promise<UserResult> {
    const existingUser = await User.findOne(userId)
    if (!existingUser) return {
      code: 400,
      success: false,
      message: "not found token userID"
    }

    existingUser.tokenVersion += 1
    await existingUser.save()
    res.clearCookie(process.env.REFRESH_COOKIE_TOKEN as string, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/refresh_token'
    })

    return {
      code: 200,
      success: true,
      message: "logout fully"
    }
  }

}
