import { useState, useEffect, FC } from "react"
import { Paper, Title, Table, Alert, Group, Button } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Role } from "../context/AuthProvider"
import { ROLES } from "../helpers/constants"
import { Volunteers, Adopters } from "../api/shelterApi"
import { User } from "./UserForm"
import useAuth from "../hooks/useAuth"

const Users: FC<{ role: Role }> = ({ role }) => {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState<User[]>([])
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
      }
    }

    fetchUsers()
  }, [role])

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Group mb="md" justify="space-between">
        <Title order={2}>
          {role === ROLES.Adopter ? "Adopters" : "Volunteers"}
        </Title>
        {auth.role === ROLES.Admin && (
          <Button
            onClick={() =>
              navigate(`/users/create`, { state: { userType: role } })
            }
          >
            New User
          </Button>
        )}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Username</Table.Th>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Link to={`/users/${user.id}`} state={{ userType: role }}>
                    {user.username}
                  </Link>
                </Table.Td>
                <Table.Td>{user.first_name}</Table.Td>
                <Table.Td>{user.last_name}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}

export default Users
