import { useState, useEffect } from "react"
import {
  Button,
  TextInput,
  Card,
  Select,
  Alert,
  Paper,
  Title,
  Group,
} from "@mantine/core"
import { useParams, useNavigate } from "react-router-dom"
import { isAxiosError } from "axios"
import useAuth from "../hooks/useAuth"
import { ROLES } from "../helpers/constants"
import { Animals } from "../api/shelterApi"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useForm } from "@mantine/form"

type AnimalType = "dog" | "cat"

export interface Animal {
  id: number
  name: string
  age: number
  breed: string
  type: AnimalType
  status: string
}

const initialValues: Animal = {
  id: 0,
  name: "",
  age: 0,
  breed: "",
  type: "dog",
  status: "awaiting_adoption",
}

const Animal = () => {
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState<null | string>(null)
  const { auth } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = auth?.role === ROLES.Admin
  const form = useForm<Animal>({ initialValues })

  useEffect(() => {
    const fetchAnimal = async () => {
      if (id === undefined) return
      try {
        const endpoint = Animals.get(id)
        const response = await axiosPrivate.get(endpoint)
        form.setValues(response.data)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }
    fetchAnimal()
  }, [id])

  const requestAdoption = async () => {
    if (id === undefined) return
    try {
      const endpoint = Animals.requestAdoption(id)
      await axiosPrivate.post(endpoint)
      alert("Adoption request sent.")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const createAnimal = async () => {
    try {
      const endpoint = Animals.create
      await axiosPrivate.post(endpoint, form.values)
      alert("Created successfully.")
      navigate("/animals")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const updateAnimal = async () => {
    if (id === undefined) return
    try {
      const endpoint = Animals.update(id)
      await axiosPrivate.patch(endpoint, form.values)
      alert("Updated successfully.")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const deleteAnimal = async () => {
    if (id === undefined) return
    try {
      const endpoint = Animals.delete(id)
      await axiosPrivate.delete(endpoint)
      navigate("/animals")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Animal
      </Title>
      <Card withBorder shadow="sm" px="xl" mb="md">
        <TextInput
          label="Name"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Age"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("age")}
        />
        <TextInput
          label="Breed"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("breed")}
        />
        <Select
          label="Type"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("type")}
          data={[
            { value: "dog", label: "Dog" },
            { value: "cat", label: "Cat" },
          ]}
        />
        {auth.role === ROLES.Adopter && (
          <Button mt="md" onClick={() => requestAdoption()}>
            Request Adoption
          </Button>
        )}
        {isAdmin ? (
          id === undefined ? (
            <Button mt="md" onClick={() => createAnimal()}>
              Create
            </Button>
          ) : (
            <Group grow>
              <Button mt="md" onClick={() => updateAnimal()}>
                Update
              </Button>
              <Button color="red" mt="md" onClick={() => deleteAnimal()}>
                Delete
              </Button>
            </Group>
          )
        ) : (
          <></>
        )}
      </Card>
    </Paper>
  )
}

export default Animal
