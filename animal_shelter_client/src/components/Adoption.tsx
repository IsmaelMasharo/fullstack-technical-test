import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  Button,
  Loader,
  Card,
  Alert,
  Select,
} from "@mantine/core"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"

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
        const response = await axiosPrivate.get("/api/adoptions/")
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
      await axiosPrivate.post(`/api/adoptions/${adoptionId}/change_status/`, {
        status,
      })
    } catch (err) {
      alert("Failed to update status.")
    }
  }

  if (loading) return <Loader size="lg" />
  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
    >
      <Title
        order={2}
        mb="md"
      >
        Adoptions
      </Title>

      {adoptions.map((adoption) => (
        <Card
          key={adoption.id}
          shadow="sm"
          padding="lg"
        >
          <p>Animal: {adoption.animal}</p>
          <p>Adopter: {adoption.adopter}</p>
          <p>Volunteer: {adoption.volunteer}</p>
          <Select
            label="State"
            value={adoption.status}
            onChange={(status) =>
              handleStatusChange(adoption.id, status as AdoptionStatus)
            }
            data={[
              { value: "pending_adoption", label: "En proceso" },
              { value: "adopted", label: "Adoptado" },
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
