import { FC } from "react"
import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import { Role } from "../context/AuthProvider"

const RequireAuth: FC<{ allowedRoles: Role[] }> = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const location = useLocation()

  return auth.role && allowedRoles?.includes(auth.role) ? (
    <Outlet />
  ) : auth?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
