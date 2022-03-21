import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../contexts/ContextAuth"
import { useLoginMutation } from "../generated/graphql"
import JWTManager from '../utils/jwt'

const Login = () => {

  const { setIsAuthenticated } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [login] = useLoginMutation()

  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await login({
      variables: { loginInput: { password, email } }
    })

    if (res.data?.login.success) {
      JWTManager.setToken(res.data.login.accessToken as string)
      setIsAuthenticated(true)
      navigate('..')
    } else {
      if (res.data?.login.message) setError(res.data?.login.message)
    }

  }


  return (
    <>
      {error && <h3 style={{ color: "red" }} > {error}</h3>}
      <form style={{ marginTop: 16 }} onSubmit={onSubmit} >

        <input type="text" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </>
  )
}

export default Login