import axios from "axios"
const BASE_URL =
  process.env.ENVIRONMENT === "local"
    ? process.env.REACT_LOCAL_API
    : process.env.REACT_PROD_API

export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
