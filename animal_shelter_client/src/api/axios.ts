import axios from "axios"
const BASE_URL = "https://django-shelter-api.vercel.app"

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
