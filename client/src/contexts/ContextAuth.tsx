import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useState } from "react"
import jwt from "../utils/jwt"

interface IAuthContext {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  checkAuth: Function,
  logoutClient: Function
}

const defaultIsAuthenticated = false

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => { },
  checkAuth: () => { return Promise.resolve() },
  logoutClient: () => { }
})

export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = (props: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultIsAuthenticated)
  const checkAuth = useCallback(async () => {
    const token = jwt.getToken()
    // console.log(token)
    if (token) setIsAuthenticated(true)
    else {
      const success = await jwt.getRefreshToken()
      if (success) setIsAuthenticated(true)
    }

  }, [])

  const logoutClient = () => {
    jwt.deleteToken()
    setIsAuthenticated(false)
  }

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient
  }



  return <AuthContext.Provider value={authContextData}>
    {props.children}
  </AuthContext.Provider>
}