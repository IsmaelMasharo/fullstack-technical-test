import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "@mantine/form"
import {
  TextInput,
  PasswordInput,
  Select,
  Container,
  Button,
  Title,
  Alert,
  Text,
  Paper,
} from "@mantine/core"
import { isAxiosError } from "axios"
import axios from "../api/axios"

type AdopterOrVolunteer = "adopter" | "volunteer"

interface FormValues {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
  userType: AdopterOrVolunteer
}

const RegistrationForm = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const form = useForm<FormValues>({
    initialValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      userType: "adopter",
    },

    validate: {
      username: (value) => (value.length > 0 ? null : "Username is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    const payload = {
      username: values.username,
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      password: values.password,
      user_type: values.userType,
    }

    try {
      await axios.post("/api/register/", payload)
      alert("Registration successful. Please log in.")
      navigate("/login")
    } catch (error) {
      if (isAxiosError(error)) {
        setError(error.response?.data.detail)
      }
    }
  }

  return (
    <Container size={420} my={40}>
      <Title order={2} ta="center">
        Registration
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Have an account already? <Link to="/login">Log in</Link>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Username"
            placeholder="Username"
            required
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            mt="md"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="First Name"
            placeholder="First Name"
            mt="md"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Last Name"
            placeholder="Last Name"
            mt="md"
            {...form.getInputProps("lastName")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            required
            mt="md"
            {...form.getInputProps("confirmPassword")}
          />
          <Select
            label="User Type"
            placeholder="Select user type"
            required
            mt="md"
            data={[
              { value: "volunteer", label: "Volunteer" },
              { value: "adopter", label: "Adopter" },
            ]}
            {...form.getInputProps("userType")}
          />
          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </form>
      </Paper>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
    </Container>
  )
}

export default RegistrationForm
