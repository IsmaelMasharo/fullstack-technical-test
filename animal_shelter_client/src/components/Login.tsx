import { useState } from "react"
import { useForm } from "@mantine/form"
import { Link, useNavigate } from "react-router-dom"
import {
  TextInput,
  PasswordInput,
  Paper,
  Group,
  Button,
  Title,
  Text,
  Alert,
} from "@mantine/core"
import useAuth from "../hooks/useAuth"
import axios from "../api/axios"

const LoginForm = () => {
  const { setAuth } = useAuth()
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      password: (value) =>
        value.length < 6 ? "Password must be at least 6 characters" : null,
    },
  })

  const handleSubmit = async (values) => {
    const payload = {
      username: values.username,
      password: values.password,
    }

    try {
      const response = await axios.post("/api/auth/token/", payload, {
        withCredentials: true,
      })
      const { access, user_type } = response?.data
      setAuth({ accessToken: access, role: user_type })
      navigate("/animals/")
    } catch (error) {
      setError(error.response.data.detail)
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
        Login
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
          placeholder="Your username"
          required
          {...form.getInputProps("username")}
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps("password")}
        />

        <Group mt="md">
          <Text size="sm">Forgot password?</Text>
        </Group>

        <Button
          fullWidth
          mt="xl"
          type="submit"
        >
          Login
        </Button>
      </form>
      <Group mt="md">
        Need an Account?
        <br />
        <span className="line">
          <Link to="/register">Sign Up</Link>
        </span>
      </Group>
    </Paper>
  )
}

export default LoginForm
