import { useHelloQuery } from "../generated/graphql"

const Profile = () => {
  const { loading, data, error } = useHelloQuery({
    fetchPolicy: "no-cache"
  })
  // console.log(data?.hello)

  if (loading) return <h3>Loading...</h3>
  if (error) return <h3 style={{ color: 'red' }}>{JSON.stringify(error)}</h3>




  return (
    <h3> {data?.hello}</h3>
  )
}

export default Profile