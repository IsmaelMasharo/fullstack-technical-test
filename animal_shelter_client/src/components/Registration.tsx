import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form"
import {
  TextInput,
  PasswordInput,
  Select,
  Paper,
  Button,
  Title,
  Alert,
  Group,
  Anchor,
} from "@mantine/core"
import axios from "../api/axios"

const RegistrationForm = () => {
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      userType: "",
    },

    validate: {
      username: (value) => (value.length > 0 ? null : "Username is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      firstName: (value) =>
        value.length > 0 ? null : "First name is required",
      lastName: (value) => (value.length > 0 ? null : "Last name is required"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
      userType: (value) => (value ? null : "User type is required"),
    },
  })

  const handleSubmit = async (values) => {
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
      navigate("/login")
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Email is already in use.")
      } else {
        setError("An error occurred during registration.")
      }
    }
  }

  return (
    <Paper
      radius="md"
      p="xl"
      withBorder
    >
      <Title
        order={2}
        mt="md"
        mb={50}
      >
        Register
      </Title>

      {error && (
        <Alert
          color="red"
          mb="md"
        >
          {error}
        </Alert>
      )}

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
          required
          mt="md"
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last Name"
          placeholder="Last Name"
          required
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

        <Button
          fullWidth
          mt="xl"
          type="submit"
        >
          Register
        </Button>
      </form>

      <Group mt="md">
        <Anchor
          component="button"
          onClick={() => navigate("/login")}
        >
          Have an account already? Log in
        </Anchor>
      </Group>
    </Paper>
  )
}

export default RegistrationForm
