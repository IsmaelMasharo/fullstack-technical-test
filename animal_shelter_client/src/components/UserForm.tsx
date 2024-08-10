import { useState, useEffect } from "react"
import {
  Paper,
  Title,
  TextInput,
  Card,
  Alert,
  Group,
  Button,
  Select,
} from "@mantine/core"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { ROLES } from "../helpers/constants"
import { Volunteers, Adopters } from "../api/shelterApi"
import useAuth from "../hooks/useAuth"
import { useForm } from "@mantine/form"
import { isAxiosError } from "axios"

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  status: string
}

const initialValues: User = {
  id: 0,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  user_type: "",
  status: "active",
}

const User = () => {
  const [error, setError] = useState<null | string>(null)
  const form = useForm<User>({ initialValues })
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const userType = location.state?.userType
  const isAdmin = auth?.role === ROLES.Admin
  const Users = userType === ROLES.Adopter ? Adopters : Volunteers
  const redirectTo = userType === ROLES.Adopter ? "/adopters" : "/volunteers"

  useEffect(() => {
    const fetchUser = async () => {
      if (id === undefined) return
      try {
        const endpoint = Users.get(id)
        const response = await axiosPrivate.get(endpoint)
        form.setValues(response.data)
      } catch (err) {
        setError("Error fetching user.")
      }
    }
    fetchUser()
  }, [id])

  const createUser = async () => {
    try {
      const endpoint = Users.create
      const payload = { ...form.values, user_type: userType }
      await axiosPrivate.post(endpoint, payload)
      alert("Created successfully.")
      navigate(redirectTo)
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const updateUser = async () => {
    if (id === undefined) return
    try {
      const endpoint = Users.update(id)
      await axiosPrivate.patch(endpoint, form.values)
      alert("Updated successfully.")
    } catch (err) {
      if (isAxiosError(err)) {
        alert(err.response?.data.detail)
      }
    }
  }

  const deleteUser = async () => {
    if (id === undefined) return
    try {
      const endpoint = Users.delete(id)
      await axiosPrivate.delete(endpoint)
      navigate(redirectTo)
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
        {userType === ROLES.Adopter ? "Adopter" : "Volunteer"}
      </Title>
      <Card withBorder shadow="sm" px="xl" mb="md">
        <TextInput
          label="Username"
          mb="sm"
          readOnly={!isAdmin}
          required
          {...form.getInputProps("username")}
        />
        <TextInput
          label="First Name"
          mb="sm"
          readOnly={!isAdmin}
          {...form.getInputProps("first_name")}
        />
        <TextInput
          label="Last Name"
          mb="sm"
          readOnly={!isAdmin}
          {...form.getInputProps("last_name")}
        />
        <TextInput
          label="Email"
          mb="sm"
          required
          readOnly={!isAdmin}
          {...form.getInputProps("email")}
        />
        <Select
          label="Status"
          readOnly={!isAdmin}
          required
          {...form.getInputProps("status")}
          data={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        {auth.role === ROLES.Admin ? (
          id === undefined ? (
            <Button mt="md" onClick={() => createUser()}>
              Create
            </Button>
          ) : (
            <Group grow>
              <Button mt="md" onClick={() => updateUser()}>
                Update
              </Button>
              <Button color="red" mt="md" onClick={() => deleteUser()}>
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

export default User
