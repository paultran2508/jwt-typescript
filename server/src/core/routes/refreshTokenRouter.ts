import { sendRefreshToken, createToken } from './../utils/auth';
import { User } from './../../entities/postgres/User';
import { UserAuthPayload } from './../types/UserAuthPayload';
import { Secret, verify } from 'jsonwebtoken';
import express from 'express';

const router = express.Router()


router.get('/', async (req, res) => {
  // req.cookies
  // console.log(refreshToken)

  try {
    const refreshToken = req.cookies[process.env.REFRESH_COOKIE_TOKEN as string]

    if (!refreshToken) {
      res.status(401).send({ success: false, message: "not found Cookie" })
      return
    }
    const decodedUser = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload
    const existingUser = await User.findOne(decodedUser.userId)
    if (!existingUser) {
      res.sendStatus(401)
      return
    } else {
      if (!existingUser || existingUser.tokenVersion !== decodedUser.tokenVersion) {
        res.sendStatus(401)
        return

      }
      sendRefreshToken(res, existingUser)
      res.json({
        success: true,
        accessToken: createToken('accessToken', existingUser),

      })
    }
  } catch (error) {
    res.sendStatus(407).json({ success: false, message: "cookie error" })
    return

  }

})

export default router