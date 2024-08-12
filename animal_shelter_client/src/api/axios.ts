import axios from "axios"
const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "production"
    ? import.meta.env.VITE_PROD_API
    : import.meta.env.VITE_LOCAL_API

console.log({ BASE_URL, env: import.meta.env })
export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
