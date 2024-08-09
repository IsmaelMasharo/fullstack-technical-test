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
import useAxiosPrivate from "../hooks/useAxiosPrivate"

const AdoptionPage = () => {
  const axiosPrivate = useAxiosPrivate()
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const response = await axiosPrivate.get("/api/adoptions/")
        setAdoptions(response.data)
      } catch (err) {
        setError(err.response.data.detail)
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [])

  const handleStatusChange = (adoptionId, newStatus) => {
    setAdoptions((prevAdoptions) =>
      prevAdoptions.map((adoption) =>
        adoption.id === adoptionId
          ? { ...adoption, status: newStatus }
          : adoption
      )
    )
  }

  const handleUpdate = async (adoptionId, currentStatus) => {
    try {
      const response = await axiosPrivate.post(
        `/api/adoptions/${adoptionId}/change_status/`,
        {
          status: currentStatus,
        }
      )
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
          <p>Animal: {adoption.animal.name}</p>
          <p>Adopter: {adoption.adopter.first_name}</p>
          <p>Volunteer: {adoption.volunteer?.first_name}</p>
          <Select
            label="State"
            value={adoption.status}
            onChange={(newStatus) => handleStatusChange(adoption.id, newStatus)}
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
