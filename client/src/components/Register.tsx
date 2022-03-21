import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../generated/graphql"

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register] = useRegisterMutation()
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await register({
      variables: { registerInput: { username, password, email } }
    })
    navigate('..')
  }

  return (
    <form style={{ marginTop: 16 }} onSubmit={onSubmit}>
      <input type="text" value={username} placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="text" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="pass" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  )
}

export default Register