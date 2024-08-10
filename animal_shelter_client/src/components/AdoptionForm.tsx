import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  Button,
  Card,
  Alert,
  Select,
  TextInput,
} from "@mantine/core"
import { isAxiosError } from "axios"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { Adoptions } from "../api/shelterApi"
import { useParams } from "react-router-dom"
import { ROLES } from "../helpers/constants"
import useAuth from "../hooks/useAuth"

type AdoptionStatus = "pending_adoption" | "adopted" | string | null

export interface Adoption {
  id: number
  animal: string
  adopter: string
  volunteer: string
  status: AdoptionStatus
}

const Adoption = () => {
  const axiosPrivate = useAxiosPrivate()
  const [adoption, setAdoption] = useState<Adoption>()
  const [status, setStatus] = useState<AdoptionStatus>()
  const [error, setError] = useState(null)
  const { id } = useParams()
  const { auth } = useAuth()
  const isAdminOrVolunteer =
    auth?.role === ROLES.Admin || auth?.role === ROLES.Volunteer

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (id === undefined) return
      try {
        const endpoint = Adoptions.get(id)
        const response = await axiosPrivate.get(endpoint)
        setAdoption(response.data)
        setStatus(response.data.status)
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data.detail)
        }
      }
    }

    fetchAdoptions()
  }, [id])

  const handleUpdate = async () => {
    if (id === undefined || status === adoption?.status || !adoption || !status)
      return
    try {
      const endpoint = Adoptions.changeStatus(id)
      await axiosPrivate.post(endpoint, { status })
      setAdoption({ ...adoption, status })
      alert("Status successfully updated.")
    } catch (err) {
      alert("Failed to update status.")
    }
  }

  if (error) return <Alert color="red">{error}</Alert>

  return (
    <Paper p="sm">
      <Title order={2} mb="md">
        Adoption
      </Title>
      {adoption && (
        <Card key={adoption.id} withBorder shadow="sm" px="xl" mb="md">
          <TextInput
            label="Animal"
            value={adoption.animal}
            mb="sm"
            readOnly={true}
          />
          <TextInput
            label="Adopter"
            value={adoption.adopter}
            mb="sm"
            readOnly={true}
          />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            readOnly={!isAdminOrVolunteer}
            data={[
              { value: "pending_adoption", label: "Pending" },
              { value: "adopted", label: "Adopted" },
            ]}
          />
          {isAdminOrVolunteer && (
            <Button mt="sm" onClick={handleUpdate}>
              Update Status
            </Button>
          )}
        </Card>
      )}
    </Paper>
  )
}

export default Adoption
