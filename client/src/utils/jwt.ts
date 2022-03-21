import { JwtPayload } from 'jsonwebtoken';
import jwtDecode from "jwt-decode"

const JWTManager = () => {
  const LOGOUT_NAME = 'jwt_logout'
  let inMemoryToken: string | null = null
  let refreshTokenTimeoutId: number | null = null
  let userId: number | null = null

  const getToken = () => inMemoryToken

  const getUserId = () => userId

  const setToken = (accessToken: string) => {
    console.log(inMemoryToken)
    inMemoryToken = accessToken

    const decoded = jwtDecode<JwtPayload & { userId: number }>(accessToken)
    userId = decoded.userId
    setRefreshTokenTimeout((decoded.exp as number) - (decoded.iat as number))
    return true
  }

  const abortRefreshToken = () => {
    if (refreshTokenTimeoutId) window.clearTimeout(refreshTokenTimeoutId)
  }

  const deleteToken = async () => {
    inMemoryToken = null
    abortRefreshToken()
    window.localStorage.setItem(LOGOUT_NAME, Date.now.toString())
    return true

  }

  // to logout all taps
  window.addEventListener('storage', e => {
    if (e.key === LOGOUT_NAME) inMemoryToken = null
  })

  // console.log(inMemoryToken)
  const getRefreshToken = async () => {


    try {

      const res = await fetch('http://localhost:5000/refresh_token', { credentials: 'include' })
      const data = await res.json() as { success: boolean, accessToken: string }
      // console.log(data.accessToken)
      setToken(data.accessToken)
      return true
    } catch (error) {
      deleteToken()
      return false
    }


  }



  const setRefreshTokenTimeout = (delay: number) => {
    refreshTokenTimeoutId = window.setTimeout(getRefreshToken, delay * 1000 - 5000)
  }

  return { getToken, setToken, getRefreshToken, deleteToken, getUserId }
}

export default JWTManager()
