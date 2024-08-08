import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"

import LoginForm from "./components/Login"
import RegistrationForm from "./components/Registration"
import Animals from "./components/Animals"
import Adoption from "./components/Adoption"
import Users from "./components/Users"
import Header from "./components/Header"

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <LoginForm /> },
      { path: "/register", element: <RegistrationForm /> },
      { path: "/animals", element: <Animals /> },
      { path: "/adoptions", element: <Adoption /> },
      { path: "/adopters", element: <Users userType="adopter" /> },
      { path: "/volunteers", element: <Users userType="volunteer" /> },
    ],
  },
])

export default function App() {
  return (
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
