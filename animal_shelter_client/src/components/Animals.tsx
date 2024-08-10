import { useState, useEffect } from "react"
import { Paper, Title, Alert, Table, Group, Button } from "@mantine/core"
import { Link, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import useAuth from "../hooks/useAuth"
import { Animals } from "../api/shelterApi"
import { ROLES } from "../helpers/constants"
import { Animal } from "./AnimalForm"

const ListAnimals = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [error, setError] = useState<null | string>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const endpoint =
          auth.role === ROLES.Adopter ? Animals.listAvailable : Animals.list
        const response = await axiosPrivate.get(endpoint)
        setAnimals(response.data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }
    fetchAnimals()
  }, [])

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Group mb="md" justify="space-between">
        <Title order={2}>Animals</Title>
        {auth.role === ROLES.Admin && (
          <Button onClick={() => navigate("/animals/create")}>
            New Animal
          </Button>
        )}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table miw={700}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Age</Table.Th>
              <Table.Th>Breed</Table.Th>
              <Table.Th>Type</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {animals.map((animal) => (
              <Table.Tr key={animal.id}>
                <Table.Td>
                  <Link to={`/animal/${animal.id}`}>{animal.name}</Link>
                </Table.Td>
                <Table.Td>{animal.age}</Table.Td>
                <Table.Td>{animal.breed}</Table.Td>
                <Table.Td>{animal.type}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  )
}

const Dashboard = () => {
  return <ListAnimals />
}

export default Dashboard
