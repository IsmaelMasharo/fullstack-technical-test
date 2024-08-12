import { useState, useEffect } from "react"
import { Paper, Title, Button, Card, Alert, Select, Group } from "@mantine/core"
import { useForm } from "@mantine/form"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Adoptions, Adopters, Volunteers, Animals } from "../api/shelterApi"
import { useParams, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { ROLES } from "../helpers/constants"
import { User } from "./UserForm"
import { Animal } from "./AnimalForm"

type AdoptionStatus = "pending_adoption" | "adopted" | string | null

export interface Adoption {
  id: number
  animal: string
  adopter: string
  volunteer: string
  animal_id: string
  adopter_id: string
  volunteer_id: string
  status: AdoptionStatus
}

interface SelectOption {
  value: string
  label: string
}

const initialValues: Adoption = {
  id: 0,
  animal: "",
  adopter: "",
  volunteer: "",
  animal_id: "",
  adopter_id: "",
  volunteer_id: "",
  status: "pending_adoption",
}

const Adoption = () => {
  const axiosPrivate = useAxiosPrivate()
  const [error, setError] = useState(null)
  const [adopters, setAdopters] = useState<SelectOption[]>([])
  const [volunteers, setVolunteers] = useState<SelectOption[]>([])
  const [animals, setAnimals] = useState<SelectOption[]>([])
  const { auth } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = auth?.role === ROLES.Admin
  const form = useForm<Adoption>({
    initialValues,
    validate: {
      adopter_id: (value) => (value !== "" ? null : "Adopter is required"),
      animal_id: (value) => (value !== "" ? null : "Animal is required"),
    },
  })

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (id === undefined) return
      try {
        const response = await axiosPrivate.get(Adoptions.get(id))
        const formData = {
          ...response.data,
          animal_id: response.data.animal_id.toString(),
          adopter_id: response.data.adopter_id.toString(),
          volunteer_id: response.data.volunteer_id?.toString(),
        }
        form.setValues(formData)
        setAnimals([{ value: formData.animal_id, label: formData.animal }])
        setAdopters([{ value: formData.adopter_id, label: formData.adopter }])
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }

    fetchAdoptions()
  }, [id])

  useEffect(() => {
    if (isAdmin) {
      const fetchAdoptionFormData = async () => {
        try {
          const adopters = await axiosPrivate.get(Adopters.list)
          const volunteers = await axiosPrivate.get(Volunteers.list)
          const animals = await axiosPrivate.get(Animals.list)
          setAdopters(
            adopters.data.map((adopter: User) => ({
              value: adopter.id.toString(),
              label: adopter.username,
            }))
          )
          setVolunteers(
            volunteers.data.map((volunteer: User) => ({
              value: volunteer.id.toString(),
              label: volunteer.username,
            }))
          )
          setAnimals(
            animals.data.map((animal: Animal) => ({
              value: animal.id.toString(),
              label: animal.name,
            }))
          )
        } catch (error) {
          console.error("Error fetching adopters or animals:", error)
        }
      }

      fetchAdoptionFormData()
    }
  }, [id])

  const handleStatusUpdate = async () => {
    if (id === undefined) return
    try {
      const endpoint = Adoptions.updateStatus(id)
      await axiosPrivate.patch(endpoint, { status: form.values.status })
      alert("Status successfully updated.")
    } catch (err) {
      alert("Failed to update status.")
    }
  }

  const createAdoption = async () => {
    try {
      await axiosPrivate.post(Adoptions.create, form.values)
      alert("Created successfully.")
      navigate("/adoptions")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const updateAdoption = async () => {
    if (id === undefined) return
    try {
      await axiosPrivate.patch(Adoptions.update(id), form.values)
      alert("Updated successfully.")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const deleteAdoption = async () => {
    if (id === undefined) return
    try {
      await axiosPrivate.delete(Adoptions.delete(id))
      navigate("/adoptions")
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
        Adoption
      </Title>
      <Card withBorder shadow="sm" px="xl" mb="md">
        <Select
          label="Animal"
          mb="sm"
          readOnly={!isAdmin}
          {...form.getInputProps("animal_id")}
          data={animals}
        />
        <Select
          label="Adopter"
          mb="sm"
          readOnly={!isAdmin}
          {...form.getInputProps("adopter_id")}
          data={adopters}
        />
        {isAdmin && (
          <Select
            label="Volunteer"
            mb="sm"
            required
            readOnly={!isAdmin}
            {...form.getInputProps("volunteer_id")}
            data={volunteers}
          />
        )}
        <Select
          label="Status"
          required
          {...form.getInputProps("status")}
          data={[
            { value: "pending_adoption", label: "Pending" },
            { value: "adopted", label: "Adopted" },
          ]}
        />
        {isAdmin ? (
          id === undefined ? (
            <Button mt="md" onClick={createAdoption} disabled={!form.isValid()}>
              Create
            </Button>
          ) : (
            <Group grow>
              <Button mt="md" onClick={updateAdoption}>
                Update
              </Button>
              <Button color="red" mt="md" onClick={deleteAdoption}>
                Delete
              </Button>
            </Group>
          )
        ) : (
          <Button mt="sm" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        )}
      </Card>
    </Paper>
  )
}

export default Adoption
