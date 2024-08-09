import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  Button,
  TextInput,
  Loader,
  Card,
  Alert,
} from "@mantine/core"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import useAuth from "../hooks/useAuth"

interface Animal {
  id: number
  name: string
  age: number
  breed: string
  type: string
  status: string
}

// ListAnimals Component
const ListAnimals = () => {
  const axiosPrivate = useAxiosPrivate()
  const {
    auth: { role },
  } = useAuth()

  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<null | string>(null)

  const fetchAnimals = async () => {
    try {
      const endpoint =
        role === "adopter"
          ? "/api/animals/available_for_adoption/"
          : "/api/animals/"
      const response = await axiosPrivate.get(endpoint)
      setAnimals(response.data)
    } catch (err) {
      setError("Error fetching animals.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAnimals()
  }, [])

  const handleRequestAdoption = async (animalId: number) => {
    try {
      await axiosPrivate.post(`/api/animals/${animalId}/request_adoption/`)
      fetchAnimals()
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  if (loading) return <Loader size="lg" />
  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Animals
      </Title>
      {animals.map((animal) => (
        <Card key={animal.id} withBorder shadow="sm" px="xl" mb="md">
          <TextInput label="Name" value={animal.name} mb="sm" disabled={true} />
          <TextInput label="Age" value={animal.age} mb="sm" disabled={true} />
          <TextInput
            label="Breed"
            value={animal.breed}
            mb="sm"
            disabled={true}
          />
          <TextInput label="Type" value={animal.type} mb="sm" disabled={true} />
          {role === "adopter" && (
            <Button mt="md" onClick={() => handleRequestAdoption(animal.id)}>
              Adopt
            </Button>
          )}
        </Card>
      ))}
    </Paper>
  )
}

const Dashboard = () => {
  return <ListAnimals />
}

export default Dashboard
