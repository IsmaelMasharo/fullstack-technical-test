import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { Routes, Route, Outlet } from "react-router-dom"
import { Container } from "@mantine/core"
import LoginForm from "./components/Login"
import RegistrationForm from "./components/Registration"
import Animals from "./components/Animals"
import AnimalForm from "./components/AnimalForm"
import Adoptions from "./components/Adoptions"
import AdoptionForm from "./components/AdoptionForm"
import Users from "./components/Users"
import UserForm from "./components/UserForm"
import Header from "./components/Header"
import RequireAuth from "./components/RequireAuth"
import Unauthorized from "./components/Unauthorized"
import Missing from "./components/Missing"
import PersistLogin from "./components/PersistLogin"

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
              <Route path="/animals/create" element={<AnimalForm />} />
              <Route path="/animal/:id" element={<AnimalForm />} />
            </Route>

            <Route
              element={<RequireAuth allowedRoles={["admin", "volunteer"]} />}
            >
              <Route path="/adoptions" element={<Adoptions />} />
              <Route path="/adoptions/create" element={<AdoptionForm />} />
              <Route path="/adoptions/:id" element={<AdoptionForm />} />
              <Route path="/adopters" element={<Users role="adopter" />} />
              <Route path="/users/:id" element={<UserForm />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/volunteers" element={<Users role="volunteer" />} />
              <Route path="/users/create" element={<UserForm />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Missing />} />
      </Routes>
    </MantineProvider>
  )
}
