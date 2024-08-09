import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.post(
      "/api/auth/login/refresh/",
      {},
      {
        withCredentials: true,
      }
    )
    setAuth({
      role: response.data.user_type,
      accessToken: response.data.access,
    })
    return response.data.access
  }
  return refresh
}

export default useRefreshToken
