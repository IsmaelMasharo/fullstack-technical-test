import { useState, useEffect } from "react"
import { Paper, Title, Alert, Table, Group, Button } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Adoptions } from "../api/shelterApi"
import { Adoption } from "./AdoptionForm"
import useAuth from "../hooks/useAuth"
import { ROLES } from "../helpers/constants"

const AdoptionPage = () => {
  const axiosPrivate = useAxiosPrivate()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [error, setError] = useState(null)
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const endpoint = Adoptions.list
        const response = await axiosPrivate.get(endpoint)
        setAdoptions(response.data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }

    fetchAdoptions()
  }, [auth.role])

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Group mb="md" justify="space-between">
        <Title order={2}>Adoptions</Title>
        {auth.role === ROLES.Admin && (
          <Button onClick={() => navigate("/adoptions/create")}>
            New Adoption
          </Button>
        )}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Id</Table.Th>
              <Table.Th>Animal</Table.Th>
              <Table.Th>Adopter</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {adoptions.map((adoption) => (
              <Table.Tr key={adoption.id}>
                <Table.Td>
                  <Link to={`/adoptions/${adoption.id}`}>{adoption.id}</Link>
                </Table.Td>
                <Table.Td>{adoption.animal}</Table.Td>
                <Table.Td>{adoption.adopter}</Table.Td>
                <Table.Td>{adoption.status}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}

export default AdoptionPage
