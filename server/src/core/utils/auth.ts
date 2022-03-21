import { Response } from 'express';
import { Secret, sign } from "jsonwebtoken";
import { User } from "./../../entities/postgres/User";
export const createToken = (type: 'accessToken' | 'refreshToken', user: User) => {
  return sign(
    {
      userId: user.id,
      ...(type === 'refreshToken' ? { tokenVersion: user.tokenVersion } : {})
    },
    type === 'accessToken' ?
      process.env.TOKEN_SECRET as Secret : process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: type === 'accessToken' ? '10s' : "60m",
    }
  );
};

export const sendRefreshToken = (res: Response, user: User) => {
  // console.log(process.env.REFRESH_COOKIE_TOKEN)
  res.cookie(process.env.REFRESH_COOKIE_TOKEN as string, createToken('refreshToken', user), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/refresh_token'
  })
}
