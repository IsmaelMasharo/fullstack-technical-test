import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  Button,
  TextInput,
  Loader,
  Card,
  Alert,
  Select,
} from "@mantine/core"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import useAuth from "../hooks/useAuth"
import { Animals } from "../api/shelterApi"
import { ROLES } from "../helpers/constants"

interface Animal {
  id: number
  name: string
  age: number
  breed: string
  type: string
  status: string
}

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
        role === ROLES.Adopter ? Animals.listAvailable : Animals.list
      const response = await axiosPrivate.get(endpoint)
      setAnimals(response.data)
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data.detail)
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAnimals()
  }, [])

  const handleRequestAdoption = async (animalId: number) => {
    try {
      const endpoint = Animals.requestAdoption(animalId)
      await axiosPrivate.post(endpoint)
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
          <Select
            label="Type"
            disabled={true}
            value={animal.type}
            data={[
              { value: "dog", label: "Dog" },
              { value: "cat", label: "Cat" },
            ]}
          />
          {role === ROLES.Adopter && (
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
