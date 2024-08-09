import { useState, useEffect, FC } from "react"
import { Paper, Title, TextInput, Loader, Card, Alert } from "@mantine/core"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Role } from "../context/AuthProvider"
import { ROLES } from "../helpers/constants"
import { Volunteers, Adopters } from "../api/shelterApi"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  status: string
}

const UsersPage: FC<{ role: Role }> = ({ role }) => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const endpoint =
          role === ROLES.Adopter ? Adopters.list : Volunteers.list
        const response = await axiosPrivate.get(endpoint)
        setUsers(response.data)
      } catch (err) {
        setError("Error fetching users.")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [role])

  if (loading) return <Loader size="lg" />
  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        {role === ROLES.Adopter ? "Adopters" : "Volunteers"}
      </Title>
      {users.map((user) => (
        <Card key={user.id} withBorder shadow="sm" px="xl" mb="md">
          <TextInput
            label="Username"
            value={user.username}
            mb="sm"
            disabled={true}
          />
          <TextInput
            label="First Name"
            value={user.first_name}
            mb="sm"
            disabled={true}
          />
          <TextInput
            label="Last Name"
            value={user.last_name}
            mb="sm"
            disabled={true}
          />
          <TextInput label="Email" value={user.email} mb="sm" disabled={true} />
          <TextInput
            label="Status"
            value={user.status}
            mb="sm"
            disabled={true}
          />
        </Card>
      ))}
    </Paper>
  )
}

export default UsersPage
