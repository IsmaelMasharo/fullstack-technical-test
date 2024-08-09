import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  Button,
  Loader,
  Card,
  Alert,
  Select,
  TextInput,
} from "@mantine/core"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Adoptions } from "../api/shelterApi"

type AdoptionStatus = "pending_adoption" | "adopted"

interface Adoption {
  id: number
  animal: string
  adopter: string
  volunteer: string
  status: AdoptionStatus
}

const AdoptionPage = () => {
  const axiosPrivate = useAxiosPrivate()
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [])

  const handleStatusChange = (adoptionId: number, status: AdoptionStatus) => {
    setAdoptions((prevAdoptions) =>
      prevAdoptions.map((adoption) =>
        adoption.id === adoptionId ? { ...adoption, status } : adoption
      )
    )
  }

  const handleUpdate = async (adoptionId: number, status: AdoptionStatus) => {
    try {
      const endpoint = Adoptions.changeStatus(adoptionId)
      await axiosPrivate.post(endpoint, { status })
      alert("Status successfully updated.")
    } catch (err) {
      alert("Failed to update status.")
    }
  }

  if (loading) return <Loader size="lg" />
  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Adoptions
      </Title>

      {adoptions.map((adoption) => (
        <Card key={adoption.id} withBorder shadow="sm" px="xl" mb="md">
          <TextInput
            label="Animal"
            value={adoption.animal}
            mb="sm"
            disabled={true}
          />
          <TextInput
            label="Adopter"
            value={adoption.adopter}
            mb="sm"
            disabled={true}
          />
          <Select
            label="Status"
            value={adoption.status}
            onChange={(status) =>
              handleStatusChange(adoption.id, status as AdoptionStatus)
            }
            data={[
              { value: "pending_adoption", label: "Pending" },
              { value: "adopted", label: "Adopted" },
            ]}
          />
          <Button
            mt="sm"
            onClick={() => handleUpdate(adoption.id, adoption.status)}
          >
            Update Status
          </Button>
        </Card>
      ))}
    </Paper>
  )
}

export default AdoptionPage
