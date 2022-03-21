import { Link, Outlet } from "react-router-dom"
import { useAuthContext } from "../contexts/ContextAuth"
import { useLogoutMutation } from "../generated/graphql"
import jwt from "../utils/jwt"

const Layout = () => {

  const { isAuthenticated, logoutClient, } = useAuthContext()
  const [logoutServer] = useLogoutMutation()

  const onLogout = async () => {
    logoutClient()
    await logoutServer({
      variables: { userId: jwt.getUserId()?.toString() as string }
    })

  }
  return (
    <div>
      <h1>JWT AUTHENTICATION FULL STACK</h1>
      <nav style={{ borderBottom: '1px solid', paddingBottom: '1rem' }}>
        <Link to={'/'}>Home</Link>| <Link to={'/profile'}>Profile</Link>| <Link to={'/login'}>Login</Link> | <Link to={'/register'}>Register</Link>
        {isAuthenticated && <button onClick={onLogout}> |  Logout</button>}
      </nav>
      <Outlet />
    </div>
  )
}

export default Layout

