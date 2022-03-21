import { UserAuthPayload } from "./../core/types/UserAuthPayload";
import { Context } from "../core/types/context";
import { MiddlewareFn } from "type-graphql";
import { AuthenticationError } from "apollo-server-core";
import { Secret, verify } from "jsonwebtoken";

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    //authHeader here is Bearer accessToken

    const authHeader = context.req.header("authorization");
    const accessToken = authHeader && authHeader.split(" ")[1];

    if (!accessToken)
      throw new AuthenticationError("Not authenticated to perform operations");
    // console.log(accessToken, process.env.TOKEN_SECRET);

    const decodedUser = verify(
      accessToken,
      process.env.TOKEN_SECRET as Secret
    ) as UserAuthPayload;

    context.user = decodedUser;


    return next();
  } catch (error) {
    throw new AuthenticationError(
      "Interval Error authenticated user" + JSON.stringify(error)
    );
  }
};
