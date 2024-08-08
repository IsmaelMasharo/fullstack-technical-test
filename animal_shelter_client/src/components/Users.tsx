import { useState, useEffect } from "react"
import { Paper, Title, Group, Loader, Card, Alert } from "@mantine/core"
import { getAdopters, getVolunteers } from "../api/shelter.api"

const AdoptersPage = ({ userType }) => {
  const [adopters, setAdopters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdopters = async () => {
      try {
        console.log({ userType })
        const request = userType === "adopter" ? getAdopters : getVolunteers
        const response = await request()
        console.log({ users: response.data })
        setAdopters(response.data)
      } catch (err) {
        setError("Error fetching adopters.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdopters()
  }, [userType])

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
        List of {userType === "adopter" ? "Adopters" : "Volunteers"}
      </Title>
      <Group
        direction="column"
        spacing="md"
      >
        {adopters.map((adopter) => (
          <Card
            key={adopter.id}
            shadow="sm"
            padding="lg"
          >
            <Title order={3}>{adopter.username}</Title>
            <p>First Name: {adopter.first_name}</p>
            <p>Last Name: {adopter.last_name}</p>
            <p>Email: {adopter.email}</p>
            <p>Status: {adopter.status}</p>
          </Card>
        ))}
      </Group>
    </Paper>
  )
}

export default AdoptersPage
