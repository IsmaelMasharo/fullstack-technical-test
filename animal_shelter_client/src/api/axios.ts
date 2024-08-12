import axios from "axios"
const BASE_URL =
  process.env.ENVIRONMENT === "local"
    ? process.env.REACT_LOCAL_API
    : process.env.REACT_PROD_API

console.log({ BASE_URL, env: process.env })
export default axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})
