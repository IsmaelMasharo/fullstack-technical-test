import axios from "axios"

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000"

console.log(URL)
const tasksApi = axios.create({ baseURL: `${URL}/api/` })
const shelterNoAuthApi = axios.create({ baseURL: `${URL}/api/` })

const shelterApi = axios.create({ baseURL: `${URL}/api/` })

// Interceptors can be set up here
shelterApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") // Retrieve token from storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const getAllTasks = () => tasksApi.get("/")
export const getTask = (id) => tasksApi.get(`/${id}`)
export const createTask = (task) => tasksApi.post("/", task)
export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task)
export const deleteTask = (id) => tasksApi.delete(`/${id}`)

export const createUser = (user) => shelterNoAuthApi.post("/register/", user)
export const login = (user) => shelterNoAuthApi.post("/token/", user)

export const getAvailableAnimals = () =>
  shelterApi.get("/animals/available_for_adoption/")
export const requestAdoption = (animalId) =>
  shelterApi.post(`/animals/${animalId}/request_adoption/`)
export const getAdoptions = () => shelterApi.get(`/adoptions/`)
export const getAnimals = () => shelterApi.get(`/animals/`)
export const updateAdoption = (adoptionId, status) =>
  shelterApi.post(`/adoptions/${adoptionId}/change_status/`, {
    status,
  })

export const getAdopters = () => shelterApi.get(`/adopters/`)
export const getVolunteers = () => shelterApi.get(`/volunteers/`)
