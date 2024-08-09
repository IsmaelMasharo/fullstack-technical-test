import { useContext, useDebugValue } from "react"
import AuthContext, { CurrentUserContextType } from "../context/AuthProvider"

const useAuth = (): CurrentUserContextType => {
  const { auth } = useContext(AuthContext)
  useDebugValue(auth, (auth) => (auth ? "Logged In" : "Logged Out"))
  return useContext(AuthContext)
}

export default useAuth
