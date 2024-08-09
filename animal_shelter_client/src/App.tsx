import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { Routes, Route, Outlet } from "react-router-dom"

import LoginForm from "./components/Login"
import RegistrationForm from "./components/Registration"
import Animals from "./components/Animals"
import Adoption from "./components/Adoption"
import Users from "./components/Users"
import Header from "./components/Header"
import RequireAuth from "./components/RequireAuth"
import Unauthorized from "./components/Unauthorized"
import Missing from "./components/Missing"
import PersistLogin from "./components/PersistLogin"
import { Container } from "@mantine/core"

function Layout() {
  return (
    <>
      <Header />
      <Container px="md" py="sm">
        <Outlet />
      </Container>
    </>
  )
}

export default function App() {
  return (
    <MantineProvider>
      <Routes>
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegistrationForm />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Layout />}>
            <Route
              element={
                <RequireAuth allowedRoles={["admin", "adopter", "volunteer"]} />
              }
            >
              <Route path="/animals" element={<Animals />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={["admin", "volunteer"]} />}
            >
              <Route path="/adoptions" element={<Adoption />} />
              <Route path="/adopters" element={<Users role="adopter" />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/volunteers" element={<Users role="volunteer" />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes>
    </MantineProvider>
  )
}
